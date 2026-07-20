import { getApiKey, setApiKey } from "../lib/storage";

const apiKeyInput = document.getElementById("apiKey") as HTMLInputElement;
const saveButton = document.getElementById("save") as HTMLButtonElement;
const statusEl = document.getElementById("status") as HTMLElement;

getApiKey(chrome.storage.sync).then((apiKey) => {
  if (apiKey) apiKeyInput.value = apiKey;
});

saveButton.addEventListener("click", async () => {
  await setApiKey(apiKeyInput.value.trim(), chrome.storage.sync);
  statusEl.textContent = "Saved.";
  setTimeout(() => {
    statusEl.textContent = "";
  }, 2000);
});
