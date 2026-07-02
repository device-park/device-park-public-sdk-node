import type { DeviceParkHttpClient } from "../http/DeviceParkHttpClient.js";

export abstract class BaseApi {
  protected readonly httpClient: DeviceParkHttpClient;

  public constructor(httpClient: DeviceParkHttpClient) {
    this.httpClient = httpClient;
  }
}
