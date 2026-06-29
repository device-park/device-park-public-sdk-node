import { AllocationApi } from "./allocation/AllocationApi.js";
import { ApplicationApi } from "./applications/ApplicationApi.js";
import { DeviceParkHttpClient } from "./client/DeviceParkHttpClient.js";
import { DevicesApi } from "./management/devices/DevicesApi.js";
import { PoolsApi } from "./management/pools/PoolsApi.js";
import { SessionApi } from "./sessions/SessionApi.js";
import { DeviceParkApiClientBuilder } from "./DeviceParkApiClientBuilder.js";

/**
 * Main entry point for the Device Park public SDK.
 *
 * The class groups all public API services behind a single client instance
 * and keeps service creation lazy.
 */
export class DeviceParkApiClient {
  private readonly httpClient: DeviceParkHttpClient;
  private devicesApi?: DevicesApi;
  private poolsApi?: PoolsApi;
  private allocationsApi?: AllocationApi;
  private sessionsApi?: SessionApi;
  private applicationsApi?: ApplicationApi;

  public constructor(httpClient: DeviceParkHttpClient) {
    this.httpClient = httpClient;
  }

  public static builder(): DeviceParkApiClientBuilder {
    return new DeviceParkApiClientBuilder();
  }

  public devices(): DevicesApi {
    if (!this.devicesApi) {
      this.devicesApi = new DevicesApi(this.httpClient);
    }

    return this.devicesApi;
  }

  public pools(): PoolsApi {
    if (!this.poolsApi) {
      this.poolsApi = new PoolsApi(this.httpClient);
    }

    return this.poolsApi;
  }

  public allocations(): AllocationApi {
    if (!this.allocationsApi) {
      this.allocationsApi = new AllocationApi(this.httpClient);
    }

    return this.allocationsApi;
  }

  public sessions(): SessionApi {
    if (!this.sessionsApi) {
      this.sessionsApi = new SessionApi(this.httpClient);
    }

    return this.sessionsApi;
  }

  public applications(): ApplicationApi {
    if (!this.applicationsApi) {
      this.applicationsApi = new ApplicationApi(this.httpClient);
    }

    return this.applicationsApi;
  }

  public async close(): Promise<void> {
    await this.httpClient.close();
  }
}

export { DeviceParkApiClient as DeviceParkManagementClient };
