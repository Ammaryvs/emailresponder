import { describe, expect, it } from "vitest";
import { TONE_PRESETS, type ToneKey } from "./tonePresets";

describe("TONE_PRESETS", () => {
  const expectedKeys: ToneKey[] = ["formal", "casual", "brief"];

  it("defines exactly the formal, casual, and brief presets", () => {
    expect(Object.keys(TONE_PRESETS).sort()).toEqual([...expectedKeys].sort());
  });

  it.each(expectedKeys)("gives %s a non-empty label and instruction", (key) => {
    const preset = TONE_PRESETS[key];
    expect(preset.label.trim().length).toBeGreaterThan(0);
    expect(preset.instruction.trim().length).toBeGreaterThan(0);
  });
});
