import type { SearchOperationType } from "../../common/SearchOperation.js";
import type { DeviceAppFilter } from "./DeviceAppFilter.js";

export interface DeviceAppFilterRequest {
  key: (typeof DeviceAppFilter)[keyof typeof DeviceAppFilter];
  value: unknown;
  operation: SearchOperationType;
}
