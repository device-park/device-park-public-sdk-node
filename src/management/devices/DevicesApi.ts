import { DeviceParkHttpClient } from "../../client/DeviceParkHttpClient.js";
import { JsonMapper } from "../../core/json/JsonMapper.js";
import type { PageDto } from "../../model/common/PageDto.js";
import type { Device } from "../../model/devices/Device.js";
import { ListDevicesRequestBuilder, type ListDevicesRequest } from "../../model/devices/ListDevicesRequest.js";
import { createPaginationQuery } from "../../sdk/core/requestMapping.js";
import type { DeviceApp } from "../../model/devices/apps/DeviceApp.js";
import {
  ListDeviceAppsRequestBuilder,
  type ListDeviceAppsRequest
} from "../../model/devices/apps/ListDeviceAppsRequest.js";
import { DeviceParkConfigError } from "../../sdk/errors/index.js";

/**
 * Devices API service.
 *
 * Base path: `/management/api/v1/public/devices`
 */
export class DevicesApi {
  private readonly deviceParkHttpClient: DeviceParkHttpClient;

  public constructor(deviceParkHttpClient: DeviceParkHttpClient) {
    this.deviceParkHttpClient = deviceParkHttpClient;
  }

  /**
   * Lists visible devices with pagination and sorting options.
   *
   * When no request is provided, default pagination values are used.
   */
  public async list(request?: ListDevicesRequest): Promise<PageDto<Device>> {
    const nextRequest = request ?? new ListDevicesRequestBuilder().build();
    const response = await this.deviceParkHttpClient.get(
      "/management/api/v1/public/devices",
      createPaginationQuery(nextRequest)
    );

    return JsonMapper.fromJson<PageDto<Device>>(response);
  }

  /**
   * Fetches a single device by its serial number.
   */
  public async get(serial: string): Promise<Device> {
    const response = await this.deviceParkHttpClient.get(
      `/management/api/v1/public/devices/${encodeURIComponent(serial)}`
    );
    return JsonMapper.fromJson<Device>(response);
  }

  /** Lists applications installed on a device visible to the authenticated client. */
  public async apps(
    serial: string,
    request?: ListDeviceAppsRequest
  ): Promise<PageDto<DeviceApp>> {
    if (!serial?.trim()) {
      throw new DeviceParkConfigError("serial cannot be empty");
    }

    const nextRequest = request ?? new ListDeviceAppsRequestBuilder().build();
    const response = await this.deviceParkHttpClient.get(
      `/management/api/v1/public/devices/${encodeURIComponent(serial)}/apps`,
      createPaginationQuery(nextRequest)
    );
    return JsonMapper.fromJson<PageDto<DeviceApp>>(response);
  }
}
