import { DeviceParkHttpClient } from "../client/DeviceParkHttpClient.js";
import { JsonMapper } from "../core/json/JsonMapper.js";
import type { PageDto } from "../model/common/PageDto.js";
import type { Allocation } from "../model/allocation/Allocation.js";
import {
  AllocationSearchRequestBuilder,
  type AllocationSearchRequest
} from "../model/allocation/AllocationSearchRequest.js";
import type { DeviceAllocationRequest } from "../model/allocation/DeviceAllocationRequest.js";
import { DeviceParkConfigError } from "../sdk/errors/index.js";
import { createPaginationQuery } from "../sdk/core/requestMapping.js";

const ALLOCATION_PATH = "/allocation/api/v2/public/allocations";

/**
 * Allocation API service.
 *
 * Base path: `/allocation/api/v2/public/allocations`
 */
export class AllocationApi {
  private readonly deviceParkHttpClient: DeviceParkHttpClient;

  public constructor(deviceParkHttpClient: DeviceParkHttpClient) {
    this.deviceParkHttpClient = deviceParkHttpClient;
  }

  /**
   * Lists allocations with pagination and sorting options.
   */
  public async list(request?: AllocationSearchRequest): Promise<PageDto<Allocation>> {
    const nextRequest = request ?? new AllocationSearchRequestBuilder().build();
    const response = await this.deviceParkHttpClient.get(
      ALLOCATION_PATH,
      createPaginationQuery(nextRequest)
    );

    return JsonMapper.fromJson<PageDto<Allocation>>(response);
  }

  /**
   * Creates a new allocation request for a device or device pool.
   */
  public async create(request: DeviceAllocationRequest): Promise<Allocation> {
    if (!request) {
      throw new DeviceParkConfigError("request is required");
    }

    const response = await this.deviceParkHttpClient.post(ALLOCATION_PATH, request);
    return JsonMapper.fromJson<Allocation>(response);
  }

  /**
   * Deletes an existing allocation by id.
   */
  public async delete(allocationId: string): Promise<void> {
    if (!allocationId.trim()) {
      throw new DeviceParkConfigError("allocationId cannot be empty");
    }

    await this.deviceParkHttpClient.delete(`${ALLOCATION_PATH}/${encodeURIComponent(allocationId)}`);
  }
}
