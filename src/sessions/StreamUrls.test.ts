import assert from "node:assert/strict";
import test from "node:test";
import { StreamUrls } from "./StreamUrls.js";

test("StreamUrls appends the token as a query parameter", () => {
  assert.equal(
    StreamUrls.withAccessToken("wss://stream.example/ws/v2/devicepark/sessions/12345/stream", "abc.def"),
    "wss://stream.example/ws/v2/devicepark/sessions/12345/stream?token=abc.def"
  );
});

test("StreamUrls encodes the token and keeps an existing query", () => {
  assert.equal(
    StreamUrls.withAccessToken("wss://stream.example/stream?session=1", "a+b/c="),
    "wss://stream.example/stream?session=1&token=a%2Bb%2Fc%3D"
  );
});

test("StreamUrls rejects blank input", () => {
  assert.throws(() => StreamUrls.withAccessToken("  ", "token"));
  assert.throws(() => StreamUrls.withAccessToken("wss://stream.example/stream", " "));
});
