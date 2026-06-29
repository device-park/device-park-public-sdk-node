import type { SearchOperationType } from "../../common/SearchOperation.js";
import type { ScreenRecordFilter } from "./ScreenRecordFilter.js";

export interface ScreenRecordFilterRequest {
  key: (typeof ScreenRecordFilter)[keyof typeof ScreenRecordFilter];
  value: unknown;
  operation: SearchOperationType;
}
