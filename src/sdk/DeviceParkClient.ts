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

  public static builder(): DeviceParkClientBuilder {
    return new DeviceParkClientBuilder();
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

  public allocations(): AllocationsApi {
    if (!this.allocationsApi) {
      this.allocationsApi = new AllocationsApi(this.httpClient);
    }

    return this.allocationsApi;
  }

  public sessions(): SessionsApi {
    if (!this.sessionsApi) {
      this.sessionsApi = new SessionsApi(this.httpClient);
    }

    return this.sessionsApi;
  }

  public applications(): ApplicationsApi {
    if (!this.applicationsApi) {
      this.applicationsApi = new ApplicationsApi(this.httpClient);
    }

    return this.applicationsApi;
  }

  public async close(): Promise<void> {
    await this.httpClient.close();
  }
}
