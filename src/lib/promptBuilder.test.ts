import { describe, expect, it } from "vitest";
import { buildReplyPrompt } from "./promptBuilder";
import { TONE_PRESETS } from "./tonePresets";

describe("buildReplyPrompt", () => {
  it("includes the tone's instruction in the system prompt", () => {
    const { system } = buildReplyPrompt("Can you send the report by Friday?", "brief", "");
    expect(system).toContain(TONE_PRESETS.brief.instruction);
  });

  it("includes the original email text verbatim in the user message", () => {
    const email = "Can you send the report by Friday?";
    const { user } = buildReplyPrompt(email, "formal", "");
    expect(user).toContain(email);
  });

  it("throws when the email text is empty", () => {
    expect(() => buildReplyPrompt("", "casual", "")).toThrow();
  });

  it("throws when the email text is only whitespace", () => {
    expect(() => buildReplyPrompt("   \n\t", "casual", "")).toThrow();
  });

  it("includes the user's intention in the user message when provided", () => {
    const { user } = buildReplyPrompt("Can you send the report by Friday?", "formal", "tell them it'll be a day late");
    expect(user).toContain("tell them it'll be a day late");
  });

  it("omits any intention guidance from the user message when intention is empty or whitespace", () => {
    const { user } = buildReplyPrompt("Can you send the report by Friday?", "formal", "   ");
    expect(user).not.toContain("guidance");
  });
});
