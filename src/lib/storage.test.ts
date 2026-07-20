import { describe, expect, it, vi } from "vitest";
import { getApiKey, setApiKey, API_KEY_STORAGE_KEY } from "./storage";

function fakeStorage(initial: Record<string, unknown> = {}) {
  const data = { ...initial };
  return {
    get: vi.fn((key: string) => Promise.resolve(key in data ? { [key]: data[key] } : {})),
    set: vi.fn((items: Record<string, unknown>) => {
      Object.assign(data, items);
      return Promise.resolve();
    }),
  };
}

describe("getApiKey", () => {
  it("returns the stored API key", async () => {
    const storage = fakeStorage({ [API_KEY_STORAGE_KEY]: "sk-ant-abc" });

    await expect(getApiKey(storage)).resolves.toBe("sk-ant-abc");
  });

  it("returns undefined when no key has been stored", async () => {
    const storage = fakeStorage();

    await expect(getApiKey(storage)).resolves.toBeUndefined();
  });
});

describe("setApiKey", () => {
  it("persists the key under the expected storage key", async () => {
    const storage = fakeStorage();

    await setApiKey(storage, "sk-ant-xyz");

    expect(storage.set).toHaveBeenCalledWith({ [API_KEY_STORAGE_KEY]: "sk-ant-xyz" });
  });
});
