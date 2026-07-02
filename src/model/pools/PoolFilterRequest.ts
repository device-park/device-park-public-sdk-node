import type { SearchOperationType } from "../common/SearchOperation.js";
import type { PoolFilter } from "./PoolFilter.js";

export interface PoolFilterRequest {
  key: (typeof PoolFilter)[keyof typeof PoolFilter];
  value: unknown;
  operation: SearchOperationType;
}
