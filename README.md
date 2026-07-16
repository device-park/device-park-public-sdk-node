# Device Park Public SDK - Node.js

Official Node.js client library for the Device Park public APIs.

## Installation

```bash
npm install @devicepark/public-sdk
```

## Quick Start

```ts
import {
  Credentials,
  DeviceParkApiClient,
  ListDevicesRequestBuilder
} from "@devicepark/public-sdk";

const client = DeviceParkApiClient.builder()
  .url("https://devicepark.testinium.io")
  .credentials(Credentials.create("your-client-id", "your-client-secret"))
  .build();

const devices = await client.devices().list(
  new ListDevicesRequestBuilder().page(0).size(20).build()
);

console.log(devices.totalElements);
await client.close();
```

## Authentication

```ts
import { Credentials, DeviceParkApiClient } from "@devicepark/public-sdk";

const client = DeviceParkApiClient.builder()
  .url("https://devicepark.testinium.io")
  .credentials(Credentials.fromEnvironment())
  .build();
```

## Available APIs

- `client.devices()`
- `client.pools()`
- `client.allocations()`
- `client.sessions()`
- `client.applications()`

## Image Injection

Application uploads use standard processing by default. Pass `true` as the fourth argument when the workflow requires Device Park gadget injection:

```ts
import { createReadStream } from "node:fs";

const application = await client.applications().upload(
  createReadStream("/path/to/mobile-app.apk"),
  "mobile-app.apk",
  "1.0.0",
  true
);
```

`Device` responses also expose nullable `isSimulator` and `isPublic` fields.

## Notes

- Node.js `18+`
- OAuth2 client-credentials flow with automatic token refresh
- Zero runtime dependency beyond the Node standard runtime
