import type { Sorting } from "./common/pagination.js";
import type {
  AllocationFilterRequest,
  ApplicationFilterRequest,
  DeviceFilterRequest,
  DeviceSessionFilterRequest,
  PoolFilterRequest,
  ScreenRecordFilterRequest
} from "./filterRequests.js";

export interface ListDevicesRequest {
  filters: DeviceFilterRequest[];
  sorting: Sorting;
}

export interface ListPoolsRequest {
  filters: PoolFilterRequest[];
  sorting: Sorting;
}

export interface ApplicationPaginationRequest {
  filters: ApplicationFilterRequest[];
  sorting: Sorting;
}

export interface AllocationSearchRequest {
  filters: AllocationFilterRequest[];
  sorting: Sorting;
}

export interface DeviceAllocationRequest {
  serial?: string;
  manufacturer?: string;
  model?: string;
  platform?: string;
  platformVersion?: string;
  devicePoolId?: string;
  priority: number;
}

export interface DeviceSessionRequest {
  filters: DeviceSessionFilterRequest[];
  sorting: Sorting;
}

export interface DeviceStartSessionRequest {
  allocationId?: string;
  companyPoolId?: string;
  sessionId?: string;
  videoRecording: boolean;
  userId?: number;
  userEmail?: string;
  companyId?: number;
  companyName?: string;
  customVideoRecordingPath?: string;
  appiumVersion?: string;
}

export interface ScreenRecordPaginationRequest {
  filters: ScreenRecordFilterRequest[];
  sorting: Sorting;
}
