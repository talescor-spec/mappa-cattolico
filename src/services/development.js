import { Capacitor } from "@capacitor/core";
import { engagement } from "./engagement";
import { resolveDevelopmentEnvironment } from "../utils/development.js";
export function getDevelopmentEnvironment() {
  const native = Capacitor.isNativePlatform();
  return resolveDevelopmentEnvironment({
    native,
    debugWeb: import.meta.env.DEV,
    checkNative: async () => {
      if (
        Capacitor.getPlatform() !== "ios" ||
        !Capacitor.isPluginAvailable("FideoraEngagement")
      )
        return null;
      return engagement.developmentEnvironment();
    },
  });
}
