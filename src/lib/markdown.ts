/**
 * Belt-and-suspenders cleanup: the prompt asks the model for plain text, but
 * models don't always comply. Strips common Markdown syntax so it never shows
 * up as literal characters in Gmail's plain-text compose box.
 */
export function stripMarkdownFormatting(text: string): string {
  return text
    .replace(/^ {0,3}#{1,6}\s+/gm, "")
    .replace(/^ {0,3}[*+]\s+/gm, "- ")
    .replace(/(\*\*|__)(.+?)\1/g, "$2")
    .replace(/(\*|_)(.+?)\1/g, "$2")
    .replace(/`([^`]+)`/g, "$1");
}
