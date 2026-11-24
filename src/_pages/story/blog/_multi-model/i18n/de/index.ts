import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  common: {
    back: "Zurück zum Blog",
    category: "Vergleich",
    readTime: "7 Min. Lesezeit",
    switching: "Warum Nutzer nach Alternativen suchen",
    criteria: "Was du vor dem Wechsel prüfen solltest",
    privacy:
      "Prüfe, wo der Verlauf liegt und wer deine Eingaben verarbeitet. Ein gehostetes Modell erhält deine Eingabe auch dann, wenn die Oberfläche lokal läuft.",
    table: "Alle Optionen im direkten Vergleich",
    checked:
      "Preise der Anbieter geprüft am {{date}}. Die Beträge stehen in US-Dollar. An der Kasse können je nach Land andere Preise gelten. Die Angaben zu {{appName}} stammen aus unserer aktuellen Konfiguration. Auf schmalen Bildschirmen kannst du die Tabelle seitlich verschieben.",
    alternatives: "Die anderen Optionen im Detail",
    price: "Kosten.",
    pro: "Stärke.",
    con: "Nachteil.",
    fit: "Passt zu dir, wenn",
    faq: "Häufige Fragen",
    guides: "Weitere Vergleiche",
    modelCatalog: "Zum Modellkatalog",
  },
  kinds: {
    aggregator: "Gehosteter Chat für mehrere Modelle",
    client: "Client für eigene API-Schlüssel",
    selfHosted: "Selbst gehostete Chatoberfläche",
    gateway: "API-Gateway mit Webchat",
    creativeChat: "Gehosteter Kreativchat",
    singleProvider: "Gehosteter Chat eines Anbieters",
  },
  us: {
    title: "{{appName}}. KI-Chat mit wählbarer Filterstufe",
    intro:
      "Wechsle mitten im Gespräch das Modell, ganz ohne eigene API-Schlüssel. Im Katalog stehen {{modelCount}} Chatmodelle, darunter {{mainstream}} Mainstream-Modelle, {{open}} offene und {{uncensored}} unzensierte Modelle. Für unzensierte Modelle bestätigst du, dass du mindestens 18 bist.",
    price:
      "Als Gast erhältst du monatlich {{guestCredits}} Gratiscredits, mit Konto {{freeCredits}}. Tarife beginnen bei {{subPrice}} im Monat. Welche Credits eine Anfrage verbraucht, hängt vom Modell ab.",
    privacy:
      "Im Inkognitomodus bleibt der Verlauf im Browser. Ein gehostetes Modell erhält weiterhin die Eingabe, die es für seine Antwort benötigt.",
    api: "Zugang zu den OpenAI- und Anthropic-kompatiblen APIs gibt es ab {{apiSubPrice}} im Monat.",
    cta: "Teste dieselbe Frage mit zwei Modellen",
    ctaSubtitle:
      "Starte inkognito mit {{guestCredits}} Gratiscredits im Monat. Wähle ein Modell und schick deine erste Nachricht.",
    start: "Inkognito-Chat starten",
    models: "Unzensierte Modelle entdecken",
  },
  platforms: {
    poe: {
      free: "Kostenlose Punkte pro Tag.",
      paid: "Ab {{poeStart}} im Monat",
      filter: "Poe-Richtlinien und Regeln des Bots",
      privacy: "Poe und Bot-Anbieter verarbeiten Chatdaten",
      api: "OpenAI-kompatibel mit Tarifpunkten",
      media: "Bilder, Video, Audio",
      open: "Proprietär",
      models:
        "Auf Quoras Plattform findest du GPT, Claude und Gemini neben Bots aus der Community. Ein Punktestand gilt für Chat und Medien. Eigene API-Schlüssel brauchst du dafür nicht.",
      price:
        "Gratiskontingente werden alle 24 Stunden zurückgesetzt. Ungenutzte Punkte verfallen. Der kleinste Bezahltarif nennt 10.000 Punkte pro Tag. Je nach Bot können längere Eingaben, Antworten oder mehr Kontext zusätzliche Punkte kosten.",
      pro: "Du kannst Community-Bots entdecken, Leute in Gruppenchats einladen und eigene Bots veröffentlichen. Berechtigte Entwickler können pro Nachricht Geld verdienen. Abonnenten nutzen dieselben Punkte im Chat und über die API.",
      con: "Wie viel du chatten kannst, hängt vom Kontingent und vom Bot ab. Laut Datenschutzerklärung können Anbieter und Entwickler Chats sowie hochgeladene Dateien erhalten. Neben den Regeln des Bots gelten die Vorgaben von Poe.",
      fit: "du Community-Bots, Gruppenchats und eine gemeinsame Abrechnung für verschiedene Modelle willst.",
    },
    typingMind: {
      free: "Basisoberfläche ohne Lizenz.",
      paid: "Einmalig {{typingStandard}} plus Modellkosten",
      filter: "Regeln des eingebundenen Anbieters und Modells",
      privacy: "Standardmäßig im Browser, Sync optional",
      api: "Bindet externe APIs an",
      media: "Bilder und Sprache je nach Lizenz und Modell",
      open: "Proprietär, statisches Selbsthosting mit Lizenz",
      models:
        "TypingMind ist eine Oberfläche für eigene API-Schlüssel oder kompatible Endpunkte. Sie bindet GPT, Claude, Gemini und weitere Modelle an. Mit Lizenz lässt sich der Chatverlauf im Browser speichern.",
      price:
        "Standard kostet {{typingStandard}}, Extended {{typingExtended}}. Premium stand zum Aktionspreis von {{typingPremium}} bei einem Listenpreis von {{typingList}}. Modellnutzung und kostenpflichtige Speichererweiterungen werden separat abgerechnet.",
      pro: "Premium bringt Projektordner und parallele Antworten mit eigenem Kontext pro Modell. Du stellst Modellparameter ein und greifst auf Anbieter zurück, bei denen du bereits zahlst.",
      con: "Die Gratisversion speichert keine Chats. Schlüssel und Abrechnungen verwaltest du selbst. Für das Selbsthosting brauchst du eine Lizenz und bekommst die kompilierte App.",
      fit: "du direkt beim Modellanbieter zahlen und die Antworten über eine fertige Oberfläche fein steuern willst.",
    },
    libreChat: {
      free: "Kostenlose MIT-Software.",
      paid: "Hosting und Modellnutzung nach Bedarf",
      filter: "Je nach Instanz und Modell",
      privacy: "Verlauf auf der eigenen Instanz, Eingaben an gehostete Modelle",
      api: "Anbieter-APIs und Agents-API in Beta",
      media: "Bildgenerierung über eingebundene Werkzeuge",
      open: "MIT, selbst hostbar",
      models:
        "LibreChat bindet Anbieter wie OpenAI, Anthropic und OpenRouter an. Installiere es auf deinem Server oder teste die öffentliche Demo mit einem Konto.",
      price:
        "Die Software kostet keine Lizenzgebühr. Server und kostenpflichtige Modelle rechnest du separat ein. Die öffentliche Demo dient zum Ausprobieren.",
      pro: "Du kannst den Code anpassen und bekommst Agenten, MCP, Dateisuche, Chatimporte und mehrere Exportformate.",
      con: "Installation, Updates und Sicherungen liegen bei dir. Sensible Daten oder wichtige Verläufe gehören auf deine eigene Instanz.",
      fit: "du eine anpassbare Oberfläche für mehrere Anbieter und Zeit für den Serverbetrieb hast.",
    },
    openWebUi: {
      free: "Selbsthosting unter Lizenz kostenlos.",
      paid: "Hardware, Hosting oder Modellnutzung nach Bedarf",
      filter: "Je nach Instanz und Modell",
      privacy: "Mit lokalen Modellen offline nutzbar",
      api: "Ollama und OpenAI-kompatible Endpunkte",
      media: "Bilder und Sprache über Integrationen",
      open: "Quellcode verfügbar, Vorgaben zur Marke",
      models:
        "Open WebUI ist eine selbst gehostete Oberfläche für Ollama und OpenAI-kompatible APIs. Mit einem lokalen Modell läuft der Chat vollständig offline.",
      price:
        "Mit der Originalmarke ist die Software kostenlos. Für größere Installationen mit eigener Marke gibt es eine separate Lizenz.",
      pro: "Du kannst Modelle auf deiner Hardware betreiben und dort auch den Verlauf speichern. Bei Bedarf bindest du in derselben Oberfläche eine Cloud-API an.",
      con: "Lokale Modelle brauchen geeignete Hardware oder einen separaten Server. Wenn du den Dienst für andere betreibst, kommen Wartung und Lizenzvorgaben hinzu.",
      fit: "du lokale und gehostete Modelle in derselben Oberfläche brauchst, auch offline.",
    },
    openRouter: {
      free: "Ausgewählte Modelle gratis.",
      paid: "Verbrauchsabhängige Abrechnung",
      filter: "Regeln des Modells und Anbieters",
      privacy: "Datenschutz je nach Anbieterrouting",
      api: "Einheitliche API",
      media: "Je nach Modell",
      open: "Gehostet, proprietär",
      models:
        "OpenRouter Chat ist die Browseroberfläche für den OpenRouter-Katalog. Schick dieselbe Eingabe an mehrere Modelle und vergleiche die Antworten nebeneinander.",
      price:
        "Kostenpflichtige Modelle werden nach Verbrauch abgerechnet. Für Guthaben im Standardtarif per Karte fallen {{routerFee}} an, mindestens {{routerMinimum}}. OpenRouter reicht die Modellpreise der Anbieter durch.",
      pro: "Du kannst Antworten vergleichen und einen Anbieter für die Anfrage wählen. Dasselbe Guthaben gilt auch für die API.",
      con: "Gratisanfragen sind limitiert. Preis und Datenschutz hängen von Modell, Kontext und Anbieter ab.",
      fit: "du viele Modelle im Browser vergleichen und nach Verbrauch zahlen willst.",
    },
    venice: {
      free: "Täglich 10 Text- und 15 Bildanfragen mit Basismodellen.",
      paid: "Pro für {{venicePro}} im Monat",
      filter: "Filter für sensible Inhalte ab Pro abschaltbar",
      privacy: "Standardmäßig lokaler Verlauf, Schutz je nach Routing",
      api: "API gegen Credits",
      media: "Bilder, Video, Sprache und Musik",
      open: "Gehostet, proprietär",
      models:
        "Venice bietet offene und proprietäre Textmodelle sowie Bild-, Video- und Audiowerkzeuge. Die Datenschutzerklärung unterscheidet vier Verarbeitungswege mit unterschiedlichem Schutz.",
      price:
        "Pro kostet {{venicePro}} im Monat und umfasst unbegrenzte Textanfragen bei den enthaltenen Modellen. Einige Spitzenmodelle und Medienausgaben kosten weiterhin Credits.",
      pro: "Der Verlauf bleibt standardmäßig im Browser. Pro bietet verschlüsselte Sicherungen und auf unterstützten Routen hardwaregeschützte Modelle.",
      con: "Der Gratistarif hat Tageslimits. Einige Spitzenmodelle laufen bei externen Anbietern. Den Filter kannst du erst ab Pro abschalten.",
      fit: "du mehr Kontrolle über Inhaltsfilter und einen gehosteten Chat mit lokalem Verlauf willst.",
    },
    nanoGpt: {
      free: "Ein kostenloses Modell im Browser.",
      paid: "Nach Verbrauch oder Pro für {{nanoPro}} im Monat",
      filter: "Nutzungsbedingungen und Modellgrenzen",
      privacy: "Verlauf im Browser, Sync optional",
      api: "API mit Guthaben oder Kontingent",
      media: "Bilder, Video und Sprache",
      open: "Gehostet, proprietär",
      models:
        "NanoGPT bietet offene Modelle und Mainstream-Modelle im Browser und per API. Lade Guthaben ohne Abo auf oder buche einen Tarif mit Kontingent.",
      price:
        "Pro kostet {{nanoPro}} im Monat und umfasst bis zu 60 Millionen Eingabetokens pro Woche für ausgewählte offene Modelle. Bei vier Bildmodellen sind 100 Bilder pro Tag enthalten.",
      pro: "Browser und API greifen auf dasselbe Guthaben zu. Der Verlauf bleibt standardmäßig im Browser. Für die Anmeldung gibt es eine generierte Kennung.",
      con: "Die meisten geschlossenen Modelle sowie Video und Sprache gehen auch mit Pro vom Guthaben ab. Das enthaltene Kontingent gilt nur für bestimmte Modelle.",
      fit: "du unregelmäßig chattest oder ein festes Kontingent vor allem für offene Modelle suchst.",
    },
    chatGpt: {
      free: "Separater ChatGPT-Gratistarif.",
      paid: "Plus für {{plus}} im Monat",
      filter: "OpenAI-Richtlinien",
      privacy: "Kontoverlauf mit Einstellungen zur Trainingsnutzung",
      api: "OpenAI-API wird separat abgerechnet",
      media: "Bilder und Sprache",
      open: "Gehostet, proprietär",
      models:
        "ChatGPT Plus ist das gehostete Abo von OpenAI. Es bündelt OpenAI-Modelle, Sprachchats, Dateianalyse, Bildgenerierung und, wo verfügbar, Deep Research.",
      price:
        "Plus kostet laut OpenAI {{plus}} im Monat. Nutzungslimits können sich ändern. Die API hat eine eigene Abrechnung.",
      pro: "Sprache, Dateien und Recherche liegen in einer App mit übersichtlichem Monatspreis.",
      con: "Nutzungslimits sind möglich. Die Modellauswahl bleibt bei OpenAI und die allgemeine API-Nutzung ist im Abo nicht enthalten.",
      fit: "du vor allem OpenAI-Modelle und die Werkzeuge von ChatGPT nutzt.",
    },
  },
  posts: {
    poe: {
      metaTitle: "8 Alternativen zu Poe im Vergleich (2026)",
      description:
        "Poe-Alternativen mit gemeinsamem Guthaben, Bezahlung nach Verbrauch oder eigenen API-Schlüsseln. Preise, Vor- und Nachteile und {{appName}} im Vergleich.",
      keywords:
        "Poe Alternativen, Alternative zu Poe AI, Poe Punkte, Poe vs TypingMind, OpenRouter Chat, {{appName}}",
      title: "8 Alternativen zu Poe für unterschiedliche Budgets",
      subtitle:
        "Gehostet chatten, nach Verbrauch zahlen oder selbst hosten. Acht Alternativen im Vergleich, darunter {{appName}}.",
      lead: "Poe ist praktisch, wenn du regelmäßig zwischen Modellen wechselst. Wird ein langer Chat unerwartet teuer, prüfe, wie andere Dienste denselben Verlauf abrechnen. Ein Tageskontingent, Guthaben und direkte API-Abrechnung passen zu unterschiedlichen Gewohnheiten.",
      overview: "Was Poe bietet und wie die Abrechnung läuft",
      tradeoff:
        "Poe punktet mit Bot-Verzeichnis, Vergütung für Entwickler und Gruppenchats. Auch bei {{appName}} kostet jede Anfrage Credits. Vergleiche einen langen Chat mit den Modellen, die du tatsächlich verwendest.",
      switch: {
        firstLink: "Verlängerungspreise und Kontingente bei Poe",
        secondLink: "Poe oder Bezahlung nach Verbrauch",
        first:
          "In einer Diskussion bei r/PoeAI berichten Abonnenten von geänderten Verlängerungspreisen und Punktelimits. Eine Person plante daraufhin den Wechsel zu OpenRouter mit TypingMind. Für eine andere lohnte sich der bisherige Tarif weiterhin.",
        second:
          "In einem zweiten Thread lobte eine Person die Kostentransparenz bei OpenRouter. Eine andere hielt das Tageskontingent von Poe bei regelmäßiger Nutzung für günstiger. Das sind persönliche Erfahrungen. Für den Preisvergleich gelten die offiziellen Angaben.",
      },
      criteria: {
        cost: "Wenn du nur gelegentlich viel chattest, vergleiche ein Guthabenmodell mit deinen Abokosten in einem ruhigen Monat. Bei täglicher Nutzung zählt, wie viele echte Gesprächsrunden dein Kontingent abdeckt.",
        workflow:
          "Schreib auf, was du außer dem normalen Chat nutzt. Für Community-Bots und Gruppenchats kann sich Poe lohnen. Zum Vergleichen von Antworten helfen parallele Antworten oder ein Modellwechsel im selben Verlauf.",
      },
      faq: {
        best: {
          q: "Was ist die beste Alternative zu Poe?",
          a: "Für einen gehosteten Chat mit Mainstream-Modellen und unzensierten Modellen gibt es {{appName}}. OpenRouter Chat und NanoGPT rechnen nach Verbrauch ab. Mit TypingMind bringst du eigene Schlüssel mit, mit Open WebUI kannst du lokal arbeiten.",
        },
        free: {
          q: "Gibt es eine kostenlose Alternative zu Poe?",
          a: "{{appName}} gibt Gästen monatlich {{guestCredits}} Gratiscredits. Bei OpenRouter sind einige Modelle gratis. LibreChat und Open WebUI haben beim üblichen Selbsthosting keine Softwaregebühr. Hardware, Hosting und kostenpflichtige Modelle können Geld kosten.",
        },
        billing: {
          q: "Bei welcher Poe-Alternative zahle ich nach Verbrauch?",
          a: "OpenRouter und NanoGPT rechnen Modellnutzung gegen Guthaben ab. TypingMind und LibreChat können Anbieter einbinden, bei denen du direkt zahlst. Was günstiger ist, hängt von Modell, Kontextlänge und Häufigkeit ab.",
        },
        privacy: {
          q: "Wo bleiben meine Chats lokal?",
          a: "Open WebUI kann mit einem lokalen Modell offline laufen. TypingMind speichert den Verlauf mit Lizenz standardmäßig lokal. Auch Venice, NanoGPT und {{appName}} im Inkognitomodus können den Verlauf lokal halten. Gehostete Modelle erhalten dennoch deine Eingabe.",
        },
        switching: {
          q: "Lohnt sich Poe weiterhin für Community-Bots?",
          a: "Oft ja. Andere Dienste haben eigene Agenten oder Werkzeuge. Poes Bot-Verzeichnis, Gruppenchats und Vergütung für Entwickler gehören zur Plattform. Prüf vor dem Wechsel, ob deine wichtigsten Abläufe beim neuen Dienst funktionieren.",
        },
      },
    },
  },
};
