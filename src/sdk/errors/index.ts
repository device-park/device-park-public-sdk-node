export class DeviceParkError extends Error {
  public constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = new.target.name;
  }
}

export class DeviceParkConfigError extends DeviceParkError {}

export class DeviceParkSerializationError extends DeviceParkError {}

export class DeviceParkHttpError extends DeviceParkError {
  public readonly status: number;
  public readonly body: string;

  public constructor(status: number, body: string, options?: ErrorOptions) {
    super(`HTTP request failed with status ${status}`, options);
    this.status = status;
    this.body = body;
  }
}
