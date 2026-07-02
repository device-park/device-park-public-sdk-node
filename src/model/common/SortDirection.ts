export const SortDirection = {
  ASC: "ASC",
  DESC: "DESC"
} as const;

export type SortDirectionType = (typeof SortDirection)[keyof typeof SortDirection];
