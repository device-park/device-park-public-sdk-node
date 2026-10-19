import assert from "node:assert/strict";
import test from "node:test";
import { Credentials } from "../authentication/credentials/Credentials.js";
import { DeviceParkHttpClient } from "../client/DeviceParkHttpClient.js";
import { DeviceParkHttpError } from "../sdk/errors/index.js";
import { SessionApi } from "./SessionApi.js";

interface Call {
  url: string;
  authorization?: string | undefined;
}

function createClient(handler: (call: Call, index: number) => Response): { client: DeviceParkHttpClient; calls: Call[] } {
  const calls: Call[] = [];
  let tokenCount = 0;
  const fetchImplementation = (async (input: string | URL | Request, init?: RequestInit) => {
    const url = String(input);
    const headers = (init?.headers ?? {}) as Record<string, string>;
    if (url.endsWith("/uaa/oauth2/token")) {
      tokenCount += 1;
      return new Response(JSON.stringify({ access_token: `token-${tokenCount}`, expires_in: 3600 }), { status: 200 });
    }
    const call: Call = { url, authorization: headers.authorization };
    calls.push(call);
    return handler(call, calls.length - 1);
  }) as typeof fetch;

  const client = new DeviceParkHttpClient({
    baseUrl: "https://devicepark.example",
    credentials: Credentials.create("client", "secret"),
    timeoutMs: 5_000,
    defaultHeaders: {},
    fetchImplementation
  });
  return { client, calls };
}

test("SessionApi.streamUrl returns the stream address with the current access token", async () => {
  const { client, calls } = createClient(() =>
    new Response(JSON.stringify({ url: "wss://stream.example/ws/v2/devicepark/sessions/abc/stream" }), { status: 200 }));

  const url = await new SessionApi(client).streamUrl("abc");

  assert.equal(url, "wss://stream.example/ws/v2/devicepark/sessions/abc/stream?token=token-1");
  assert.equal(calls.length, 1);
  assert.ok(calls[0]?.url.endsWith("/session/api/v2/public/sessions/abc/stream-url"));
  assert.equal(calls[0]?.authorization, "Bearer token-1");
});

test("SessionApi.streamUrl rejects an empty session id", async () => {
  const { client } = createClient(() => new Response("{}", { status: 200 }));
  await assert.rejects(() => new SessionApi(client).streamUrl(" "));
});

test("a 401 response renews the access token and retries the request once", async () => {
  const { client, calls } = createClient((_call, index) =>
    index === 0 ? new Response("expired", { status: 401 }) : new Response(JSON.stringify({ url: "wss://s/x" }), { status: 200 }));

  const url = await new SessionApi(client).streamUrl("abc");

  assert.equal(calls.length, 2);
  assert.equal(calls[0]?.authorization, "Bearer token-1");
  assert.equal(calls[1]?.authorization, "Bearer token-2");
  assert.equal(url, "wss://s/x?token=token-2");
});

test("a repeated 401 is reported as an HTTP error instead of looping", async () => {
  const { client, calls } = createClient(() => new Response("denied", { status: 401 }));

  await assert.rejects(() => new SessionApi(client).streamUrl("abc"), (error: unknown) =>
    error instanceof DeviceParkHttpError && error.status === 401);
  assert.equal(calls.length, 2);
});
