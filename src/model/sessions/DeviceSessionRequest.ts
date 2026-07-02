import type { SearchOperationType } from "../common/SearchOperation.js";
import type { SortDirectionType } from "../common/SortDirection.js";
import { createDefaultSorting, type Sorting } from "../common/Sorting.js";
import type { SessionFilter } from "./SessionFilter.js";
import type { DeviceSessionFilterRequest } from "./DeviceSessionFilterRequest.js";

export interface DeviceSessionRequest {
  filters: DeviceSessionFilterRequest[];
  sorting: Sorting;
}

/**
 * Builder for the sessions list request.
 */
export class DeviceSessionRequestBuilder {
  private readonly request: DeviceSessionRequest = {
    filters: [],
    sorting: createDefaultSorting()
  };

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

  public direction(direction: SortDirectionType): this {
    this.request.sorting.direction = direction;
    return this;
  }

  public addFilter(
    key: (typeof SessionFilter)[keyof typeof SessionFilter],
    value: unknown,
    operation: SearchOperationType
  ): this {
    this.request.filters.push({ key, value, operation });
    return this;
  }

  public filters(filters: DeviceSessionFilterRequest[]): this {
    this.request.filters = [...filters];
    return this;
  }

  public build(): DeviceSessionRequest {
    return {
      filters: [...this.request.filters],
      sorting: { ...this.request.sorting }
    };
  }
}
