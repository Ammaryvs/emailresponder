import { extractLatestMessageText } from "../lib/domExtract";
import { insertReplyText } from "../lib/domInsert";
import { GENERATE_REPLY_MESSAGE, type GenerateReplyResponse } from "../lib/messaging";
import { TONE_PRESETS, type ToneKey } from "../lib/tonePresets";

/**
 * Gmail's DOM is undocumented and can change without notice. These selectors are
 * best-effort and may need updating if Gmail's markup shifts.
 */
const REPLY_BUTTON_SELECTOR = ".ams.bkH";
const COMPOSE_BOX_SELECTOR = 'div[aria-label^="Message Body"][contenteditable="true"]';
const INJECTED_ATTR = "data-gra-button";

function injectStyles(): void {
  const style = document.createElement("style");
  style.textContent = `
    .gra-trigger { margin-left: 8px; padding: 4px 10px; border-radius: 4px; border: 1px solid #c4c7c5; background: #fff; cursor: pointer; font-size: 13px; }
    .gra-trigger:hover { background: #f1f3f4; }
    .gra-panel { position: fixed; bottom: 24px; right: 24px; width: 360px; background: #fff; border: 1px solid #dadce0; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.2); padding: 16px; z-index: 9999; font-family: Arial, sans-serif; font-size: 13px; color: #202124; }
    .gra-panel select { width: 100%; margin-bottom: 8px; padding: 4px; }
    .gra-panel textarea { width: 100%; min-height: 120px; box-sizing: border-box; margin-bottom: 8px; font-family: inherit; font-size: inherit; }
    .gra-panel .gra-actions { display: flex; gap: 8px; }
    .gra-panel button { padding: 6px 12px; cursor: pointer; }
    .gra-panel button:disabled { cursor: default; opacity: 0.6; }
    .gra-error { color: #c5221f; margin-bottom: 8px; }
  `;
  document.head.appendChild(style);
}

function injectTriggerButtons(): void {
  const replyButtons = document.querySelectorAll<HTMLElement>(REPLY_BUTTON_SELECTOR);
  for (const replyButton of replyButtons) {
    if (replyButton.hasAttribute(INJECTED_ATTR)) continue;
    replyButton.setAttribute(INJECTED_ATTR, "true");

    const trigger = document.createElement("button");
    trigger.type = "button";
    trigger.className = "gra-trigger";
    trigger.textContent = "✨ Draft with AI";
    trigger.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      // Open Gmail's own reply editor first so a compose box exists for Insert to target.
      replyButton.click();
      openPreviewPanel();
    });

    replyButton.insertAdjacentElement("afterend", trigger);
  }
}

let activePanel: HTMLElement | null = null;

function closePanel(): void {
  activePanel?.remove();
  activePanel = null;
}

function openPreviewPanel(): void {
  closePanel();

  const panel = document.createElement("div");
  panel.className = "gra-panel";
  panel.innerHTML = `
    <select class="gra-tone">
      ${Object.entries(TONE_PRESETS)
        .map(([key, preset]) => `<option value="${key}">${preset.label}</option>`)
        .join("")}
    </select>
    <div class="gra-error" hidden></div>
    <textarea class="gra-draft" hidden readonly></textarea>
    <div class="gra-actions">
      <button type="button" class="gra-insert" hidden>Insert</button>
      <button type="button" class="gra-action">Regenerate</button>
      <button type="button" class="gra-cancel">Cancel</button>
    </div>
  `;
  document.body.appendChild(panel);
  activePanel = panel;

  const toneSelect = panel.querySelector<HTMLSelectElement>(".gra-tone")!;
  const errorEl = panel.querySelector<HTMLElement>(".gra-error")!;
  const draftEl = panel.querySelector<HTMLTextAreaElement>(".gra-draft")!;
  const insertBtn = panel.querySelector<HTMLButtonElement>(".gra-insert")!;
  const actionBtn = panel.querySelector<HTMLButtonElement>(".gra-action")!;
  const cancelBtn = panel.querySelector<HTMLButtonElement>(".gra-cancel")!;

  cancelBtn.addEventListener("click", closePanel);
  actionBtn.addEventListener("click", generate);
  insertBtn.addEventListener("click", () => {
    const composeBox = document.querySelector<HTMLElement>(COMPOSE_BOX_SELECTOR);
    if (!composeBox) {
      showError("Couldn't find an open compose box to insert into.");
      return;
    }
    insertReplyText(composeBox, draftEl.value);
    closePanel();
  });

  function showError(message: string): void {
    errorEl.textContent = message;
    errorEl.hidden = false;
    draftEl.hidden = true;
    insertBtn.hidden = true;
    actionBtn.textContent = "Retry";
    actionBtn.disabled = false;
  }

  function generate(): void {
    errorEl.hidden = true;
    insertBtn.hidden = true;
    actionBtn.disabled = true;
    actionBtn.textContent = "Generating…";

    let emailText: string;
    try {
      emailText = extractLatestMessageText(document);
    } catch (err) {
      showError(err instanceof Error ? err.message : String(err));
      return;
    }

    const tone = toneSelect.value as ToneKey;
    const CONNECTION_LOST_MESSAGE = "Lost connection to the extension. Please refresh this Gmail tab and try again.";

    try {
      chrome.runtime.sendMessage(
        { type: GENERATE_REPLY_MESSAGE, emailText, tone },
        (response: GenerateReplyResponse) => {
          if (!activePanel) return;
          if (chrome.runtime.lastError || !response) {
            showError(CONNECTION_LOST_MESSAGE);
            return;
          }
          if (!response.ok) {
            showError(response.error);
            return;
          }
          draftEl.hidden = false;
          draftEl.readOnly = false;
          draftEl.value = response.text;
          insertBtn.hidden = false;
          actionBtn.disabled = false;
          actionBtn.textContent = "Regenerate";
        },
      );
    } catch {
      showError(CONNECTION_LOST_MESSAGE);
    }
  }

  generate();
}

injectStyles();
injectTriggerButtons();
new MutationObserver(injectTriggerButtons).observe(document.body, { childList: true, subtree: true });
