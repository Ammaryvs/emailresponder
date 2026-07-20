export const API_KEY_STORAGE_KEY = "apiKey";

export interface SyncStorageArea {
  get(key: string): Promise<Record<string, unknown>>;
  set(items: Record<string, unknown>): Promise<void>;
}

export async function getApiKey(storage: SyncStorageArea): Promise<string | undefined> {
  const result = await storage.get(API_KEY_STORAGE_KEY);
  const value = result[API_KEY_STORAGE_KEY];
  return typeof value === "string" ? value : undefined;
}

export async function setApiKey(storage: SyncStorageArea, apiKey: string): Promise<void> {
  await storage.set({ [API_KEY_STORAGE_KEY]: apiKey });
}
