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
