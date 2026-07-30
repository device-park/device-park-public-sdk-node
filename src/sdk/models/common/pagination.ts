import type { SortDirection } from "./enums.js";

export interface Sorting {
  page: number;
  size: number;
  sortBy: string;
  direction: SortDirection;
}

export interface PageDto<T> {
  size: number;
  page: number;
  totalPages: number;
  totalElements: number;
  data: T[];
}

export function createDefaultSorting(): Sorting {
  return {
    page: 0,
    size: 20,
    sortBy: "ID",
    direction: "DESC"
  };
}
