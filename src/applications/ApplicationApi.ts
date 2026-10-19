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

/** The storage API serializes the size as `size_in_bytes`; expose it as `sizeInBytes` like the Java SDK model. */
function normalizeApplication(application: Application): Application {
  const raw = application as Application & { size_in_bytes?: number | null };
  const { size_in_bytes: sizeInBytes, ...rest } = raw;
  return { ...rest, sizeInBytes: rest.sizeInBytes ?? sizeInBytes ?? null };
}

/**
 * Application API service.
 *
 * Base path: `/storage/api/v1/public/applications`
 */
export class ApplicationApi {
  private readonly deviceParkHttpClient: DeviceParkHttpClient;

  public constructor(deviceParkHttpClient: DeviceParkHttpClient) {
    this.deviceParkHttpClient = deviceParkHttpClient;
  }

  /**
   * Lists uploaded applications with pagination and sorting options.
   */
  public async list(request?: ApplicationPaginationRequest): Promise<PageDto<Application>> {
    const nextRequest = request ?? new ApplicationPaginationRequestBuilder().build();
    const response = await this.deviceParkHttpClient.get(
      APPLICATION_PATH,
      createPaginationQuery(nextRequest)
    );

    const page = JsonMapper.fromJson<PageDto<Application>>(response);
    return { ...page, data: page.data.map(normalizeApplication) };
  }

  /**
   * Uploads an application as `application/octet-stream`.
   *
   * The provided version must be non-empty and at most 50 characters.
   */
  public async upload(
    fileStream: NodeJS.ReadableStream | ReadableStream,
    fileName: string,
    version: string,
    imageInjection = false
  ): Promise<Application> {
    if (!fileName?.trim()) {
      throw new DeviceParkConfigError("fileName cannot be empty");
    }

    if (!version?.trim()) {
      throw new DeviceParkConfigError("version cannot be empty");
    }

    if (version.length > 50) {
      throw new DeviceParkConfigError("version length must be at most 50 characters");
    }

    const response = await this.deviceParkHttpClient.postStream(APPLICATION_PATH, fileStream, {
      "file-name": fileName,
      version,
      "image-injection": String(imageInjection)
    });

    return normalizeApplication(JsonMapper.fromJson<Application>(response));
  }

  /**
   * Deletes an application and its revisions by file key.
   */
  public async delete(fileKey: string): Promise<void> {
    if (!fileKey?.trim()) {
      throw new DeviceParkConfigError("fileKey cannot be empty");
    }

    await this.deviceParkHttpClient.delete(`${APPLICATION_PATH}/${encodeURIComponent(fileKey)}`);
  }
}
