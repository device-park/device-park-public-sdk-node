import type { SearchOperationType } from "../common/SearchOperation.js";
import type { SortDirectionType } from "../common/SortDirection.js";
import { createDefaultSorting, type Sorting } from "../common/Sorting.js";
import type { DeviceFilter } from "./DeviceFilter.js";
import type { DeviceFilterRequest } from "./DeviceFilterRequest.js";

export interface ListDevicesRequest {
  filters: DeviceFilterRequest[];
  sorting: Sorting;
}

/**
 * Builder for the devices list request.
 *
 * The request carries filter, pagination and sorting data for
 * `GET /management/api/v1/public/devices`.
 */
export class ListDevicesRequestBuilder {
  private readonly request: ListDevicesRequest = {
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

  /**
   * Adds a single filter rule to the request.
   */
  public addFilter(
    key: (typeof DeviceFilter)[keyof typeof DeviceFilter],
    value: unknown,
    operation: SearchOperationType
  ): this {
    this.request.filters.push({ key, value, operation });
    return this;
  }

  public filters(filters: DeviceFilterRequest[]): this {
    this.request.filters = [...filters];
    return this;
  }

  public build(): ListDevicesRequest {
    return {
      filters: [...this.request.filters],
      sorting: { ...this.request.sorting }
    };
  }
}
