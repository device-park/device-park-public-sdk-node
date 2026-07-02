import type { SearchOperationType } from "../common/SearchOperation.js";
import type { DeviceFilter } from "./DeviceFilter.js";

export interface DeviceFilterRequest {
  key: (typeof DeviceFilter)[keyof typeof DeviceFilter];
  value: unknown;
  operation: SearchOperationType;
}
