import UIKit
import Capacitor

@objc(FideoraViewController)
class FideoraViewController: CAPBridgeViewController {
    override func capacitorDidLoad() {
        bridge?.registerPluginInstance(FideoraSecureStoragePlugin())
        webView?.isOpaque = false
        webView?.backgroundColor = UIColor(red: 247.0/255.0, green: 248.0/255.0, blue: 245.0/255.0, alpha: 1)
        webView?.scrollView.contentInsetAdjustmentBehavior = .never
    }
    override var preferredStatusBarStyle: UIStatusBarStyle { .darkContent }
}
