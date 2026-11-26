import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Collega una banca",
  description:
    "Scegli la banca e il conto contabile. La banca può consentire l’accesso in lettura per un massimo di 180 giorni.",
  company: "Azienda",
  ledgerAccount: "Conto bancario nel libro mastro",
  bankCountry: "Codice paese della banca",
  bankName: "Nome della banca",
  psu: "Tipo di accesso alla banca",
  personal: "Conto bancario personale",
  business: "Aziendale",
  start: "Avvia l’autorizzazione bancaria",
  ready: "Autorizzazione pronta",
  continueDescription:
    "Verifica la banca e il conto contabile selezionati prima di continuare.",
  starting: "Avvio dell’autorizzazione…",
  authorize: "Continua verso la banca",
  unavailable:
    "Non è stato possibile avviare l’autorizzazione. Controlla la banca e riprova.",
  forbidden: "Non hai accesso a questa azienda e a questo conto bancario.",
  invalidAccount: "Il consenso bancario non è disponibile o è scaduto.",
  expiryTitle: "Il consenso bancario scadrà a breve",
};
