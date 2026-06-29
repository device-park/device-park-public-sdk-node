import { DeviceParkHttpClient } from "../client/DeviceParkHttpClient.js";
import { JsonMapper } from "../core/json/JsonMapper.js";
import type { PageDto } from "../model/common/PageDto.js";
import type { Application } from "../model/applications/Application.js";
import {
  ApplicationPaginationRequestBuilder,
  type ApplicationPaginationRequest
} from "../model/applications/ApplicationPaginationRequest.js";
import { DeviceParkConfigError } from "../sdk/errors/index.js";
import { createPaginationQuery } from "../sdk/core/requestMapping.js";

const APPLICATION_PATH = "/storage/api/v1/public/applications";

/**
 * Application API service.
 */
export class ApplicationApi {
  private readonly deviceParkHttpClient: DeviceParkHttpClient;

  public constructor(deviceParkHttpClient: DeviceParkHttpClient) {
    this.deviceParkHttpClient = deviceParkHttpClient;
  }

  public async list(request?: ApplicationPaginationRequest): Promise<PageDto<Application>> {
    const nextRequest = request ?? new ApplicationPaginationRequestBuilder().build();
    const response = await this.deviceParkHttpClient.get(
      APPLICATION_PATH,
      createPaginationQuery(nextRequest)
    );

    return JsonMapper.fromJson<PageDto<Application>>(response);
  }

  public async upload(
    fileStream: NodeJS.ReadableStream | ReadableStream,
    fileName: string,
    version: string
  ): Promise<Application> {
    if (!fileName.trim()) {
      throw new DeviceParkConfigError("fileName cannot be empty");
    }

    if (!version.trim()) {
      throw new DeviceParkConfigError("version cannot be empty");
    }

    if (version.length > 50) {
      throw new DeviceParkConfigError("version length must be at most 50 characters");
    }

    const response = await this.deviceParkHttpClient.postStream(APPLICATION_PATH, fileStream, {
      "file-name": fileName,
      version
    });

    return JsonMapper.fromJson<Application>(response);
  }

  public async delete(fileKey: string): Promise<void> {
    if (!fileKey.trim()) {
      throw new DeviceParkConfigError("fileKey cannot be empty");
    }

    await this.deviceParkHttpClient.delete(`${APPLICATION_PATH}/${encodeURIComponent(fileKey)}`);
  }
}
