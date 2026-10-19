/**
 * Filter keys of the device list endpoint. The server deserializes `key` into its `DeviceFilter`
 * enum, so the value sent must be the enum NAME (as the Java SDK sends), not the database column.
 */
export const DeviceFilter = {
  POOL_ID: "POOL_ID",
  SERIAL_NUMBER: "SERIAL_NUMBER",
  MARKETING_NAME: "MARKETING_NAME",
  MANUFACTURER: "MANUFACTURER",
  MODEL_NAME: "MODEL_NAME",
  PLATFORM: "PLATFORM",
  PLATFORM_VERSION: "PLATFORM_VERSION",
  /** @deprecated `osVersion` is not a filterable field; use {@link DeviceFilter.PLATFORM_VERSION}. */
  OS_VERSION: "PLATFORM_VERSION",
  TAGS: "TAGS",
  STATE: "STATE"
} as const;
