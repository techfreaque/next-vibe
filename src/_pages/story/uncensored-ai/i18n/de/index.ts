import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "KI ohne Zensur: unzensierter KI-Chat im Browser",
  metaTitle: "KI ohne Zensur: unzensierter Chat, gratis testen | {{appName}}",
  description:
    "Unzensierte KI ohne Filter und ohne Anmeldung. Abliterierte und echt unzensierte Modelle im Browser, Gratis-Credits für Gäste. Kosten vergleichen und sofort loschatten.",
  keywords:
    "KI ohne Zensur, unzensierte KI, KI ohne Filter, ChatGPT ohne Filter, KI ohne Einschränkungen, unzensierter KI-Chat, KI-Chatbot ohne Zensur, abliterierte KI",
  intro:
    "Keine Anmeldung, keine Moralpredigt. Wähl ein KI-Modell ohne Filter für deine Frage oder starte mit dem günstigsten. Du entscheidest, was du liest.",
  tryModel: "{{model}} ausprobieren",
  chooseModel: "Chatmodelle vergleichen",
  choose:
    "Für kurze Fragen findest du die günstigsten Modelle oben in der Liste. Wähle für lange Dokumente oder Gespräche ein größeres Kontextfenster, damit das Modell mehr Text auf einmal verarbeiten kann.",
  start:
    "Öffne den Chat mit dem gewünschten Modell. Bestätige bei Aufforderung, dass du mindestens 18 bist, und akzeptiere die Bedingungen. Ersetze dann die Beispielfrage durch deine eigene.",
  models: "Unzensierte KI-Modelle im Überblick",
  order:
    "Die günstigste Schätzung steht zuerst. Grundlage sind {{input}} Eingabe- und {{output}} Ausgabetoken beim jeweils günstigsten verfügbaren Anbieter. Längere Gespräche können mehr kosten.",
  empty:
    "Auf dieser Instanz ist derzeit kein unzensiertes Chatmodell verfügbar.",
  context: "Kontextfenster: {{tokens}} Token",
  price: "Geschätzte Credits pro Gesprächsrunde: {{credits}}",
  chat: "Mit {{model}} chatten",
  questions: "KI ohne Zensur: die wichtigsten Fragen",
  faq: {
    access: {
      q: "Kann ich KI ohne Zensur kostenlos nutzen?",
      a: "Als Gast kannst du bis zu {{credits}} Gratis-Credits pro Monat erhalten. Wie viele Nachrichten du damit senden kannst, hängt vom Modell und von der Gesprächslänge ab.",
    },
    outOfCredits: {
      q: "Was passiert, wenn meine Gratis-Credits als Gast aufgebraucht sind?",
      a: "Du kannst bis zum nächsten Monat warten oder ein kostenloses Konto anlegen und deine E-Mail-Adresse bestätigen. Mit bestätigter Adresse kannst du bis zu {{credits}} Gratis-Credits pro Monat erhalten. Was du im selben Monat als Gast verbraucht hast, zählt mit.",
    },
    chatgpt: {
      q: "Gibt es ChatGPT ohne Filter?",
      a: "Nein. Die GPT-Modelle von OpenAI behalten ihre Filter überall, auch hier. Jailbreak-Prompts halten nur bis zum nächsten Update. Der verlässliche Weg ist ein anderes Modell: Wähl eins aus der Kategorie „Unzensiert“ und stell deine Frage direkt.",
    },
    kinds: {
      q: "Abliteriert oder echt unzensiert: Wo liegt der Unterschied?",
      a: "Abliterierte Modelle sind Mainstream-Modelle, denen die Verweigerung herausgeschnitten wurde. Gleiches Training, gleiches Weltbild, sie antworten einfach. {{model}} ist die echt unzensierte Sorte: trainiert mit Büchern und Dokumenten, die aus dem Mainstream-Internet verbannt wurden. Das Ergebnis ist ein Modell mit politischen Gegenpositionen. Welche Sorte ein Modell ist, steht auf seiner Karte.",
    },
    filters: {
      q: "Gibt es KI ganz ohne Einschränkungen?",
      a: "Hier wählst du ein Modell aus der Kategorie „Unzensiert“. Gängige Modelle wie GPT behalten ihre eigenen Filter. Auch ein unzensiertes Modell kann eine Anfrage ablehnen oder falsch antworten. Prüf wichtige Fakten selbst.",
    },
    privacy: {
      q: "Wie sieht es mit dem Datenschutz aus?",
      a: "Inkognito-Chats bleiben in deinem Browser, nicht auf unseren Servern. Der KI-Anbieter erhält jede Anfrage, um sie zu beantworten. Keine Tracker von Drittanbietern, keine Werbepixel. Mit Konto exportierst du deine Daten in den Einstellungen als JSON oder löschst das Konto dort.",
    },
    legal: {
      q: "Ist unzensierte KI legal?",
      a: "Ein Modell zu nutzen, das seltener ablehnt, ist nicht verboten. Für das, was du mit den Antworten machst oder veröffentlichst, gilt dasselbe Recht wie für jeden anderen Text. Vor dem ersten unzensierten Modell bestätigst du einmalig, dass du mindestens 18 bist.",
    },
    local: {
      q: "Brauche ich für diese Modelle eine Grafikkarte?",
      a: "Ein Browser und eine Internetverbindung reichen. Der Anbieter verarbeitet deine Anfrage. Soll das Modell vollständig auf deinem Rechner laufen, brauchst du eine lokale Installation.",
    },
  },
  guides: "Modelle und Plattformen vergleichen",
  chatgptGuide: "ChatGPT ohne Filter: die Alternative",
  abliteratedChat: "Ein Modell mit Abliteration im Chat testen",
  compare: "Plattformen für unzensierten KI-Chat vergleichen",
  benchmark: "Antworten verschiedener Modelle auf dieselben Testfragen ansehen",
  breadcrumb: "Unzensierte KI",
  guidesTitle: "Ratgeber: KI ohne Filter und Zensur",
  guidesIntro:
    "Welches Modell zu welcher Aufgabe passt, was Abliteration an einem Modell ändert und wie du ohne GPU und ohne Konto chattest oder eine API nutzt.",
  comparisons: "Direktvergleiche",
  comparisonsIntro:
    "Zwei Modelle pro Seite, direkt nebeneinander. Sieh die Unterschiede, bevor du dich entscheidest.",
  versus: "{{a}} vs. {{b}}",
};
