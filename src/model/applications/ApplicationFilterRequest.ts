import type { SearchOperationType } from "../common/SearchOperation.js";
import type { ApplicationFilter } from "./ApplicationFilter.js";

export interface ApplicationFilterRequest {
  key: (typeof ApplicationFilter)[keyof typeof ApplicationFilter];
  value: unknown;
  operation: SearchOperationType;
}
