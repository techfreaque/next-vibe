import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Bank verbinden",
  description:
    "Wählen Sie Bank und Sachkonto. Ihre Bank genehmigt den Lesezugriff für bis zu 180 Tage.",
  company: "Unternehmen",
  ledgerAccount: "Bankkonto im Hauptbuch",
  bankCountry: "Ländercode der Bank",
  bankName: "Bankname",
  psu: "Bankzugang",
  personal: "Privates Bankkonto",
  business: "Geschäftlich",
  start: "Bankfreigabe starten",
  ready: "Bankfreigabe bereit",
  continueDescription:
    "Prüfen Sie die gewählte Bank und das Sachkonto, bevor Sie fortfahren.",
  starting: "Bankfreigabe wird gestartet…",
  authorize: "Weiter zur Bank",
  unavailable:
    "Die Bankfreigabe konnte nicht gestartet werden. Prüfen Sie die Bankauswahl und versuchen Sie es erneut.",
  forbidden: "Sie haben keinen Zugriff auf dieses Unternehmen und Bankkonto.",
  invalidAccount:
    "Die Bankfreigabe ist nicht verfügbar oder bereits abgelaufen.",
  expiryTitle: "Bankfreigabe läuft bald ab",
};
