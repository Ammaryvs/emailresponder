/**
 * Belt-and-suspenders cleanup: the prompt asks the model for plain text, but
 * models don't always comply. Strips common Markdown syntax so it never shows
 * up as literal characters in Gmail's plain-text compose box.
 */
// Requires markers to sit at a word boundary and not wrap whitespace, so
// snake_case identifiers ("my_variable_name") and spaced-out asterisks
// ("5 * 3") aren't mistaken for emphasis. [\s\S] (not ".") lets the pair span
// multiple lines.
const BOLD_PATTERN = /(?<![\w*_])(\*\*|__)(?!\s)([\s\S]+?)(?<!\s)\1(?![\w*_])/g;
const ITALIC_PATTERN = /(?<![\w*_])(\*|_)(?!\s)([\s\S]+?)(?<!\s)\1(?![\w*_])/g;

export function stripMarkdownFormatting(text: string): string {
  return text
    .replace(/^ {0,3}#{1,6}\s+/gm, "")
    .replace(/^ {0,3}[*+]\s+/gm, "- ")
    .replace(BOLD_PATTERN, "$2")
    .replace(ITALIC_PATTERN, "$2")
    .replace(/`([^`]+)`/g, "$1");
}
