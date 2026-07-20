import { describe, expect, it, vi } from "vitest";
import { generateReply } from "./openAiClient";

function jsonResponse(body: unknown, ok = true, status = 200): Response {
  return {
    ok,
    status,
    json: () => Promise.resolve(body),
  } as Response;
}

describe("generateReply", () => {
  const params = { apiKey: "sk-test", system: "sys", user: "usr" };

  it("calls the OpenAI chat completions endpoint with the required headers", async () => {
    const fetchImpl = vi.fn().mockResolvedValue(
      jsonResponse({ choices: [{ message: { content: "Draft reply" } }] }),
    );

    await generateReply(params, fetchImpl);

    expect(fetchImpl).toHaveBeenCalledWith(
      "https://api.openai.com/v1/chat/completions",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          authorization: "Bearer sk-test",
          "content-type": "application/json",
        }),
      }),
    );
  });

  it("resolves with the message content from the first choice", async () => {
    const fetchImpl = vi.fn().mockResolvedValue(
      jsonResponse({ choices: [{ message: { content: "Draft reply" } }] }),
    );

    await expect(generateReply(params, fetchImpl)).resolves.toBe("Draft reply");
  });

  it("rejects with the API's error message on a non-ok response", async () => {
    const fetchImpl = vi.fn().mockResolvedValue(
      jsonResponse({ error: { message: "Incorrect API key provided" } }, false, 401),
    );

    await expect(generateReply(params, fetchImpl)).rejects.toThrow("Incorrect API key provided");
  });

  it("rejects with a wrapped error when the network request itself fails", async () => {
    const fetchImpl = vi.fn().mockRejectedValue(new TypeError("Failed to fetch"));

    await expect(generateReply(params, fetchImpl)).rejects.toThrow("Failed to fetch");
  });
});
