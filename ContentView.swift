struct ContentView: View {
    var body: some View {
        VStack {
            // Nur Timer und Kontrollen-bezogene Inhalte
            TimerView()
            LetzeKontrollenView()
            
            Spacer()
            Text("© ZVV")
                .font(.caption)
                .foregroundColor(.secondary)
                .padding(.bottom, 5)
        }
    }
} 