import SwiftUI

@main
struct KontrollenApp: App {
    var body: some Scene {
        WindowGroup {
            TabNavigation()
                .ignoresSafeArea(.keyboard)
        }
    }
} 