import SwiftUI

struct AdminView: View {
    var body: some View {
        NavigationView {
            List {
                Button(action: {
                    // CSV Export Logik kommt später
                }) {
                    Label("CSV herunterladen", systemImage: "arrow.down.doc")
                }
                
                Button(action: {
                    // Lösch-Logik kommt später
                }) {
                    Label("Alle Kontrollen löschen", systemImage: "trash")
                        .foregroundColor(.red)
                }
            }
            .navigationTitle("Admin")
        }
    }
} 