import type { formTranslations as EnglishFormTranslations } from "../../../../en/sections/consultations/admin/form";

export const formTranslations: typeof EnglishFormTranslations = {
  selection: {
    title: "Auswahl-Typ",
  },
  selectionType: {
    label: "Auswahl-Typ",
    new: "Neue Beratung erstellen",
    user: "Bestehenden Benutzer auswählen",
    lead: "Bestehenden Lead auswählen",
    placeholder: "Option auswählen...",
  },
  userSelect: {
    label: "Benutzer auswählen",
    placeholder: "Benutzer nach Name oder E-Mail suchen...",
    selected: "Benutzer ausgewählt",
    noCompany: "Keine Firma",
    displayFormat: "{{name}} ({{email}})",
  },
  leadSelect: {
    label: "Lead auswählen",
    placeholder: "Leads nach Firmenname oder E-Mail suchen...",
    selected: "Lead ausgewählt",
    displayFormat: "{{businessName}} ({{email}})",
  },
  search: {
    noResults: "Keine Ergebnisse gefunden",
  },
  contact: {
    title: "Kontaktinformationen",
    basic: "Grundinformationen",
    basicDescription: "Primäre Kontaktdaten für die Beratung",
  },
  business: {
    title: "Geschäftsinformationen",
    details: "Geschäftsdetails",
    detailsDescription: "Informationen über das Unternehmen und die Branche",
  },
  consultation: {
    title: "Beratungsdetails",
    details: "Beratungsinformationen",
    detailsDescription: "Spezifische Details zur Beratungsanfrage",
  },
  preferences: {
    title: "Beratungspräferenzen",
    scheduling: "Terminpräferenzen",
    schedulingDescription: "Bevorzugtes Datum und Uhrzeit für die Beratung",
  },
  admin: {
    title: "Admin-Einstellungen",
    internal: "Interne Einstellungen",
    internalDescription: "Nur für Admins sichtbare Einstellungen und Notizen",
  },
  name: {
    label: "Vollständiger Name",
    placeholder: "Vollständigen Namen eingeben",
  },
  email: {
    label: "E-Mail-Adresse",
    placeholder: "E-Mail-Adresse eingeben",
  },
  phone: {
    label: "Telefonnummer",
    placeholder: "Telefonnummer eingeben (optional)",
  },
  businessType: {
    label: "Geschäftstyp",
    placeholder: "Geschäftstyp oder Branche eingeben",
  },
  businessName: {
    label: "Firmenname",
    placeholder: "Firmenname eingeben (optional)",
  },
  website: {
    label: "Website",
    placeholder: "Website-URL eingeben (optional)",
  },
  country: {
    label: "Land",
    placeholder: "Land auswählen",
    options: {
      GLOBAL: "Global",
      US: "Vereinigte Staaten",
      CA: "Kanada",
      GB: "Vereinigtes Königreich",
      DE: "Deutschland",
      FR: "Frankreich",
      IT: "Italien",
      ES: "Spanien",
      NL: "Niederlande",
      BE: "Belgien",
      CH: "Schweiz",
      AT: "Österreich",
      PL: "Polen",
      CZ: "Tschechische Republik",
      SK: "Slowakei",
      HU: "Ungarn",
      RO: "Rumänien",
      BG: "Bulgarien",
      HR: "Kroatien",
      SI: "Slowenien",
      LT: "Litauen",
      LV: "Lettland",
      EE: "Estland",
      FI: "Finnland",
      SE: "Schweden",
      DK: "Dänemark",
      NO: "Norwegen",
      IS: "Island",
      IE: "Irland",
      PT: "Portugal",
      GR: "Griechenland",
      CY: "Zypern",
      MT: "Malta",
      LU: "Luxemburg",
    },
  },
  city: {
    label: "Stadt",
    placeholder: "Stadt eingeben (optional)",
  },
  currentChallenges: {
    label: "Aktuelle Herausforderungen",
    placeholder:
      "Beschreiben Sie aktuelle Geschäftsherausforderungen (optional)",
  },
  goals: {
    label: "Ziele",
    placeholder: "Beschreiben Sie Geschäftsziele und Objectives (optional)",
  },
  targetAudience: {
    label: "Zielgruppe",
    placeholder: "Beschreiben Sie die Zielgruppe (optional)",
  },
  existingAccounts: {
    label: "Bestehende Social Media Konten",
    placeholder: "Listen Sie bestehende Social Media Konten auf (optional)",
  },
  competitors: {
    label: "Hauptkonkurrenten",
    placeholder: "Listen Sie Hauptkonkurrenten auf (optional)",
  },
  preferredDate: {
    label: "Gewünschtes Datum",
    placeholder: "Gewünschtes Datum auswählen (optional)",
  },
  preferredTime: {
    label: "Gewünschte Zeit",
    placeholder: "Gewünschte Zeit eingeben (optional)",
  },
  message: {
    label: "Zusätzliche Nachricht",
    placeholder: "Zusätzliche Notizen oder Anforderungen eingeben (optional)",
  },
  status: {
    label: "Status",
    placeholder: "Beratungsstatus auswählen",
  },
  priority: {
    label: "Priorität",
    placeholder: "Prioritätsstufe auswählen",
    options: {
      low: "Niedrig",
      normal: "Normal",
      high: "Hoch",
    },
  },
  internalNotes: {
    label: "Interne Notizen",
    placeholder: "Interne Admin-Notizen eingeben (optional)",
  },
};
