import type { ToneKey } from "./tonePresets";

export const GENERATE_REPLY_MESSAGE = "GENERATE_REPLY" as const;

export interface GenerateReplyRequest {
  type: typeof GENERATE_REPLY_MESSAGE;
  emailText: string;
  tone: ToneKey;
}

export type GenerateReplyResponse = { ok: true; text: string } | { ok: false; error: string };
