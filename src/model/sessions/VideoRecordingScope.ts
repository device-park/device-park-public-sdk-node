/**
 * Controls whether Device Park manages screen recording for the whole Device Park session,
 * or leaves start and stop to Appium plugins for the Appium session only.
 *
 * When omitted on session start, the API defaults to `FULL_SESSION`.
 */
export const VideoRecordingScope = {
  /** Device Park starts and stops screen recording for the entire Device Park session. */
  FULL_SESSION: "FULL_SESSION",
  /** Appium plugins start and stop screen recording; Device Park does not manage its lifecycle. */
  APPIUM_SESSION: "APPIUM_SESSION"
} as const;

export type VideoRecordingScopeType =
  (typeof VideoRecordingScope)[keyof typeof VideoRecordingScope];
