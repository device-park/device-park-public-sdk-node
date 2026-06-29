import type { SearchOperation } from "./common/enums.js";
import type {
  AllocationFilter,
  ApplicationFilter,
  DeviceFilter,
  PoolFilter,
  ScreenRecordFilter,
  SessionFilter
} from "./filters.js";

export interface FilterRequest<TKey extends string = string> {
  key: TKey;
  value: unknown;
  operation: SearchOperation;
}

export type DeviceFilterRequest = FilterRequest<(typeof DeviceFilter)[keyof typeof DeviceFilter]>;
export type PoolFilterRequest = FilterRequest<(typeof PoolFilter)[keyof typeof PoolFilter]>;
export type ApplicationFilterRequest = FilterRequest<
  (typeof ApplicationFilter)[keyof typeof ApplicationFilter]
>;
export type AllocationFilterRequest = FilterRequest<
  (typeof AllocationFilter)[keyof typeof AllocationFilter]
>;
export type DeviceSessionFilterRequest = FilterRequest<
  (typeof SessionFilter)[keyof typeof SessionFilter]
>;
export type ScreenRecordFilterRequest = FilterRequest<
  (typeof ScreenRecordFilter)[keyof typeof ScreenRecordFilter]
>;
