export const DeviceFilter = {
  POOL_ID: "devicePools.id",
  SERIAL_NUMBER: "serial",
  MARKETING_NAME: "marketName",
  MANUFACTURER: "manufacturer",
  MODEL_NAME: "model",
  PLATFORM: "platform",
  PLATFORM_VERSION: "platformVersion",
  /** @deprecated `osVersion` is not a filterable field; use {@link DeviceFilter.PLATFORM_VERSION}. */
  OS_VERSION: "platformVersion",
  TAGS: "tags.name",
  STATE: "deviceStates.state"
} as const;
