import assert from "node:assert/strict";
import test from "node:test";
import { Credentials } from "../../authentication/credentials/Credentials.js";
import { DeviceParkApiClient } from "../../DeviceParkApiClient.js";
import { SearchOperation } from "../../model/common/SearchOperation.js";
import { DeviceFilter } from "../../model/devices/DeviceFilter.js";
import { ListDevicesRequestBuilder } from "../../model/devices/ListDevicesRequest.js";
import { SessionFilter } from "../../model/sessions/SessionFilter.js";
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

function clientWith(handler: (url: URL) => Response) {
  const fetchImplementation: typeof fetch = async (input) => {
    if (String(input).endsWith("/uaa/oauth2/token")) {
      return Response.json({ access_token: "token", token_type: "Bearer", expires_in: 3600 });
    }
    return handler(new URL(String(input)));
  };

  return DeviceParkApiClient.builder()
    .url("https://devicepark.testinium.io")
    .credentials(Credentials.create("client-id", "client-secret"))
    .fetchImplementation(fetchImplementation)
    .build();
}

const emptyPage = { size: 20, page: 0, totalPages: 0, totalElements: 0, data: [] };

test("DevicesApi lists devices through the v2 endpoint", async () => {
  const urls: URL[] = [];
  const client = clientWith((url) => {
    urls.push(url);
    return Response.json(emptyPage);
  });

  try {
    await client.devices().list();
  } finally {
    await client.close();
  }

  assert.equal(urls[0]?.pathname, "/management/api/v2/public/devices");
});

test("DevicesApi keeps the v1 endpoint for a single device", async () => {
  const urls: URL[] = [];
  const client = clientWith((url) => {
    urls.push(url);
    return Response.json({ serial: "abc" });
  });

  try {
    await client.devices().get("abc");
    await assert.rejects(() => client.devices().get(" "));
  } finally {
    await client.close();
  }

  assert.equal(urls[0]?.pathname, "/management/api/v1/public/devices/abc");
});

test("DevicesApi.listByDefaultPool filters by the default pool and replaces a caller pool filter", async () => {
  const urls: URL[] = [];
  const client = clientWith((url) => {
    urls.push(url);
    if (url.pathname.endsWith("/pools")) {
      return Response.json({ ...emptyPage, data: [{ id: "pool-1", name: "Default", isDefault: true }] });
    }
    return Response.json(emptyPage);
  });

  try {
    await client.devices().listByDefaultPool(
      new ListDevicesRequestBuilder()
        .addFilter(DeviceFilter.POOL_ID, "other", "EQUAL")
        .addFilter(DeviceFilter.PLATFORM, "ANDROID", "EQUAL")
        .build()
    );
  } finally {
    await client.close();
  }

  const deviceUrl = urls.find((url) => url.pathname === "/management/api/v2/public/devices");
  assert.ok(deviceUrl);
  assert.equal(deviceUrl.searchParams.get("filters[0].key"), DeviceFilter.POOL_ID);
  assert.equal(deviceUrl.searchParams.get("filters[0].value"), "pool-1");
  assert.equal(deviceUrl.searchParams.get("filters[1].key"), DeviceFilter.PLATFORM);
  assert.equal(deviceUrl.searchParams.get("filters[2].key"), null);
});

test("DevicesApi.listByDefaultPool fails when no default pool exists", async () => {
  const client = clientWith(() => Response.json(emptyPage));

  try {
    await assert.rejects(() => client.devices().listByDefaultPool(), /Default pool not found/);
  } finally {
    await client.close();
  }
});

test("filter constants follow the Java SDK", () => {
  // The server expects the enum name of its DeviceFilter, not the database column.
  assert.equal(DeviceFilter.PLATFORM_VERSION, "PLATFORM_VERSION");
  assert.equal(DeviceFilter.OS_VERSION, "PLATFORM_VERSION");
  assert.equal(DeviceFilter.SERIAL_NUMBER, "SERIAL_NUMBER");
  assert.equal(DeviceFilter.STATE, "STATE");
  assert.equal(DeviceFilter.POOL_ID, "POOL_ID");
  assert.equal(SessionFilter.USER_EMAIL, "USER_EMAIL");
  assert.equal(SessionFilter.USER_ID, "USER_ID");
  assert.equal(SessionFilter.COMPANY_ID, "COMPANY_ID");
  assert.equal(SessionFilter.COMPANY_NAME, "COMPANY_NAME");
});
