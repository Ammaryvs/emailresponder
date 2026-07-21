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

  it("preserves line breaks as separate block elements", () => {
    const box = document.createElement("div");
    box.contentEditable = "true";

    insertReplyText(box, "Hi Sam,\n\nSounds good.\n\nThanks,\nAlex");

    expect(box.querySelectorAll("div")).toHaveLength(6);
    expect(box.innerHTML).toBe(
      "<div>Hi Sam,</div><div><br></div><div>Sounds good.</div><div><br></div><div>Thanks,</div><div>Alex</div>",
    );
  });

  it("escapes HTML special characters in the text", () => {
    const box = document.createElement("div");
    box.contentEditable = "true";

    insertReplyText(box, "Use <b>bold</b> & <i>italics</i>");

    expect(box.textContent).toBe("Use <b>bold</b> & <i>italics</i>");
    expect(box.querySelector("b")).toBeNull();
  });

  it("strips Markdown the user typed into the (editable) preview textarea", () => {
    const box = document.createElement("div");
    box.contentEditable = "true";

    insertReplyText(box, "Sounds **great**, thanks!");

    expect(box.textContent).toBe("Sounds great, thanks!");
  });
});
