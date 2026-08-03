import { TONE_PRESETS, type ToneKey } from "./tonePresets";

export interface ReplyPrompt {
  system: string;
  user: string;
}

export function buildReplyPrompt(originalEmail: string, tone: ToneKey, intention: string): ReplyPrompt {
  if (originalEmail.trim().length === 0) {
    throw new Error("Cannot draft a reply to an empty email.");
  }

  const system = [
    "You draft replies to emails on behalf of the user, for insertion into Gmail's reply box.",
    "Reply with only the body text of the reply — no subject line, no quoting of the original email.",
    "Write plain text only: no Markdown (no **bold**, *italics*, backticks, or # headings) and no bullet lists — Gmail's reply box is not a Markdown renderer, so any Markdown syntax will show up as literal characters.",
    "Format it like a real email: separate the greeting, each paragraph, and the sign-off with a blank line between them.",
    TONE_PRESETS[tone].instruction,
  ].join(" ");

  let user = `Draft a reply to this email:\n\n${originalEmail}`;
  const trimmedIntention = intention.trim();
  if (trimmedIntention.length > 0) {
    user += `\n\nIncorporate this guidance from the user about what they want to say:\n${trimmedIntention}`;
  }

  return { system, user };
}
