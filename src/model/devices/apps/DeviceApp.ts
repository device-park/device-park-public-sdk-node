/** An application installed on a Device Park device. */
export interface DeviceApp {
  id: number | null;
  bundleIdentifier: string | null;
  installedAt: string | null;
  updatedAt: string | null;
  isDefault: boolean | null;
}
