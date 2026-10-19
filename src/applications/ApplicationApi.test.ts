import assert from "node:assert/strict";
import { Readable } from "node:stream";
import test from "node:test";
import { DeviceParkApiClient } from "../DeviceParkApiClient.js";
import { Credentials } from "../authentication/credentials/Credentials.js";

test("ApplicationApi sends the image injection preference", async () => {
  const uploadHeaders: Record<string, string>[] = [];
  const fetchImplementation: typeof fetch = async (input, init) => {
    if (String(input).endsWith("/uaa/oauth2/token")) {
      return Response.json({
        access_token: "token",
        token_type: "Bearer",
        expires_in: 3600
      });
    }

    uploadHeaders.push(init?.headers as Record<string, string>);
    return Response.json({ fileKey: "application-key" });
  };

  const client = DeviceParkApiClient.builder()
    .url("https://devicepark.testinium.io")
    .credentials(Credentials.create("client-id", "client-secret"))
    .fetchImplementation(fetchImplementation)
    .build();

  try {
    await client.applications().upload(Readable.from("default"), "app.apk", "1.0.0");
    await client.applications().upload(Readable.from("enabled"), "app.apk", "1.0.0", true);
  } finally {
    await client.close();
  }

  assert.equal(uploadHeaders[0]?.["image-injection"], "false");
  assert.equal(uploadHeaders[1]?.["image-injection"], "true");
});

test("maps the server's size_in_bytes to sizeInBytes", async () => {
  const body = { size: 1, page: 0, totalPages: 1, totalElements: 1, data: [{ fileKey: "k", version: "1", size_in_bytes: 123 }] };
  const fetchImplementation: typeof fetch = async (input) =>
    String(input).endsWith("/uaa/oauth2/token")
      ? Response.json({ access_token: "token", token_type: "Bearer", expires_in: 3600 })
      : Response.json(body);
  const client = DeviceParkApiClient.builder()
    .url("https://devicepark.testinium.io")
    .credentials(Credentials.create("client-id", "client-secret"))
    .fetchImplementation(fetchImplementation)
    .build();

  try {
    const page = await client.applications().list();
    assert.equal(page.data[0]?.sizeInBytes, 123);
    assert.equal("size_in_bytes" in (page.data[0] ?? {}), false);
  } finally {
    await client.close();
  }
});
