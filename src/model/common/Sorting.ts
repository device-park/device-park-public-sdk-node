import type { SortDirectionType } from "./SortDirection.js";

export interface Sorting {
  page: number;
  size: number;
  sortBy: string;
  direction: SortDirectionType;
}

export function createDefaultSorting(): Sorting {
  return {
    page: 0,
    size: 20,
    sortBy: "ID",
    direction: "DESC"
  };
}
