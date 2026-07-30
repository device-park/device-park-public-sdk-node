import { DeviceParkHttpClient } from "../../client/DeviceParkHttpClient.js";
import { JsonMapper } from "../../core/json/JsonMapper.js";
import type { PageDto } from "../../model/common/PageDto.js";
import { ListPoolsRequestBuilder, type ListPoolsRequest } from "../../model/pools/ListPoolsRequest.js";
import type { Pool } from "../../model/pools/Pool.js";
import { PoolFilter } from "../../model/pools/PoolFilter.js";
import { SearchOperation } from "../../model/common/SearchOperation.js";
import { createPaginationQuery } from "../../sdk/core/requestMapping.js";

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
      "/management/api/v1/public/pools",
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
      "/management/api/v1/public/pools",
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
}
