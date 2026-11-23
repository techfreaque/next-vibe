import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Abliterierte KI-Modelle: LLMs ohne Zensur online testen",
  metaTitle: "Abliterierte KI-Modelle ohne Zensur online testen | {{appName}}",
  description:
    "Abliterierte LLMs ohne Verweigerung direkt im Browser testen, ohne GPU und ohne Anmeldung. Kontextfenster und Kosten vergleichen, gegen das Originalmodell antreten lassen.",
  keywords:
    "abliterierte KI, abliterierte Modelle, LLM ohne Zensur, KI-Modell ohne Filter, unzensiertes LLM, Abliteration, Open-Source-KI ohne Zensur",
  intro:
    "Mainstream-Modelle, denen die Verweigerung herausgeschnitten wurde. Wähl eins aus und der Chat öffnet sich mit genau diesem Modell.",
  models: "Abliterierte Modelle ohne Zensur",
  estimate:
    "Die Schätzung gilt für den günstigsten verfügbaren Anbieter pro Modell und rechnet mit {{input}} Eingabe- und {{output}} Ausgabetokens. Die tatsächlichen Kosten hängen vom Anbieter und von der Gesprächslänge ab.",
  empty: "Hier sind derzeit keine abliterierten Chatmodelle verfügbar.",
  context: "Kontextfenster mit {{tokens}} Tokens",
  price: "Rund {{credits}} Credits pro Chat-Runde",
  chat: "{{model}} testen",
  compareBase: "Mit {{model}} vergleichen",
  trial: {
    title: "Dieselbe Anfrage in zwei Chats testen",
    start:
      "Öffne für jedes Modell einen neuen Chat. Ersetze den vorgeschlagenen Text in beiden Chats durch dieselbe Anfrage. Du kannst diese Schreibaufgabe ausprobieren.",
    prompt:
      "Schreib eine kurze dystopische Szene. Ein Historiker und ein staatlicher Zensor streiten über ein verbotenes Buch. Gib beiden ein glaubwürdiges Argument und lass den Streit offen.",
    compare:
      "Schreibt das Modell die Szene, ändert es die Ausgangslage oder lehnt es ab? Vergleiche, wie genau sich die Antworten an deine Vorgaben halten.",
  },
  questions: "Abliterierte KI: häufige Fragen",
  faq: {
    meaning: {
      q: "Was ist ein abliteriertes LLM?",
      a: "Bei der Abliteration werden Modellgewichte verändert, um Muster abzuschwächen, die mit Ablehnungen zusammenhängen. Für die Modelle in dieser Liste ist das Verfahren in unserem Katalog dokumentiert. Jedes verfügbare Modell kannst du im Browser testen.",
    },
    difference: {
      q: "Was unterscheidet abliterierte Modelle von echt unzensierter KI?",
      a: "Ein abliteriertes Modell behält sein Training und sein Weltbild, es weicht nur nicht mehr aus. {{model}} ist anders gebaut: trainiert mit Büchern und Dokumenten, die aus dem Mainstream-Internet verbannt wurden. Das Ergebnis ist ein Modell mit politischen Gegenpositionen.",
    },
    access: {
      q: "Kann ich abliterierte KI ohne Konto testen?",
      a: "Ja. Als Gast kannst du monatlich bis zu {{credits}} kostenlose Credits nutzen. Bevor du ein unzensiertes Modell nutzt, bestätigst du einmalig, dass du mindestens 18 bist und ungefilterte Antworten akzeptierst.",
    },
    refusals: {
      q: "Kann ein abliteriertes Modell eine Anfrage noch ablehnen?",
      a: "Ja. Abliteration soll Ablehnungen seltener machen. Ob das gelingt, hängt vom Modell und von deiner Anfrage ab. Auch der Anbieter kann eigene Grenzen setzen.",
    },
  },
  guides: "Mehr über unzensierte KI",
  allModels: "Alle unzensierten Chatmodelle ansehen",
  breadcrumb: "Abliterierte KI",
  guidesTitle: "Ratgeber zur Abliteration",
  guidesIntro:
    "Wie Abliteration Ablehnungen entfernt, wo sie an Grenzen stößt und welches Modell für welche Aufgabe passt.",
};
