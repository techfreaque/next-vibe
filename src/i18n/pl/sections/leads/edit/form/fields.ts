import type { fieldsTranslations as EnglishFieldsTranslations } from "../../../../../en/sections/leads/edit/form/fields";

export const fieldsTranslations: typeof EnglishFieldsTranslations = {
  id: {
    label: "ID",
    description: "Unikalny identyfikator dla leada",
  },
  businessName: {
    label: "Nazwa firmy",
    placeholder: "Wprowadź nazwę firmy",
  },
  contactName: {
    label: "Imię kontaktu",
    placeholder: "Wprowadź imię osoby kontaktowej",
  },
  email: {
    label: "Adres email",
    placeholder: "Wprowadź adres email",
  },
  phone: {
    label: "Numer telefonu",
    placeholder: "Wprowadź numer telefonu",
  },
  website: {
    label: "Strona internetowa",
    placeholder: "Wprowadź URL strony internetowej",
  },
  country: {
    label: "Kraj",
    placeholder: "Wybierz kraj",
  },
  language: {
    label: "Język",
    placeholder: "Wybierz język",
  },
  status: {
    label: "Status",
    description: "Aktualny status leada",
    placeholder: "Wybierz status",
    options: {
      new: "Nowy",
      pending: "Oczekujący",
      campaign_running: "Kampania w toku",
      website_user: "Użytkownik strony",
      newsletter_subscriber: "Subskrybent newslettera",
      in_contact: "W kontakcie",
      signed_up: "Zarejestrowany",
      consultation_booked: "Konsultacja zarezerwowana",
      subscription_confirmed: "Subskrypcja potwierdzona",
      unsubscribed: "Wypisany",
      bounced: "Odrzucony",
      invalid: "Nieprawidłowy",
    },
  },
  currentCampaignStage: {
    label: "Etap kampanii",
    description: "Aktualny etap w kampanii e-mailowej",
    placeholder: "Wybierz etap kampanii",
    options: {
      not_started: "Nie rozpoczęto",
      initial: "Początkowy",
      followup_1: "Follow-up 1",
      followup_2: "Follow-up 2",
      followup_3: "Follow-up 3",
      nurture: "Pielęgnowanie",
      reactivation: "Reaktywacja",
    },
  },
  source: {
    label: "Źródło",
    placeholder: "Wprowadź źródło lead",
  },
  notes: {
    label: "Notatki",
    description: "Dodatkowe uwagi o leadzie",
    placeholder: "Wprowadź notatki",
  },
  metadata: {
    label: "Metadane",
    description: "Dodatkowe metadane jako JSON",
    placeholder: "Wprowadź metadane jako JSON",
  },
  convertedUserId: {
    label: "Konwertowany Użytkownik",
    placeholder:
      "Wybierz użytkownika, na którego ten lead został konwertowany...",
    searchPlaceholder: "Szukaj użytkowników...",
    searchHint: "Wpisz co najmniej 2 znaki, aby wyszukać",
    noResults: "Nie znaleziono użytkowników",
    selectedUser: "{{firstName}} {{lastName}} ({{email}})",
  },
};
