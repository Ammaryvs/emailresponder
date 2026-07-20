const OPENAI_CHAT_COMPLETIONS_URL = "https://api.openai.com/v1/chat/completions";
const MODEL = "gpt-4o-mini";

export interface GenerateReplyParams {
  apiKey: string;
  system: string;
  user: string;
}

interface OpenAiChatResponse {
  choices: Array<{ message: { content: string } }>;
}

interface OpenAiErrorResponse {
  error?: { message?: string };
}

export async function generateReply(
  { apiKey, system, user }: GenerateReplyParams,
  fetchImpl: typeof fetch = fetch,
): Promise<string> {
  let response: Response;
  try {
    response = await fetchImpl(OPENAI_CHAT_COMPLETIONS_URL, {
      method: "POST",
      headers: {
        authorization: `Bearer ${apiKey}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
      }),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    throw new Error(`Could not reach OpenAI: ${message}`);
  }

  if (!response.ok) {
    const body = (await response.json()) as OpenAiErrorResponse;
    throw new Error(body.error?.message ?? `OpenAI API request failed with status ${response.status}`);
  }

  const body = (await response.json()) as OpenAiChatResponse;
  const text = body.choices[0]?.message.content;
  if (!text) {
    throw new Error("OpenAI's response did not contain any text.");
  }
  return text;
}
