import { Buffer } from "node:buffer";
import { Readable } from "node:stream";
import { AccessToken, type AccessTokenResponse } from "../auth/AccessToken.js";
import type { Credentials } from "../auth/Credentials.js";
import { parseJson, serializeJson } from "../core/json.js";
import { buildUri, buildUrl, type QueryValue } from "../core/query.js";
import { DeviceParkConfigError, DeviceParkHttpError } from "../errors/index.js";

export interface HttpClientOptions {
  baseUrl: string;
  credentials: Credentials;
  timeoutMs: number;
  defaultHeaders: Record<string, string>;
  fetchImplementation?: typeof fetch;
}

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

  public async get(path: string, query?: Record<string, QueryValue>, headers?: Record<string, string>): Promise<string> {
    const options: RequestOptions = {};
    if (query) {
      options.query = query;
    }
    if (headers) {
      options.headers = headers;
    }
    return this.request("GET", path, options);
  }

  public async getBytes(
    path: string,
    query?: Record<string, QueryValue>,
    headers?: Record<string, string>
  ): Promise<Buffer> {
    const options: RequestOptions = {};
    if (query) {
      options.query = query;
    }
    if (headers) {
      options.headers = headers;
    }
    const response = await this.execute("GET", path, options);
    return Buffer.from(await response.arrayBuffer());
  }

  public async post(
    path: string,
    body?: unknown,
    query?: Record<string, QueryValue>,
    headers?: Record<string, string>
  ): Promise<string> {
    const requestHeaders = {
      "content-type": "application/json",
      ...headers
    };
    const options: RequestOptions = {
      headers: requestHeaders
    };
    if (body !== undefined) {
      options.body = serializeJson(body);
    }
    if (query) {
      options.query = query;
    }
    return this.request("POST", path, options);
  }

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

  public async postStream(
    path: string,
    body: NodeJS.ReadableStream | ReadableStream,
    headers?: Record<string, string>
  ): Promise<string> {
    const requestHeaders = {
      "content-type": "application/octet-stream",
      ...headers
    };

    return this.request("POST", path, {
      body: this.toBodyInit(body),
      headers: requestHeaders
    });
  }

  public async close(): Promise<void> {
    return Promise.resolve();
  }

  private async request(
    method: string,
    path: string,
    options: RequestOptions = {}
  ): Promise<string> {
    const response = await this.execute(method, path, options);
    return response.text();
  }

  private async execute(
    method: string,
    path: string,
    options: RequestOptions = {}
  ): Promise<Response> {
    const accessToken = await this.getValidAccessToken();
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const response = await this.fetchImplementation(this.createUrl(path, options.query), {
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

  private createUrl(path: string, query?: Record<string, QueryValue>): string {
    if (!query) {
      return buildUrl(this.baseUrl, path);
    }

    return buildUri(this.baseUrl, path, query);
  }

  private toBodyInit(body: NodeJS.ReadableStream | ReadableStream): BodyInit {
    if (body instanceof ReadableStream) {
      return body;
    }

    return Readable.toWeb(body as Readable) as ReadableStream;
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
    const credentials = Buffer.from(
      `${this.credentials.clientId}:${this.credentials.clientSecret}`,
      "utf8"
    ).toString("base64");

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const response = await this.fetchImplementation(buildUrl(this.baseUrl, "/uaa/oauth2/token"), {
        method: "POST",
        headers: {
          authorization: `Basic ${credentials}`,
          "content-type": "application/x-www-form-urlencoded"
        },
        body: "grant_type=client_credentials&scope=openid",
        signal: controller.signal
      });

      if (!response.ok) {
        throw new DeviceParkHttpError(response.status, await response.text());
      }

      const body = parseJson<AccessTokenResponse>(await response.text());
      return AccessToken.fromResponse(body);
    } finally {
      clearTimeout(timeout);
    }
  }
}

interface RequestOptions {
  body?: BodyInit;
  headers?: Record<string, string>;
  query?: Record<string, QueryValue>;
}
