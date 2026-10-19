import { DeviceParkConfigError } from "../sdk/errors/index.js";

/**
 * Joins a token-less screen-stream URL with the caller's current access token.
 */
export const StreamUrls = {
  /**
   * Appends the access token as the `token` query parameter.
   *
   * The returned URL carries a credential and must not be logged.
   */
  withAccessToken(streamUrl: string, accessToken: string): string {
    if (!streamUrl?.trim()) {
      throw new DeviceParkConfigError("stream url cannot be empty");
    }

    if (!accessToken?.trim()) {
      throw new DeviceParkConfigError("access token cannot be empty");
    }

    const separator = streamUrl.includes("?") ? "&" : "?";
    return `${streamUrl}${separator}token=${encodeURIComponent(accessToken)}`;
  }
} as const;
