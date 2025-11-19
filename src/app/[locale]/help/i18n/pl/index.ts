import type { translations as enTranslations } from "../en";
import { translations as contactTranslations } from "@/app/api/[locale]/v1/core/contact/i18n/pl";

export const translations: typeof enTranslations = {
  contact: contactTranslations,
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
              "Akceptujemy karty kredytowe przez Stripe oraz płatności kryptowalutowe (Bitcoin, Ethereum, stablecoiny) przez NowPayments. Subskrypcja {{subPrice}}/miesiąc zawiera {{subCredits}} kredytów/miesiąc. Możesz również kupić pakiety kredytowe ({{packPrice}} za {{packCredits}} kredytów), jeśli potrzebujesz więcej kredytów. Pakiety kredytowe nigdy nie wygasają, nawet po zakończeniu subskrypcji.",
          },
          q3: {
            question: "Jak działa system kredytów?",
            answer:
              "Potrzebujesz subskrypcji {{subPrice}}/miesiąc, aby uzyskać dostęp do czatu AI, która zawiera {{subCredits}} kredytów/miesiąc. Jeśli potrzebujesz więcej kredytów, możesz kupić pakiety kredytowe ({{packPrice}} za {{packCredits}} kredytów). Pakiety kredytowe nigdy nie wygasają, nawet po zakończeniu subskrypcji, więc działają ze wszystkimi {{modelCount}} modelami AI, gdy ponownie aktywujesz konto.",
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
