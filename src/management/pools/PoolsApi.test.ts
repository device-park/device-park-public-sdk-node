import assert from "node:assert/strict";
import test from "node:test";
import { DeviceParkApiClient } from "../../DeviceParkApiClient.js";
import { Credentials } from "../../authentication/credentials/Credentials.js";
import { ListPoolsRequestBuilder } from "../../model/pools/ListPoolsRequest.js";
import { CreatePoolRequestBuilder } from "../../model/pools/CreatePoolRequest.js";

test("PoolsApi lists default pools with the required filter and requested sorting", async () => {
  let requestedUrl: URL | undefined;
  const fetchImplementation: typeof fetch = async (input) => {
    if (String(input).endsWith("/uaa/oauth2/token")) {
      return Response.json({
        access_token: "token",
        token_type: "Bearer",
        expires_in: 3600
      });
    }

    requestedUrl = new URL(String(input));
    return Response.json({
      size: 10,
      page: 2,
      totalPages: 1,
      totalElements: 1,
      data: [{ id: "default-pool", name: "Default", isDefault: true }]
    });
  };

  const client = DeviceParkApiClient.builder()
    .url("https://devicepark.testinium.io")
    .credentials(Credentials.create("client-id", "client-secret"))
    .fetchImplementation(fetchImplementation)
    .build();

  try {
    const pools = await client.pools().listByDefaultPool(
      new ListPoolsRequestBuilder().page(2).size(10).build()
    );

    assert.equal(pools.data[0]?.isDefault, true);
  } finally {
    await client.close();
  }

  assert.ok(requestedUrl);
  assert.equal(requestedUrl.searchParams.get("sorting.page"), "2");
  assert.equal(requestedUrl.searchParams.get("sorting.size"), "10");
  assert.equal(requestedUrl.searchParams.get("filters[0].key"), "IS_DEFAULT");
  assert.equal(requestedUrl.searchParams.get("filters[0].value"), "true");
  assert.equal(requestedUrl.searchParams.get("filters[0].operation"), "EQUAL");
});

test("PoolsApi creates and deletes pools and changes pool devices", async () => {
  const requests: Array<{ method: string; url: URL; body?: string }> = [];
  const fetchImplementation: typeof fetch = async (input, init) => {
    if (String(input).endsWith("/uaa/oauth2/token")) {
      return Response.json({
        access_token: "token",
        token_type: "Bearer",
        expires_in: 3600
      });
    }

    const method = init?.method ?? "GET";
    const url = new URL(String(input));
    const body = typeof init?.body === "string" ? init.body : undefined;
    requests.push(body === undefined ? { method, url } : { method, url, body });

    if (method === "POST" && url.pathname.endsWith("/pools")) {
      return Response.json({ id: "pool-123", name: "Regression", isDefault: false });
    }
    if (method === "POST" && url.pathname.endsWith("/devices")) {
      return Response.json(["SERIAL-1", "SERIAL-2"]);
    }
    if (method === "DELETE" && url.pathname.endsWith("/devices")) {
      return Response.json(["SERIAL-2"]);
    }

    return new Response(null, { status: 204 });
  };

  const client = DeviceParkApiClient.builder()
    .url("https://devicepark.testinium.io")
    .credentials(Credentials.create("client-id", "client-secret"))
    .fetchImplementation(fetchImplementation)
    .build();

  try {
    const pool = await client.pools().create(
      new CreatePoolRequestBuilder().name("Regression").build()
    );
    assert.equal(pool.id, "pool-123");

    assert.deepEqual(
      await client.pools().addDevices("pool-123", ["SERIAL-1", "SERIAL-2"]),
      ["SERIAL-1", "SERIAL-2"]
    );
    assert.deepEqual(
      await client.pools().removeDevices("pool-123", ["SERIAL-1"]),
      ["SERIAL-2"]
    );
    await client.pools().delete("pool-123");
  } finally {
    await client.close();
  }

  assert.equal(requests[0]?.method, "POST");
  assert.equal(requests[0]?.body, JSON.stringify({ name: "Regression" }));
  assert.deepEqual(requests[1]?.url.searchParams.getAll("serials"), ["SERIAL-1", "SERIAL-2"]);
  assert.deepEqual(requests[2]?.url.searchParams.getAll("serials"), ["SERIAL-1"]);
  assert.equal(requests[3]?.method, "DELETE");
  assert.equal(requests[3]?.url.pathname, "/management/api/v1/public/pools/pool-123");
});

test("PoolsApi validates pool mutation inputs", async () => {
  const client = DeviceParkApiClient.builder()
    .url("https://devicepark.testinium.io")
    .credentials(Credentials.create("client-id", "client-secret"))
    .build();

  try {
    assert.throws(() => new CreatePoolRequestBuilder().name("   ").build(), /name cannot be empty/);
    await assert.rejects(client.pools().delete(" "), /poolId cannot be empty/);
    await assert.rejects(client.pools().addDevices("pool-123", []), /serials cannot be empty/);
    await assert.rejects(client.pools().removeDevices(" ", ["SERIAL-1"]), /poolId cannot be empty/);
  } finally {
    await client.close();
  }
});
