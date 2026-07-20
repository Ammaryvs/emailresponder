import { TONE_PRESETS, type ToneKey } from "./tonePresets";

export interface ReplyPrompt {
  system: string;
  user: string;
}

export function buildReplyPrompt(originalEmail: string, tone: ToneKey): ReplyPrompt {
  if (originalEmail.trim().length === 0) {
    throw new Error("Cannot draft a reply to an empty email.");
  }

  const system = [
    "You draft replies to emails on behalf of the user, for insertion into Gmail's reply box.",
    "Reply with only the body text of the reply — no subject line, no quoting of the original email.",
    TONE_PRESETS[tone].instruction,
  ].join(" ");

  const user = `Draft a reply to this email:\n\n${originalEmail}`;

  return { system, user };
}
