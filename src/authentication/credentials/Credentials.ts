import { DeviceParkConfigError } from "../../sdk/errors/index.js";

/**
 * Immutable credentials holder used by the OAuth2 client credentials flow.
 */
export class Credentials {
  public readonly clientId: string;
  public readonly clientSecret: string;

  private constructor(clientId: string, clientSecret: string) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
  }

  public static create(clientId: string, clientSecret: string): Credentials {
    if (!clientId.trim()) {
      throw new DeviceParkConfigError("clientId cannot be empty");
    }

    if (!clientSecret.trim()) {
      throw new DeviceParkConfigError("clientSecret cannot be empty");
    }

    return new Credentials(clientId, clientSecret);
  }

  public static fromEnvironment(environment: NodeJS.ProcessEnv = process.env): Credentials {
    return Credentials.create(
      environment.DEVICEPARK_CLIENT_ID ?? "",
      environment.DEVICEPARK_CLIENT_SECRET ?? ""
    );
  }
}
