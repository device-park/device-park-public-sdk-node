export interface AccessTokenResponse {
  access_token: string;
  token_type?: string;
  expires_in: number;
}

/**
 * OAuth2 access token model returned by the token endpoint.
 */
export class AccessToken {
  public readonly value: string;
  public readonly type: string;
  public readonly expiresInSeconds: number;
  public readonly issuedAt: Date;

  private constructor(
    value: string,
    type: string,
    expiresInSeconds: number,
    issuedAt: Date
  ) {
    this.value = value;
    this.type = type;
    this.expiresInSeconds = expiresInSeconds;
    this.issuedAt = issuedAt;
  }

  public static fromResponse(response: AccessTokenResponse): AccessToken {
    return new AccessToken(
      response.access_token,
      response.token_type ?? "Bearer",
      response.expires_in,
      new Date()
    );
  }

  public isValid(safetyMarginSeconds: number, now: Date): boolean {
    const expiresAt = this.issuedAt.getTime() + this.expiresInSeconds * 1000;
    return now.getTime() < expiresAt - safetyMarginSeconds * 1000;
  }

  public toAuthorizationHeader(): string {
    return `${this.type} ${this.value}`;
  }
}
