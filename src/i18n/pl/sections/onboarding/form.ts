import type { formTranslations as EnglishFormTranslations } from "../../../en/sections/onboarding/form";

export const formTranslations: typeof EnglishFormTranslations = {
  businessName: "Nazwa firmy",
  businessType: {
    label: "Typ firmy",
    placeholder: "Wybierz typ swojej firmy",
    options: {
      retail: "Handel detaliczny",
      service: "Usługi",
      hospitality: "Hotelarstwo",
      technology: "Technologia",
      healthcare: "Opieka zdrowotna",
      education: "Edukacja",
      nonprofit: "Organizacja non-profit",
      other: "Inne",
    },
  },
  contactName: "Imię i nazwisko kontaktowe",
  email: "Adres email",
  phone: "Numer telefonu",
  message: "Dodatkowe informacje",
  preferredDate: "Preferowana data (opcjonalnie)",
  preferredTime: "Preferowana godzina (opcjonalnie)",
  submit: "Prześlij żądanie",
  required: "Pole wymagane",
  targetAudience: {
    label: "Grupa docelowa",
    placeholder: "Opisz swoją grupę docelową",
  },
  socialPlatforms: {
    label: "Platformy mediów społecznościowych",
    description:
      "Wybierz platformy, których obecnie używasz lub które Cię interesują",
    platforms: {
      instagram: "Instagram",
      facebook: "Facebook",
      twitter: "Twitter",
      linkedin: "LinkedIn",
      tiktok: "TikTok",
      youtube: "YouTube",
      pinterest: "Pinterest",
    },
  },
  goals: {
    label: "Twoje cele",
    description: "Co chcesz osiągnąć dzięki mediom społecznościowym?",
    options: {
      awareness: "Świadomość marki",
      engagement: "Zwiększenie zaangażowania",
      traffic: "Zwiększenie ruchu na stronie",
      leads: "Generowanie leadów",
      sales: "Zwiększenie sprzedaży",
      loyalty: "Lojalność klientów",
      community: "Budowanie społeczności",
    },
  },
  competitors: {
    label: "Konkurenci",
    placeholder: "Wymień swoich głównych konkurentów (opcjonalnie)",
  },
  brandGuidelines: {
    label: "Wytyczne marki",
    placeholder: "Podziel się wytycznymi marki lub preferencjami",
  },
  additionalInfo: {
    label: "Dodatkowe informacje",
    placeholder: "Czy jest coś jeszcze, co chciałbyś, żebyśmy wiedzieli?",
  },
  submitButton: "Prześlij i kontynuuj",
  skip: "Pomiń na razie",
};
