import { DeviceParkConfigError } from "../../sdk/errors/index.js";

export interface DeviceStartSessionRequest {
  allocationId: string;
  companyPoolId?: string;
  videoRecording?: boolean;
  userId: number;
  userEmail: string;
  companyId: number;
  companyName: string;
  customVideoRecordingPath?: string;
  appiumVersion?: string;
}

/**
 * Builder for starting a new session.
 *
 * `videoRecording` defaults to `false`.
 */
export class DeviceStartSessionRequestBuilder {
  private readonly request: Partial<DeviceStartSessionRequest> = {
    videoRecording: false
  };

  public allocationId(allocationId: string): this {
    this.request.allocationId = allocationId;
    return this;
  }

  public companyPoolId(companyPoolId: string): this {
    this.request.companyPoolId = companyPoolId;
    return this;
  }

  public videoRecording(videoRecording: boolean): this {
    this.request.videoRecording = videoRecording;
    return this;
  }

  public userId(userId: number): this {
    this.request.userId = userId;
    return this;
  }

  public userEmail(userEmail: string): this {
    this.request.userEmail = userEmail;
    return this;
  }

  public companyId(companyId: number): this {
    this.request.companyId = companyId;
    return this;
  }

  public companyName(companyName: string): this {
    this.request.companyName = companyName;
    return this;
  }

  public customVideoRecordingPath(customVideoRecordingPath: string): this {
    this.request.customVideoRecordingPath = customVideoRecordingPath;
    return this;
  }

  public appiumVersion(appiumVersion: string): this {
    this.request.appiumVersion = appiumVersion;
    return this;
  }

  public build(): DeviceStartSessionRequest {
    const requiredFields = [
      "allocationId",
      "userId",
      "userEmail",
      "companyId",
      "companyName"
    ] as const;

    for (const field of requiredFields) {
      if (this.request[field] === undefined || this.request[field] === null) {
        throw new DeviceParkConfigError(`${field} is required`);
      }
    }

    if (!this.request.companyName?.trim()) {
      throw new DeviceParkConfigError("companyName cannot be blank");
    }

    return { ...this.request } as DeviceStartSessionRequest;
  }
}
