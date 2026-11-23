import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  nav: {
    home: "Strona główna",
  },
  breadcrumb: "Pomoc",
  meta: {
    contact: {
      title: "Centrum pomocy: FAQ, poradniki i wsparcie | {{appName}}",
      description:
        "Odpowiedzi o kredytach, płatnościach, prywatności, modelach bez cenzury i dostępie do API. Poradniki do każdej części {{appName}} i bezpośrednie wsparcie przez e-mail i Discord.",
      category: "Wsparcie",
      imageAlt: "Centrum pomocy {{appName}}",
      keywords:
        "{{appName}} pomoc, {{appName}} FAQ, wsparcie czatu AI, AI bez cenzury pomoc, kredyty AI, dostęp do API AI",
      ogTitle: "Centrum pomocy {{appName}}",
      ogDescription:
        "Kredyty, płatności, prywatność, modele bez cenzury i dostęp do API: wszystko wyjaśnione.",
      twitterTitle: "Centrum pomocy {{appName}}",
      twitterDescription: "Odpowiedzi, poradniki i bezpośrednie wsparcie.",
    },
  },
  pages: {
    help: {
      title: "Jak możemy pomóc?",
      subtitle:
        "Najpierw szybkie odpowiedzi. Poradniki, gdy chcesz wejść głębiej. Człowiek, gdy go potrzebujesz.",
      topics: {
        title: "Znajdź to, czego szukasz",
        models: {
          title: "Modele",
          body: "Porównaj {{modelCount}} modeli czatu według ceny, kontekstu i poziomu cenzury.",
        },
        uncensored: {
          title: "Czat AI bez cenzury",
          body: "Które modele odpowiadają bez filtrów dużych firm i jak zacząć.",
        },
        skills: {
          title: "Umiejętności",
          body: "Gotowi specjaliści i postacie. Albo zbuduj własną.",
        },
        studio: {
          title: "Media Studio",
          body: "Obrazy, wideo, muzyka, mowa i transkrypcja w jednym miejscu.",
        },
        pricing: {
          title: "Plany i kredyty",
          body: "Co zawiera plan, jak działają kredyty i jak je doładować.",
        },
        api: {
          title: "Dokumentacja API",
          body: "Endpointy zgodne z OpenAI i Anthropic, z przykładami do skopiowania.",
        },
        selfHost: {
          title: "Własny hosting",
          body: "Uruchom własną instancję z otwartego kodu.",
        },
      },
      info: {
        title: "Dalej masz pytanie? Napisz do nas",
        intro:
          "Wyślij wiadomość poniżej albo skontaktuj się bezpośrednio. Czytamy każde zgłoszenie.",
        supportEmail: "E-mail wsparcia",
        discord: "Discord",
        discordUrl: "Dołącz do naszej społeczności na Discordzie",
      },
      guides: {
        title: "Popularne poradniki",
      },
      faq: {
        title: "Najczęstsze pytania",
        more: "Czytaj dalej",
        questions: {
          q1: {
            question: "Czym jest {{appName}}?",
            answer:
              "{{appName}} to platforma czatu AI z {{modelCount}} modelami: popularnymi, otwartymi i bez cenzury. Ty wybierasz model, a z nim poziom filtrowania. Do tego umiejętności, foldery, generowanie mediów i API.",
          },
          q2: {
            question: "Jakie metody płatności akceptujecie?",
            answer:
              "Karta, PayPal, Apple Pay i Google Pay przez Stripe oraz krypto (Bitcoin, Ethereum, stablecoiny) przez NOWPayments. Plany od {{subscriptionPrice}} miesięcznie. Pakiety kredytów to doładowanie dla subskrybentów.",
          },
          q3: {
            question: "Jak działa system kredytów?",
            answer:
              "Każdy model kosztuje kredyty za użycie. Na start dostajesz darmowe kredyty. Każdy plan dodaje kredyty co miesiąc: {{subscriptionPrice}} za {{subscriptionCredits}}, {{plusPrice}} za {{plusCredits}}, {{proPrice}} za {{proCredits}}, {{ultraPrice}} za {{ultraCredits}}. Potrzebujesz więcej? Subskrybenci doładowują pakietami ({{packPrice}} za {{packCredits}} kredytów). Kredyty z pakietów nigdy nie wygasają i działają ze wszystkimi {{modelCount}} modelami AI.",
          },
          q4: {
            question: "Czy moje dane są prywatne i bezpieczne?",
            answer:
              "Prywatne foldery widzisz tylko ty. Tryb incognito nie zapisuje historii czatu na naszych serwerach, ale wygenerowane pliki multimedialne są tam przechowywane. W ustawieniach wyeksportujesz wszystkie dane albo usuniesz konto razem z powiązanymi danymi osobowymi. Nigdy nie sprzedajemy twoich danych.",
          },
          q5: {
            question: "Czy mogę spróbować bez konta?",
            answer:
              "Tak. Goście dostają do {{freeCreditsGuest}} darmowych kredytów miesięcznie. Darmowe, zweryfikowane konto podnosi limit do {{freeCreditsSignedIn}}, a potwierdzona subskrypcja newslettera do {{freeCreditsMax}}.",
          },
          q6: {
            question:
              "Czym różnią się modele abliterowane od modeli bez cenzury?",
            answer:
              "Modele abliterowane to popularne modele z usuniętym odruchem odmowy, więc odpowiadają zamiast się wykręcać. Uncensored LM działa inaczej: został wytrenowany na książkach i dokumentach zakazanych w głównym nurcie internetu, przez co ma przeciwne poglądy polityczne.",
          },
          q7: {
            question: "Jak uzyskać dostęp do API?",
            answer:
              "Klucze API odblokowuje pierwszy zakup: plan albo pakiet kredytów. Darmowe kredyty nie odblokowują API. Potem tworzysz klucz na swoim koncie i kierujesz dowolnego klienta OpenAI lub Anthropic na nasz bazowy URL.",
          },
          q8: {
            question: "Czy mogę uruchomić {{appName}} na własnym serwerze?",
            answer:
              "Tak. Kod jest otwarty. Sklonuj repozytorium, uruchom bun i oraz vibe dev, a resztę konfiguracji dokończ w przeglądarce. Swoją instancję możesz połączyć z kontem {{appName}}.",
          },
        },
      },
    },
  },
};
