import { translations as componentsTranslations } from "../../_components/i18n/pl";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  components: componentsTranslations,
  nav: {
    home: "Strona główna",
  },
  meta: {
    contact: {
      title: "Kontakt i wsparcie - {{appName}}",
      description:
        "Uzyskaj pomoc z {{appName}} - platforma czatu AI bez cenzury. Skontaktuj się z naszym zespołem wsparcia.",
      category: "Wsparcie",
      imageAlt: "Wsparcie {{appName}}",
      keywords: "kontakt, wsparcie, pomoc, {{appName}}, czat ai, pomoc",
      ogTitle: "Skontaktuj się z wsparciem {{appName}}",
      ogDescription: "Uzyskaj pomoc w korzystaniu z czatu AI bez cenzury",
      twitterTitle: "Skontaktuj się z {{appName}}",
      twitterDescription: "Skontaktuj się z naszym zespołem wsparcia",
    },
  },
  pages: {
    help: {
      title: "Jak możemy Ci pomóc?",
      subtitle:
        "Uzyskaj wsparcie dla swojego doświadczenia z czatem AI bez cenzury lub znajdź odpowiedzi na często zadawane pytania",
      faq: {
        title: "Najczęściej zadawane pytania",
        questions: {
          q1: {
            question: "Czym jest {{appName}}?",
            answer:
              "{{appName}} to platforma czatu AI bez cenzury z dostępem do {{modelCount}} modeli AI. Łączymy szczere rozmowy z AI z zaawansowanymi funkcjami, takimi jak zarządzanie folderami, niestandardowe persony i obsługa wielu modeli.",
          },
          q2: {
            question: "Jakie metody płatności akceptujecie?",
            answer:
              "Akceptujemy karty kredytowe przez Stripe oraz płatności kryptowalutowe (Bitcoin, Ethereum, stablecoiny) przez NowPayments. Wybierz między subskrypcją {{subPrice}}/miesiąc ({{subCredits}} kredytów/miesiąc) lub pakietami kredytowymi {{packPrice}} ({{packCredits}} kredytów każdy, wymaga subskrypcji).",
          },
          q3: {
            question: "Jak działa system kredytów?",
            answer:
              "Darmowi użytkownicy otrzymują {{freeCredits}} kredytów/miesiąc. Płatni użytkownicy mogą wybrać nieograniczoną subskrypcję ({{subPrice}}/miesiąc) lub pakiety kredytowe pay-as-you-go ({{packPrice}} za {{packCredits}} kredytów). Kredyty nigdy nie wygasają i działają ze wszystkimi 40+ modelami AI.",
          },
          q4: {
            question: "Czy moje dane są prywatne i bezpieczne?",
            answer:
              "Tak! Oferujemy szyfrowanie end-to-end dla prywatnych folderów, tryb incognito dla czatów tylko w sesji i pełną zgodność z RODO. Twoje rozmowy należą do Ciebie - nigdy nie sprzedajemy Twoich danych.",
          },
        },
      },
    },
  },
};
