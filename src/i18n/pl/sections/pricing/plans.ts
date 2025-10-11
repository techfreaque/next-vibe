import type { plansTranslations as EnglishPlansTranslations } from "../../../en/sections/pricing/plans";

export const plansTranslations: typeof EnglishPlansTranslations = {
  title: "Plany cenowe",
  subtitle:
    "Wybierz idealny plan dla potrzeb Twojego biznesu w mediach społecznościowych.",
  monthly: "Miesięcznie",
  annually: "Rocznie",
  savePercent: "Oszczędź więcej niż {{percent}}%",
  supportBadge: "Dedykowane wsparcie",
  contactUsLink: "Skontaktuj się z nami",
  tailoredPackageText: "w sprawie pakietu dostosowanego do Twoich potrzeb.",
  perMonth: "/miesiąc",
  guaranteeBadge: "Dedykowany zespół kreatywny",
  flexibleBadge: "Anuluj subskrypcję lub przejdź na inny plan w każdej chwili",
  customSolutionText:
    "Wszystkie plany obejmują konfigurację konta, tworzenie treści i rozmowy strategiczne. Potrzebujesz niestandardowego rozwiązania?",
  badge: "Wybierz idealny plan dla swojego biznesu",
  processing: "Przetwarzanie...",
  orSeparator: "lub",
  monthlyPosts: {
    starter: "2 posty na wszystkich twoich platformach",
    professional: "4 posty lub 2 reels na wszystkich twoich platformach",
    premium: "8 postów lub 4 reels na wszystkich twoich platformach",
    enterprise: "Nieograniczone treści",
  },
  strategyCalls: {
    starter: "Kwartalnie",
    professional: "Miesięcznie",
    premium: "Miesięcznie",
    enterprise: "Tygodniowo",
  },
  STARTER: {
    name: "Starter",
    price: "{{price}}{{currency}}",
    description: "Idealny dla małych firm, które dopiero zaczynają",
    features: {
      freeSocialSetup:
        "Konfiguracja kont społecznościowych wliczona jeśli jeszcze ich nie masz",
      posts:
        "2 posty ze zdjęciami i opisem miesięcznie na wszystkich twoich platformach",
      strategyCall: "Kwartalna rozmowa strategiczna",
      contentStrategy: "Podstawowa strategia treści",
      analytics: "Podstawowa analiza",
      support: "Wsparcie emailowe",
      calendar: "Harmonogram treści",
    },
    cta: "Wybierz Starter",
  },
  PROFESSIONAL: {
    name: "Professional",
    price: "{{price}}{{currency}}",
    description: "Idealny dla rozwijających się firm",
    features: {
      freeSocialSetup:
        "Konfiguracja kont społecznościowych wliczona jeśli jeszcze ich nie masz",
      contentStrategy: "Zaawansowana strategia treści",
      posts:
        "4 posty ze zdjęciami i opisem miesięcznie na wszystkich twoich platformach",
      reels: "2 reels miesięcznie na wszystkich twoich platformach",
      strategyCall: "Miesięczna rozmowa strategiczna",
      analytics: "Zaawansowana analiza",
      support: "Priorytetowe wsparcie email i chat",
      calendar: "Harmonogram treści",
    },
    cta: "Wybierz Professional",
    badge: "Najpopularniejszy",
  },
  PREMIUM: {
    name: "Premium",
    price: "{{price}}{{currency}}",
    description: "Kompletne rozwiązanie z premium tworzeniem treści",
    premiumFeatures: {
      premiumPosts:
        "8 postów ze zdjęciami i opisem miesięcznie na wszystkich twoich platformach",
      premiumReels: "4 reels miesięcznie na wszystkich twoich platformach",
    },
    features: {
      freeSocialSetup:
        "Konfiguracja kont społecznościowych wliczona jeśli jeszcze ich nie masz",
      strategyCalls: "Miesięczna rozmowa strategiczna raz na miesiąc",
      contentStrategy: "Zaawansowana strategia treści w ciągu miesiąca",
      analytics: "Kompleksowa analiza i raportowanie",
      accountManager: "Dedykowany social media manager do Twojego konta",
      support: "Priorytetowe wsparcie",
    },
    cta: "Wybierz Premium",
    featureBadge: "Treści najwyższej jakości",
  },
  ENTERPRISE: {
    name: "Enterprise",
    price: "Niestandardowy",
    description:
      "Dostosowane rozwiązania dla firm każdej wielkości z unikalnymi wymaganiami",
    featureBadge: "Rozwiązania niestandardowe",
    features: {
      freeSocialSetup:
        "Konfiguracja kont społecznościowych wliczona jeśli jeszcze ich nie masz",
      posts: "Nieograniczone treści na wszystkich platformach",
      creativeTeam: "Zespół contentowy na wyłączność",
      onSiteProduction: "Opcje produkcji na miejscu",
      bottomNote:
        "Niestandardowe rozwiązania zarówno dla małych, jak i dużych firm.",
    },
    cta: "Rozpocznij teraz",
  },
};
