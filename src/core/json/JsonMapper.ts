import { DeviceParkSerializationError } from "../../sdk/errors/index.js";

/**
 * Shared JSON helpers for SDK serialization and deserialization.
 */
export class JsonMapper {
  public static fromJson<T>(value: string): T {
    try {
      return JSON.parse(value) as T;
    } catch (error) {
      throw new DeviceParkSerializationError("Failed to parse JSON response", { cause: error });
    }
  }

  public static toJson(value: unknown): string {
    try {
      return JSON.stringify(value);
    } catch (error) {
      throw new DeviceParkSerializationError("Failed to serialize JSON", { cause: error });
    }
  }
}
