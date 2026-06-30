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
 *
 * This is the recommended way to create the SDK client. It keeps required
 * configuration explicit and validates mandatory values during {@link build()}.
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

  /**
   * Alias for {@link url}.
   */
  public endpoint(url: string): this {
    return this.url(url);
  }

  /**
   * Sets OAuth2 client credentials.
   */
  public credentials(credentials: Credentials): this {
    this.options.credentials = credentials;
    return this;
  }

  /**
   * Creates and sets credentials from raw values.
   */
  public credentialsFrom(clientId: string, clientSecret: string): this {
    this.options.credentials = Credentials.create(clientId, clientSecret);
    return this;
  }

  /**
   * Sets the request timeout in seconds.
   */
  public timeout(timeoutSeconds: number): this {
    this.options.timeoutMs = timeoutSeconds * 1000;
    return this;
  }

  /**
   * Sets the request timeout in milliseconds.
   */
  public timeoutMs(timeoutMs: number): this {
    this.options.timeoutMs = timeoutMs;
    return this;
  }

  /**
   * Adds a default header that will be sent with every API request.
   */
  public addHeader(name: string, value: string): this {
    this.options.headers = {
      ...this.options.headers,
      [name]: value
    };

    return this;
  }

  /**
   * Overrides the fetch implementation used by the SDK.
   */
  public fetchImplementation(fetchImplementation: typeof fetch): this {
    this.options.fetchImplementation = fetchImplementation;
    return this;
  }

  /**
   * Validates configuration and creates a ready-to-use SDK client.
   */
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
