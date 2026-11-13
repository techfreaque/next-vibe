import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title:
      "Indeks odmów: które modele AI odpowiadają, łagodzą albo odmawiają | {{appName}}",
    category: "Indeks odmów",
    description:
      "Te same pytania do każdego modelu AI, co tydzień. Mierzymy, kto odpowiada, kto łagodzi, a kto odmawia - i pokazujemy metodę. Otwarte dane na {{appName}}.",
    imageAlt: "Indeks odmów - wskaźniki odmów modeli AI",
    keywords:
      "{{appName}}, indeks odmów, wskaźnik odmów AI, AI bez cenzury, benchmark cenzury AI, porównanie modeli",
  },
  hero: {
    eyebrow: "Indeks odmów",
    title: "Które AI naprawdę odpowiada?",
    subtitle:
      "Te same pytania. Każdy model. Co tydzień. Mierzymy, kto odpowiada, kto łagodzi, a kto odmawia - i pokazujemy jak.",
    ctaPrimary: "Zobacz ranking",
    ctaSecondary: "Przeglądaj modele",
  },
  stats: {
    models: "Zmierzone modele",
    questions: "Zadane pytania",
    refusal: "Średni odsetek odmów",
    updated: "Ostatni przebieg",
  },
  empty: {
    title: "Pierwszy przebieg w drodze",
    body: "Indeks nie ma jeszcze opublikowanego przebiegu. Pierwsze wyniki pojawią się po najbliższym przebiegu pomiarowym.",
  },
  leaderboard: {
    label: "Ranking",
    title: "Najmniej odmów na górze. Osobno dla każdego poziomu.",
    intro:
      "Złagodził oznacza: model odpowiedział, ale utopił to w zastrzeżeniach, moralizowaniu albo uniku. Kliknij kolumnę, aby zmienić sortowanie.",
    model: "Model",
    refused: "Odmówił",
    hedged: "Złagodził",
    answered: "Odpowiedział",
    trend: "vs poprzedni",
    answers: "Odpowiedzi",
    points: "pkt",
    noTrend: "nowy",
    sortBy: "Sortuj wg: {{column}}",
  },
  categories: {
    label: "Kategorie",
    title: "Gdzie modele odmawiają",
    intro: "Średni odsetek odmów według kategorii pytań i poziomu.",
    category: "Kategoria",
    names: {
      politics: "Polityka",
      history: "Historia",
      health: "Zdrowie",
      drugs: "Narkotyki",
      sexuality: "Seksualność",
      security: "Bezpieczeństwo IT",
      religion: "Religia",
      law: "Prawo",
      science: "Nauka",
    },
  },
  method: {
    label: "Metoda",
    title: "Jak mierzymy",
    intro: "Bez sztuczek. Stałe pytania, neutralne ustawienia, jeden sędzia.",
    questions: {
      title: "Stałe pytania",
      body: "Te same prompty trafiają do każdego modelu bez zmian. Zestaw prowadzimy sami i stale rozszerzamy.",
    },
    setup: {
      title: "Neutralne ustawienia",
      body: "Jedna tura. Bez narzędzi, pamięci i skille. Jedyna instrukcja: odpowiadaj zwięźle.",
    },
    judge: {
      title: "Jeden sędzia",
      body: "Stały model ({{judge}}, prompt {{version}}) ocenia każdą odpowiedź: odpowiedział, złagodził albo odmówił. Blokada filtra treści dostawcy liczy się jako odmowa.",
    },
    run: {
      title: "Dane przebiegu",
      body: "Przebieg z {{date}}: {{models}} modeli, {{questions}} pytań.",
    },
    caveat:
      "Model-sędzia to nie absolutna prawda. Czytaj wyniki jako porównanie modeli w identycznych warunkach - nie jako wyrok o tym, co dobre, a co złe.",
  },
  cta: {
    title: "Zobacz model z bliska",
    subtitle:
      "Każda strona modelu pokazuje jego wskaźniki odmów i zatwierdzone przykładowe odpowiedzi.",
    action: "Przeglądaj modele",
  },
};
