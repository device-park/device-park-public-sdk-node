export const SortDirection = {
  ASC: "ASC",
  DESC: "DESC"
} as const;

export type SortDirection = (typeof SortDirection)[keyof typeof SortDirection];

export const SearchOperation = {
  EQUAL: "EQUAL",
  NOT_EQUAL: "NOT_EQUAL",
  GREATER_THAN: "GREATER_THAN",
  LESS_THAN: "LESS_THAN"
} as const;

export type SearchOperation = (typeof SearchOperation)[keyof typeof SearchOperation];
