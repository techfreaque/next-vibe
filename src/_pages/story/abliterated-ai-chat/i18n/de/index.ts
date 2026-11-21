import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Abliterierte KI-Modelle online testen",
  metaTitle: "Abliterierte KI-Modelle online testen | {{appName}}",
  description:
    "Vergleiche abliterierte LLMs nach Kontextfenster und geschätzten Kosten. Teste sie im Browser und vergleiche sie mit dem Basismodell, sofern verfügbar.",
  intro:
    "Teste Modelle, die so angepasst wurden, dass sie seltener Anfragen ablehnen. Wähle eins aus und öffne einen Browser-Chat mit genau diesem Modell.",
  models: "Verfügbare abliterierte Modelle",
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
  questions: "Häufige Fragen",
  faq: {
    meaning: {
      q: "Was ist ein abliteriertes LLM?",
      a: "Bei der Abliteration werden Modellgewichte verändert, um Muster abzuschwächen, die mit Ablehnungen zusammenhängen. Für die Modelle in dieser Liste ist das Verfahren in unserem Katalog dokumentiert. Jedes verfügbare Modell kannst du im Browser testen.",
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
  methodGuide: "Was Abliteration von anderen Methoden unterscheidet",
  allModels: "Alle unzensierten Chatmodelle ansehen",
};
