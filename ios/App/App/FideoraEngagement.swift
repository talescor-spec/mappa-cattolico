import Capacitor
import StoreKit
import UIKit
import UserNotifications

@objc(FideoraEngagementPlugin)
public final class FideoraEngagementPlugin: CAPPlugin, CAPBridgedPlugin, NotificationHandlerProtocol {
    public let identifier = "FideoraEngagementPlugin"
    public let jsName = "FideoraEngagement"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "requestReview", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "openReviewPage", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "allowsReviewMetrics", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "developmentEnvironment", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "configureReminders", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "takeReminderRoute", returnType: CAPPluginReturnPromise)
    ]

    private let reminderKinds = ["reading", "prayer"]
    private var pendingRoute: String?

    @objc public func requestReview(_ call: CAPPluginCall) {
        DispatchQueue.main.async {
            guard UIApplication.shared.applicationState == .active,
                  let controller = self.bridge?.viewController,
                  controller.presentedViewController == nil,
                  let scene = controller.viewIfLoaded?.window?.windowScene,
                  scene.activationState == .foregroundActive else {
                call.resolve(["requested": false])
                return
            }
            if #available(iOS 16.0, *) {
                AppStore.requestReview(in: scene)
            } else {
                SKStoreReviewController.requestReview(in: scene)
            }
            call.resolve(["requested": true])
        }
    }

    @objc public func openReviewPage(_ call: CAPPluginCall) {
        let url = URL(string: "https://apps.apple.com/app/id6825337165?action=write-review")!
        DispatchQueue.main.async {
            UIApplication.shared.open(url, options: [:]) { opened in
                call.resolve(["opened": opened])
            }
        }
    }

    @objc public func allowsReviewMetrics(_ call: CAPPluginCall) {
        #if DEBUG
        call.resolve(["allowed": false])
        #else
        if #available(iOS 16.0, *) {
            Task {
                if let result = try? await AppTransaction.shared,
                   case .verified(let transaction) = result {
                    call.resolve(["allowed": transaction.environment == .production])
                } else {
                    call.resolve(["allowed": false])
                }
            }
        } else {
            call.resolve(["allowed": Bundle.main.appStoreReceiptURL?.lastPathComponent == "receipt"])
        }
        #endif
    }

    @objc public func developmentEnvironment(_ call: CAPPluginCall) {
        #if DEBUG
        call.resolve(["allowed": true, "channel": "debug"])
        #else
        if #available(iOS 16.0, *) {
            Task {
                if let result = try? await AppTransaction.shared,
                   case .verified(let transaction) = result,
                   transaction.environment == .sandbox || transaction.environment == .xcode {
                    call.resolve(["allowed": true, "channel": "sandbox"])
                } else {
                    call.resolve(["allowed": false, "channel": "unavailable"])
                }
            }
        } else if let receipt = Bundle.main.appStoreReceiptURL,
                  receipt.lastPathComponent == "sandboxReceipt",
                  FileManager.default.fileExists(atPath: receipt.path) {
            call.resolve(["allowed": true, "channel": "sandbox"])
        } else {
            call.resolve(["allowed": false, "channel": "unavailable"])
        }
        #endif
    }

    private func reminderID(_ kind: String) -> String {
        "fideora.reminder.\(kind)"
    }

    @objc public func configureReminders(_ call: CAPPluginCall) {
        let center = UNUserNotificationCenter.current()
        let portuguese = call.getString("locale") == "pt"
        let copy = [
            "reading": portuguese
                ? ("Sua leitura de hoje está pronta", "Reserve alguns minutos para ler no Fideora.")
                : ("La lettura di oggi è pronta", "Prenditi qualche minuto per leggerla su Fideora."),
            "prayer": portuguese
                ? ("Seu momento de oração", "Abra o Fideora para acompanhar a oração guiada.")
                : ("Il tuo momento di preghiera", "Apri Fideora per seguire la preghiera guidata.")
        ]
        var requests: [UNNotificationRequest] = []
        var disabledIDs: [String] = []
        for kind in reminderKinds {
            let id = reminderID(kind)
            guard let time = call.getString(kind) else {
                disabledIDs.append(id)
                continue
            }
            let parts = time.split(separator: ":")
            guard parts.count == 2, let hour = Int(parts[0]), let minute = Int(parts[1]),
                  (0...23).contains(hour), (0...59).contains(minute),
                  let (title, body) = copy[kind] else {
                call.reject("Invalid reminder time")
                return
            }
            let content = UNMutableNotificationContent()
            content.title = title
            content.body = body
            content.sound = .default
            let trigger = UNCalendarNotificationTrigger(
                dateMatching: DateComponents(hour: hour, minute: minute), repeats: true)
            requests.append(UNNotificationRequest(identifier: id, content: content, trigger: trigger))
        }
        if requests.isEmpty {
            center.removePendingNotificationRequests(withIdentifiers: disabledIDs)
            center.removeDeliveredNotifications(withIdentifiers: disabledIDs)
            call.resolve(["status": "disabled"])
            return
        }

        // Keep settings changes serial and replace only the app's own reminders.
        let scheduled = requests
        let removed = disabledIDs
        let askPermission = call.getBool("askPermission") == true
        Task {
            do {
                var settings = await center.notificationSettings()
                if settings.authorizationStatus == .notDetermined && askPermission {
                    _ = try await center.requestAuthorization(options: [.alert, .sound])
                    settings = await center.notificationSettings()
                }
                guard [.authorized, .provisional, .ephemeral].contains(settings.authorizationStatus) else {
                    center.removePendingNotificationRequests(withIdentifiers: reminderKinds.map(reminderID))
                    call.resolve(["status": "blocked"])
                    return
                }
                for request in scheduled {
                    try await center.add(request)
                }
                center.removePendingNotificationRequests(withIdentifiers: removed)
                center.removeDeliveredNotifications(withIdentifiers: removed)
                call.resolve(["status": "scheduled"])
            } catch {
                call.reject("Could not schedule reminders")
            }
        }
    }

    public func willPresent(notification: UNNotification) -> UNNotificationPresentationOptions {
        []
    }

    public func didReceive(response: UNNotificationResponse) {
        guard response.actionIdentifier == UNNotificationDefaultActionIdentifier,
              let kind = reminderKinds.first(where: { reminderID($0) == response.notification.request.identifier })
        else { return }
        DispatchQueue.main.async {
            self.pendingRoute = kind
            self.notifyListeners("reminderTapped", data: [:])
        }
    }

    @objc public func takeReminderRoute(_ call: CAPPluginCall) {
        DispatchQueue.main.async {
            let route = self.pendingRoute
            self.pendingRoute = nil
            call.resolve(["route": route ?? ""])
        }
    }
}
