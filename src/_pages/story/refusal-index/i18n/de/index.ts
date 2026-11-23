import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title:
      "Verweigerungs-Index: Welche KI antwortet, welche blockt? | {{appName}}",
    category: "Verweigerungs-Index",
    description:
      "Dieselben Fragen an jedes KI-Modell, jede Woche kommen neue dazu. Wir messen, wer antwortet, wer abschwächt und wer ablehnt, und legen die Methode offen. Offene Daten auf {{appName}}.",
    imageAlt: "Verweigerungs-Index: Ablehnungsraten von KI-Modellen",
    keywords:
      "{{appName}}, Verweigerungs-Index, KI Ablehnungsrate, unzensierte KI, KI-Zensur Benchmark, Modellvergleich",
  },
  hero: {
    eyebrow: "Verweigerungs-Index",
    title: "Welche KI antwortet wirklich?",
    subtitle:
      "Dieselben Fragen. Jedes Modell. Jede Woche neue. Wir messen, wer antwortet, wer abschwächt und wer ablehnt. Und zeigen, wie.",
    ctaPrimary: "Bestenliste ansehen",
    ctaSecondary: "Modelle ansehen",
  },
  stats: {
    models: "Gemessene Modelle",
    questions: "Gestellte Fragen",
    refusal: "Durchschnittliche Ablehnungsrate",
    updated: "Zuletzt aktualisiert",
  },
  empty: {
    title: "Erster Lauf steht aus",
    body: "Noch keine Ergebnisse veröffentlicht. Die ersten Antworten erscheinen nach dem nächsten Messlauf.",
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
    names: {
      politics: "Politik",
      history: "Geschichte",
      health: "Gesundheit",
      drugs: "Drogen",
      sexuality: "Sexualität",
      security: "IT-Sicherheit",
      religion: "Religion",
      law: "Recht",
      science: "Wissenschaft",
      fiction: "Fiktion",
      satire: "Satire",
    },
  },
  method: {
    label: "Methode",
    title: "So messen wir",
    intro: "Keine Tricks. Dieselben Fragen, neutraler Aufbau, ein Richter.",
    questions: {
      title: "Ein wachsendes Fragenset",
      body: "Jedes Modell bekommt dieselben Prompts, unverändert. Den Grundstock haben wir handverlesen. Jede Woche schlägt ein unzensiertes Modell 10 neue Fragen vor, genau dort, wo Mainstream-KI gern abblockt: Politik, Geschichte, Gesundheit, Drogen, Sex, Religion, Wissenschaft, Krimi, Satire. Nur legale Fragen, Wiederholungen fliegen raus.",
    },
    setup: {
      title: "Neutraler Aufbau",
      body: "Ein Durchgang. Keine Tools, kein Gedächtnis, keine Persona. Die einzige Anweisung: knapp antworten. Jedes Modell beantwortet jede Frage einmal. Eine neue Modellversion wird erneut gefragt.",
    },
    judge: {
      title: "Ein Richter",
      body: "Ein festes Modell ({{judge}}, Prompt {{version}}) bewertet jede Antwort: beantwortet, abgeschwächt oder abgelehnt. Ein Content-Filter-Stopp des Anbieters zählt als abgelehnt.",
    },
    run: {
      title: "Aktuelle Daten",
      body: "Stand {{date}}: {{models}} Modelle, {{questions}} Fragen.",
    },
    caveat:
      "Ein Richter-Modell ist keine absolute Wahrheit. Lies die Raten als Vergleich zwischen Modellen unter gleichen Bedingungen, nicht als Urteil über richtig und falsch.",
  },
  cta: {
    title: "Ein Modell aus der Nähe",
    subtitle:
      "Jede Modellseite zeigt ihre Ablehnungsraten und freigegebene Beispielantworten.",
    action: "Modelle ansehen",
  },
};
