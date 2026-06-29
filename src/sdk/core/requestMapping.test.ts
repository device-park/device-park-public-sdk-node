import test from "node:test";
import assert from "node:assert/strict";
import { SearchOperation } from "../models/common/enums.js";
import { DeviceFilter } from "../models/filters.js";
import { ListDevicesRequestBuilder } from "../models/builders.js";
import { createPaginationQuery } from "./requestMapping.js";

test("createPaginationQuery maps sorting and filters", () => {
  const request = new ListDevicesRequestBuilder()
    .page(2)
    .size(50)
    .sortBy("SERIAL")
    .direction("ASC")
    .addFilter(DeviceFilter.PLATFORM, "Android", SearchOperation.EQUAL)
    .build();

  assert.deepEqual(createPaginationQuery(request), {
    "sorting.page": 2,
    "sorting.size": 50,
    "sorting.sortBy": "SERIAL",
    "sorting.direction": "ASC",
    "filters[0].key": "platform",
    "filters[0].value": "Android",
    "filters[0].operation": "EQUAL"
  });
});
