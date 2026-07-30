export const DeviceFilter = {
  POOL_ID: "devicePools.id",
  SERIAL_NUMBER: "serial",
  MARKETING_NAME: "marketName",
  MANUFACTURER: "manufacturer",
  MODEL_NAME: "model",
  PLATFORM: "platform",
  OS_VERSION: "osVersion",
  TAGS: "tags.name",
  STATE: "deviceStates.state"
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
  STATE: "state"
} as const;

export const ScreenRecordFilter = {
  CREATED_AT: "createdAt"
} as const;
