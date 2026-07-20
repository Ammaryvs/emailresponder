import { describe, expect, it } from "vitest";
import { insertReplyText } from "./domInsert";

describe("insertReplyText", () => {
  it("sets the compose box's text content", () => {
    const box = document.createElement("div");
    box.contentEditable = "true";

    insertReplyText(box, "Thanks, sounds good.");

    expect(box.textContent).toBe("Thanks, sounds good.");
  });

  it("dispatches a bubbling input event so Gmail's own listeners notice the change", () => {
    const box = document.createElement("div");
    box.contentEditable = "true";
    document.body.appendChild(box);

    let bubbled = false;
    document.body.addEventListener("input", () => {
      bubbled = true;
    });

    insertReplyText(box, "Thanks, sounds good.");

    expect(bubbled).toBe(true);
    document.body.removeChild(box);
  });
});
