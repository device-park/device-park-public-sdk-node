import { AllocationsApi } from "./api/AllocationsApi.js";
import { ApplicationsApi } from "./api/ApplicationsApi.js";
import { DevicesApi } from "./api/DevicesApi.js";
import { PoolsApi } from "./api/PoolsApi.js";
import { SessionsApi } from "./api/SessionsApi.js";
import type { DeviceParkHttpClient } from "./http/DeviceParkHttpClient.js";
import { DeviceParkClientBuilder } from "./DeviceParkClientBuilder.js";

export class DeviceParkClient {
  private readonly httpClient: DeviceParkHttpClient;
  private devicesApi?: DevicesApi;
  private poolsApi?: PoolsApi;
  private allocationsApi?: AllocationsApi;
  private sessionsApi?: SessionsApi;
  private applicationsApi?: ApplicationsApi;

  public constructor(httpClient: DeviceParkHttpClient) {
    this.httpClient = httpClient;
  }

  /**
   * Creates a fluent builder for the SDK client.
   */
  public static builder(): DeviceParkClientBuilder {
    return new DeviceParkClientBuilder();
  }

  /**
   * Returns the devices API service.
   */
  public devices(): DevicesApi {
    if (!this.devicesApi) {
      this.devicesApi = new DevicesApi(this.httpClient);
    }

    return this.devicesApi;
  }

  /**
   * Returns the pools API service.
   */
  public pools(): PoolsApi {
    if (!this.poolsApi) {
      this.poolsApi = new PoolsApi(this.httpClient);
    }

    return this.poolsApi;
  }

  /**
   * Returns the allocations API service.
   */
  public allocations(): AllocationsApi {
    if (!this.allocationsApi) {
      this.allocationsApi = new AllocationsApi(this.httpClient);
    }

    return this.allocationsApi;
  }

  /**
   * Returns the sessions API service.
   */
  public sessions(): SessionsApi {
    if (!this.sessionsApi) {
      this.sessionsApi = new SessionsApi(this.httpClient);
    }

    return this.sessionsApi;
  }

  /**
   * Returns the applications API service.
   */
  public applications(): ApplicationsApi {
    if (!this.applicationsApi) {
      this.applicationsApi = new ApplicationsApi(this.httpClient);
    }

    return this.applicationsApi;
  }

  /**
   * Closes SDK resources.
   *
   * The current Node.js implementation does not keep a long-lived socket pool,
   * but the method is preserved for API parity.
   */
  public async close(): Promise<void> {
    await this.httpClient.close();
  }
}
