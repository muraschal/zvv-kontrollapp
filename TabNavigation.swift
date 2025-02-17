import SwiftUI

struct TabNavigation: View {
    @State private var selectedTab = 0
    
    var body: some View {
        TabView(selection: $selectedTab) {
            ContentView()
                .tabItem {
                    Image(systemName: "list.bullet")
                    Text("Kontrollen")
                }
                .tag(0)
            
            AdminView()
                .tabItem {
                    Image(systemName: "gear")
                    Text("Admin")
                }
                .tag(1)
            
            Text("Profil")
                .tabItem {
                    Image(systemName: "person.circle")
                    Text("Profil")
                }
                .tag(2)
        }
    }
}

struct TabNavigation_Previews: PreviewProvider {
    static var previews: some View {
        TabNavigation()
    }
} 