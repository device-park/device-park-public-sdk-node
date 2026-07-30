import { createPaginationQuery } from "../core/requestMapping.js";
import { parseJson } from "../core/json.js";
import type { PageDto } from "../models/common/pagination.js";
import type { Pool } from "../models/resources.js";
import type { ListPoolsRequest } from "../models/requests.js";
import { ListPoolsRequestBuilder } from "../models/builders.js";
import { BaseApi } from "./BaseApi.js";

export class PoolsApi extends BaseApi {
  public async list(request?: ListPoolsRequest): Promise<PageDto<Pool>> {
    const nextRequest = request ?? new ListPoolsRequestBuilder().build();
    const response = await this.httpClient.get(
      "/management/api/v1/public/pools",
      createPaginationQuery(nextRequest)
    );

    return parseJson<PageDto<Pool>>(response);
  }
}
