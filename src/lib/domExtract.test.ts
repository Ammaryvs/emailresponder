import { describe, expect, it } from "vitest";
import { extractLatestMessageText } from "./domExtract";

function fixture(html: string): ParentNode {
  const container = document.createElement("div");
  container.innerHTML = html;
  return container;
}

describe("extractLatestMessageText", () => {
  it("returns the text of the last Gmail message body in the thread", () => {
    const root = fixture(`
      <div class="a3s">First message in the thread.</div>
      <div class="a3s">Latest message in the thread.</div>
    `);

    expect(extractLatestMessageText(root)).toBe("Latest message in the thread.");
  });

  it("trims surrounding whitespace", () => {
    const root = fixture(`<div class="a3s">\n   Padded message.   \n</div>`);

    expect(extractLatestMessageText(root)).toBe("Padded message.");
  });

  it("throws when no message body can be found", () => {
    const root = fixture(`<div>No Gmail message here.</div>`);

    expect(() => extractLatestMessageText(root)).toThrow();
  });
});
