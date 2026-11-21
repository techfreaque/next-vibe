import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Unzensiertes LLM online: ohne GPU, ohne Installation | {{appName}}",
    description:
      "Unzensiertes LLM online nutzen, ganz ohne Grafikkarte. Wie viel VRAM lokale Modelle wirklich brauchen, welche abliterierten und unzensierten Modelle im Browser laufen und was eine Nachricht kostet.",
    category: "Modell-Guide",
    imageAlt: "Ein unzensiertes LLM online, ganz ohne GPU",
    keywords:
      "unzensiertes LLM online, unzensiertes LLM ohne GPU, Online-Alternative zu lokalem LLM, lokales LLM Alternative online, unzensierte KI ohne Grafikkarte, abliteriertes Modell online, unzensiertes Modell im Browser, VRAM für lokale LLMs, Ollama Alternative online, LM Studio Alternative, {{appName}}",
  },
  hero: {
    backToBlog: "Zurück zum Blog",
    category: "Modell-Guide",
    readTime: "8 Min. Lesezeit",
    title: "Unzensiertes LLM online. Ohne GPU. Ohne Installation.",
    subtitle:
      "Was ein lokales unzensiertes Modell wirklich von Ihrer Hardware verlangt, und {{count}} unzensierte Modelle, die stattdessen im Browser-Tab laufen. Preise und Kontext live aus unserem Modellregister.",
  },
  intro: {
    lead: "Jeder Ratgeber zu unzensierten Modellen sagt dasselbe: herunterladen, lokal ausführen. Dann schauen Sie auf Ihre Grafikkarte. Die großen Modelle brauchen mehr Speicher, als ein Gaming-PC hat. Die kleinen, die passen, sind nicht die, von denen alle schwärmen.",
    p2: "Es gibt einen zweiten Weg. Dieselbe Art Modell, gehostet, im Browser-Tab. Keine GPU, keine Treiber, kein 40-GB-Download. Dieser Guide zeigt, was lokal wirklich kostet, wann es trotzdem gewinnt und welche {{count}} unzensierten Modelle gerade auf {{appName}} laufen.",
  },
  table: {
    model: "Modell",
    context: "Kontext",
    price: "Pro Nachricht",
  },
  hardware: {
    title: "Was lokaler Betrieb wirklich verlangt",
    intro:
      "Der Speicher ist die Grenze. Die Gewichte des Modells müssen in den VRAM Ihrer Grafikkarte passen (oder in den Unified Memory eines Macs), sonst wird es zäh. Das sind die unzensierten Modelle in unserem Katalog mit veröffentlichter Parameterzahl.",
    colParams: "Parameter",
    colMemory: "Gewichte bei 4 Bit / 8 Bit",
    paramsValue: "{{count}} Mrd.",
    memoryValue: "{{q4}} GB / {{q8}} GB",
    unknown: "Nicht veröffentlicht",
    footnote:
      "Nur die Gewichte, berechnet aus der Parameterzahl: rund 0,5 GB pro Milliarde Parameter bei 4 Bit, 1 GB bei 8 Bit. Kontext (KV-Cache) und Laufzeit kommen obendrauf, lange Chats brauchen deutlich mehr.",
    small:
      "Bis etwa 12 GB Gewichte: passt auf eine 16-GB-Karte, mit Luft für Kontext.",
    mid: "20 bis 40 GB: eine 24-GB-Karte bei 4 Bit und kurzem Kontext, zwei Karten oder ein Mac mit sehr viel Unified Memory.",
    large:
      "Hunderte GB: kein Heimrechner. Das sind die Modelle in Frontier-Größe, und praktisch nutzbar sind sie nur gehostet.",
    callout:
      "Quantisierung macht die Datei kleiner und kostet etwas Qualität. Eine 4-Bit-Version eines mittelgroßen Modells fühlt sich anders an als das volle Modell in der Cloud.",
  },
  local: {
    title: "Wann lokal trotzdem die richtige Wahl ist",
    intro:
      "Lokal ist nicht falsch. Es ist ein Tausch. Tools wie Ollama und LM Studio machen es einfach, wenn die Hardware mitspielt.",
    winsTitle: "Wo lokal gewinnt",
    offline:
      "Offline: kein Internet, kein Konto, kein Anbieter dazwischen. Nichts verlässt den Rechner.",
    catchTitle: "Der Haken",
    verdict:
      "Kurz gesagt: Starke Grafikkarte, volle Privatsphäre gewünscht und ein mittelgroßes Modell reicht? Lokal ausführen. Sie wollen die großen Modelle, langen Kontext oder einfach in der nächsten Minute eine Antwort? Online nutzen.",
  },
  online: {
    title: "{{count}} unzensierte Modelle direkt im Browser",
    intro:
      "Jedes aktuelle unzensierte Modell auf {{appName}}, das günstigste zuerst. Kontext und Preis pro Nachricht kommen direkt aus unserem Modellregister. Ein Klick, und Sie chatten.",
    colChat: "Ausprobieren",
    chatLink: "Mit {{model}} chatten",
    footnote:
      "Pro Nachricht heißt: ein Referenz-Austausch über die günstigste Route. Lange Chats und lange Antworten kosten mehr. Alle laufen auf Servern, Ihr Laptop braucht nur einen Browser.",
    directoryLink: "Alle abliterierten Modelle mit Kontext und Preis",
  },
  steps: {
    title: "In einer Minute zur ersten Antwort",
    intro: "Kein Download, zum Start kein Konto nötig.",
    open: {
      title: "Chat öffnen",
      body: "Klicken Sie oben auf ein Modell oder starten Sie einen Inkognito-Chat. Gäste erhalten {{guestCredits}} Gratis-Credits pro Monat.",
    },
    pick: {
      title: "Modell wählen",
      body: "In der Modellauswahl die unzensierte Stufe wählen. Mitten im Gespräch wechseln geht jederzeit, der Verlauf bleibt.",
    },
    confirm: {
      title: "18+ bestätigen",
      body: "Unzensierte Modelle fragen einmal nach der Bestätigung, dass Sie volljährig sind, und nach den Nutzungsbedingungen. Danach bleiben sie freigeschaltet.",
    },
    ask: {
      title: "Die echte Frage stellen",
      body: "Die, der andere Assistenten ausweichen. Kein Jailbreak-Prompt, keine Rollenspiel-Verpackung.",
    },
  },
  kinds: {
    title: "Zwei Arten von unzensiert, beide online",
    intro: "Unzensiert ist nicht gleich unzensiert.",
    abliterated:
      "Abliterierte und nachtrainierte Versionen: Mainstream- oder offene Modelle, leicht verändert, damit sie Fragen nicht mehr ausweichen. Gleiches Training, gleiches Weltbild. Sie antworten einfach.",
    own: "{{ownModel}}: trainiert mit Büchern und Dokumenten, die im Mainstream-Internet verbannt sind. Das Ergebnis ist ein Modell mit politischen Gegenpositionen. Es läuft gehostet, über uncensored.ai.",
    link: "Abliteriert, nachtrainiert oder eigenes Weltbild: die Unterschiede",
  },
  privacy: {
    title: "Was ein gehostetes Modell sieht",
    intro:
      "Online heißt: Das Modell läuft auf einem fremden Server. So sieht es aus, wer was sieht.",
    transit:
      "Jede Nachricht läuft über unseren Server zum Anbieter, der das Modell betreibt. Der Anbieter sieht den Prompt, unter seinen eigenen Bedingungen. So funktioniert jede gehostete KI.",
    incognito:
      "Inkognito-Chats liegen im lokalen Speicher Ihres Browsers, nicht auf unseren Servern. Browserdaten löschen, und sie sind weg.",
    selfHost:
      "{{appName}} ist Open Source. Selbst hosten und mit Ihren eigenen lokalen Modellen verbinden, wenn nichts den Rechner verlassen darf.",
    selfHostLink: "{{appName}} selbst hosten",
    callout:
      "Darf ein Prompt Ihre Hardware nie verlassen, dann lokal. Für alles andere ist gehostet der schnelle Weg.",
  },
  cost: {
    title: "Was es kostet: lokal gegen online",
    intro:
      "Lokal gibt es keinen Preis pro Nachricht. Die Hardware ist der Preis.",
    guest:
      "Online bei uns: {{guestCredits}} Gratis-Credits im Monat ohne Konto, {{freeCredits}} mit kostenlosem Konto.",
    plan: "Abos ab {{subPrice}} im Monat. Credit-Pakete stocken ein aktives Abo auf und verfallen nie.",
    local:
      "Lokal: gratis pro Nachricht, aber eine Grafikkarte für die großen Modelle kostet mehr als Jahre gehosteter Chats. Dazu der Strom.",
  },
  pairs: {
    title: "Das Basismodell neben seiner unzensierten Version",
    intro:
      "Gleiches Labor, gleiche Größe, ohne Verweigerungen. Kontext, Preis und Filter im direkten Vergleich.",
    link: "{{a}} vs. {{b}}",
  },
  faq: {
    title: "FAQ",
    gpu: {
      q: "Kann ich ein unzensiertes LLM ohne GPU nutzen?",
      a: "Ja, gehostet. Das Modell läuft auf den Servern des Anbieters, Sie brauchen nur einen Browser. Auf {{appName}} sind das {{count}} unzensierte Modelle, auch solche in Frontier-Größe, die kein Heim-PC stemmt.",
    },
    free: {
      q: "Gibt es ein kostenloses unzensiertes LLM online?",
      a: "Auf {{appName}} erhalten Sie {{guestCredits}} Gratis-Credits im Monat ohne Konto und {{freeCredits}} mit kostenlosem Konto. Wie viele Nachrichten das sind, hängt vom Modell und der Chatlänge ab. Unzensierte Modelle verlangen einmalig eine 18+-Bestätigung.",
    },
    vram: {
      q: "Wie viel VRAM brauche ich für ein lokales unzensiertes Modell?",
      a: "Faustregel für die Gewichte: etwa 0,5 GB pro Milliarde Parameter bei 4 Bit, 1 GB bei 8 Bit. Ein 24B-Modell braucht bei 4 Bit rund 12 GB, ein 70B-Modell etwa 35 bis 40 GB. Kontext und Laufzeit kommen dazu.",
    },
    private: {
      q: "Ist ein unzensiertes LLM online privat?",
      a: "Weniger privat als lokal. Der Anbieter, der das Modell betreibt, sieht Ihren Prompt. Auf {{appName}} bleiben Inkognito-Chats im Speicher Ihres Browsers, nicht auf unseren Servern. Für Prompts, die den Rechner nie verlassen dürfen: lokal ausführen.",
    },
    offline: {
      q: "Kann ich ein unzensiertes Modell offline nutzen?",
      a: "Ein gehostetes nicht. Offline heißt lokal: ein Modell herunterladen, das in Ihren Speicher passt, und es mit einem Tool wie Ollama oder LM Studio ausführen.",
    },
    truly: {
      q: "Sind abliterierte Modelle wirklich unzensiert?",
      a: "Sie verweigern nicht mehr, behalten aber Training und Weltbild ihres Basismodells. {{ownModel}} ist anders: trainiert mit Büchern und Dokumenten, die im Mainstream-Internet verbannt sind. Das Ergebnis ist ein Modell mit politischen Gegenpositionen.",
    },
    chatLink: "Unzensierter KI-Chat im Browser",
    platformsLink:
      "Unzensierte KI-Plattformen im Vergleich, lokale Tools inklusive",
  },
  cta: {
    title: "Kein Download. Jetzt fragen.",
    subtitle:
      "{{guestCredits}} Gratis-Credits im Monat, kein Konto nötig. Unzensiertes Modell wählen, jederzeit wechseln.",
    start: "Unzensierten Chat starten",
    models: "Alle Modelle vergleichen",
  },
};
