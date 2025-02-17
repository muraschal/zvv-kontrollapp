import SwiftUI

struct AdminView: View {
    @EnvironmentObject var kontrollenManager: KontrollenManager
    
    var body: some View {
        VStack {
            // Admin-Funktionen hierher verschieben
            Button(action: exportCSV) {
                Text("CSV herunterladen")
                    .frame(maxWidth: .infinity)
                    .padding()
                    .background(Color.pink)
                    .foregroundColor(.white)
                    .cornerRadius(10)
            }
            .padding(.horizontal)
            
            Button(action: { showDeleteAlert() }) {
                Text("Alle Kontrollen löschen")
                    .frame(maxWidth: .infinity)
                    .padding()
                    .background(Color.red)
                    .foregroundColor(.white)
                    .cornerRadius(10)
            }
            .padding(.horizontal)
            
            Spacer()
        }
        .navigationTitle("Admin")
    }
    
    private func exportCSV() {
        // CSV Export Logik kommt später
    }
    
    private func showDeleteAlert() {
        // Lösch-Logik kommt später
    }
} 