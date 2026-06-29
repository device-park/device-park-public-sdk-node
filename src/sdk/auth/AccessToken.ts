export interface AccessTokenResponse {
  access_token: string;
  token_type?: string;
  expires_in: number;
}

export class AccessToken {
  public readonly value: string;
  public readonly type: string;
  public readonly expiresInSeconds: number;
  public readonly issuedAt: Date;

  private constructor(input: {
    value: string;
    type: string;
    expiresInSeconds: number;
    issuedAt: Date;
  }) {
    this.value = input.value;
    this.type = input.type;
    this.expiresInSeconds = input.expiresInSeconds;
    this.issuedAt = input.issuedAt;
  }

  public static fromResponse(response: AccessTokenResponse): AccessToken {
    return new AccessToken({
      value: response.access_token,
      type: response.token_type ?? "Bearer",
      expiresInSeconds: response.expires_in,
      issuedAt: new Date()
    });
  }

  public isValid(safetyMarginSeconds: number, now: Date): boolean {
    const expiresAt = this.issuedAt.getTime() + this.expiresInSeconds * 1000;
    return now.getTime() < expiresAt - safetyMarginSeconds * 1000;
  }

  public toAuthorizationHeader(): string {
    return `${this.type} ${this.value}`;
  }
}
