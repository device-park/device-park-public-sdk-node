import { createPaginationQuery } from "../core/requestMapping.js";
import { parseJson } from "../core/json.js";
import { DeviceParkConfigError } from "../errors/index.js";
import type { PageDto } from "../models/common/pagination.js";
import type { Allocation } from "../models/resources.js";
import type { AllocationSearchRequest, DeviceAllocationRequest } from "../models/requests.js";
import { AllocationSearchRequestBuilder } from "../models/builders.js";
import { BaseApi } from "./BaseApi.js";

const ALLOCATION_PATH = "/allocation/api/v2/public/allocations";

export class AllocationsApi extends BaseApi {
  public async list(request?: AllocationSearchRequest): Promise<PageDto<Allocation>> {
    const nextRequest = request ?? new AllocationSearchRequestBuilder().build();
    const response = await this.httpClient.get(ALLOCATION_PATH, createPaginationQuery(nextRequest));
    return parseJson<PageDto<Allocation>>(response);
  }

  public async create(request: DeviceAllocationRequest): Promise<Allocation> {
    if (!request) {
      throw new DeviceParkConfigError("request is required");
    }

    const response = await this.httpClient.post(ALLOCATION_PATH, request);
    return parseJson<Allocation>(response);
  }

  public async delete(allocationId: string): Promise<void> {
    if (!allocationId.trim()) {
      throw new DeviceParkConfigError("allocationId cannot be empty");
    }

    await this.httpClient.delete(`${ALLOCATION_PATH}/${encodeURIComponent(allocationId)}`);
  }
}
