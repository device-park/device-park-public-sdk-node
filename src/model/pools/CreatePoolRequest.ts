import { DeviceParkConfigError } from "../../sdk/errors/index.js";

export interface CreatePoolRequest {
  name: string;
}

export class CreatePoolRequestBuilder {
  private readonly request: Partial<CreatePoolRequest> = {};

  public name(name: string): this {
    this.request.name = name;
    return this;
  }

  public build(): CreatePoolRequest {
    if (!this.request.name?.trim()) {
      throw new DeviceParkConfigError("name cannot be empty");
    }

    return { name: this.request.name };
  }
}
