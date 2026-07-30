import { DeviceParkConfigError } from "../errors/index.js";

export interface CredentialsInput {
  clientId: string;
  clientSecret: string;
}

export class Credentials {
  public readonly clientId: string;
  public readonly clientSecret: string;

  private constructor(input: CredentialsInput) {
    this.clientId = input.clientId;
    this.clientSecret = input.clientSecret;
  }

  public static create(clientId: string, clientSecret: string): Credentials {
    if (!clientId.trim()) {
      throw new DeviceParkConfigError("clientId cannot be empty");
    }

    if (!clientSecret.trim()) {
      throw new DeviceParkConfigError("clientSecret cannot be empty");
    }

    return new Credentials({ clientId, clientSecret });
  }

  public static fromEnvironment(environment: NodeJS.ProcessEnv = process.env): Credentials {
    const clientId = environment.DEVICEPARK_CLIENT_ID ?? "";
    const clientSecret = environment.DEVICEPARK_CLIENT_SECRET ?? "";
    return Credentials.create(clientId, clientSecret);
  }
}
