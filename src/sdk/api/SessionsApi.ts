import { createPaginationQuery } from "../core/requestMapping.js";
import { parseJson } from "../core/json.js";
import { DeviceParkConfigError } from "../errors/index.js";
import type { PageDto } from "../models/common/pagination.js";
import type { ScreenRecord, Session } from "../models/resources.js";
import type {
  DeviceSessionRequest,
  DeviceStartSessionRequest,
  ScreenRecordPaginationRequest
} from "../models/requests.js";
import {
  DeviceSessionRequestBuilder,
  ScreenRecordPaginationRequestBuilder
} from "../models/builders.js";
import { BaseApi } from "./BaseApi.js";

const SESSION_PATH = "/session/api/v2/public/sessions";
const SCREEN_RECORDS_PATH = "/storage/api/v1/public/sessions";

export class SessionsApi extends BaseApi {
  public async list(request?: DeviceSessionRequest): Promise<PageDto<Session>> {
    const nextRequest = request ?? new DeviceSessionRequestBuilder().build();
    const response = await this.httpClient.get(SESSION_PATH, createPaginationQuery(nextRequest));
    return parseJson<PageDto<Session>>(response);
  }

  public async start(request: DeviceStartSessionRequest): Promise<Session> {
    if (!request) {
      throw new DeviceParkConfigError("request is required");
    }

    const response = await this.httpClient.post(SESSION_PATH, request);
    return parseJson<Session>(response);
  }

  public async stop(sessionId: string): Promise<void> {
    this.assertSessionId(sessionId);
    await this.httpClient.delete(`${SESSION_PATH}/${encodeURIComponent(sessionId)}`);
  }

  public async logs(sessionId: string): Promise<Buffer> {
    this.assertSessionId(sessionId);
    return this.httpClient.getBytes(`${SESSION_PATH}/${encodeURIComponent(sessionId)}/appium-log`);
  }

  public async screenRecords(
    sessionId: string,
    request?: ScreenRecordPaginationRequest
  ): Promise<PageDto<ScreenRecord>> {
    this.assertSessionId(sessionId);
    const nextRequest = request ?? new ScreenRecordPaginationRequestBuilder().build();
    const response = await this.httpClient.get(
      `${SCREEN_RECORDS_PATH}/${encodeURIComponent(sessionId)}/screen-records`,
      createPaginationQuery(nextRequest)
    );

    return parseJson<PageDto<ScreenRecord>>(response);
  }

  private assertSessionId(sessionId: string): void {
    if (!sessionId.trim()) {
      throw new DeviceParkConfigError("sessionId cannot be empty");
    }
  }
}
