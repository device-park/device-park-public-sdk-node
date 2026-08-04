import { createPaginationQuery } from "../core/requestMapping.js";
import { parseJson } from "../core/json.js";
import type { PageDto } from "../models/common/pagination.js";
import type { Pool } from "../models/resources.js";
import type { CreatePoolRequest, ListPoolsRequest } from "../models/requests.js";
import { ListPoolsRequestBuilder } from "../models/builders.js";
import { PoolFilter } from "../models/filters.js";
import { SearchOperation } from "../models/common/enums.js";
import { BaseApi } from "./BaseApi.js";
import { DeviceParkConfigError } from "../errors/index.js";

const POOLS_PATH = "/management/api/v1/public/pools";

export class PoolsApi extends BaseApi {
  public async list(request?: ListPoolsRequest): Promise<PageDto<Pool>> {
    const nextRequest = request ?? new ListPoolsRequestBuilder().build();
    const response = await this.httpClient.get(
      POOLS_PATH,
      createPaginationQuery(nextRequest)
    );

    return parseJson<PageDto<Pool>>(response);
  }

  public async listByDefaultPool(request?: ListPoolsRequest): Promise<PageDto<Pool>> {
    const nextRequest = request ?? new ListPoolsRequestBuilder().build();
    const response = await this.httpClient.get(
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

    return parseJson<PageDto<Pool>>(response);
  }

  public async create(request: CreatePoolRequest): Promise<Pool> {
    if (!request?.name?.trim()) {
      throw new DeviceParkConfigError("name cannot be empty");
    }

    const response = await this.httpClient.post(POOLS_PATH, request);
    return parseJson<Pool>(response);
  }

  public async delete(poolId: string): Promise<void> {
    this.assertPoolId(poolId);
    await this.httpClient.delete(`${POOLS_PATH}/${encodeURIComponent(poolId)}`);
  }

  public async addDevices(poolId: string, serials: string[]): Promise<string[]> {
    this.assertPoolIdAndSerials(poolId, serials);
    const response = await this.httpClient.post(
      `${POOLS_PATH}/${encodeURIComponent(poolId)}/devices`,
      undefined,
      { serials }
    );
    return parseJson<string[]>(response);
  }

  public async removeDevices(poolId: string, serials: string[]): Promise<string[]> {
    this.assertPoolIdAndSerials(poolId, serials);
    const response = await this.httpClient.delete(
      `${POOLS_PATH}/${encodeURIComponent(poolId)}/devices`,
      { serials }
    );
    return parseJson<string[]>(response);
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
