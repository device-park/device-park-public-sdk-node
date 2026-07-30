# Device Park Public SDK for Node.js

The official Node.js SDK for integrating test automation and CI systems with Device Park.

The SDK provides typed clients for discovering devices, selecting device pools, reserving devices, managing test sessions and storing mobile application artifacts. Its public domain model and lifecycle follow the Device Park Java SDK so teams can use the same concepts across Java and Node.js projects.

## Capabilities

- List devices and retrieve current device details.
- List device pools available to the authenticated account.
- Reserve an exact device, a device pool or a device matching platform criteria.
- Inspect active and queued allocations.
- Start multiple sequential sessions from the same active allocation.
- Stop sessions and collect Appium logs or screen recordings.
- Upload, list and delete APK or IPA artifacts.
- Enable image injection for supported application-upload workflows.
- Authenticate with OAuth2 client credentials and renew access tokens automatically.

## Requirements

- Node.js 18 or newer
- Device Park `clientId` and `clientSecret`
- Access to the required Device Park environment, devices and pools

## Installation

```bash
npm install device-park-public-sdk
```

The package includes ESM JavaScript and TypeScript declarations.

## Authentication

Store credentials in your CI secret store or environment. Do not commit them to source control.

```bash
export DEVICEPARK_CLIENT_ID=your-client-id
export DEVICEPARK_CLIENT_SECRET=your-client-secret
```

Create one client for the test run and reuse it:

```typescript
import {
  Credentials,
  DeviceParkApiClient
} from "device-park-public-sdk";

const client = DeviceParkApiClient.builder()
  .url("https://devicepark.testinium.io")
  .credentials(Credentials.fromEnvironment())
  .timeout(60)
  .build();
```

`Credentials.fromEnvironment()` reads `DEVICEPARK_CLIENT_ID` and `DEVICEPARK_CLIENT_SECRET`. Credentials already held by the application can be supplied with `Credentials.create(clientId, clientSecret)`.

The client obtains an access token on the first SDK operation, keeps it in memory and renews it before expiration. Create one client per test run so the cached token can be reused.

## First Device Session

A Device Park test normally follows this lifecycle:

1. List devices or pools.
2. Create an allocation to reserve a device.
3. Start a session with the returned `allocationId`.
4. Run the Appium test.
5. Stop the session.
6. Release the allocation after the final session.
7. Close the SDK client.

```typescript
import {
  Credentials,
  DeviceAllocationRequestBuilder,
  DeviceParkApiClient,
  DeviceStartSessionRequestBuilder,
  ListDevicesRequestBuilder
} from "device-park-public-sdk";

const client = DeviceParkApiClient.builder()
  .url("https://devicepark.testinium.io")
  .credentials(Credentials.fromEnvironment())
  .build();

let allocationId: string | undefined;
let sessionId: string | undefined;

try {
  const devices = await client.devices().list(
    new ListDevicesRequestBuilder().page(0).size(20).build()
  );

  const selectedDevice = devices.data[0];
  if (!selectedDevice?.serial) {
    throw new Error("No Device Park device is available");
  }

  const allocation = await client.allocations().create(
    new DeviceAllocationRequestBuilder()
      .serial(selectedDevice.serial)
      .priority(3)
      .build()
  );

  allocationId = allocation.allocationId ?? undefined;
  if (!allocationId) {
    throw new Error("Allocation id is missing");
  }

  if (!allocation.deviceSerial) {
    throw new Error(
      `Allocation ${allocationId} is waiting for a device`
    );
  }

  const session = await client.sessions().start(
    new DeviceStartSessionRequestBuilder()
      .allocationId(allocationId)
      .videoRecording(true)
      .build()
  );

  sessionId = session.sessionId ?? undefined;
  if (!sessionId) {
    throw new Error("Session id is missing");
  }

  console.log(`Session started: ${sessionId}`);
  // Run Appium automation for the active session.
} finally {
  if (sessionId) {
    await client.sessions().stop(sessionId);
  }

  if (allocationId) {
    await client.allocations().delete(allocationId);
  }

  await client.close();
}
```

## Allocation and Session Lifecycle

An allocation is a temporary device reservation. Store its `allocationId` immediately after creation.

If `deviceSerial` is not assigned, the allocation can be waiting in the queue. Inspect the same allocation until a device is assigned or the test-runner deadline is reached. Do not create duplicate allocations while waiting.

One active allocation can be reused for multiple sessions:

```typescript
const firstSession = await client.sessions().start(
  new DeviceStartSessionRequestBuilder()
    .allocationId(allocationId)
    .build()
);

await client.sessions().stop(firstSession.sessionId!);

const secondSession = await client.sessions().start(
  new DeviceStartSessionRequestBuilder()
    .allocationId(allocationId)
    .build()
);
```

Stop the current session before starting the next unless concurrent sessions are enabled for the Device Park environment. Release the allocation only after the final session.

## SDK Services

| Service | Purpose | Main methods |
|---|---|---|
| `client.devices()` | Discover and inspect devices | `list`, `get` |
| `client.pools()` | Discover managed device pools | `list` |
| `client.allocations()` | Reserve and release devices | `create`, `list`, `delete` |
| `client.sessions()` | Manage test sessions and artifacts | `start`, `list`, `stop`, `logs`, `screenRecords` |
| `client.applications()` | Manage APK and IPA artifacts | `upload`, `list`, `delete` |

List methods return `PageDto<T>` with `page`, `size`, `totalPages`, `totalElements` and `data`.

## Upload an Application

Upload an APK or IPA with a readable Node.js stream:

```typescript
import { createReadStream } from "node:fs";

const application = await client.applications().upload(
  createReadStream("/path/to/mobile-app.apk"),
  "mobile-app.apk",
  "1.0.0"
);

console.log(application.fileKey);
```

Image injection is disabled by default. Enable it only when the test workflow requires Device Park gadget injection:

```typescript
const application = await client.applications().upload(
  createReadStream("/path/to/mobile-app.apk"),
  "mobile-app.apk",
  "1.0.0",
  true
);
```

Use `fileKey` as the stable application identifier. A returned `downloadUrl` can be temporary.

## Error Handling

```typescript
import {
  DeviceParkConfigError,
  DeviceParkHttpError,
  DeviceParkSerializationError
} from "device-park-public-sdk";

try {
  const devices = await client.devices().list();
  console.log(devices.data);
} catch (error) {
  if (error instanceof DeviceParkConfigError) {
    console.error("Invalid SDK configuration:", error.message);
  } else if (error instanceof DeviceParkHttpError) {
    console.error("Device Park request failed:", error.status, error.body);
  } else if (error instanceof DeviceParkSerializationError) {
    console.error("Unexpected response format:", error.message);
  } else if (error instanceof Error && error.name === "AbortError") {
    console.error("Device Park request timed out");
  } else {
    throw error;
  }
}
```

Never log client secrets, access tokens or authorization headers.

## Cleanup

Production test runners should perform cleanup from a `finally` block:

1. Stop active sessions.
2. Release allocations after their final session.
3. Close the SDK client.

Handle cleanup failures separately so they do not replace the original test failure.

## Documentation and Support

- [Device Park SDK documentation](https://github.com/device-park/device-park-api-docs)
- [Source repository](https://github.com/device-park/device-park-public-sdk-node)
- [Issue tracker](https://github.com/device-park/device-park-public-sdk-node/issues)

When reporting a problem, include the SDK version and relevant resource identifiers. Remove credentials, tokens and sensitive application data from logs.

## License

Licensed under the [MIT License](LICENSE).
