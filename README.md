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
  .url("https://dev-devicepark.testinium.io")
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
  .url("https://dev-devicepark.testinium.io")
  .credentials(Credentials.fromEnvironment())
  .build();
```

## Available APIs

- `client.devices()`
- `client.pools()`
- `client.allocations()`
- `client.sessions()`
- `client.applications()`

## Notes

- Node.js `18+`
- OAuth2 client-credentials flow with automatic token refresh
- Zero runtime dependency beyond the Node standard runtime
