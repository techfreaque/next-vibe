import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Bank verbinden",
  description:
    "Erteilen Sie Lesezugriff. Nach der Rückkehr legen Sie fest, welche geschäftlichen Umsätze Sie übernehmen, und prüfen die Importvorschau.",
  company: "Unternehmen",
  ledgerAccount: "Bankkonto im Hauptbuch",
  bankCountry: "Land der Bank",
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
  bankStep: "1 von 4 · Bank wählen",
  ledgerStep: "2 von 4 · Sachkonto wählen",
  authorizeStep: "3 von 4 · Lesezugriff freigeben",
  next: "Sachkonto wählen",
  back: "Zurück zur Bankauswahl",
  createAccount: "Bankkonto im Kontenplan anlegen",
  noLedger:
    "In diesem Unternehmen fehlt ein aktives Bankkonto im Kontenplan. Legen Sie eines an.",
  search: "Bank suchen",
  noBanks: "Keine passende Bank. Prüfen Sie Name, Land oder Zugangsart.",
  loading: "Bankverzeichnis wird geladen…",
  unconfigured:
    "Die Serververwaltung muss die Anwendungs-ID und den Signaturschlüssel für Enable Banking hinterlegen.",
  directoryUnavailable:
    "Das Bankenverzeichnis ist gerade nicht erreichbar. Laden Sie es erneut.",
  retry: "Erneut versuchen",
};
