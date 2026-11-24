import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Alternativen zu Character.AI für Rollenspiele (2026)",
    category: "KI-Rollenspiel",
    description:
      "Alternativen zu Character.AI für Rollenspiel, Geschichten und KI-Begleiter vergleichen. Mit Janitor AI, SpicyChat, DreamGen, SillyTavern und {{appName}}.",
    imageAlt: "Alternativen zu Character.AI für Rollenspiele und KI-Begleiter",
    keywords:
      "Character AI Alternative, Character AI ohne Filter, KI Rollenspiel, Janitor AI, SillyTavern",
  },
  hero: {
    backToBlog: "Zurück zum Blog",
    category: "KI-Rollenspiel",
    readTime: "9 Min. Lesezeit",
    title: "Alternativen zu Character.AI für Rollenspiele",
    subtitle:
      "Finde fertige Figuren, einen Begleiter mit Gedächtnis oder ein Modell nach Wahl. Preise geprüft am {{date}}.",
  },
  intro: {
    lead: "Bei Janitor AI suchst du dir eine Figur aus und legst los. Mit SillyTavern betreibst du dein Rollenspiel selbst. Kindroid und Nomi eignen sich für einen Begleiter, der sich an dich erinnern soll.",
    p2: "Wir betreiben {{appName}} und stellen es wegen der Modellwahl und des Figurenimports zuerst vor. Die Preise der anderen Anbieter stammen aus den verlinkten offiziellen Seiten oder App-Einträgen, geprüft am {{date}}. Alle Vergleichspreise stehen in US-Dollar.",
  },
  characterAi: { title: "Was Character.AI heute bietet" },
  switch: {
    title: "Warum manche nach einer Alternative suchen",
    intro:
      "In öffentlichen Diskussionen tauchen drei unterschiedliche Gründe auf.",
    reasons: {
      filtering: {
        body: "Unterbrochene Szenen. Im Community-Update vom August 2025 griff Character.AI die Rückmeldung auf, dass der Filter zu oft ins Gespräch eingriff.",
        source: "Community-Update auf Reddit",
      },
      continuity: {
        body: "Verlorener Faden. Eine Person suchte nach Figuren mit besserem Gedächtnis und glaubwürdigen Dialogen, die ihr in ruhigen Szenen Platz für eigene Beiträge lassen.",
        source: "Diskussion über Rollenspiel und Gedächtnis auf Reddit",
      },
      oldSite: {
        body: "Das Ende der alten Website. In einer Diskussion über den Wechsel schrieb eine Person, dass sie danach ganz zu einem anderen Dienst wechselte.",
        source: "Diskussion über den Abschied von Character.AI auf Reddit",
      },
    },
  },
  criteria: {
    title: "Was du vor dem Wechsel prüfen solltest",
    intro:
      "Spiele dieselbe Szene in zwei Apps. Kehre am nächsten Tag zurück und frag nach einem Detail vom Anfang.",
    filter:
      "Prüfe, welche Themen das Modell zulässt und ob der Dienst eine Altersprüfung verlangt.",
    memory:
      "Prüfe, ob die App ältere Details aus gespeicherten Erinnerungen, Zusammenfassungen oder Lorebooks wieder aufgreift.",
    price:
      "Rechne aus, wie viele Nachrichten oder Credits dein bevorzugtes Modell braucht. Zähle neue Antwortversuche mit.",
    privacy:
      "Prüfe, wo der Verlauf gespeichert wird und wer deine Eingaben verarbeitet.",
    characters:
      "Entscheide, ob du fertige Figuren, bearbeitbare Figurenkarten oder einen festen Begleiter willst.",
  },
  table: {
    title: "Character.AI und die Alternativen im direkten Vergleich",
  },
  us: {
    title: "1. {{appName}}: Figur mitbringen, Modell wählen",
    intro:
      "Beginne eine Szene im Browser oder lege eine Figur als wiederverwendbaren Skill an.",
    models:
      "Unter den {{modelCount}} Chatmodellen findest du {{uncensored}} unzensierte, {{mainstream}} Mainstream-Modelle und {{open}} offene Modelle. Der Wechsel klappt mitten in der Szene.",
    characters:
      "Der Rollenspiel-Skill hilft dem Modell, in seiner Rolle zu bleiben. Du kannst veröffentlichte Skills nutzen oder mit dem Editor und dem Skill Creator eigene Figuren erstellen.",
    consent:
      "Für unzensierte Modelle musst du einmal bestätigen, dass du mindestens 18 bist und ungefilterte Antworten akzeptierst.",
    import:
      "Importiere eine Figur über einen öffentlichen Link von Character.AI oder Talkie. Die Kopie nennt den ursprünglichen Autor.",
    privacy:
      "Der Inkognito-Chat läuft ohne Konto. Der Verlauf bleibt im Browser. Jede Eingabe geht zur Verarbeitung an den Modellanbieter.",
    price:
      "{{guestCredits}} Credits im Monat als Gast oder {{freeCredits}} mit einem Gratis-Konto. Abos beginnen bei {{subPrice}} im Monat. Die Modelle verbrauchen Credits.",
    weak: "Charaktere lassen sich bei Character.AI und Janitor AI leichter entdecken. Wer viel spielt, kann die Ausgaben mit einem Pauschaltarif besser planen.",
    skillsLink: "Integrierte und veröffentlichte Skills ansehen",
    roleplayLink: "Rollenspiel-Skill öffnen",
    creatorLink: "Figur mit dem Skill Creator erstellen",
  },
  list: {
    title: "Neun Alternativen im Detail",
    intro:
      "Wähle nach deinem Spielstil. Die Quellen zu Preisen und Funktionen stehen jeweils beim Anbieter.",
    heading: "{{number}}. {{name}}: {{bestFor}}",
    filter: "Inhaltsregeln.",
    price: "Preis.",
    pro: "Stärke.",
    con: "Nachteil.",
    versusLink: "{{appName}} im Vergleich zu {{name}}",
  },
  options: {
    characterAi: {
      summary:
        "Character.AI bietet öffentliche und selbst erstellte Figuren für Textrollenspiele, mit Stimmen und Anrufen. Berechtigte Nutzer können im Standardchat weiterhin unbegrenzt gratis schreiben.",
      pricing:
        "Standardchats sind kostenlos. In den USA gibt es diese Tarife ({{plans}}). Lite bietet einige Premiumfunktionen und zeigt Werbung. Plus enthält alle Gedächtnisfunktionen und blendet Werbung aus.",
      filter:
        "Pornografische Inhalte sind verboten. Offene Figurendialoge sind erst ab 18 verfügbar.",
      privacy: "Einstellung zur Nutzung fürs Modelltraining",
      pro: "Viele Figuren aus Fandoms. Stimmen und Anrufe sind eingebaut.",
      con: "Ein Abo ergänzt Funktionen. Die Regeln für explizite Inhalte gelten weiter.",
    },
    janitorAi: {
      bestFor: "Figuren aus der Community",
      summary:
        "Millionen von Community-Figuren, bearbeitbare Personas und auf Wunsch ein externes Modell.",
      pricing:
        "Standardchats sind unbegrenzt. Der US App Store listet {{plans}}.",
      filter:
        "Figuren mit dem Label Limitless dürfen Themen für Erwachsene haben. Die App startet im eingeschränkten Modus.",
      privacy: "Externe Proxys können Eingaben erhalten",
      pro: "Große Figurenauswahl und unbegrenzte kostenlose Standardchats. Janitor+ bietet fünfmal so viel Kontext, Vorrang und neue Antwortvarianten mit Premiummodellen.",
      con: "Der Gratis-Kontext umfasst etwa 9.000 Token. Ein externer Proxy bringt Aufwand und möglicherweise Zusatzkosten mit.",
    },
    sillyTavern: {
      bestFor: "volle Kontrolle auf dem eigenen Rechner",
      summary:
        "Kostenlose Oberfläche mit offenem Quellcode für lokale und gehostete Modelle. Unterstützt Figurenkarten, Lorebooks und Prompt-Vorlagen.",
      pricing:
        "Die Software ist gratis. Lokale Modelle laufen auf deiner Hardware. Gehostete APIs rechnen separat ab.",
      filter: "Die Regeln hängen vom gewählten Modell und Backend ab.",
      privacy: "Lokale Verlaufsdateien. Gehostete APIs erhalten Eingaben.",
      pro: "Du bestimmst Figurenkarten, Lorebooks, Prompts und Modelle. Der gesamte Aufbau kann lokal laufen.",
      con: "Installation und Pflege liegen bei dir. Für lokale Modelle brauchst du passende Hardware.",
    },
    chub: {
      bestFor: "Lorebooks und verzweigte Geschichten",
      summary:
        "Figurenkarten und eine gehostete Oberfläche mit Lorebooks, die Schlüsselwörter erkennen, mehreren Figuren pro Chat und einem Baum für alternative Handlungsverläufe.",
      pricing:
        "Chub beschreibt gelegentliche einmalige Testcredits. Das gehostete Abo kostet {{plans}}. Externe Modelle haben eigene Tarife.",
      filter:
        "Chub bezeichnet seine eigenen Modelle als unzensiert. Externe Anbieter setzen eigene Regeln.",
      privacy:
        "Geteilte Chats können öffentlich erscheinen. Externe APIs erhalten Eingaben.",
      pro: "Verzweige Szenen, hänge ein Lorebook an und exportiere Chats als SillyTavern-JSONL oder als Text.",
      con: "Für den laufenden Einsatz brauchst du ein Abo oder ein eigenes Backend. Testcredits gibt es nur begrenzt und ohne Garantie.",
      free: "Gelegentliche Testcredits",
    },
    crushOn: {
      bestFor: "sofort spielbare Szenen für Erwachsene",
      summary:
        "Community-Figuren, Gruppenszenen, Stimmen und Modellwechsel ohne eigenen API-Schlüssel.",
      pricing:
        "Unbegrenzte Chats auf Gratis-Modellen und 100 monatliche Credits für Pro-Modelle. Monatlich stehen diese Tarife zur Wahl ({{plans}}).",
      filter:
        "Rollenspiele für Erwachsene sind möglich. Für fortgeschrittene Modelle gelten eigene Zugangsregeln und Creditlimits.",
      privacy:
        "Die geprüfte Datenschutzerklärung lässt den Zugriff für Figurenersteller offen",
      pro: "Mit fertigen Figuren starten, Gruppen bilden und mitten im Chat das Modell ändern.",
      con: "Pro und Ultra haben getrennte Kontingente. Ein Abo macht den Zugriff auf Premiummodelle nicht pauschal unbegrenzt.",
    },
    spicyChat: {
      bestFor: "Figuren und Personas für Erwachsene",
      summary:
        "Gehostetes Rollenspiel mit Community-Figuren, mehreren Personas für dich und Gedächtnisfunktionen im Abo.",
      pricing:
        "Gratis mit 4.096 Token Kontext. Die geprüften US-Jahresabos kosten {{plans}}. Monatsangebote stehen auf der Website.",
      filter:
        "Rollenspiele für Erwachsene sind möglich. Öffentliche Figuren werden moderiert.",
      privacy: "Gehostet. Antworten verwenden den laufenden Chat als Kontext.",
      pro: "Abos umgehen Warteschlangen und erlauben es, Erinnerungen zu bearbeiten. Höhere Stufen ergänzen semantisches Gedächtnis und Bilder im Chat.",
      con: "Gratis bleiben Werbung und Wartezeiten. Sprachausgabe und Steuerung der Textgenerierung gibt es in der höchsten Stufe.",
    },
    kindroid: {
      bestFor: "einen Begleiter mit Live-Anrufen",
      summary:
        "Ein eigener Begleiter mit Vorgeschichte, dauerhaftem Gedächtnis, Selfies sowie Sprach- und Videoanrufen.",
      pricing:
        "Einmalig 50 Testnachrichten, in einigen Regionen 15. Der US App Store listet {{plans}}. Im Web kann das Abo günstiger sein.",
      filter:
        "Ab 18. Laut Kindroid greift die Moderation bei schweren realen Gefahren auf Kontoebene ein.",
      privacy: "Verschlüsselt bei Speicherung und Übertragung",
      pro: "Anrufe mit Ton und Bild, selbstständige Nachrichten, Gruppen und Selfies gehören zum Begleiter.",
      con: "Nach Testkontingent oder Aboende kannst du nur noch lesen. Mehr Gedächtnis kostet extra.",
      free: "Einmaliges Testkontingent",
    },
    nomi: {
      bestFor: "einen Begleiter mit täglichem Freikontingent",
      summary:
        "KI-Begleiter mit Langzeitgedächtnis, Selfies und Gruppenchat. Sprachfunktionen gibt es im Abo.",
      pricing:
        "50 Nachrichten am Tag gratis. Das Standard-Abo gibt es mit verschiedenen Laufzeiten ({{plans}}).",
      filter:
        "Ab 18. Nomi bezeichnet Textchats als ungefiltert. Für Bilder gelten eigene Regeln.",
      privacy: "Laut Nomi kein Verkauf oder Verleih personenbezogener Daten",
      pro: "Kehre zu derselben Figur zurück oder bringe mehrere Begleiter in einem Gruppenchat zusammen.",
      con: "Gratis gibt es ein Tageslimit. Für Sprachfunktionen brauchst du ein Abo.",
    },
    venice: {
      bestFor: "private Figurenchats und Medien",
      summary:
        "Figurenchats neben regulärem KI-Chat, Bildgenerierung und einer Auswahl an Modellen.",
      pricing:
        "Mit den Basismodellen sind täglich 10 Texteingaben und 15 Bildanfragen gratis. {{plans}}. Eigene Figuren brauchen Pro.",
      filter:
        "Der Filter für Erwachseneninhalte ist standardmäßig aktiv. Berechtigte Pro-Nutzer können ihn abschalten.",
      privacy: "Verlauf bleibt standardmäßig auf dem Gerät",
      pro: "Figuren, Chat und Bilder in einer App. Bezahlte Tarife bieten eine optionale verschlüsselte Sicherung.",
      con: "Der Gratis-Chat ist begrenzt. Premiummodelle und manche Medienfunktionen verbrauchen Credits.",
    },
    nanoGpt: {
      bestFor: "Modellwahl mit Abrechnung nach Verbrauch",
      summary:
        "Webchat und API mit Text- und Medienmodellen. Nutze eine Vorlage oder bring einen eigenen Figurenprompt mit.",
      pricing:
        "Ein kostenloses Webmodell. Erste Aufladung ab 0,10 US-Dollar per Krypto oder 1 US-Dollar per Karte. {{plans}}. PRO deckt ausgewählte offene Modelle ab.",
      filter: "Ab 18. Die Einschränkungen hängen von Modell und Anbieter ab.",
      privacy:
        "Verlauf standardmäßig lokal. Anbieterregeln unterscheiden sich.",
      pro: "Zahle nach Verbrauch. Die API lässt sich auch in SillyTavern einbinden.",
      con: "Du baust die Figuren selbst oder nutzt eine andere Oberfläche. Die meisten Modelle greifen auf dein Guthaben zu.",
    },
  },
  import: {
    title: "So nimmst du eine Figur aus Character.AI mit",
    intro:
      "Beginne eine neue Geschichte mit den Angaben, die der Urheber öffentlich gemacht hat.",
    steps: {
      account: {
        title: "Anmelden",
        body: "Mit einem Gratis-Konto kannst du die importierte Figur später bearbeiten.",
      },
      create: {
        title: "Figureneditor öffnen",
        body: "Erstelle auf der Skills-Seite einen benutzerdefinierten Skill und wähle den Import per Link.",
      },
      paste: {
        title: "Öffentlichen Link einfügen",
        body: "Verwende einen Link von Character.AI oder Talkie. Der Import übernimmt sichtbare Felder wie Name, Avatar, Begrüßung und Beschreibung. Öffentliche Definitionen lassen sich ebenfalls übernehmen.",
      },
      model: {
        title: "Modell wählen",
        body: "Beginne einen Chat mit deiner Kopie. Du kannst das Modell im selben Gespräch wechseln.",
      },
    },
    callout:
      "Die Kopie nennt den Urheber und verlinkt das Original. Alte Chatverläufe bleiben beim bisherigen Dienst.",
  },
  privacy: {
    title: "Wo dein Chat landet",
    intro: "So funktioniert Inkognito bei {{appName}}.",
    incognito:
      "Der Verlauf liegt im Browserspeicher. Wenn du ihn leerst, verschwindet auch der Chat.",
    transit:
      "Deine Eingaben gehen über unseren Dienst an den gehosteten Modellanbieter. Den Creditverbrauch erfassen wir für die Abrechnung.",
    callout:
      "Für einen vollständig lokalen Aufbau kannst du SillyTavern mit einem Modell auf eigener Hardware kombinieren.",
  },
  stay: {
    title: "Wann sich Character.AI weiterhin lohnt",
    intro:
      "Character.AI passt, wenn du vertraute Figuren und lockere, moderierte Chats suchst.",
    library:
      "Du hast schon Lieblingsfiguren und nutzt die eingebauten Sprachanrufe.",
    flat: "Du schreibst vor allem im Standardchat und legst mehr Wert auf unbegrenzte Gratisnachrichten als auf Modellwahl.",
    callout:
      "Die Plattform lohnt sich, wenn ihre Werkzeuge und Regeln zu deinen Geschichten passen.",
  },
  faq: {
    title: "Häufige Fragen",
    best: {
      q: "Was ist die beste Alternative zu Character.AI?",
      a: "Janitor AI bietet viele Community-Figuren. SillyTavern bietet lokale Kontrolle und Lorebooks. Kindroid und Nomi eignen sich für feste Begleiter. Mit {{appName}} kannst du eine öffentliche Figur importieren und das Modell wechseln.",
    },
    free: {
      q: "Gibt es eine kostenlose Alternative zu Character.AI?",
      a: "Janitor AI bietet unbegrenzte Standardchats. Bei Nomi sind 50 Nachrichten pro Tag gratis. SillyTavern ist kostenlos und braucht ein separates Modell. Bei {{appName}} bekommst du {{guestCredits}} Credits im Monat als Gast oder {{freeCredits}} mit einem Gratis-Konto.",
    },
    import: {
      q: "Kann ich Figuren und Chats aus Character.AI mitnehmen?",
      a: "Mit einem Gratis-Konto kann {{appName}} sichtbare Felder aus einem öffentlichen Link von Character.AI oder Talkie übernehmen. Private Definitionen und alte Gespräche bleiben beim bisherigen Dienst.",
    },
    nsfw: {
      q: "Welche Alternativen zu Character.AI erlauben Rollenspieltexte für Erwachsene?",
      a: "Janitor AI mit Limitless, CrushOn und SpicyChat erlauben Erwachseneninhalte nach ihren jeweiligen Regeln. Bei SillyTavern entscheidet das Backend. {{appName}} schaltet unzensierte Modelle nach einer Bestätigung ab 18 frei.",
    },
    private: {
      q: "Welche Alternative zu Character.AI läuft lokal?",
      a: "SillyTavern kann mit einem lokalen Modell laufen und den Verlauf auf deinem Rechner speichern. Venice und der Inkognito-Chat von {{appName}} speichern den Verlauf auf dem Gerät. Gehostete Anbieter verarbeiten weiterhin die Eingaben.",
    },
    account: {
      q: "Kann ich {{appName}} ohne Konto ausprobieren?",
      a: "Ja. Nutze deine Gastcredits im Inkognito-Chat. Melde dich an, wenn du Figuren importieren oder gespeicherte Chats auf mehreren Geräten nutzen willst.",
    },
    memory: {
      q: "Welche Alternativen eignen sich für lange Szenen?",
      a: "Chub und SillyTavern fügen über Lorebooks passende Details zum Kontext hinzu. Kindroid und Nomi setzen auf das Gedächtnis eines festen Begleiters. Prüfe vor dem Bezahlen, woran sich das Modell aus einer frühen Szene erinnert.",
    },
    roleplayLink: "KI-Rollenspiel ohne Filter",
    kindsLink: "Wie sich unzensierte KI-Modelle unterscheiden",
  },
  partners: {
    body: "Leitest du eine Rollenspiel-Community? Das Partnerprogramm von {{appName}} zahlt {{referralPercent}} % jeder vermittelten Zahlung.",
    link: "Partnerprogramm ansehen",
  },
  cta: {
    title: "Modell wählen und Szene beginnen",
    subtitle:
      "Als Gast startest du mit {{guestCredits}} Gratiscredits im Monat.",
    start: "Rollenspiel starten",
    skills: "Skills ansehen",
  },
};
