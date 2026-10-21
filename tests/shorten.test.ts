import { beforeEach, afterAll, describe, expect, it } from "vitest";
import { buildApp } from "../src/app.js";
import { clearStore } from "../src/store.js";

const app = buildApp();

beforeEach(() => {
  clearStore();
});

afterAll(async () => {
  await app.close();
});

describe("POST /shorten", () => {
  it("creates a short link", async () => {
    const res = await app.inject({
      method: "POST",
      url: "/shorten",
      payload: { url: "https://example.com" },
    });

    expect(res.statusCode).toBe(201);

    const body = res.json();
    expect(body.url).toBe("https://example.com");
    expect(body.code).toEqual(expect.any(String));
    expect(body.shortUrl).toContain(body.code);
  });

  it("rejects invalid url", async () => {
    const res = await app.inject({
      method: "POST",
      url: "/shorten",
      payload: { url: "not-a-url" },
    });

    expect(res.statusCode).toBe(400);
    const body = res.json();
    expect(body.error).toBe("Invalid URL");
    expect(body.details).toBeDefined();
  });
});