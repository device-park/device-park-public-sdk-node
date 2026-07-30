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
 *
 * Typical usage starts with {@link DeviceParkApiClient.builder()}, then
 * continues with one of the typed service accessors such as
 * {@link devices()}, {@link allocations()} or {@link sessions()}.
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

  /**
   * Creates a fluent builder for configuring the SDK client.
   */
  public static builder(): DeviceParkApiClientBuilder {
    return new DeviceParkApiClientBuilder();
  }

  /**
   * Returns the public devices API service.
   */
  public devices(): DevicesApi {
    if (!this.devicesApi) {
      this.devicesApi = new DevicesApi(this.httpClient);
    }

    return this.devicesApi;
  }

  /**
   * Returns the public pools API service.
   */
  public pools(): PoolsApi {
    if (!this.poolsApi) {
      this.poolsApi = new PoolsApi(this.httpClient);
    }

    return this.poolsApi;
  }

  /**
   * Returns the public allocations API service.
   */
  public allocations(): AllocationApi {
    if (!this.allocationsApi) {
      this.allocationsApi = new AllocationApi(this.httpClient);
    }

    return this.allocationsApi;
  }

  /**
   * Returns the public sessions API service.
   */
  public sessions(): SessionApi {
    if (!this.sessionsApi) {
      this.sessionsApi = new SessionApi(this.httpClient);
    }

    return this.sessionsApi;
  }

  /**
   * Returns the public applications API service.
   */
  public applications(): ApplicationApi {
    if (!this.applicationsApi) {
      this.applicationsApi = new ApplicationApi(this.httpClient);
    }

    return this.applicationsApi;
  }

  /**
   * Closes underlying SDK resources.
   *
   * The current Node.js implementation does not keep a custom resource pool,
   * but the method is preserved for client lifecycle symmetry.
   */
  public async close(): Promise<void> {
    await this.httpClient.close();
  }
}

export { DeviceParkApiClient as DeviceParkManagementClient };
