import { DeviceParkHttpClient } from "../client/DeviceParkHttpClient.js";
import { JsonMapper } from "../core/json/JsonMapper.js";
import type { PageDto } from "../model/common/PageDto.js";
import {
  DeviceSessionRequestBuilder,
  type DeviceSessionRequest
} from "../model/sessions/DeviceSessionRequest.js";
import type { DeviceStartSessionRequest } from "../model/sessions/DeviceStartSessionRequest.js";
import type { Session } from "../model/sessions/Session.js";
import type { StreamUrl } from "../model/sessions/StreamUrl.js";
import { StreamUrls } from "./StreamUrls.js";
import type { ScreenRecord } from "../model/sessions/screenRecord/ScreenRecord.js";
import {
  ScreenRecordPaginationRequestBuilder,
  type ScreenRecordPaginationRequest
} from "../model/sessions/screenRecord/ScreenRecordPaginationRequest.js";
import { DeviceParkConfigError } from "../sdk/errors/index.js";
import { createPaginationQuery } from "../sdk/core/requestMapping.js";

const SESSION_PATH = "/session/api/v2/public/sessions";
const SCREEN_RECORDS_PATH = "/storage/api/v1/public/sessions";

/**
 * Session API service.
 *
 * Base paths:
 * - `/session/api/v2/public/sessions`
 * - `/session/api/v2/public/sessions/{sessionId}/stream-url`
 * - `/storage/api/v1/public/sessions/{sessionId}/screen-records`
 */
export class SessionApi {
  private readonly deviceParkHttpClient: DeviceParkHttpClient;

  public constructor(deviceParkHttpClient: DeviceParkHttpClient) {
    this.deviceParkHttpClient = deviceParkHttpClient;
  }

  /**
   * Lists sessions with pagination and sorting options.
   */
  public async list(request?: DeviceSessionRequest): Promise<PageDto<Session>> {
    const nextRequest = request ?? new DeviceSessionRequestBuilder().build();
    const response = await this.deviceParkHttpClient.get(
      SESSION_PATH,
      createPaginationQuery(nextRequest)
    );

    return JsonMapper.fromJson<PageDto<Session>>(response);
  }

  /**
   * Starts a new session for an allocation.
   */
  public async start(request: DeviceStartSessionRequest): Promise<Session> {
    if (!request) {
      throw new DeviceParkConfigError("request is required");
    }

    const response = await this.deviceParkHttpClient.post(SESSION_PATH, request);
    return JsonMapper.fromJson<Session>(response);
  }

  /**
   * Returns a WebSocket URL for watching the device screen of the given session.
   *
   * The session-api response contains the stream address without a token. This method appends the
   * SDK's current access token as the `token` query parameter. The session must belong to the
   * authenticated client. The returned URL carries a credential and must not be logged.
   */
  public async streamUrl(sessionId: string): Promise<string> {
    this.assertSessionId(sessionId);
    const response = await this.deviceParkHttpClient.get(
      `${SESSION_PATH}/${encodeURIComponent(sessionId)}/stream-url`
    );
    const streamUrl = JsonMapper.fromJson<StreamUrl>(response);
    return StreamUrls.withAccessToken(streamUrl.url, await this.deviceParkHttpClient.currentAccessToken());
  }

  /**
   * Stops an active session by id.
   */
  public async stop(sessionId: string): Promise<void> {
    this.assertSessionId(sessionId);
    await this.deviceParkHttpClient.delete(`${SESSION_PATH}/${encodeURIComponent(sessionId)}`);
  }

  /**
   * Downloads the Appium log output for the given session.
   */
  public async logs(sessionId: string): Promise<Buffer> {
    this.assertSessionId(sessionId);
    return this.deviceParkHttpClient.getBytes(
      `${SESSION_PATH}/${encodeURIComponent(sessionId)}/appium-log`
    );
  }

  /**
   * Lists screen records generated for the given session.
   */
  public async screenRecords(
    sessionId: string,
    request?: ScreenRecordPaginationRequest
  ): Promise<PageDto<ScreenRecord>> {
    this.assertSessionId(sessionId);
    const nextRequest = request ?? new ScreenRecordPaginationRequestBuilder().build();
    const response = await this.deviceParkHttpClient.get(
      `${SCREEN_RECORDS_PATH}/${encodeURIComponent(sessionId)}/screen-records`,
      createPaginationQuery(nextRequest)
    );

    return JsonMapper.fromJson<PageDto<ScreenRecord>>(response);
  }

  private assertSessionId(sessionId: string): void {
    if (!sessionId.trim()) {
      throw new DeviceParkConfigError("sessionId cannot be empty");
    }
  }
}
