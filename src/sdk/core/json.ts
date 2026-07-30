import { DeviceParkSerializationError } from "../errors/index.js";

export function serializeJson(value: unknown): string {
  try {
    return JSON.stringify(value);
  } catch (error) {
    throw new DeviceParkSerializationError("Failed to serialize JSON", { cause: error });
  }
}

export function parseJson<T>(value: string): T {
  try {
    return JSON.parse(value) as T;
  } catch (error) {
    throw new DeviceParkSerializationError("Failed to parse JSON response", { cause: error });
  }
}
