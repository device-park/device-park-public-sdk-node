export const SearchOperation = {
  EQUAL: "EQUAL",
  NOT_EQUAL: "NOT_EQUAL",
  GREATER_THAN: "GREATER_THAN",
  LESS_THAN: "LESS_THAN"
} as const;

export type SearchOperationType = (typeof SearchOperation)[keyof typeof SearchOperation];
