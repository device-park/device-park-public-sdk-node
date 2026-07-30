export interface DeviceStartSessionRequest {
  allocationId?: string;
  companyPoolId?: string;
  sessionId?: string;
  videoRecording: boolean;
  userId?: number;
  userEmail?: string;
  companyId?: number;
  companyName?: string;
  customVideoRecordingPath?: string;
  appiumVersion?: string;
}

/**
 * Builder for starting a new session.
 *
 * `videoRecording` defaults to `false`.
 */
export class DeviceStartSessionRequestBuilder {
  private readonly request: DeviceStartSessionRequest = {
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

  public sessionId(sessionId: string): this {
    this.request.sessionId = sessionId;
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
    return { ...this.request };
  }
}
