import { Capacitor, registerPlugin } from "@capacitor/core";
// Native implementations use iOS Keychain and Android Keystore + AES-GCM.
// Native authentication tokens never fall back to WebView localStorage.
const Keychain = registerPlugin("FideoraSecureStorage");
export const authStorage = {
  async getItem(key) {
    if (Capacitor.isNativePlatform())
      return (await Keychain.get({ key })).value ?? null;
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  async setItem(key, value) {
    if (Capacitor.isNativePlatform()) {
      await Keychain.set({ key, value });
      return;
    }
    localStorage.setItem(key, value);
  },
  async removeItem(key) {
    if (Capacitor.isNativePlatform()) {
      await Keychain.remove({ key });
      return;
    }
    localStorage.removeItem(key);
  },
};
