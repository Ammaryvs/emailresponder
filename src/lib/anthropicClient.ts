const ANTHROPIC_MESSAGES_URL = "https://api.anthropic.com/v1/messages";
const MODEL = "claude-haiku-4-5-20251001";

export interface GenerateReplyParams {
  apiKey: string;
  system: string;
  user: string;
}

interface AnthropicMessagesResponse {
  content: Array<{ type: string; text?: string }>;
}

interface AnthropicErrorResponse {
  error?: { message?: string };
}

export async function generateReply(
  { apiKey, system, user }: GenerateReplyParams,
  fetchImpl: typeof fetch = fetch,
): Promise<string> {
  let response: Response;
  try {
    response = await fetchImpl(ANTHROPIC_MESSAGES_URL, {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "anthropic-dangerous-direct-browser-access": "true",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 1024,
        system,
        messages: [{ role: "user", content: user }],
      }),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    throw new Error(`Could not reach Claude: ${message}`);
  }

  if (!response.ok) {
    const body = (await response.json()) as AnthropicErrorResponse;
    throw new Error(body.error?.message ?? `Claude API request failed with status ${response.status}`);
  }

  const body = (await response.json()) as AnthropicMessagesResponse;
  const text = body.content.find((block) => block.type === "text")?.text;
  if (!text) {
    throw new Error("Claude's response did not contain any text.");
  }
  return text;
}
