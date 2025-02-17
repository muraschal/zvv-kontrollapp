struct Kontrolle: Identifiable, Codable {
    let id: UUID
    let datum: Date
    let kontrolleur: String
    let linie: String
    let kurs: String
    let richtung: String
    let anzahlKontrolliert: Int
    
    init(id: UUID = UUID(), datum: Date, kontrolleur: String, linie: String, kurs: String, richtung: String, anzahlKontrolliert: Int) {
        self.id = id
        self.datum = datum
        self.kontrolleur = kontrolleur
        self.linie = linie
        self.kurs = kurs
        self.richtung = richtung
        self.anzahlKontrolliert = anzahlKontrolliert
    }
} 