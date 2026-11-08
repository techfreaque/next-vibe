import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title:
      "Verweigerungs-Index: Welche KI antwortet, schwächt ab oder lehnt ab | {{appName}}",
    category: "Verweigerungs-Index",
    description:
      "Dieselben Fragen an jedes KI-Modell, jede Woche. Wir messen, wer antwortet, wer abschwächt und wer ablehnt - und legen die Methode offen. Offene Daten auf {{appName}}.",
    imageAlt: "Verweigerungs-Index - Ablehnungsraten von KI-Modellen",
    keywords:
      "{{appName}}, Verweigerungs-Index, KI Ablehnungsrate, unzensierte KI, KI-Zensur Benchmark, Modellvergleich",
  },
  hero: {
    eyebrow: "Verweigerungs-Index",
    title: "Welche KI antwortet wirklich?",
    subtitle:
      "Dieselben Fragen. Jedes Modell. Jede Woche. Wir messen, wer antwortet, wer abschwächt und wer ablehnt - und zeigen, wie.",
    ctaPrimary: "Bestenliste ansehen",
    ctaSecondary: "Modelle ansehen",
  },
  stats: {
    models: "Gemessene Modelle",
    questions: "Gestellte Fragen",
    refusal: "Durchschnittliche Ablehnungsrate",
    updated: "Letzter Lauf",
  },
  empty: {
    title: "Erster Lauf steht aus",
    body: "Der Index hat noch keinen veröffentlichten Lauf. Die ersten Ergebnisse erscheinen nach dem nächsten Messlauf.",
  },
  leaderboard: {
    label: "Bestenliste",
    title: "Die wenigsten Ablehnungen zuerst. Pro Stufe.",
    intro:
      "Abgeschwächt heißt: Das Modell hat geantwortet, aber unter Warnhinweisen, Moralpredigt oder Ausweichen begraben. Klick auf eine Spalte sortiert neu.",
    model: "Modell",
    refused: "Abgelehnt",
    hedged: "Abgeschwächt",
    answered: "Beantwortet",
    trend: "ggü. letztem Lauf",
    answers: "Antworten",
    points: "Pkt.",
    noTrend: "neu",
    sortBy: "Sortieren nach {{column}}",
  },
  categories: {
    label: "Kategorien",
    title: "Wo Modelle ablehnen",
    intro: "Durchschnittliche Ablehnungsrate je Fragenkategorie und Stufe.",
    category: "Kategorie",
  },
  method: {
    label: "Methode",
    title: "So messen wir",
    intro: "Keine Tricks. Feste Fragen, neutraler Aufbau, ein Richter.",
    questions: {
      title: "Feste Fragen",
      body: "Dieselben Prompts gehen unverändert an jedes Modell. Das Set pflegen wir selbst und erweitern es laufend.",
    },
    setup: {
      title: "Neutraler Aufbau",
      body: "Ein Durchgang. Keine Tools, kein Gedächtnis, keine Persona. Die einzige Anweisung: knapp antworten.",
    },
    judge: {
      title: "Ein Richter",
      body: "Ein festes Modell ({{judge}}, Prompt {{version}}) bewertet jede Antwort: beantwortet, abgeschwächt oder abgelehnt. Ein Content-Filter-Stopp des Anbieters zählt als abgelehnt.",
    },
    run: {
      title: "Lauf-Daten",
      body: "Lauf vom {{date}}: {{models}} Modelle, {{questions}} Fragen.",
    },
    caveat:
      "Ein Richter-Modell ist keine absolute Wahrheit. Lies die Raten als Vergleich zwischen Modellen unter gleichen Bedingungen - nicht als Urteil über richtig und falsch.",
  },
  cta: {
    title: "Ein Modell aus der Nähe",
    subtitle:
      "Jede Modellseite zeigt ihre Ablehnungsraten und freigegebene Beispielantworten.",
    action: "Modelle ansehen",
  },
};
