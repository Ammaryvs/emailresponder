import { describe, expect, it } from "vitest";
import { stripMarkdownFormatting } from "./markdown";

describe("stripMarkdownFormatting", () => {
  it("removes bold markers", () => {
    expect(stripMarkdownFormatting("Sounds **great**, thanks!")).toBe("Sounds great, thanks!");
    expect(stripMarkdownFormatting("Sounds __great__, thanks!")).toBe("Sounds great, thanks!");
  });

  it("removes italic markers", () => {
    expect(stripMarkdownFormatting("Sounds *great*, thanks!")).toBe("Sounds great, thanks!");
    expect(stripMarkdownFormatting("Sounds _great_, thanks!")).toBe("Sounds great, thanks!");
  });

  it("removes inline code backticks", () => {
    expect(stripMarkdownFormatting("Run `npm install` first.")).toBe("Run npm install first.");
  });

  it("removes heading markers at the start of a line", () => {
    expect(stripMarkdownFormatting("## Next steps\nSee above.")).toBe("Next steps\nSee above.");
  });

  it("converts markdown bullet markers to plain dashes", () => {
    expect(stripMarkdownFormatting("* First item\n* Second item")).toBe("- First item\n- Second item");
  });

  it("leaves plain text untouched", () => {
    expect(stripMarkdownFormatting("Hi Sam,\n\nSounds good.\n\nThanks,\nAlex")).toBe(
      "Hi Sam,\n\nSounds good.\n\nThanks,\nAlex",
    );
  });
});
