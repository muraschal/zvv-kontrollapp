import Foundation

class KontrollenManager: ObservableObject {
    @Published var kontrollen: [Kontrolle] = []
    private let saveKey = "SavedKontrollen"
    
    init() {
        loadKontrollen()
    }
    
    func loadKontrollen() {
        if let data = UserDefaults.standard.data(forKey: saveKey) {
            if let decoded = try? JSONDecoder().decode([Kontrolle].self, from: data) {
                kontrollen = decoded
                return
            }
        }
        kontrollen = []
    }
    
    func saveKontrollen() {
        if let encoded = try? JSONEncoder().encode(kontrollen) {
            UserDefaults.standard.set(encoded, forKey: saveKey)
        }
    }
    
    func addKontrolle(_ kontrolle: Kontrolle) {
        kontrollen.append(kontrolle)
        saveKontrollen()
    }
} 