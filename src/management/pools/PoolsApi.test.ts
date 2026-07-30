import assert from "node:assert/strict";
import test from "node:test";
import { DeviceParkApiClient } from "../../DeviceParkApiClient.js";
import { Credentials } from "../../authentication/credentials/Credentials.js";
import { ListPoolsRequestBuilder } from "../../model/pools/ListPoolsRequest.js";

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
