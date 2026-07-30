/**
 * Controls which applications Device Park removes before allocating a device.
 */
export const RemoveAppSelection = {
  NO_REMOVE: "NO_REMOVE",
  REMOVE_WITHOUT_IS_DEFAULT_APPS: "REMOVE_WITHOUT_IS_DEFAULT_APPS"
} as const;

export type RemoveAppSelectionType =
  (typeof RemoveAppSelection)[keyof typeof RemoveAppSelection];
