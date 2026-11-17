import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
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
      info: {
        title: "Informacje kontaktowe",
        supportEmail: "E-mail wsparcia",
        discord: "Discord",
        discordUrl: "Dołącz do naszego Discorda",
      },
      faq: {
        title: "Najczęściej zadawane pytania",
        questions: {
          q1: {
            question: "Co to jest {{appName}}?",
            answer:
              "{{appName}} to platforma czatu AI bez cenzury z dostępem do {{modelCount}} modeli AI. Łączymy uczciwe rozmowy AI z zaawansowanymi funkcjami, takimi jak zarządzanie folderami, niestandardowe skille i wsparcie wielu modeli.",
          },
          q2: {
            question: "Jakie metody płatności akceptujecie?",
            answer:
              "Karta, PayPal, Apple Pay i Google Pay przez Stripe, do tego krypto (Bitcoin, Ethereum, stablecoiny) przez NOWPayments. Plany od {{subscriptionPrice}} miesięcznie. Pakiety kredytów to doładowanie dla subskrybentów.",
          },
          q3: {
            question: "Jak działa system kredytowy?",
            answer:
              "Każdy model kosztuje kredyty za użycie. Na start dostajesz darmowe kredyty. Każdy plan dodaje kredyty co miesiąc: {{subscriptionPrice}} za {{subscriptionCredits}}, {{plusPrice}} za {{plusCredits}}, {{proPrice}} za {{proCredits}}, {{ultraPrice}} za {{ultraCredits}}. Potrzebujesz więcej? Subskrybenci dokupują pakiety kredytów ({{packPrice}} za {{packCredits}} kredytów). Kredyty z pakietów nigdy nie wygasają i działają ze wszystkimi {{modelCount}} modelami AI.",
          },
          q4: {
            question: "Czy moje dane są prywatne i bezpieczne?",
            answer:
              "Tak! Prywatne foldery widzisz tylko Ty, tryb incognito trzyma czaty poza naszymi serwerami (wygenerowane media przechowujemy tymczasowo ze względów technicznych), a w ustawieniach możesz wyeksportować wszystkie swoje dane lub usunąć konto wraz z powiązanymi danymi osobowymi. Twoje rozmowy są Twoje - nigdy nie sprzedajemy Twoich danych. Szyfrowanie end-to-end już wkrótce.",
          },
        },
      },
    },
  },
};
