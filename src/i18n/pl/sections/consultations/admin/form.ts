import type { formTranslations as EnglishFormTranslations } from "../../../../en/sections/consultations/admin/form";

export const formTranslations: typeof EnglishFormTranslations = {
  selection: {
    title: "Typ Wyboru",
  },
  selectionType: {
    label: "Typ Wyboru",
    new: "Utwórz nową konsultację",
    user: "Wybierz istniejącego użytkownika",
    lead: "Wybierz istniejący lead",
    placeholder: "Wybierz opcję...",
  },
  userSelect: {
    label: "Wybierz Użytkownika",
    placeholder: "Szukaj użytkowników po imieniu lub e-mailu...",
    selected: "Użytkownik wybrany",
    noCompany: "Brak firmy",
    displayFormat: "{{name}} ({{email}})",
  },
  leadSelect: {
    label: "Wybierz Lead",
    placeholder: "Szukaj leadów po nazwie firmy lub e-mailu...",
    selected: "Lead wybrany",
    displayFormat: "{{businessName}} ({{email}})",
  },
  search: {
    noResults: "Nie znaleziono wyników",
  },
  contact: {
    title: "Informacje Kontaktowe",
    basic: "Podstawowe Informacje",
    basicDescription: "Podstawowe dane kontaktowe do konsultacji",
  },
  business: {
    title: "Informacje o Firmie",
    details: "Szczegóły Firmy",
    detailsDescription: "Informacje o firmie i branży",
  },
  consultation: {
    title: "Szczegóły Konsultacji",
    details: "Informacje o Konsultacji",
    detailsDescription: "Szczegółowe informacje o żądaniu konsultacji",
  },
  preferences: {
    title: "Preferencje Konsultacji",
    scheduling: "Preferencje Terminowania",
    schedulingDescription: "Preferowana data i godzina konsultacji",
  },
  admin: {
    title: "Ustawienia Administratora",
    internal: "Ustawienia Wewnętrzne",
    internalDescription:
      "Ustawienia i notatki widoczne tylko dla administratorów",
  },
  name: {
    label: "Pełne Imię i Nazwisko",
    placeholder: "Wprowadź pełne imię i nazwisko",
  },
  email: {
    label: "Adres E-mail",
    placeholder: "Wprowadź adres e-mail",
  },
  phone: {
    label: "Numer Telefonu",
    placeholder: "Wprowadź numer telefonu (opcjonalne)",
  },
  businessType: {
    label: "Typ Biznesu",
    placeholder: "Wprowadź typ biznesu lub branżę",
  },
  businessName: {
    label: "Nazwa Firmy",
    placeholder: "Wprowadź nazwę firmy (opcjonalne)",
  },
  website: {
    label: "Strona Internetowa",
    placeholder: "Wprowadź URL strony internetowej (opcjonalne)",
  },
  country: {
    label: "Kraj",
    placeholder: "Wybierz kraj",
    options: {
      GLOBAL: "Globalny",
      US: "Stany Zjednoczone",
      CA: "Kanada",
      GB: "Wielka Brytania",
      DE: "Niemcy",
      FR: "Francja",
      IT: "Włochy",
      ES: "Hiszpania",
      NL: "Holandia",
      BE: "Belgia",
      CH: "Szwajcaria",
      AT: "Austria",
      PL: "Polska",
      CZ: "Czechy",
      SK: "Słowacja",
      HU: "Węgry",
      RO: "Rumunia",
      BG: "Bułgaria",
      HR: "Chorwacja",
      SI: "Słowenia",
      LT: "Litwa",
      LV: "Łotwa",
      EE: "Estonia",
      FI: "Finlandia",
      SE: "Szwecja",
      DK: "Dania",
      NO: "Norwegia",
      IS: "Islandia",
      IE: "Irlandia",
      PT: "Portugalia",
      GR: "Grecja",
      CY: "Cypr",
      MT: "Malta",
      LU: "Luksemburg",
    },
  },
  city: {
    label: "Miasto",
    placeholder: "Wprowadź miasto (opcjonalne)",
  },
  currentChallenges: {
    label: "Obecne Wyzwania",
    placeholder: "Opisz obecne wyzwania biznesowe (opcjonalne)",
  },
  goals: {
    label: "Cele",
    placeholder: "Opisz cele i zadania biznesowe (opcjonalne)",
  },
  targetAudience: {
    label: "Grupa Docelowa",
    placeholder: "Opisz grupę docelową (opcjonalne)",
  },
  existingAccounts: {
    label: "Istniejące Konta Social Media",
    placeholder: "Wymień istniejące konta social media (opcjonalne)",
  },
  competitors: {
    label: "Główni Konkurenci",
    placeholder: "Wymień głównych konkurentów (opcjonalne)",
  },
  preferredDate: {
    label: "Preferowana Data",
    placeholder: "Wybierz preferowaną datę (opcjonalne)",
  },
  preferredTime: {
    label: "Preferowana Godzina",
    placeholder: "Wprowadź preferowaną godzinę (opcjonalne)",
  },
  message: {
    label: "Dodatkowa Wiadomość",
    placeholder: "Wprowadź dodatkowe notatki lub wymagania (opcjonalne)",
  },
  status: {
    label: "Status",
    placeholder: "Wybierz status konsultacji",
  },
  priority: {
    label: "Priorytet",
    placeholder: "Wybierz poziom priorytetu",
    options: {
      low: "Niski",
      normal: "Normalny",
      high: "Wysoki",
    },
  },
  internalNotes: {
    label: "Notatki Wewnętrzne",
    placeholder: "Wprowadź wewnętrzne notatki administratora (opcjonalne)",
  },
};
