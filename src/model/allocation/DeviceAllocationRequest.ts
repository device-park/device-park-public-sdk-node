import { DeviceParkConfigError } from "../../sdk/errors/index.js";
import {
  RemoveAppSelection,
  type RemoveAppSelectionType
} from "./RemoveAppSelection.js";

export interface DeviceAllocationRequest {
  serial?: string;
  manufacturer?: string;
  model?: string;
  platform?: string;
  platformVersion?: string;
  devicePoolId?: string;
  priority: number;
  removeApps: RemoveAppSelectionType;
}

/**
 * Builder for creating a new device allocation request.
 *
 * Priority defaults to `3` and must stay in the range `1..5`.
 */
export class DeviceAllocationRequestBuilder {
  private readonly request: DeviceAllocationRequest = {
    priority: 3,
    removeApps: RemoveAppSelection.NO_REMOVE
  };

  public serial(serial: string): this {
    this.request.serial = serial;
    return this;
  }

  public manufacturer(manufacturer: string): this {
    this.request.manufacturer = manufacturer;
    return this;
  }

  public model(model: string): this {
    this.request.model = model;
    return this;
  }

  public platform(platform: string): this {
    this.request.platform = platform;
    return this;
  }

  public platformVersion(platformVersion: string): this {
    this.request.platformVersion = platformVersion;
    return this;
  }

  public devicePoolId(devicePoolId: string): this {
    this.request.devicePoolId = devicePoolId;
    return this;
  }

  public priority(priority: number): this {
    if (priority < 1 || priority > 5) {
      throw new DeviceParkConfigError("priority must be between 1 and 5");
    }

    this.request.priority = priority;
    return this;
  }

  public removeApps(removeApps: RemoveAppSelectionType): this {
    this.request.removeApps = removeApps;
    return this;
  }

  public build(): DeviceAllocationRequest {
    return { ...this.request };
  }
}
