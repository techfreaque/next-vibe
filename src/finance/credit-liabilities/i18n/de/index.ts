import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Verbindlichkeiten aus Kundenguthaben",
  description:
    "Prüfen Sie die gebuchten Verbindlichkeiten aus bezahlten Guthabenpaketen dieses Unternehmens.",
  tag: "Guthabenverbindlichkeiten",
  company: "Unternehmen",
  choose:
    "Wählen Sie ein Unternehmen, um die gebuchten Guthabenverbindlichkeiten anzuzeigen.",
  empty: "Keine verknüpften Buchungen für bezahlte Guthaben",
  account: "Sachkonto",
  currency: "Währung",
  amount: "Gebuchter Saldo",
  asOf: "Stand",
  reportDay: "Bis zum {{date}} (UTC)",
  scope:
    "Enthalten sind verknüpfte Verkäufe, Erstattungen, Erlösbuchungen und Stornos. Wallet-Guthaben und Beträge ohne bestätigte Unternehmenszuordnung sind ausgeschlossen.",
  ledgerScope:
    "Öffnen Sie ein Konto für das vollständige Kontoblatt einschließlich Buchungen außerhalb dieses Berichts.",
  supplierLink: "Lieferantenvorauszahlungen prüfen",
  errors: {
    validation: {
      title: "Unternehmensauswahl prüfen",
      description:
        "Wählen Sie ein aktives Unternehmen, auf das Sie Zugriff haben.",
    },
    forbidden: {
      title: "Unternehmenszugriff erforderlich",
      description: "Sie haben keinen Zugriff auf dieses Unternehmen.",
    },
    server: {
      title: "Guthabenverbindlichkeiten konnten nicht geladen werden",
      description: "Versuchen Sie, den Bericht erneut zu laden.",
    },
  },
};
