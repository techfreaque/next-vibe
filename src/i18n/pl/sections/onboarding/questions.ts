import type { questionsTranslations as EnglishQuestionsTranslations } from "../../../en/sections/onboarding/questions";

export const questionsTranslations: typeof EnglishQuestionsTranslations = {
  title: "Opowiedz nam o swojej firmie",
  description:
    "Pomóż nam stworzyć idealną strategię mediów społecznościowych dla Ciebie.",
  submit: "Ukończ wdrożenie",
  submitting: "Kończenie wdrożenia...",
  businessType: {
    label: "Jaki typ firmy prowadzisz?",
    placeholder: "Wybierz typ swojej firmy",
    description: "To pomaga nam dostosować nasze usługi do Twojej branży.",
  },
  targetAudience: {
    label: "Kto jest Twoją grupą docelową?",
    placeholder:
      "Opisz swoich idealnych klientów (wiek, zainteresowania, demografia itp.)",
    description:
      "Zrozumienie Twoich odbiorców pomaga nam tworzyć lepsze treści.",
  },
  socialPlatforms: {
    label:
      "Na których platformach mediów społecznościowych jesteś zainteresowany?",
    description: "Wybierz wszystkie platformy, na których chcesz się skupić.",
  },
  goals: {
    label: "Jakie są Twoje główne cele w mediach społecznościowych?",
    description: "Wybierz wszystkie, które dotyczą celów Twojej firmy.",
    customPlaceholder: "Dodaj niestandardowy cel...",
    selected: "Wybrane",
  },
  competitors: {
    label: "Kim są Twoi główni konkurenci?",
    placeholder: "Wymień firmy lub marki, z którymi konkurujesz",
    description: "To pomaga nam zrozumieć Twoją pozycję na rynku.",
  },
  brandGuidelines: {
    label: "Czy masz istniejące wytyczne marki?",
    description:
      "Zaznacz to, jeśli masz kolory marki, czcionki lub przewodniki stylu, których powinniśmy przestrzegać.",
  },
  additionalInfo: {
    label: "Czy jest coś jeszcze, co chciałbyś, żebyśmy wiedzieli?",
    placeholder:
      "Podziel się dodatkowymi informacjami o swojej firmie lub celach",
    description:
      "Opcjonalnie: Wszelkie specjalne wymagania lub dodatkowy kontekst.",
  },
  currentChallenges: {
    label: "Obecne wyzwania",
    placeholder:
      "Z jakimi wyzwaniami borykasz się w marketingu w mediach społecznościowych?",
    description:
      "Pomóż nam zrozumieć Twoje problemy i zapewnić lepsze rozwiązania.",
  },
  consultation: {
    title: "Preferencje konsultacji",
    description: "Opcjonalnie: Ustaw preferencje dla przyszłych konsultacji.",
    preferredDate: {
      label: "Preferowana data",
      description: "Kiedy wolałbyś mieć konsultację?",
    },
    preferredTime: {
      label: "Preferowana godzina",
      description: "Jaka pora dnia jest dla Ciebie najlepsza?",
    },
    contactPhone: {
      label: "Telefon firmowy",
      placeholder: "+48 123 456 789",
      description: "Główny numer telefonu do kontaktu biznesowego",
    },
  },
};
