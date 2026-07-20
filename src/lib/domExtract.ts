/**
 * Gmail renders each message body inside an element carrying the "a3s" class.
 * This selector is undocumented and may need updating if Gmail changes its markup.
 */
const MESSAGE_BODY_SELECTOR = ".a3s";

export function extractLatestMessageText(root: ParentNode): string {
  const messages = root.querySelectorAll(MESSAGE_BODY_SELECTOR);
  const latest = messages[messages.length - 1];

  if (!latest || !latest.textContent) {
    throw new Error("Could not find the email content on this page.");
  }

  return latest.textContent.trim();
}
