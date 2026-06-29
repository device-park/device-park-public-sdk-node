import type { SearchOperationType } from "../common/SearchOperation.js";
import type { SessionFilter } from "./SessionFilter.js";

export interface DeviceSessionFilterRequest {
  key: (typeof SessionFilter)[keyof typeof SessionFilter];
  value: unknown;
  operation: SearchOperationType;
}
