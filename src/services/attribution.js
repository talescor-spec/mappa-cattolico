import { registerPlugin } from "@capacitor/core";
import { createAttributionClient } from "./attributionClient.js";

const bridge = registerPlugin("FideoraAttribution");
export const createNativeAttribution = (sdk, native) =>
  createAttributionClient({ sdk, bridge, native });
