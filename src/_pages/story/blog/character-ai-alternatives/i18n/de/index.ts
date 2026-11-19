import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Character AI Alternative ohne Filter im Vergleich (2026)",
    description:
      "Character.AI-Alternativen ohne Filter, verglichen anhand ihrer eigenen Preis-, Filter- und Datenschutzseiten: Janitor AI, SillyTavern, CrushOn, Kindroid, Nomi, Venice und {{appName}}. Dazu: deine Character.AI-Figuren importieren.",
    category: "Vergleich",
    imageAlt: "Character.AI-Alternativen ohne Filter im Vergleich",
    keywords:
      "Character AI Alternative ohne Filter, Character AI Alternative, Character.AI Alternativen, Seiten wie Character AI, Apps wie Character AI, Character AI unzensiert, Character AI ohne Filter, NSFW Character AI Alternative, Janitor AI Alternative, Character AI Charakter importieren, KI-Rollenspiel ohne Filter, Character.AI alternatives, Character AI alternative no filter, sites like Character AI, uncensored Character AI, {{appName}}",
  },
  hero: {
    backToBlog: "Zurück zum Blog",
    category: "Vergleich",
    readTime: "10 Min. Lesezeit",
    title: "Character.AI-Alternativen ohne Filter. Geprüft, nicht geraten.",
    subtitle:
      "{{count}} Alternativen und {{appName}}, verglichen anhand dessen, was ihre eigenen Preis-, Filter- und Datenschutzseiten sagen. Geprüft am {{date}}. Deine Figuren nimmst du mit.",
  },
  intro: {
    lead: "Die meisten Listen mit Character.AI-Alternativen schreiben voneinander ab. „Kein Filter“, „kostenlos“, „am besten für NSFW“: Behauptungen, die niemand geprüft hat. Dann meldest du dich an und stehst nach 50 Nachrichten vor der Bezahlschranke. Oder vor einem Filter, den die Liste nie erwähnt hat.",
    p2: "Wir haben am {{date}} die Preisseite, die AGB, die Datenschutzerklärung und das Hilfecenter jeder Plattform gelesen. Jede Angabe unten stammt von diesen Seiten, die Quellen sind einen Klick entfernt. Eine dieser Plattformen betreiben wir selbst: {{appName}}. Wir sagen das offen, stellen sie an den Anfang und sagen dir, wo die anderen besser sind.",
  },
  criteria: {
    title: "Was beim Wechsel wirklich zählt",
    intro: "Fünf Fragen. Beantworte sie, bevor du wählst.",
    filter:
      "Filter: Was ist erlaubt, wer entscheidet, gibt es eine Altersprüfung? „Ungefiltert“ auf der Startseite und „verboten“ in den AGB gibt es auf derselben Seite.",
    memory:
      "Gedächtnis: wie viel der Geschichte das Modell vor jeder Antwort liest. Kleiner Kontext heißt: Deine Figur vergisst die frühen Kapitel.",
    price:
      "Preis: Pauschal-Abo, Nachrichtenlimit oder Bezahlung pro Nutzung. Gratisstufen reichen von unbegrenzt bis zur Vorschau mit 50 Nachrichten.",
    privacy:
      "Datenschutz: Werden deine Chats gespeichert, fürs Training genutzt, für Werbung? Rollenspiel ist persönlich. Lies diesen Teil.",
    characters:
      "Figuren: eine große Community-Bibliothek, eigene Kreationen oder beides. Und kannst du die mitnehmen, die du schon hast?",
  },
  table: {
    title: "Alle im direkten Vergleich",
    intro:
      "Auf dem Handy seitlich scrollen. Angaben zur Konkurrenz am {{date}} auf deren eigenen Seiten geprüft. Angaben zu {{appName}} live aus unserer Konfiguration. Character.AI steht als gefilterte Referenz am Ende der Tabelle.",
  },
  us: {
    title: "{{appName}}: Modell wählen, Filter einstellen",
    intro:
      "Keine Figuren-App mit einem Hausmodell. Ein Chat mit {{modelCount}} Modellen, in dem Figuren Skills sind, die du auswählst, baust oder importierst.",
    models:
      "Modelle: {{uncensored}} unzensierte Modelle neben {{mainstream}} Mainstream- und {{open}} offenen. Wechsle pro Nachricht, mitten in der Szene. {{ownModel}} ist trainiert mit Büchern und Dokumenten, die im Mainstream-Internet verbannt sind, und lenkt eine düstere Geschichte deshalb nicht auf sicheres Terrain zurück.",
    characters:
      "Figuren: Der Roleplay-Skill bringt jedes Modell dazu, in der Rolle zu bleiben. Die Skills-Seite listet eingebaute Figuren und Community-Skills, die andere Nutzer veröffentlicht haben. Bau deine eigene im Editor, oder lass den Skill Creator sie im Chat mit dir schreiben.",
    import:
      "Import: Füg einen öffentlichen Character.AI- oder Talkie-Link ein und du bekommst deine eigene Kopie der Figur, mit Nennung des ursprünglichen Erstellers.",
    privacy:
      "Datenschutz: Inkognito-Chats bleiben in deinem Browser, kein Konto nötig. Private Chats werden nur in deinem Konto gespeichert.",
    price:
      "Preis: {{guestCredits}} kostenlose Credits im Monat ohne Konto, {{freeCredits}} mit Konto. Tarife ab {{subPrice}} im Monat. Credit-Pakete stocken einen aktiven Tarif auf und verfallen nie.",
    weak: "Wo wir schwächer sind: Unsere Community-Bibliothek ist klein neben Character.AI oder Janitor AI, und Credits werden nach Verbrauch abgerechnet. Lange Szenen auf Premium-Modellen summieren sich.",
    skillsLink: "Eingebaute und Community-Skills ansehen",
    roleplayLink: "Roleplay-Skill öffnen",
    creatorLink: "Figur mit dem Skill Creator bauen",
  },
  list: {
    title: "Die {{count}} Alternativen im Einzelnen",
    intro:
      "Von ihren eigenen Seiten, geprüft am {{date}}. Was jede ist, was ihr Filter wirklich erlaubt, was sie kostet, was mit deinen Chats passiert.",
    heading: "{{number}}. {{name}}: {{kind}}",
    filter: "Filter:",
    price: "Preis:",
    priceValue: "Gratisstufe: {{free}}. Bezahlt: {{plans}}.",
    privacy: "Datenschutz:",
    pro: "Stärke:",
    con: "Haken:",
    forWho: "Nimm sie, wenn:",
    versusLink: "{{appName}} vs. {{name}}: der ganze Vergleich",
    visit: "Zu {{name}}",
  },
  import: {
    title: "Nimm deine Character.AI-Figuren mit",
    intro:
      "Wechseln heißt nicht, von vorn anzufangen. Importiere eine Figur über ihren öffentlichen Link in unter einer Minute.",
    steps: {
      account: {
        title: "Anmelden",
        body: "Der Import braucht ein kostenloses Konto, damit die Figur einen Besitzer hat.",
      },
      create: {
        title: "Figuren-Editor öffnen",
        body: "Klick auf der Skills-Seite auf „Eigenen Skill Erstellen“ und wähl „Per Link importieren“.",
      },
      paste: {
        title: "Öffentlichen Link einfügen",
        body: "Character.AI (character.ai, c.ai) oder Talkie (talkie-ai.com). Wir übernehmen, was die öffentliche Seite zeigt: Name, Avatar, Begrüßung, Beschreibung und Tags, dazu die Definition, wenn der Ersteller sie öffentlich gemacht hat. Behalte sie privat, nicht gelistet oder öffentlich.",
      },
      model: {
        title: "Modell wählen",
        body: "Die Figur läuft jetzt auf jedem unserer Modelle. Starte mit einem unzensierten und wechsle mitten in der Szene, wenn ein Modell flach wird. Der Thread behält seinen Verlauf.",
      },
    },
    callout:
      "Der ursprüngliche Ersteller wird bei der importierten Figur genannt, mit Link zur Quelle. Importierst du denselben Link zweimal, öffnet sich deine bestehende Kopie statt eines Duplikats.",
  },
  privacy: {
    title: "Wer liest dein Rollenspiel?",
    intro: "Auf {{appName}} passiert genau das.",
    incognito:
      "Inkognito-Chats liegen im lokalen Speicher deines Browsers, nicht auf unseren Servern. Löschst du deine Browserdaten, sind sie weg.",
    transit:
      "Jede Nachricht läuft trotzdem über unseren Server zum Modellanbieter, der die Antwort schreibt. So funktioniert jede gehostete KI. Der Credit-Verbrauch wird für die Abrechnung erfasst.",
    others:
      "Für die anderen: Lies die Datenschutzzeile in jeder Karte oben. Mehrere Plattformen schreiben in ihrer eigenen Richtlinie, dass Chats ihre Modelle trainieren oder Werbung speisen können.",
    callout:
      "Inkognito hält deine Geschichte von unseren Servern fern. Vor dem Modell, das die Antworten schreibt, verbirgt es sie nicht.",
  },
  stay: {
    title: "Wann Character.AI trotzdem die richtige Wahl ist",
    intro: "Manchmal ist der Filter das Feature.",
    library:
      "Du willst die größte Bibliothek fertiger Figuren und nie selbst eine bauen.",
    flat: "Du willst unbegrenzt kostenlose Nachrichten und nimmst dafür Werbung und ein gefiltertes Modell in Kauf.",
    filter:
      "Der Nutzer ist ein Teenager, oder ein Teenager nutzt dasselbe Gerät. Dann passt eine abgeriegelte App besser.",
    callout:
      "Ungefiltert heißt ohne Sicherheitsnetz. Was du schreibst und veröffentlichst, verantwortest du, und das Recht an deinem Wohnort gilt trotzdem.",
  },
  faq: {
    title: "FAQ",
    best: {
      q: "Was ist die beste Character.AI-Alternative ohne Filter?",
      a: "Kommt darauf an, was du willst. Eine riesige kostenlose Community-Bibliothek: Janitor AI. Volle Kontrolle auf deinem eigenen Rechner: SillyTavern. Ein langfristiger Begleiter mit Stimme und Selfies: Kindroid oder Nomi. Modellwahl, unzensierte Modelle und eigene Figuren auf einem Guthaben: {{appName}}.",
    },
    free: {
      q: "Gibt es eine kostenlose Character.AI-Alternative ohne Filter?",
      a: "Ja. Janitor AI hat eine Gratisstufe mit NSFW-Bots, die als Limitless markiert sind. SillyTavern ist freie Software, das Modell bringst du selbst mit. {{appName}} gibt dir {{guestCredits}} kostenlose Credits im Monat ohne Konto und {{freeCredits}} mit Konto, unzensierte Modelle inklusive nach einer einmaligen 18+-Bestätigung.",
    },
    import: {
      q: "Kann ich meine Character.AI-Figuren in eine andere App umziehen?",
      a: "Auf {{appName}} ja: Füg den öffentlichen Link der Figur ein und du bekommst deine eigene Kopie mit Name, Avatar, Begrüßung, Beschreibung und Tags, dazu die Definition, wenn sie öffentlich ist. Talkie-Links funktionieren auch. Du brauchst ein kostenloses Konto.",
    },
    nsfw: {
      q: "Welche Character.AI-Alternativen erlauben NSFW?",
      a: "Laut ihren eigenen Seiten: Janitor AI erlaubt als Limitless markierte NSFW-Bots für Nutzer, die sich selbst als volljährig angeben. CrushOn hat nach einer Altersprüfung einen Unfiltered-Schalter. Kindroid nennt sich ungefiltert, mit ein paar roten Linien. Nomi lässt Text ungefiltert und filtert Nacktheit in Bildern. {{appName}} schaltet unzensierte Modelle nach einer einmaligen 18+-Bestätigung frei. Character.AI sagt, pornografische Inhalte werden nie unterstützt.",
    },
    private: {
      q: "Welche Alternative hält meine Chats privat?",
      a: "SillyTavern speichert Chats auf deinem eigenen Rechner. Auf {{appName}} bleiben Inkognito-Chats in deinem Browser. Venice sagt, der Verlauf bleibt auf deinem Gerät. Nachrichten an ein gehostetes Modell erreichen trotzdem den Anbieter, der sie beantwortet.",
    },
    account: {
      q: "Brauche ich ein Konto zum Ausprobieren?",
      a: "Nicht auf {{appName}}: Inkognito-Chat funktioniert ohne. Ein kostenloses Konto brauchst du, um Figuren zu importieren, eigene zu veröffentlichen und Chats geräteübergreifend zu behalten.",
    },
    roleplayLink: "KI-Rollenspiel ohne Filter: Modelle, Gedächtnis und Preise",
    kindsLink:
      "Abliteriert, nachtrainiert oder eigenes Weltbild: die drei Arten unzensierter KI",
  },
  partners: {
    body: "Du betreibst eine Rollenspiel-Community, einen Discord oder einen Kanal über KI-Figuren? Das Partnerprogramm von {{appName}} zahlt dir {{referralPercent}} % jeder Zahlung, die du vermittelst, jeden Monat.",
    link: "Zum Partnerprogramm",
  },
  cta: {
    title: "Bring eine Figur mit. Wähl das Modell.",
    subtitle:
      "{{guestCredits}} kostenlose Credits im Monat, kein Konto nötig. Unzensiert, offen oder Mainstream: Wechsle jederzeit.",
    start: "Rollenspiel starten",
    skills: "Skills ansehen",
  },
};
