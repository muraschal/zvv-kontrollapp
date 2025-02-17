import SwiftUI

struct TabNavigation: View {
    @StateObject private var kontrollenManager = KontrollenManager()
    @State private var selectedTab = 0
    
    var body: some View {
        TabView(selection: $selectedTab) {
            ContentView()
                .tabItem {
                    Image(systemName: "timer")
                    Text("Zeit")
                }
                .tag(0)
            
            AdminView()
                .tabItem {
                    Image(systemName: "gear")
                    Text("Admin")
                }
                .tag(1)
            
            Text("Profil") // Placeholder für Profil-View
                .tabItem {
                    Image(systemName: "person.circle")
                    Text("ZVV")
                }
                .tag(2)
        }
        .environmentObject(kontrollenManager)
        .accentColor(.blue) // ZVV Blau
    }
}

struct TabNavigation_Previews: PreviewProvider {
    static var previews: some View {
        TabNavigation()
    }
} 