export interface Application {
  revision: number | null;
  sizeInBytes: number | null;
  version: string | null;
  fileKey: string | null;
  filePath: string | null;
  downloadUrl: string | null;
  createdAt: string | null;
}
