import type { translations as EnglishFieldsTranslations } from "../../../../en/leads/edit/form/fields";

export const translations: typeof EnglishFieldsTranslations = {
  id: {
    label: "ID",
    description: "Eindeutige Kennung für den Lead",
  },
  businessName: {
    label: "Firmenname",
    placeholder: "Firmenname eingeben",
  },
  contactName: {
    label: "Kontaktname",
    placeholder: "Name der Kontaktperson eingeben",
  },
  email: {
    label: "E-Mail-Adresse",
    placeholder: "E-Mail-Adresse eingeben",
  },
  phone: {
    label: "Telefonnummer",
    placeholder: "Telefonnummer eingeben",
  },
  website: {
    label: "Website",
    placeholder: "Website-URL eingeben",
  },
  country: {
    label: "Land",
    placeholder: "Land auswählen",
  },
  language: {
    label: "Sprache",
    placeholder: "Sprache auswählen",
  },
  status: {
    label: "Status",
    description: "Aktueller Status des Leads",
    placeholder: "Status auswählen",
    options: {
      new: "Neu",
      pending: "Ausstehend",
      campaign_running: "Kampagne läuft",
      website_user: "Website-Nutzer",
      newsletter_subscriber: "Newsletter-Abonnent",
      in_contact: "In Kontakt",
      signed_up: "Angemeldet",
      consultation_booked: "Beratung gebucht",
      subscription_confirmed: "Abonnement bestätigt",
      unsubscribed: "Abgemeldet",
      bounced: "Abgesprungen",
      invalid: "Ungültig",
    },
  },
  currentCampaignStage: {
    label: "Kampagnenstufe",
    description: "Aktuelle Stufe in der E-Mail-Kampagne",
    placeholder: "Kampagnenstufe auswählen",
    options: {
      not_started: "Nicht gestartet",
      initial: "Initial",
      followup_1: "Nachfass 1",
      followup_2: "Nachfass 2",
      followup_3: "Nachfass 3",
      nurture: "Pflege",
      reactivation: "Reaktivierung",
    },
  },
  source: {
    label: "Quelle",
    placeholder: "Lead-Quelle eingeben",
  },
  notes: {
    label: "Notizen",
    description: "Zusätzliche Notizen über den Lead",
    placeholder: "Zusätzliche Notizen eingeben",
  },
  metadata: {
    label: "Metadaten",
    description: "Zusätzliche Metadaten als JSON",
    placeholder: "Metadaten als JSON eingeben",
  },
  convertedUserId: {
    label: "Konvertierter Benutzer",
    placeholder:
      "Wählen Sie einen Benutzer aus, zu dem dieser Lead konvertiert wurde...",
    searchPlaceholder: "Benutzer suchen...",
    searchHint: "Geben Sie mindestens 2 Zeichen ein, um zu suchen",
    noResults: "Keine Benutzer gefunden",
    selectedUser: "{{firstName}} {{lastName}} ({{email}})",
  },
};
