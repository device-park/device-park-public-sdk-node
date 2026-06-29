import { DeviceParkHttpClient } from "../../client/DeviceParkHttpClient.js";
import { JsonMapper } from "../../core/json/JsonMapper.js";
import type { PageDto } from "../../model/common/PageDto.js";
import type { Device } from "../../model/devices/Device.js";
import { ListDevicesRequestBuilder, type ListDevicesRequest } from "../../model/devices/ListDevicesRequest.js";
import { createPaginationQuery } from "../../sdk/core/requestMapping.js";

/**
 * Devices API service.
 */
export class DevicesApi {
  private readonly deviceParkHttpClient: DeviceParkHttpClient;

  public constructor(deviceParkHttpClient: DeviceParkHttpClient) {
    this.deviceParkHttpClient = deviceParkHttpClient;
  }

  public async list(request?: ListDevicesRequest): Promise<PageDto<Device>> {
    const nextRequest = request ?? new ListDevicesRequestBuilder().build();
    const response = await this.deviceParkHttpClient.get(
      "/management/api/v1/public/devices",
      createPaginationQuery(nextRequest)
    );

    return JsonMapper.fromJson<PageDto<Device>>(response);
  }

  public async get(serial: string): Promise<Device> {
    const response = await this.deviceParkHttpClient.get(
      `/management/api/v1/public/devices/${encodeURIComponent(serial)}`
    );
    return JsonMapper.fromJson<Device>(response);
  }
}
