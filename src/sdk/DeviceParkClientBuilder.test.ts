import test from "node:test";
import assert from "node:assert/strict";
import { Credentials } from "./auth/Credentials.js";
import { DeviceParkClientBuilder } from "./DeviceParkClientBuilder.js";

test("DeviceParkClientBuilder rejects missing credentials", () => {
  assert.throws(() => new DeviceParkClientBuilder().url("https://example.com").build(), {
    name: "DeviceParkConfigError"
  });
});

test("Credentials.fromEnvironment reads standard variables", () => {
  const credentials = Credentials.fromEnvironment({
    DEVICEPARK_CLIENT_ID: "client-id",
    DEVICEPARK_CLIENT_SECRET: "client-secret"
  });

  assert.equal(credentials.clientId, "client-id");
  assert.equal(credentials.clientSecret, "client-secret");
});
