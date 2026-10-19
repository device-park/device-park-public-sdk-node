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
  FILE_KEY: "fileKey",
  FILE_PATH: "filePath",
  VERSION: "version",
  REVISION: "revision"
} as const;

export const AllocationFilter = {
  ALLOCATION: "allocationId"
} as const;

export const SessionFilter = {
  ALLOCATION: "allocationId",
  SESSION: "sessionId",
  SERIAL: "deviceSerial",
  STATE: "state",
  USER_EMAIL: "userEmail",
  USER_ID: "userId",
  COMPANY_ID: "companyId",
  COMPANY_NAME: "companyName"
} as const;

export const ScreenRecordFilter = {
  CREATED_AT: "createdAt"
} as const;
