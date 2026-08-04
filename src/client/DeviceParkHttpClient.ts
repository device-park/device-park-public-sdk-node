import { Buffer } from "node:buffer";
import { Readable } from "node:stream";
import { Credentials } from "../authentication/credentials/Credentials.js";
import { AccessToken, type AccessTokenResponse } from "../authentication/token/AccessToken.js";
import { JsonMapper } from "../core/json/JsonMapper.js";
import { DeviceParkConfigError, DeviceParkHttpError } from "../sdk/errors/index.js";
import type { QueryValue } from "../sdk/core/query.js";

export interface HttpClientOptions {
  baseUrl: string;
  credentials: Credentials;
  timeoutMs: number;
  defaultHeaders: Record<string, string>;
  fetchImplementation?: typeof fetch;
}

interface RequestOptions {
  body?: BodyInit;
  headers?: Record<string, string>;
  query?: Record<string, QueryValue>;
}

/**
 * Shared HTTP transport used by all API services.
 *
 * Responsibilities:
 * - fetch and cache OAuth2 access tokens
 * - attach authorization headers automatically
 * - execute JSON and binary requests
 * - normalize non-2xx responses into SDK errors
 */
export class DeviceParkHttpClient {
  private readonly baseUrl: string;
  private readonly credentials: Credentials;
  private readonly timeoutMs: number;
  private readonly defaultHeaders: Record<string, string>;
  private readonly fetchImplementation: typeof fetch;
  private accessToken: AccessToken | null = null;
  private accessTokenPromise: Promise<AccessToken> | null = null;

  public constructor(options: HttpClientOptions) {
    if (!options.baseUrl.trim()) {
      throw new DeviceParkConfigError("baseUrl cannot be empty");
    }

    this.baseUrl = options.baseUrl;
    this.credentials = options.credentials;
    this.timeoutMs = options.timeoutMs;
    this.defaultHeaders = { ...options.defaultHeaders };
    this.fetchImplementation = options.fetchImplementation ?? fetch;
  }

  /**
   * Executes a GET request and returns the raw response body as text.
   */
  public async get(
    path: string,
    query?: Record<string, QueryValue>,
    headers?: Record<string, string>
  ): Promise<string> {
    const options: RequestOptions = {};
    if (query) {
      options.query = query;
    }
    if (headers) {
      options.headers = headers;
    }
    return this.request("GET", path, options);
  }

  /**
   * Executes a JSON POST request and returns the raw response body as text.
   */
  public async post(
    path: string,
    body?: unknown,
    query?: Record<string, QueryValue>,
    headers?: Record<string, string>
  ): Promise<string> {
    const options: RequestOptions = {
      headers: {
        "content-type": "application/json",
        ...headers
      }
    };

    if (body !== undefined) {
      options.body = JsonMapper.toJson(body);
    }
    if (query) {
      options.query = query;
    }

    return this.request("POST", path, options);
  }

  /**
   * Executes a DELETE request and returns the raw response body as text.
   */
  public async delete(
    path: string,
    query?: Record<string, QueryValue>,
    headers?: Record<string, string>
  ): Promise<string> {
    const options: RequestOptions = {};
    if (query) {
      options.query = query;
    }
    if (headers) {
      options.headers = headers;
    }
    return this.request("DELETE", path, options);
  }

  /**
   * Executes an octet-stream POST request.
   */
  public async postStream(
    path: string,
    body: NodeJS.ReadableStream | ReadableStream,
    headers?: Record<string, string>
  ): Promise<string> {
    return this.request("POST", path, {
      body: this.toBodyInit(body),
      headers: {
        "content-type": "application/octet-stream",
        ...headers
      }
    });
  }

  /**
   * Executes a GET request and returns the raw response body as bytes.
   */
  public async getBytes(path: string): Promise<Buffer> {
    const response = await this.execute("GET", path, {});
    return Buffer.from(await response.arrayBuffer());
  }

  /**
   * Closes the transport lifecycle.
   */
  public async close(): Promise<void> {
    return Promise.resolve();
  }

  private async request(method: string, path: string, options: RequestOptions): Promise<string> {
    const response = await this.execute(method, path, options);
    return response.text();
  }

  private async execute(method: string, path: string, options: RequestOptions): Promise<Response> {
    const accessToken = await this.getValidAccessToken();
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const response = await this.fetchImplementation(this.buildUrl(path, options.query), {
        method,
        body: options.body,
        headers: {
          authorization: accessToken.toAuthorizationHeader(),
          ...this.defaultHeaders,
          ...options.headers
        },
        signal: controller.signal,
        duplex: options.body ? "half" : undefined
      } as RequestInit);

      if (response.ok) {
        return response;
      }

      throw new DeviceParkHttpError(response.status, await response.text());
    } finally {
      clearTimeout(timeout);
    }
  }

  private buildUrl(
    path: string,
    query?: Record<string, QueryValue>
  ): string {
    const url = new URL(path, this.baseUrl.endsWith("/") ? this.baseUrl : `${this.baseUrl}/`);

    if (query) {
      for (const [key, value] of Object.entries(query)) {
        if (value === undefined || value === null) {
          continue;
        }

        if (Array.isArray(value)) {
          for (const item of value) {
            if (item !== undefined && item !== null) {
              url.searchParams.append(key, String(item));
            }
          }
        } else {
          url.searchParams.set(key, String(value));
        }
      }
    }

    return url.toString();
  }

  private async getValidAccessToken(): Promise<AccessToken> {
    if (this.accessToken?.isValid(60, new Date())) {
      return this.accessToken;
    }

    if (!this.accessTokenPromise) {
      this.accessTokenPromise = this.fetchAccessToken().finally(() => {
        this.accessTokenPromise = null;
      });
    }

    this.accessToken = await this.accessTokenPromise;
    return this.accessToken;
  }

  private async fetchAccessToken(): Promise<AccessToken> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const basicAuth = Buffer.from(
        `${this.credentials.clientId}:${this.credentials.clientSecret}`,
        "utf8"
      ).toString("base64");

      const response = await this.fetchImplementation(this.buildUrl("/uaa/oauth2/token"), {
        method: "POST",
        headers: {
          authorization: `Basic ${basicAuth}`,
          "content-type": "application/x-www-form-urlencoded"
        },
        body: "grant_type=client_credentials&scope=openid",
        signal: controller.signal
      });

      if (!response.ok) {
        throw new DeviceParkHttpError(response.status, await response.text());
      }

      return AccessToken.fromResponse(JsonMapper.fromJson<AccessTokenResponse>(await response.text()));
    } finally {
      clearTimeout(timeout);
    }
  }

  private toBodyInit(body: NodeJS.ReadableStream | ReadableStream): BodyInit {
    if (body instanceof ReadableStream) {
      return body;
    }

    return Readable.toWeb(body as Readable) as ReadableStream;
  }
}
