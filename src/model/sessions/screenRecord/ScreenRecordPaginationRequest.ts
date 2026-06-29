import type { SearchOperationType } from "../../common/SearchOperation.js";
import type { SortDirectionType } from "../../common/SortDirection.js";
import { createDefaultSorting, type Sorting } from "../../common/Sorting.js";
import type { ScreenRecordFilter } from "./ScreenRecordFilter.js";
import type { ScreenRecordFilterRequest } from "./ScreenRecordFilterRequest.js";

export interface ScreenRecordPaginationRequest {
  filters: ScreenRecordFilterRequest[];
  sorting: Sorting;
}

export class ScreenRecordPaginationRequestBuilder {
  private readonly request: ScreenRecordPaginationRequest = {
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
    key: (typeof ScreenRecordFilter)[keyof typeof ScreenRecordFilter],
    value: unknown,
    operation: SearchOperationType
  ): this {
    this.request.filters.push({ key, value, operation });
    return this;
  }

  public filters(filters: ScreenRecordFilterRequest[]): this {
    this.request.filters = [...filters];
    return this;
  }

  public build(): ScreenRecordPaginationRequest {
    return {
      filters: [...this.request.filters],
      sorting: { ...this.request.sorting }
    };
  }
}
