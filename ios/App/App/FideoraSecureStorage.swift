import Foundation
import Capacitor
import Security

@objc(FideoraSecureStoragePlugin)
public class FideoraSecureStoragePlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "FideoraSecureStoragePlugin"
    public let jsName = "FideoraSecureStorage"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "get", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "set", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "remove", returnType: CAPPluginReturnPromise)
    ]
    private let service = "com.fideora.app.auth"
    private func query(_ key: String) -> [String: Any] {
        return [kSecClass as String: kSecClassGenericPassword,
                kSecAttrService as String: service,
                kSecAttrAccount as String: key]
    }
    @objc func get(_ call: CAPPluginCall) {
        guard let key = call.getString("key") else { call.reject("Missing key"); return }
        var request = query(key)
        request[kSecReturnData as String] = true
        request[kSecMatchLimit as String] = kSecMatchLimitOne
        var item: CFTypeRef?
        let status = SecItemCopyMatching(request as CFDictionary, &item)
        if status == errSecItemNotFound { call.resolve(["value": NSNull()]); return }
        guard status == errSecSuccess, let data = item as? Data,
              let value = String(data: data, encoding: .utf8) else {
            call.reject("Keychain read failed", String(status)); return
        }
        call.resolve(["value": value])
    }
    @objc func set(_ call: CAPPluginCall) {
        guard let key = call.getString("key"), let value = call.getString("value"),
              let data = value.data(using: .utf8) else { call.reject("Missing key/value"); return }
        let request = query(key)
        let attributes: [String: Any] = [kSecValueData as String: data,
            kSecAttrAccessible as String: kSecAttrAccessibleAfterFirstUnlockThisDeviceOnly]
        var status = SecItemUpdate(request as CFDictionary, attributes as CFDictionary)
        if status == errSecItemNotFound {
            var insertion = request
            attributes.forEach { insertion[$0.key] = $0.value }
            status = SecItemAdd(insertion as CFDictionary, nil)
        }
        guard status == errSecSuccess else { call.reject("Keychain write failed", String(status)); return }
        call.resolve()
    }
    @objc func remove(_ call: CAPPluginCall) {
        guard let key = call.getString("key") else { call.reject("Missing key"); return }
        let status = SecItemDelete(query(key) as CFDictionary)
        guard status == errSecSuccess || status == errSecItemNotFound else {
            call.reject("Keychain removal failed", String(status)); return
        }
        call.resolve()
    }
}
