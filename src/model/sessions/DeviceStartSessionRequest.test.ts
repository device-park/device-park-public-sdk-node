import assert from "node:assert/strict";
import test from "node:test";
import { DeviceStartSessionRequestBuilder } from "./DeviceStartSessionRequest.js";

test("DeviceStartSessionRequestBuilder requires the backend mandatory fields", () => {
  const cases: Array<[string, (builder: DeviceStartSessionRequestBuilder) => void]> = [
    ["allocationId", (builder) => {
      builder.userId(42).userEmail("qa@example.com").companyId(7).companyName("Example Company");
    }],
    ["userId", (builder) => {
      builder.allocationId("allocation-123").userEmail("qa@example.com").companyId(7).companyName("Example Company");
    }],
    ["userEmail", (builder) => {
      builder.allocationId("allocation-123").userId(42).companyId(7).companyName("Example Company");
    }],
    ["companyId", (builder) => {
      builder.allocationId("allocation-123").userId(42).userEmail("qa@example.com").companyName("Example Company");
    }],
    ["companyName", (builder) => {
      builder.allocationId("allocation-123").userId(42).userEmail("qa@example.com").companyId(7);
    }]
  ];

  for (const [field, configure] of cases) {
    const builder = new DeviceStartSessionRequestBuilder();
    configure(builder);
    assert.throws(() => builder.build(), new RegExp(`${field} is required`));
  }
});

test("DeviceStartSessionRequestBuilder builds the request without a client sessionId", () => {
  const request = new DeviceStartSessionRequestBuilder()
    .allocationId("allocation-123")
    .userId(42)
    .userEmail("qa@example.com")
    .companyId(7)
    .companyName("Example Company")
    .build();

  assert.deepEqual(request, {
    allocationId: "allocation-123",
    videoRecording: false,
    userId: 42,
    userEmail: "qa@example.com",
    companyId: 7,
    companyName: "Example Company"
  });
  assert.equal("sessionId" in request, false);
});

test("DeviceStartSessionRequestBuilder rejects a blank companyName", () => {
  assert.throws(
    () => new DeviceStartSessionRequestBuilder()
      .allocationId("allocation-123")
      .userId(42)
      .userEmail("qa@example.com")
      .companyId(7)
      .companyName("   ")
      .build(),
    /companyName cannot be blank/
  );
});
