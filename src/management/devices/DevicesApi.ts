import { DeviceParkHttpClient } from "../../client/DeviceParkHttpClient.js";
import { PoolsApi } from "../pools/PoolsApi.js";
import { DeviceFilter } from "../../model/devices/DeviceFilter.js";
import { SearchOperation } from "../../model/common/SearchOperation.js";
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

const DEVICES_PATH = "/management/api/v2/public/devices";
const DEVICE_PATH = "/management/api/v1/public/devices";

/**
 * Devices API service.
 *
 * Base paths:
 * - `/management/api/v2/public/devices` (list)
 * - `/management/api/v1/public/devices/{serial}` (get, apps)
 */
export class DevicesApi {
  private readonly deviceParkHttpClient: DeviceParkHttpClient;

  private readonly poolsApi: PoolsApi;

  public constructor(deviceParkHttpClient: DeviceParkHttpClient, poolsApi: PoolsApi) {
    this.deviceParkHttpClient = deviceParkHttpClient;
    this.poolsApi = poolsApi;
  }

  /**
   * Lists visible devices with pagination and sorting options.
   *
   * When no request is provided, default pagination values are used.
   */
  public async list(request?: ListDevicesRequest): Promise<PageDto<Device>> {
    const nextRequest = request ?? new ListDevicesRequestBuilder().build();
    const response = await this.deviceParkHttpClient.get(
      DEVICES_PATH,
      createPaginationQuery(nextRequest)
    );

    return JsonMapper.fromJson<PageDto<Device>>(response);
  }

  /**
   * Lists the devices of the default pool.
   *
   * The default pool is resolved first and applied as a `POOL_ID` filter. Any `POOL_ID` filter
   * already present in the request is replaced. Fails when no default pool exists.
   */
  public async listByDefaultPool(request?: ListDevicesRequest): Promise<PageDto<Device>> {
    const nextRequest = request ?? new ListDevicesRequestBuilder().build();
    const pools = await this.poolsApi.listByDefaultPool();
    const defaultPool = pools.data[0];
    if (!defaultPool) {
      throw new DeviceParkConfigError("Default pool not found");
    }

    return this.list({
      sorting: { ...nextRequest.sorting },
      filters: [
        { key: DeviceFilter.POOL_ID, value: defaultPool.id, operation: SearchOperation.EQUAL },
        ...nextRequest.filters.filter((filter) => filter.key !== DeviceFilter.POOL_ID)
      ]
    });
  }

  /**
   * Fetches a single device by its serial number.
   */
  public async get(serial: string): Promise<Device> {
    if (!serial?.trim()) {
      throw new DeviceParkConfigError("serial cannot be empty");
    }

    const response = await this.deviceParkHttpClient.get(
      `${DEVICE_PATH}/${encodeURIComponent(serial)}`
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
      `${DEVICE_PATH}/${encodeURIComponent(serial)}/apps`,
      createPaginationQuery(nextRequest)
    );
    return JsonMapper.fromJson<PageDto<DeviceApp>>(response);
  }
}
