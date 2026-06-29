import { createPaginationQuery } from "../core/requestMapping.js";
import { parseJson } from "../core/json.js";
import type { PageDto } from "../models/common/pagination.js";
import type { Device } from "../models/resources.js";
import type { ListDevicesRequest } from "../models/requests.js";
import { ListDevicesRequestBuilder } from "../models/builders.js";
import { BaseApi } from "./BaseApi.js";

export class DevicesApi extends BaseApi {
  public async list(request?: ListDevicesRequest): Promise<PageDto<Device>> {
    const nextRequest = request ?? new ListDevicesRequestBuilder().build();
    const response = await this.httpClient.get(
      "/management/api/v1/public/devices",
      createPaginationQuery(nextRequest)
    );

    return parseJson<PageDto<Device>>(response);
  }

  public async get(serial: string): Promise<Device> {
    const response = await this.httpClient.get(`/management/api/v1/public/devices/${encodeURIComponent(serial)}`);
    return parseJson<Device>(response);
  }
}
