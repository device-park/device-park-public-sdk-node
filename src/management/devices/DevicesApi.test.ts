import assert from "node:assert/strict";
import test from "node:test";
import { Credentials } from "../../authentication/credentials/Credentials.js";
import { DeviceParkApiClient } from "../../DeviceParkApiClient.js";
import { SearchOperation } from "../../model/common/SearchOperation.js";
import { DeviceAppFilter } from "../../model/devices/apps/DeviceAppFilter.js";
import type { DeviceAppFilterRequest } from "../../model/devices/apps/DeviceAppFilterRequest.js";
import { ListDeviceAppsRequestBuilder } from "../../model/devices/apps/ListDeviceAppsRequest.js";
import { DeviceParkHttpError } from "../../sdk/errors/index.js";

test("DevicesApi lists installed apps with sorting and filters", async () => {
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
      size: 20,
      page: 0,
      totalPages: 1,
      totalElements: 1,
      data: [{
        id: 101,
        bundleIdentifier: "com.apple.mobilesafari",
        installedAt: "2026-08-01T10:15:30",
        updatedAt: "2026-08-01T10:15:30",
        isDefault: true
      }]
    });
  };

  const client = DeviceParkApiClient.builder()
    .url("https://devicepark.testinium.io")
    .credentials(Credentials.create("client-id", "client-secret"))
    .fetchImplementation(fetchImplementation)
    .build();

  const filterRequest: DeviceAppFilterRequest = {
    key: DeviceAppFilter.IS_DEFAULT,
    value: true,
    operation: SearchOperation.EQUAL
  };

  try {
    const apps = await client.devices().apps(
      "00008140-000C58300CBB801C",
      new ListDeviceAppsRequestBuilder()
        .filters([filterRequest])
        .page(0)
        .size(20)
        .build()
    );
    assert.equal(apps.data[0]?.isDefault, true);
  } finally {
    await client.close();
  }

  assert.ok(requestedUrl);
  assert.equal(
    requestedUrl.pathname,
    "/management/api/v1/public/devices/00008140-000C58300CBB801C/apps"
  );
  assert.equal(requestedUrl.searchParams.get("sorting.page"), "0");
  assert.equal(requestedUrl.searchParams.get("sorting.size"), "20");
  assert.equal(requestedUrl.searchParams.get("filters[0].key"), "IS_DEFAULT");
  assert.equal(requestedUrl.searchParams.get("filters[0].value"), "true");
  assert.equal(requestedUrl.searchParams.get("filters[0].operation"), "EQUAL");
});

test("DevicesApi uses default pagination for installed apps", async () => {
  let requestedUrl: URL | undefined;
  const fetchImplementation: typeof fetch = async (input) => {
    if (String(input).endsWith("/uaa/oauth2/token")) {
      return Response.json({ access_token: "token", token_type: "Bearer", expires_in: 3600 });
    }
    requestedUrl = new URL(String(input));
    return Response.json({ size: 20, page: 0, totalPages: 0, totalElements: 0, data: [] });
  };

  const client = DeviceParkApiClient.builder()
    .url("https://devicepark.testinium.io")
    .credentials(Credentials.create("client-id", "client-secret"))
    .fetchImplementation(fetchImplementation)
    .build();

  try {
    await client.devices().apps("serial/with space");
  } finally {
    await client.close();
  }

  assert.ok(requestedUrl);
  assert.equal(
    requestedUrl.pathname,
    "/management/api/v1/public/devices/serial%2Fwith%20space/apps"
  );
  assert.equal(requestedUrl.searchParams.get("sorting.page"), "0");
  assert.equal(requestedUrl.searchParams.get("sorting.size"), "20");
  assert.equal(requestedUrl.searchParams.get("filters[0].key"), null);
});

test("DevicesApi rejects an empty serial when listing installed apps", async () => {
  const client = DeviceParkApiClient.builder()
    .url("https://devicepark.testinium.io")
    .credentials(Credentials.create("client-id", "client-secret"))
    .build();

  try {
    await assert.rejects(client.devices().apps("   "), /serial cannot be empty/);
  } finally {
    await client.close();
  }
});

test("DevicesApi surfaces a 404 when the device is not assigned to the client", async () => {
  const fetchImplementation: typeof fetch = async (input) => {
    if (String(input).endsWith("/uaa/oauth2/token")) {
      return Response.json({ access_token: "token", token_type: "Bearer", expires_in: 3600 });
    }
    return new Response("Device not found", { status: 404 });
  };

  const client = DeviceParkApiClient.builder()
    .url("https://devicepark.testinium.io")
    .credentials(Credentials.create("client-id", "client-secret"))
    .fetchImplementation(fetchImplementation)
    .build();

  try {
    await assert.rejects(
      client.devices().apps("UNASSIGNED-SERIAL"),
      (error: unknown) => error instanceof DeviceParkHttpError
        && error.status === 404
        && error.body === "Device not found"
    );
  } finally {
    await client.close();
  }
});
