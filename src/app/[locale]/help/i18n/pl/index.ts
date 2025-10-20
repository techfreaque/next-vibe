import { translations as componentsTranslations } from "../_components/i18n/pl";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  components: componentsTranslations,
  nav: {
    home: "Strona główna",
  },
  meta: {
    contact: {
      title: "Kontakt i wsparcie - Unbottled.ai",
      description:
        "Uzyskaj pomoc z Unbottled.ai - platforma czatu AI bez cenzury. Skontaktuj się z naszym zespołem wsparcia.",
      category: "Wsparcie",
      imageAlt: "Wsparcie Unbottled.ai",
      keywords: "kontakt, wsparcie, pomoc, unbottled, czat ai, pomoc",
      ogTitle: "Skontaktuj się z wsparciem Unbottled.ai",
      ogDescription: "Uzyskaj pomoc w korzystaniu z czatu AI bez cenzury",
      twitterTitle: "Skontaktuj się z Unbottled.ai",
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
            question: "Czym jest Unbottled.ai?",
            answer:
              "Unbottled.ai to platforma czatu AI bez cenzury z dostępem do ponad 40 modeli AI. Łączymy szczere rozmowy z AI z zaawansowanymi funkcjami, takimi jak zarządzanie folderami, niestandardowe persony i obsługa wielu modeli.",
          },
          q2: {
            question: "Jakie metody płatności akceptujecie?",
            answer:
              "Akceptujemy karty kredytowe przez Stripe oraz płatności kryptowalutowe (Bitcoin, Ethereum, stablecoiny) przez NowPayments. Wybierz między subskrypcją €10/miesiąc lub pakietami kredytowymi €5.",
          },
          q3: {
            question: "Jak działa system kredytów?",
            answer:
              "Darmowi użytkownicy otrzymują 10 wiadomości/dzień. Płatni użytkownicy mogą wybrać nieograniczoną subskrypcję (€10/miesiąc) lub pakiety kredytowe pay-as-you-go (€5). Kredyty nigdy nie wygasają i działają ze wszystkimi modelami AI.",
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
