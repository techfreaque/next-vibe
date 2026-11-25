import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Unzensierte KI kostenlos: Was gratis wirklich bringt (2026)",
    description:
      "Unzensierte KI kostenlos: Venice, uncensored.ai, FreedomGPT, Gab AI, NanoGPT, OpenRouter, LM Studio, Ollama und {{appName}} im Check. Limits, Filter, Haken.",
    category: "Ratgeber",
    imageAlt: "Kostenlose unzensierte KI im Vergleich",
    keywords:
      "unzensierte KI kostenlos, KI ohne Zensur kostenlos, unzensierte KI gratis, kostenlose KI ohne Filter, unzensierter KI-Chat kostenlos, KI ohne Einschränkungen kostenlos, kostenlose unzensierte KI ohne Anmeldung, unzensierte KI auf Deutsch, {{appName}}",
  },
  hero: {
    backToBlog: "Zurück zum Blog",
    category: "Ratgeber",
    readTime: "8 Min. Lesezeit",
    title: "Unzensierte KI kostenlos. Was gratis wirklich heißt.",
    subtitle:
      "{{count}} Gratis-Angebote und {{appName}}, geprüft an ihren eigenen Preis-, Filter- und Datenschutzseiten. Mit allen Limits, die auf der Startseite fehlen.",
  },
  intro: {
    lead: "Kostenlos und unzensiert: Das versprechen viele. Dann kommt das Tageslimit nach drei Antworten, das Basismodell statt des guten, die Pflicht zur E-Mail-Bestätigung oder ein Download von 40 GB.",
    p2: "Hier steht, was jedes Angebot gratis wirklich hergibt, laut seinen eigenen Seiten (zuletzt geprüft am {{date}}). Offen gesagt: Wir kaufen Modelle bei einigen dieser Anbieter ein und bieten sie in unserem Chat an. Wo sie gratis mehr bieten, sagen wir es.",
  },
  short: {
    title: "Die kurze Antwort",
    intro: "Drei Sätze, bevor du weiterliest.",
    local:
      "Wirklich unbegrenzt kostenlos ist nur lokale KI: Ollama oder LM Studio auf deinem eigenen Rechner. Du zahlst mit Hardware statt mit Geld.",
    hosted:
      "Gehostete unzensierte KI ist gratis immer mit Limit: Antworten pro Tag, Credits pro Monat oder nur ein Basismodell.",
    us: "Bei {{appName}} bekommst du {{guestCredits}} Gratis-Credits im Monat ohne Konto, für alle {{modelCount}} Modelle, die {{uncensored}} unzensierten eingeschlossen.",
  },
  catch: {
    title: "Wo der Haken bei Gratis-KI steckt",
    intro: "Fünf Stellen, an denen kostenlos etwas kostet.",
    limit:
      "Das Limit: Tageskontingente sind oft nach wenigen Nachrichten aufgebraucht. Bei langen Gesprächen zählt jede Antwort.",
    models:
      "Die Modelle: Viele Gratis-Tarife geben dir nur ein Basis- oder Hausmodell. Die starken Modelle stehen hinter dem Abo.",
    account:
      "Das Konto: Manche Angebote verlangen eine bestätigte E-Mail, bevor es Gratis-Credits gibt. Andere starten sofort.",
    data: "Die Daten: Gratis heißt nicht privat. Lies, was protokolliert wird und ob deine Chats zum Training dienen.",
    hardware:
      "Die Hardware: Lokal kostet keine Nachricht etwas, aber gute Modelle brauchen viel Arbeitsspeicher und einen starken Grafikchip.",
    callout:
      "Jedes gehostete Modell sieht deinen Prompt, egal ob gratis oder bezahlt. Nur ein lokales Programm behält ihn auf deinem Gerät.",
  },
  table: {
    title: "Alle Gratis-Angebote im Vergleich",
    intro:
      "Auf dem Handy seitlich scrollen. Fakten der Anbieter auf ihren eigenen Seiten geprüft, das Datum steht bei jedem Eintrag. Fakten zu {{appName}} kommen live aus unserer Konfiguration.",
  },
  us: {
    title: "Was du bei {{appName}} gratis bekommst",
    intro:
      "Ein Chat, {{modelCount}} Modelle, ein Guthaben. Gratis heißt hier: ein festes Kontingent für jedes Modell, nicht nur für das schwächste.",
    guest:
      "Ohne Konto: {{guestCredits}} Gratis-Credits im Monat. Chat öffnen und schreiben, keine E-Mail, keine Handynummer.",
    account:
      "Mit kostenlosem Konto: {{freeCredits}} Credits im Monat, mit Newsletter {{maxCredits}}. Chats werden geräteübergreifend gespeichert.",
    models:
      "Alle Modelle sind dabei: {{uncensored}} unzensierte neben Claude, GPT, Gemini und offenen Modellen. {{ownModel}} ist mit Büchern und Dokumenten trainiert, die im Mainstream-Internet verbannt sind. Das Ergebnis ist ein Modell mit konträren politischen Ansichten.",
    consent:
      "Für unzensierte Modelle bestätigst du einmal, dass du mindestens 18 bist. Danach fragt niemand mehr.",
    after:
      "Wenn die Credits weg sind: bis zum nächsten Monat warten oder einen Tarif ab {{subPrice}} im Monat nehmen.",
    weak: "Wo wir gratis schwächer sind: Credits statt Flatrate. Wie viele Nachrichten dein Kontingent ergibt, hängt vom Modell ab. Jede Modellseite rechnet es dir vor.",
    hubLink: "Alle unzensierten Modelle mit Kontext und Preis",
    ownLink: "{{ownModel}} ansehen",
  },
  list: {
    title: "Die {{count}} Gratis-Angebote im Einzelnen",
    intro:
      "Was jedes Angebot ist, was es gratis gibt, was sein Filter erlaubt und was mit deinen Chats passiert.",
    heading: "{{number}}. {{name}}: {{kind}}",
    free: "Gratis:",
    filter: "Filter:",
    privacy: "Datenschutz:",
    con: "Haken:",
    forWho: "Nimm es, wenn:",
    checked: "Geprüft am {{date}}.",
    versusLink: "{{appName}} vs {{name}}: der ganze Vergleich",
    visit: "{{name}} besuchen",
  },
  local: {
    title: "Lokal: die einzige KI ohne Limit",
    intro: "Ollama und LM Studio laufen auf deinem eigenen Rechner.",
    cost: "Kosten: keine pro Nachricht, kein Tageslimit. Du zahlst einmal für die Hardware und dann für Strom.",
    quality:
      "Qualität: Dein Rechner setzt die Grenze. Kleine Modelle laufen auf fast jedem Laptop, große brauchen viel Grafikspeicher.",
    privacy:
      "Datenschutz: Prompts verlassen dein Gerät nicht. Stärker geht es nicht.",
    link: "Kein starker Rechner? Unzensierte Modelle online, ohne GPU",
  },
  faq: {
    title: "FAQ",
    best: {
      q: "Welche unzensierte KI ist kostenlos am besten?",
      a: "Kommt auf dein Gerät an. Mit starkem Rechner: Ollama oder LM Studio, gratis und ohne Limit. Im Browser: {{appName}} gibt {{guestCredits}} Credits im Monat für alle Modelle, Venice 10 Text-Prompts am Tag auf Basismodellen, uncensored.ai 3 Antworten am Tag.",
    },
    noAccount: {
      q: "Gibt es unzensierte KI kostenlos ohne Anmeldung?",
      a: "Ja. Bei {{appName}} öffnest du den Inkognito-Chat und schreibst, ohne Konto und ohne E-Mail. FreedomGPT startet laut eigener Seite ebenfalls ohne Karte und ohne Konto. Gab AI vergibt Gratis-Credits erst nach bestätigter E-Mail.",
    },
    unlimited: {
      q: "Gibt es unzensierte KI unbegrenzt und kostenlos?",
      a: "Nur lokal. Ollama und LM Studio kosten auf eigener Hardware nichts pro Nachricht. Jeder gehostete Gratis-Tarif hat ein Limit, denn jemand zahlt die Grafikchips, auf denen das Modell läuft.",
    },
    language: {
      q: "Antwortet unzensierte KI auf Deutsch?",
      a: "Die großen Modelle antworten in der Sprache, in der du schreibst. Schreib auf Deutsch, und du bekommst Deutsch zurück. Bei kleinen lokalen Modellen lohnt ein kurzer Test, manche wechseln bei langen Antworten ins Englische.",
    },
    api: {
      q: "Gibt es eine kostenlose unzensierte API?",
      a: "Lokal ja: Ollama und LM Studio bringen einen OpenAI-kompatiblen Server auf deinem Rechner mit. OpenRouter gibt 50 Gratis-Anfragen am Tag auf Gratis-Modellen, unzensierte sind dort aber rar. Bei {{appName}} schaltet jeder Kauf die API frei, Tarife ab {{apiSubPrice}} im Monat. Die Gratis-Credits gelten nur im Chat.",
    },
    legal: {
      q: "Ist unzensierte KI in Deutschland erlaubt?",
      a: "Ein Modell, das weniger ablehnt, ändert keine Gesetze. Was offline verboten ist, bleibt es auch im Chat, und unsere Nutzungsbedingungen gelten zusätzlich. Das ist keine Rechtsberatung. Wer sensible Daten verarbeitet, sollte die Datenschutzerklärung des Anbieters lesen oder lokal arbeiten.",
    },
    noSignUpLink: "KI-Chat kostenlos ohne Anmeldung: wie es funktioniert",
    kindsLink:
      "Abliteriert, feinjustiert oder eigenes Weltbild: die drei Arten",
  },
  cta: {
    title: "Kostenlos testen. Ohne Konto.",
    subtitle:
      "{{guestCredits}} Gratis-Credits im Monat für jedes Modell. Inkognito-Chat öffnen und die erste Frage stellen.",
    start: "Kostenlos chatten",
    models: "Die unzensierten Modelle ansehen",
  },
};
