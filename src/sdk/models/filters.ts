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

export const DeviceAppFilter = {
  BUNDLE_IDENTIFIER: "BUNDLE_IDENTIFIER",
  IS_DEFAULT: "IS_DEFAULT",
  FILE_KEY: "FILE_KEY"
} as const;

export const PoolFilter = {
  NAME: "NAME",
  IS_DEFAULT: "IS_DEFAULT"
} as const;

export const ApplicationFilter = {
  FILE_KEY: "FILE_KEY",
  FILE_PATH: "FILE_PATH",
  VERSION: "VERSION",
  REVISION: "REVISION"
} as const;

export const AllocationFilter = {
  ALLOCATION: "ALLOCATION"
} as const;

export const SessionFilter = {
  ALLOCATION: "ALLOCATION",
  SESSION: "SESSION",
  SERIAL: "SERIAL",
  STATE: "STATE",
  USER_EMAIL: "USER_EMAIL",
  USER_ID: "USER_ID",
  COMPANY_ID: "COMPANY_ID",
  COMPANY_NAME: "COMPANY_NAME"
} as const;

export const ScreenRecordFilter = {
  CREATED_AT: "CREATED_AT"
} as const;
