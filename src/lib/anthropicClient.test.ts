import { describe, expect, it, vi } from "vitest";
import { generateReply } from "./anthropicClient";

function jsonResponse(body: unknown, ok = true, status = 200): Response {
  return {
    ok,
    status,
    json: () => Promise.resolve(body),
  } as Response;
}

describe("generateReply", () => {
  const params = { apiKey: "sk-ant-test", system: "sys", user: "usr" };

  it("calls the Anthropic messages endpoint with the required headers", async () => {
    const fetchImpl = vi.fn().mockResolvedValue(
      jsonResponse({ content: [{ type: "text", text: "Draft reply" }] }),
    );

    await generateReply(params, fetchImpl);

    expect(fetchImpl).toHaveBeenCalledWith(
      "https://api.anthropic.com/v1/messages",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          "x-api-key": "sk-ant-test",
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
          "content-type": "application/json",
        }),
      }),
    );
  });

  it("resolves with the text from the first content block", async () => {
    const fetchImpl = vi.fn().mockResolvedValue(
      jsonResponse({ content: [{ type: "text", text: "Draft reply" }] }),
    );

    await expect(generateReply(params, fetchImpl)).resolves.toBe("Draft reply");
  });

  it("rejects with the API's error message on a non-ok response", async () => {
    const fetchImpl = vi.fn().mockResolvedValue(
      jsonResponse({ error: { message: "invalid x-api-key" } }, false, 401),
    );

    await expect(generateReply(params, fetchImpl)).rejects.toThrow("invalid x-api-key");
  });

  it("rejects with a wrapped error when the network request itself fails", async () => {
    const fetchImpl = vi.fn().mockRejectedValue(new TypeError("Failed to fetch"));

    await expect(generateReply(params, fetchImpl)).rejects.toThrow("Failed to fetch");
  });
});
