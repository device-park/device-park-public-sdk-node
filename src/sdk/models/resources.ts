export interface Device {
  id: number | null;
  serial: string | null;
  marketName: string | null;
  model: string | null;
  manufacturer: string | null;
  platform: string | null;
  platformVersion: string | null;
  version: string | null;
  state: string | null;
  isSimulator: boolean | null;
  isPublic: boolean | null;
}

export interface Pool {
  id: string | null;
  name: string | null;
  isDefault: boolean | null;
}

export interface Application {
  revision: number | null;
  sizeInBytes: number | null;
  version: string | null;
  fileKey: string | null;
  filePath: string | null;
  downloadUrl: string | null;
  createdAt: string | null;
}

export interface Allocation {
  allocationId: string | null;
  deviceSerial: string | null;
  requestId: string | null;
  position: number | null;
  expiresAt: string | null;
}

export interface Session {
  id: number | null;
  state: string | null;
  client: string | null;
  sessionId: string | null;
  allocationId: string | null;
  startDate: string | null;
  endDate: string | null;
  latestInteractionTime: string | null;
  userId: number | null;
  userEmail: string | null;
  companyId: number | null;
  companyName: string | null;
  deviceSerial: string | null;
  deviceName: string | null;
  deviceModel: string | null;
  deviceManufacturer: string | null;
  devicePlatform: string | null;
  deviceVersion: string | null;
  videoRecording: boolean | null;
  videoRecordUrl: string | null;
  appiumVersion: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  dataAccessEndDate: string | null;
}

export interface ScreenRecord {
  fileKey: string | null;
  filePath: string | null;
  downloadUrl: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  duration: number | null;
}
