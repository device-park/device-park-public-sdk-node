import type { SearchOperationType } from "../common/SearchOperation.js";
import type { SortDirectionType } from "../common/SortDirection.js";
import { createDefaultSorting, type Sorting } from "../common/Sorting.js";
import type { PoolFilter } from "./PoolFilter.js";
import type { PoolFilterRequest } from "./PoolFilterRequest.js";

export interface ListPoolsRequest {
  filters: PoolFilterRequest[];
  sorting: Sorting;
}

export class ListPoolsRequestBuilder {
  private readonly request: ListPoolsRequest = {
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
    key: (typeof PoolFilter)[keyof typeof PoolFilter],
    value: unknown,
    operation: SearchOperationType
  ): this {
    this.request.filters.push({ key, value, operation });
    return this;
  }

  public filters(filters: PoolFilterRequest[]): this {
    this.request.filters = [...filters];
    return this;
  }

  public build(): ListPoolsRequest {
    return {
      filters: [...this.request.filters],
      sorting: { ...this.request.sorting }
    };
  }
}
