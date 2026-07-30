import assert from "node:assert/strict";
import test from "node:test";
import {
  DeviceAllocationRequestBuilder
} from "./DeviceAllocationRequest.js";
import { RemoveAppSelection } from "./RemoveAppSelection.js";

test("DeviceAllocationRequestBuilder defaults to keeping installed applications", () => {
  const request = new DeviceAllocationRequestBuilder().serial("device-1").build();

  assert.equal(request.priority, 3);
  assert.equal(request.removeApps, RemoveAppSelection.NO_REMOVE);
});

test("DeviceAllocationRequestBuilder accepts an application removal selection", () => {
  const request = new DeviceAllocationRequestBuilder()
    .serial("device-1")
    .removeApps(RemoveAppSelection.REMOVE_WITHOUT_IS_DEFAULT_APPS)
    .build();

  assert.equal(
    request.removeApps,
    RemoveAppSelection.REMOVE_WITHOUT_IS_DEFAULT_APPS
  );
});
