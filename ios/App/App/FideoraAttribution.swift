import UIKit
import Capacitor
import AppTrackingTransparency
import AdSupport
import FBSDKCoreKit

// Only technical activation/installation signals. RevenueCat alone sends money events.
private final class FideoraMetaMeasurement {
    static let shared = FideoraMetaMeasurement()
    private var initialized = false
    private var observer: NSObjectProtocol?

    var configured: Bool {
        let appID = Bundle.main.object(forInfoDictionaryKey: "FacebookAppID") as? String ?? ""
        let token = Bundle.main.object(forInfoDictionaryKey: "FacebookClientToken") as? String ?? ""
        return !appID.isEmpty && appID.allSatisfy(\.isNumber)
            && !token.isEmpty && !token.contains("$(")
    }

    private var authorized: Bool {
        ATTrackingManager.trackingAuthorizationStatus == .authorized
    }

    private func updateConsent() {
        // Configure all switches before initializing or creating an anonymous ID.
        Settings.shared.isAutoLogAppEventsEnabled = false
        Settings.shared.isMetaDataCollectionEnabled = false
        Settings.shared.isAutoLogProductImprovementEnabled = false
        Settings.shared.isAdvertiserIDCollectionEnabled = authorized
        Settings.shared.isCodelessDebugLogEnabled = false
        Settings.shared.isSKAdNetworkReportEnabled = false
        if #unavailable(iOS 17) {
            Settings.shared.isAdvertiserTrackingEnabled = authorized
        }
    }

    private func activate() {
        guard configured else { return }
        // Do not touch AppEvents or create identifiers before ATT authorization.
        guard authorized else {
            if initialized { updateConsent() }
            return
        }
        updateConsent()
        if !initialized {
            initialized = true
            ApplicationDelegate.shared.initializeSDK()
            observer = NotificationCenter.default.addObserver(
                forName: UIApplication.didBecomeActiveNotification,
                object: nil, queue: .main
            ) { [weak self] _ in self?.activate() }
        }
        AppEvents.shared.activateApp()
    }

    func state() -> [String: Any] {
        let status: String
        switch ATTrackingManager.trackingAuthorizationStatus {
        case .authorized: status = "authorized"
        case .denied: status = "denied"
        case .restricted: status = "restricted"
        case .notDetermined: status = "notDetermined"
        @unknown default: status = "unavailable"
        }
        // SDK activation is independent of periodic billing refreshes.
        if !initialized && authorized { activate() }
        if initialized && !authorized { updateConsent() }
        var result: [String: Any] = ["status": status, "configured": configured]
        if configured && authorized && initialized {
            result["anonymousId"] = AppEvents.shared.anonymousID
        }
        return result
    }
}

@objc(FideoraAttributionPlugin)
public class FideoraAttributionPlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "FideoraAttributionPlugin"
    public let jsName = "FideoraAttribution"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "getState", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "requestAuthorization", returnType: CAPPluginReturnPromise)
    ]

    @objc func getState(_ call: CAPPluginCall) {
        DispatchQueue.main.async { call.resolve(FideoraMetaMeasurement.shared.state()) }
    }

    @objc func requestAuthorization(_ call: CAPPluginCall) {
        DispatchQueue.main.async {
            let measurement = FideoraMetaMeasurement.shared
            guard measurement.configured,
                  UIApplication.shared.applicationState == .active,
                  ATTrackingManager.trackingAuthorizationStatus == .notDetermined else {
                call.resolve(measurement.state())
                return
            }
            ATTrackingManager.requestTrackingAuthorization { _ in
                DispatchQueue.main.async { call.resolve(measurement.state()) }
            }
        }
    }
}
