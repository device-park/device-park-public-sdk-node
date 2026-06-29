import { Credentials } from "./authentication/credentials/Credentials.js";
import { DeviceParkHttpClient } from "./client/DeviceParkHttpClient.js";
import { DeviceParkConfigError } from "./sdk/errors/index.js";
import { DeviceParkApiClient } from "./DeviceParkApiClient.js";

export interface DeviceParkApiClientOptions {
  url?: string;
  credentials?: Credentials;
  timeoutMs?: number;
  headers?: Record<string, string>;
  fetchImplementation?: typeof fetch;
}

/**
 * Fluent builder for {@link DeviceParkApiClient}.
 */
export class DeviceParkApiClientBuilder {
  private options: DeviceParkApiClientOptions = {
    timeoutMs: 60_000,
    headers: {}
  };

  public url(url: string): this {
    this.options.url = url;
    return this;
  }

  public endpoint(url: string): this {
    return this.url(url);
  }

  public credentials(credentials: Credentials): this {
    this.options.credentials = credentials;
    return this;
  }

  public credentialsFrom(clientId: string, clientSecret: string): this {
    this.options.credentials = Credentials.create(clientId, clientSecret);
    return this;
  }

  public timeout(timeoutSeconds: number): this {
    this.options.timeoutMs = timeoutSeconds * 1000;
    return this;
  }

  public timeoutMs(timeoutMs: number): this {
    this.options.timeoutMs = timeoutMs;
    return this;
  }

  public addHeader(name: string, value: string): this {
    this.options.headers = {
      ...this.options.headers,
      [name]: value
    };

    return this;
  }

  public fetchImplementation(fetchImplementation: typeof fetch): this {
    this.options.fetchImplementation = fetchImplementation;
    return this;
  }

  public build(): DeviceParkApiClient {
    const url = this.options.url?.trim();
    const credentials = this.options.credentials;

    if (!url) {
      throw new DeviceParkConfigError("url cannot be empty");
    }

    if (!credentials) {
      throw new DeviceParkConfigError("credentials are required");
    }

    const httpClientOptions = {
      baseUrl: url,
      credentials,
      timeoutMs: this.options.timeoutMs ?? 60_000,
      defaultHeaders: this.options.headers ?? {}
    };

    const httpClient = new DeviceParkHttpClient(
      this.options.fetchImplementation
        ? {
            ...httpClientOptions,
            fetchImplementation: this.options.fetchImplementation
          }
        : httpClientOptions
    );

    return new DeviceParkApiClient(httpClient);
  }
}
