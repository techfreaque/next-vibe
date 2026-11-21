import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Unzensierter KI-Chat im Browser",
  metaTitle: "Unzensierter KI-Chat ohne Anmeldung | {{appName}}",
  description:
    "Teste einen unzensierten KI-Chat im Browser mit Gratis-Credits für Gäste. Vergleiche Kontextfenster und geschätzte Kosten oder chatte direkt los.",
  intro:
    "Starte ohne Konto. Such dir ein Chatmodell für deine Frage aus oder teste das Modell mit den niedrigsten geschätzten Kosten pro Gesprächsrunde.",
  tryModel: "{{model}} ausprobieren",
  chooseModel: "Chatmodelle vergleichen",
  choose:
    "Für kurze Fragen findest du die günstigsten Modelle oben in der Liste. Wähle für lange Dokumente oder Gespräche ein größeres Kontextfenster, damit das Modell mehr Text auf einmal verarbeiten kann.",
  start:
    "Öffne den Chat mit dem gewünschten Modell. Bestätige bei Aufforderung, dass du mindestens 18 bist, und akzeptiere die Bedingungen. Ersetze dann die Beispielfrage durch deine eigene.",
  models: "Chatmodell auswählen",
  order:
    "Die günstigste Schätzung steht zuerst. Grundlage sind {{input}} Eingabe- und {{output}} Ausgabetoken beim jeweils günstigsten verfügbaren Anbieter. Längere Gespräche können mehr kosten.",
  empty:
    "Auf dieser Instanz ist derzeit kein unzensiertes Chatmodell verfügbar.",
  context: "Kontextfenster: {{tokens}} Token",
  price: "Geschätzte Credits pro Gesprächsrunde: {{credits}}",
  chat: "Mit {{model}} chatten",
  questions: "Vor dem ersten Chat",
  faq: {
    access: {
      q: "Kann ich einen unzensierten KI-Chat kostenlos testen?",
      a: "Als Gast kannst du bis zu {{credits}} Gratis-Credits pro Monat erhalten. Wie viele Nachrichten du damit senden kannst, hängt vom Modell und von der Gesprächslänge ab.",
    },
    outOfCredits: {
      q: "Was passiert, wenn meine Gratis-Credits als Gast aufgebraucht sind?",
      a: "Du kannst bis zum nächsten Monat warten oder ein kostenloses Konto anlegen und deine E-Mail-Adresse bestätigen. Mit bestätigter Adresse kannst du bis zu {{credits}} Gratis-Credits pro Monat erhalten. Was du im selben Monat als Gast verbraucht hast, zählt mit.",
    },
    filters: {
      q: "Was bedeutet KI-Chat ohne Filter hier?",
      a: "Du wählst ein Modell aus der Kategorie „Unzensiert“. Gängige Modelle wie GPT behalten ihre eigenen Filter. Auch ein unzensiertes Modell kann eine Anfrage ablehnen oder falsch antworten.",
    },
    local: {
      q: "Brauche ich für diese Modelle eine Grafikkarte?",
      a: "Ein Browser und eine Internetverbindung reichen. Der Anbieter verarbeitet deine Anfrage. Soll das Modell vollständig auf deinem Rechner laufen, brauchst du eine lokale Installation.",
    },
  },
  guides: "Modelle und Plattformen vergleichen",
  abliteratedChat: "Ein Modell mit Abliteration im Chat testen",
  abliteration: "Was Abliteration bei einem Sprachmodell verändert",
  compare: "Plattformen für unzensierten KI-Chat vergleichen",
  benchmark: "Antworten verschiedener Modelle auf dieselben Testfragen ansehen",
};
