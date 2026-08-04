import { DeviceParkHttpClient } from "../../client/DeviceParkHttpClient.js";
import { JsonMapper } from "../../core/json/JsonMapper.js";
import type { PageDto } from "../../model/common/PageDto.js";
import { ListPoolsRequestBuilder, type ListPoolsRequest } from "../../model/pools/ListPoolsRequest.js";
import type { Pool } from "../../model/pools/Pool.js";
import { PoolFilter } from "../../model/pools/PoolFilter.js";
import { SearchOperation } from "../../model/common/SearchOperation.js";
import { createPaginationQuery } from "../../sdk/core/requestMapping.js";
import type { CreatePoolRequest } from "../../model/pools/CreatePoolRequest.js";
import { DeviceParkConfigError } from "../../sdk/errors/index.js";

const POOLS_PATH = "/management/api/v1/public/pools";

/**
 * Pools API service.
 *
 * Base path: `/management/api/v1/public/pools`
 */
export class PoolsApi {
  private readonly deviceParkHttpClient: DeviceParkHttpClient;

  public constructor(deviceParkHttpClient: DeviceParkHttpClient) {
    this.deviceParkHttpClient = deviceParkHttpClient;
  }

  /**
   * Lists device pools with pagination and sorting options.
   */
  public async list(request?: ListPoolsRequest): Promise<PageDto<Pool>> {
    const nextRequest = request ?? new ListPoolsRequestBuilder().build();
    const response = await this.deviceParkHttpClient.get(
      POOLS_PATH,
      createPaginationQuery(nextRequest)
    );

    return JsonMapper.fromJson<PageDto<Pool>>(response);
  }

  /**
   * Lists only default device pools with pagination and sorting options.
   */
  public async listByDefaultPool(request?: ListPoolsRequest): Promise<PageDto<Pool>> {
    const nextRequest = request ?? new ListPoolsRequestBuilder().build();
    const response = await this.deviceParkHttpClient.get(
      POOLS_PATH,
      createPaginationQuery({
        filters: [
          {
            key: PoolFilter.IS_DEFAULT,
            value: true,
            operation: SearchOperation.EQUAL
          }
        ],
        sorting: nextRequest.sorting
      })
    );

    return JsonMapper.fromJson<PageDto<Pool>>(response);
  }

  public async create(request: CreatePoolRequest): Promise<Pool> {
    if (!request?.name?.trim()) {
      throw new DeviceParkConfigError("name cannot be empty");
    }

    const response = await this.deviceParkHttpClient.post(POOLS_PATH, request);
    return JsonMapper.fromJson<Pool>(response);
  }

  public async delete(poolId: string): Promise<void> {
    this.assertPoolId(poolId);
    await this.deviceParkHttpClient.delete(`${POOLS_PATH}/${encodeURIComponent(poolId)}`);
  }

  public async addDevices(poolId: string, serials: string[]): Promise<string[]> {
    this.assertPoolIdAndSerials(poolId, serials);
    const response = await this.deviceParkHttpClient.post(
      `${POOLS_PATH}/${encodeURIComponent(poolId)}/devices`,
      undefined,
      { serials }
    );
    return JsonMapper.fromJson<string[]>(response);
  }

  public async removeDevices(poolId: string, serials: string[]): Promise<string[]> {
    this.assertPoolIdAndSerials(poolId, serials);
    const response = await this.deviceParkHttpClient.delete(
      `${POOLS_PATH}/${encodeURIComponent(poolId)}/devices`,
      { serials }
    );
    return JsonMapper.fromJson<string[]>(response);
  }

  private assertPoolId(poolId: string): void {
    if (!poolId?.trim()) {
      throw new DeviceParkConfigError("poolId cannot be empty");
    }
  }

  private assertPoolIdAndSerials(poolId: string, serials: string[]): void {
    this.assertPoolId(poolId);
    if (!serials?.length) {
      throw new DeviceParkConfigError("serials cannot be empty");
    }
  }
}
