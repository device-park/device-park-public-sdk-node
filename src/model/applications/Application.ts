export interface Application {
  revision: number | null;
  sizeInBytes: number | null;
  version: string | null;
  fileKey: string | null;
  filePath: string | null;
  downloadUrl: string | null;
  createdAt: string | null;
  /** IPA bundle identifier; `null` for non-IPA uploads. */
  bundleId?: string | null;
  /** App name read from the IPA `Info.plist`; `null` for non-IPA uploads. */
  title?: string | null;
  /** Version read from the IPA; may differ from `version`. `null` for non-IPA uploads. */
  ipaVersion?: string | null;
  /** `true` when the IPA is signed with an enterprise provisioning profile; `null` for non-IPA uploads. */
  enterprise?: boolean | null;
  /** Lowest iOS version the IPA supports; `null` for non-IPA uploads. */
  minimumOsVersion?: string | null;
  /** Lowest Android API level the APK supports; `null` for non-APK uploads. */
  minSdkVersion?: number | null;
}
