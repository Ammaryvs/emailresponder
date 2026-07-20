import { generateReply } from "../lib/openAiClient";
import { GENERATE_REPLY_MESSAGE, type GenerateReplyRequest, type GenerateReplyResponse } from "../lib/messaging";
import { buildReplyPrompt } from "../lib/promptBuilder";
import { getApiKey } from "../lib/storage";

chrome.runtime.onMessage.addListener((message: GenerateReplyRequest, _sender, sendResponse) => {
  if (message.type !== GENERATE_REPLY_MESSAGE) {
    return false;
  }

  handleGenerateReply(message).then(sendResponse);
  return true;
});

async function handleGenerateReply(message: GenerateReplyRequest): Promise<GenerateReplyResponse> {
  try {
    const apiKey = await getApiKey(chrome.storage.sync);
    if (!apiKey) {
      return { ok: false, error: "No OpenAI API key set. Add one in the extension's options page." };
    }

    const { system, user } = buildReplyPrompt(message.emailText, message.tone);
    const text = await generateReply({ apiKey, system, user });
    return { ok: true, text };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}
