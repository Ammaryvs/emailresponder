export type ToneKey = "formal" | "casual" | "brief";

export interface TonePreset {
  label: string;
  instruction: string;
}

export const TONE_PRESETS: Record<ToneKey, TonePreset> = {
  formal: {
    label: "Formal",
    instruction: "Write in a formal, professional tone suitable for a business or official context.",
  },
  casual: {
    label: "Casual",
    instruction: "Write in a relaxed, friendly, conversational tone.",
  },
  brief: {
    label: "Brief",
    instruction: "Keep the reply as short as possible while still fully addressing the email.",
  },
};
