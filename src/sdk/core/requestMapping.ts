import type { QueryValue } from "./query.js";
import type { FilterRequest } from "../models/filterRequests.js";
import type { Sorting } from "../models/common/pagination.js";

export function createSortingQuery(sorting: Sorting): Record<string, QueryValue> {
  return {
    "sorting.page": sorting.page,
    "sorting.size": sorting.size,
    "sorting.sortBy": sorting.sortBy,
    "sorting.direction": sorting.direction
  };
}

export function createFilterQuery<TFilter extends FilterRequest>(
  filters: TFilter[]
): Record<string, QueryValue> {
  const query: Record<string, QueryValue> = {};

  filters.forEach((filter, index) => {
    query[`filters[${index}].key`] = filter.key;
    query[`filters[${index}].value`] = normalizeFilterValue(filter.value);
    query[`filters[${index}].operation`] = filter.operation;
  });

  return query;
}

export function createPaginationQuery<TFilter extends FilterRequest>(request: {
  filters: TFilter[];
  sorting: Sorting;
}): Record<string, QueryValue> {
  return {
    ...createSortingQuery(request.sorting),
    ...createFilterQuery(request.filters)
  };
}

function normalizeFilterValue(value: unknown): QueryValue {
  if (value === undefined) {
    return undefined;
  }

  if (value === null) {
    return null;
  }

  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return value;
  }

  return JSON.stringify(value);
}
