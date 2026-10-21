import { Capacitor, registerPlugin } from "@capacitor/core";
// Native implementation is in ios/App/App/FideoraSecureStorage.swift.
// Authentication tokens never fall back to WebView localStorage on iOS.
const Keychain = registerPlugin("FideoraSecureStorage");
export const authStorage = {
  async getItem(key) {
    if (Capacitor.getPlatform() === "ios" && Capacitor.isNativePlatform())
      return (await Keychain.get({ key })).value ?? null;
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  async setItem(key, value) {
    if (Capacitor.getPlatform() === "ios" && Capacitor.isNativePlatform()) {
      await Keychain.set({ key, value });
      return;
    }
    localStorage.setItem(key, value);
  },
  async removeItem(key) {
    if (Capacitor.getPlatform() === "ios" && Capacitor.isNativePlatform()) {
      await Keychain.remove({ key });
      return;
    }
    localStorage.removeItem(key);
  },
};
