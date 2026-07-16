import { createPaginationQuery } from "../core/requestMapping.js";
import { parseJson } from "../core/json.js";
import { DeviceParkConfigError } from "../errors/index.js";
import type { PageDto } from "../models/common/pagination.js";
import type { Application } from "../models/resources.js";
import type { ApplicationPaginationRequest } from "../models/requests.js";
import { ApplicationPaginationRequestBuilder } from "../models/builders.js";
import { BaseApi } from "./BaseApi.js";

const APPLICATION_PATH = "/storage/api/v1/public/applications";

export class ApplicationsApi extends BaseApi {
  public async list(request?: ApplicationPaginationRequest): Promise<PageDto<Application>> {
    const nextRequest = request ?? new ApplicationPaginationRequestBuilder().build();
    const response = await this.httpClient.get(APPLICATION_PATH, createPaginationQuery(nextRequest));
    return parseJson<PageDto<Application>>(response);
  }

  public async upload(
    fileStream: NodeJS.ReadableStream | ReadableStream,
    fileName: string,
    version: string,
    imageInjection = false
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

    const response = await this.httpClient.postStream(APPLICATION_PATH, fileStream, {
      "file-name": fileName,
      version,
      "image-injection": String(imageInjection)
    });

    return parseJson<Application>(response);
  }

  public async delete(fileKey: string): Promise<void> {
    if (!fileKey.trim()) {
      throw new DeviceParkConfigError("fileKey cannot be empty");
    }

    await this.httpClient.delete(`${APPLICATION_PATH}/${encodeURIComponent(fileKey)}`);
  }
}
