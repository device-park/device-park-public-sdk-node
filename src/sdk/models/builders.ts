import { DeviceParkConfigError } from "../errors/index.js";
import { createDefaultSorting } from "./common/pagination.js";
import type { SearchOperation, SortDirection } from "./common/enums.js";
import type {
  AllocationFilterRequest,
  ApplicationFilterRequest,
  DeviceFilterRequest,
  DeviceAppFilterRequest,
  DeviceSessionFilterRequest,
  PoolFilterRequest,
  ScreenRecordFilterRequest
} from "./filterRequests.js";
import type {
  AllocationSearchRequest,
  ApplicationPaginationRequest,
  DeviceAllocationRequest,
  DeviceSessionRequest,
  DeviceStartSessionRequest,
  CreatePoolRequest,
  ListDevicesRequest,
  ListDeviceAppsRequest,
  ListPoolsRequest,
  ScreenRecordPaginationRequest
} from "./requests.js";
import {
  RemoveAppSelection,
  type RemoveAppSelectionType
} from "../../model/allocation/RemoveAppSelection.js";

abstract class PaginationRequestBuilder<
  TRequest extends { filters: TFilter[]; sorting: ReturnType<typeof createDefaultSorting> },
  TFilter extends { key: string; value: unknown; operation: SearchOperation }
> {
  protected readonly request: TRequest;

  protected constructor(factory: () => TRequest) {
    this.request = factory();
  }

  public page(page: number): this {
    this.request.sorting.page = page;
    return this;
  }

  public size(size: number): this {
    this.request.sorting.size = size;
    return this;
  }

  public sortBy(sortBy: string): this {
    this.request.sorting.sortBy = sortBy;
    return this;
  }

  public direction(direction: SortDirection): this {
    this.request.sorting.direction = direction;
    return this;
  }

  public filters(filters: TFilter[]): this {
    this.request.filters = [...filters];
    return this;
  }

  protected pushFilter(filter: TFilter): this {
    this.request.filters.push(filter);
    return this;
  }

  public build(): TRequest {
    return {
      ...this.request,
      filters: [...this.request.filters],
      sorting: { ...this.request.sorting }
    };
  }
}

export class ListDevicesRequestBuilder extends PaginationRequestBuilder<
  ListDevicesRequest,
  DeviceFilterRequest
> {
  public constructor() {
    super(() => ({ filters: [], sorting: createDefaultSorting() }));
  }

  public addFilter(key: DeviceFilterRequest["key"], value: unknown, operation: SearchOperation): this {
    return super.pushFilter({ key, value, operation });
  }
}

export class ListDeviceAppsRequestBuilder extends PaginationRequestBuilder<
  ListDeviceAppsRequest,
  DeviceAppFilterRequest
> {
  public constructor() {
    super(() => ({ filters: [], sorting: createDefaultSorting() }));
  }

  public addFilter(
    key: DeviceAppFilterRequest["key"],
    value: unknown,
    operation: SearchOperation
  ): this {
    return super.pushFilter({ key, value, operation });
  }
}

export class ListPoolsRequestBuilder extends PaginationRequestBuilder<ListPoolsRequest, PoolFilterRequest> {
  public constructor() {
    super(() => ({ filters: [], sorting: createDefaultSorting() }));
  }

  public addFilter(key: PoolFilterRequest["key"], value: unknown, operation: SearchOperation): this {
    return super.pushFilter({ key, value, operation });
  }
}

export class CreatePoolRequestBuilder {
  private readonly request: Partial<CreatePoolRequest> = {};

  public name(name: string): this {
    this.request.name = name;
    return this;
  }

  public build(): CreatePoolRequest {
    if (!this.request.name?.trim()) {
      throw new DeviceParkConfigError("name cannot be empty");
    }

    return { name: this.request.name };
  }
}

export class ApplicationPaginationRequestBuilder extends PaginationRequestBuilder<
  ApplicationPaginationRequest,
  ApplicationFilterRequest
> {
  public constructor() {
    super(() => ({ filters: [], sorting: createDefaultSorting() }));
  }

  public addFilter(
    key: ApplicationFilterRequest["key"],
    value: unknown,
    operation: SearchOperation
  ): this {
    return super.pushFilter({ key, value, operation });
  }
}

export class AllocationSearchRequestBuilder extends PaginationRequestBuilder<
  AllocationSearchRequest,
  AllocationFilterRequest
> {
  public constructor() {
    super(() => ({ filters: [], sorting: createDefaultSorting() }));
  }

  public addFilter(key: AllocationFilterRequest["key"], value: unknown, operation: SearchOperation): this {
    return super.pushFilter({ key, value, operation });
  }
}

export class DeviceSessionRequestBuilder extends PaginationRequestBuilder<
  DeviceSessionRequest,
  DeviceSessionFilterRequest
> {
  public constructor() {
    super(() => ({ filters: [], sorting: createDefaultSorting() }));
  }

  public addFilter(
    key: DeviceSessionFilterRequest["key"],
    value: unknown,
    operation: SearchOperation
  ): this {
    return super.pushFilter({ key, value, operation });
  }
}

export class ScreenRecordPaginationRequestBuilder extends PaginationRequestBuilder<
  ScreenRecordPaginationRequest,
  ScreenRecordFilterRequest
> {
  public constructor() {
    super(() => ({ filters: [], sorting: createDefaultSorting() }));
  }

  public addFilter(
    key: ScreenRecordFilterRequest["key"],
    value: unknown,
    operation: SearchOperation
  ): this {
    return super.pushFilter({ key, value, operation });
  }
}

export class DeviceAllocationRequestBuilder {
  private readonly request: DeviceAllocationRequest = {
    priority: 3,
    removeApps: RemoveAppSelection.NO_REMOVE
  };

  public serial(serial: string): this {
    this.request.serial = serial;
    return this;
  }

  public manufacturer(manufacturer: string): this {
    this.request.manufacturer = manufacturer;
    return this;
  }

  public model(model: string): this {
    this.request.model = model;
    return this;
  }

  public platform(platform: string): this {
    this.request.platform = platform;
    return this;
  }

  public platformVersion(platformVersion: string): this {
    this.request.platformVersion = platformVersion;
    return this;
  }

  public devicePoolId(devicePoolId: string): this {
    this.request.devicePoolId = devicePoolId;
    return this;
  }

  public priority(priority: number): this {
    if (priority < 1 || priority > 5) {
      throw new DeviceParkConfigError("priority must be between 1 and 5");
    }

    this.request.priority = priority;
    return this;
  }

  public removeApps(removeApps: RemoveAppSelectionType): this {
    this.request.removeApps = removeApps;
    return this;
  }

  public build(): DeviceAllocationRequest {
    return { ...this.request };
  }
}

export class DeviceStartSessionRequestBuilder {
  private readonly request: Partial<DeviceStartSessionRequest> = {
    videoRecording: false
  };

  public allocationId(allocationId: string): this {
    this.request.allocationId = allocationId;
    return this;
  }

  public companyPoolId(companyPoolId: string): this {
    this.request.companyPoolId = companyPoolId;
    return this;
  }

  public videoRecording(videoRecording: boolean): this {
    this.request.videoRecording = videoRecording;
    return this;
  }

  public userId(userId: number): this {
    this.request.userId = userId;
    return this;
  }

  public userEmail(userEmail: string): this {
    this.request.userEmail = userEmail;
    return this;
  }

  public companyId(companyId: number): this {
    this.request.companyId = companyId;
    return this;
  }

  public companyName(companyName: string): this {
    this.request.companyName = companyName;
    return this;
  }

  public customVideoRecordingPath(customVideoRecordingPath: string): this {
    this.request.customVideoRecordingPath = customVideoRecordingPath;
    return this;
  }

  public appiumVersion(appiumVersion: string): this {
    this.request.appiumVersion = appiumVersion;
    return this;
  }

  public build(): DeviceStartSessionRequest {
    const requiredFields = [
      "allocationId",
      "userId",
      "userEmail",
      "companyId",
      "companyName"
    ] as const;

    for (const field of requiredFields) {
      if (this.request[field] === undefined || this.request[field] === null) {
        throw new DeviceParkConfigError(`${field} is required`);
      }
    }

    if (!this.request.companyName?.trim()) {
      throw new DeviceParkConfigError("companyName cannot be blank");
    }

    return { ...this.request } as DeviceStartSessionRequest;
  }
}
