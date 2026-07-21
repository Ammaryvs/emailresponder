import { stripMarkdownFormatting } from "./markdown";

export function insertReplyText(composeBox: HTMLElement, text: string): void {
  composeBox.focus();
  composeBox.innerHTML = textToHtml(stripMarkdownFormatting(text));
  composeBox.dispatchEvent(new Event("input", { bubbles: true }));
}

function textToHtml(text: string): string {
  return text
    .split("\n")
    .map((line) => `<div>${escapeHtml(line) || "<br>"}</div>`)
    .join("");
}

function escapeHtml(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
