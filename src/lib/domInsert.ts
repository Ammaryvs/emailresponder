export function insertReplyText(composeBox: HTMLElement, text: string): void {
  composeBox.focus();
  composeBox.textContent = text;
  composeBox.dispatchEvent(new Event("input", { bubbles: true }));
}
