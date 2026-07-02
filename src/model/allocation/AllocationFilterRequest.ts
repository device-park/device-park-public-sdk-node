import type { SearchOperationType } from "../common/SearchOperation.js";
import type { AllocationFilter } from "./AllocationFilter.js";

export interface AllocationFilterRequest {
  key: (typeof AllocationFilter)[keyof typeof AllocationFilter];
  value: unknown;
  operation: SearchOperationType;
}
