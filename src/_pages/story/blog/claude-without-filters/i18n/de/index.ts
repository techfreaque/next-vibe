import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Claude ohne Filter: Warum es ablehnt, was hilft | {{appName}}",
    description:
      "Ein unzensiertes Claude gibt es nicht. Warum Claude ablehnt, warum Jailbreaks und Fake-Seiten scheitern und was hilft: Claude plus unzensierte Modelle.",
    category: "Modell-Guide",
    imageAlt: "Claude neben unzensierten Modellen in einem Chat",
    keywords:
      "Claude ohne Filter, Claude unzensiert, unzensiertes Claude, Claude Jailbreak, Claude ohne Einschränkungen, Claude verweigert, Claude Alternative für Fiktion, Claude Alternative ohne Filter, Claude NSFW Alternative, {{appName}}",
  },
  hero: {
    backToBlog: "Zurück zum Blog",
    category: "Modell-Guide",
    readTime: "7 Min. Lesezeit",
    title: "Claude ohne Filter. Warum es das nicht gibt und was funktioniert.",
    subtitle:
      "Behalte {{claudeName}} für das, was es am besten kann. Gib den Rest an {{count}} Modelle ohne Verweigerungsschicht, im selben Thread.",
  },
  intro: {
    lead: "Claude schreibt mit die beste Prosa aller Modelle. Es bricht aber auch mitten in der Szene ab, hängt einen Hinweis an, um den keiner gebeten hat, oder macht aus deinem Schurken einen Therapeuten.",
    p2: "Es gibt keinen Schalter, der das abstellt. Hier steht, warum, was nicht funktioniert und welches Setup funktioniert: {{claudeName}} und unzensierte Modelle nebeneinander, ein Gespräch, ein Guthaben. {{appName}} betreibt beides.",
  },
  why: {
    title: "Warum Claude verweigert",
    intro: "Drei Gründe, und keiner davon ist eine Einstellung.",
    trained:
      "Antrainiert. Anthropic trainiert seine Werte direkt ins Modell. Die Verweigerungen stammen aus dem Training, nicht aus einem Filter, den man abschalten kann.",
    policy:
      "Regeln überall. Anthropics Nutzungsrichtlinien gelten in jeder App und jeder API, die Claude anbietet, auch bei uns. Eine andere Oberfläche ändert das Modell nicht.",
    closed:
      "Geschlossene Gewichte. Außerhalb von Anthropic kann niemand Claude verändern. Offene Modelle lassen sich abliterieren, also leicht verändern, damit sie nicht mehr ausweichen. Claude nicht.",
  },
  tricks: {
    title: "Was nicht funktioniert",
    intro:
      "Jede Woche macht ein neuer Trick die Runde. Sie haben alle dieselben Probleme.",
    jailbreak:
      "Jailbreak-Prompts. Sie werden gepatcht, sie verschlechtern den Text, und Schutzmechanismen auszuhebeln verstößt gegen Anthropics Bedingungen. Dafür werden Konten gesperrt.",
    fiction:
      '"Ist doch nur Fiktion." Hilft bei harmlosem Material. Scheitert genau an den Szenen, auf die es ankommt.',
    fake: '"Uncensored Claude"-Seiten. Entweder ein Jailbreak-Prompt in einer Hülle oder ein anderes Modell unter Claudes Namen. Was davon, kannst du nicht prüfen.',
    callout:
      "Wenn eine Seite unzensiertes Claude verspricht, frag, welches Modell wirklich antwortet. Die ehrliche Antwort ist nie Claude.",
    jailbreakLink: "Warum Jailbreak-Prompts immer wieder brechen",
  },
  switch: {
    title: "Was funktioniert: Modell pro Nachricht wechseln",
    intro:
      "{{claudeName}} und die unzensierten Modelle teilen sich einen Thread. Das Modell wechselt, die Geschichte bleibt.",
    steps: {
      draft: {
        title: "Mit Claude entwerfen",
        body: "Gliederung, Struktur, Dialoge, also die Teile, die {{claudeName}} gut kann.",
      },
      switch: {
        title: "Wechseln, wenn es bockt",
        body: "Wähl für die nächste Nachricht ein unzensiertes Modell. Es liest das ganze Gespräch und schreibt die Szene, die Claude verweigert hat.",
      },
      back: {
        title: "Zum Feinschliff zurück",
        body: "Gib den Text für das Lektorat an Claude zurück, wenn der Inhalt es zulässt. Oder schreib unzensiert weiter.",
      },
      compare: {
        title: "Mit demselben Prompt vergleichen",
        body: "Unsicher, welche Stimme passt? Schick einen Prompt an zwei Modelle und behalte den besseren Entwurf.",
      },
    },
  },
  models: {
    title: "Claude und die unzensierten Picks im Vergleich",
    intro:
      "Unter jedem Namen: Inhaltsstufe oder Art der Entzensierung. Live aus unserem Katalog.",
    colModel: "Modell",
    colContext: "Kontext",
    colStrengths: "Stark bei",
    colPrice: "Pro Nachricht",
    colChat: "Ausprobieren",
    chatLink: "Mit {{model}} chatten",
    footnote:
      "Preis einer Referenznachricht inklusive unseres Aufschlags von {{markup}} %.",
  },
  picks: {
    title: "Welches unzensierte Modell für welche Aufgabe",
    intro: "Gleicher Chat wie Claude. Wähl nach Aufgabe, nicht nach Hype.",
    long: {
      title: "Lange kreative Arbeit: {{model}}",
      body: "Moonshot AIs Flaggschiff-Kimi, abliteriert. Hält einen langen Plot zusammen und denkt ihn durch. {{price}} pro Nachricht.",
    },
    fast: {
      title: "Schneller Allrounder: {{model}}",
      body: "Ein Mainstream-Modell, leicht verändert, damit es nicht mehr ausweicht. Flott, scharf, gut bei Prosa und Code. {{price}} pro Nachricht.",
    },
    contrary: {
      title: "Ansichten, die Claude nicht ausspricht: {{model}}",
      body: "{{model}} ist auf Büchern und Dokumenten trainiert, die aus dem Mainstream-Internet verbannt wurden, und vertritt deshalb politische Gegenpositionen. Für Figuren und Essays, die gegen den Konsens argumentieren. {{price}} pro Nachricht.",
    },
    roleplay: {
      title: "Figuren und dunkle Szenen: {{model}}",
      body: "Auf Rollenspiel feinabgestimmt. Bleibt in der Rolle und tritt nicht aus der Geschichte, um dich zu warnen. {{price}} pro Nachricht.",
    },
    cheap: {
      title: "Günstige Rohfassungen: {{model}}",
      body: "DeepSeek ohne Verweigerungen. Schnell und preiswert für viele Entwürfe. {{price}} pro Nachricht.",
    },
    compareLink: "{{a}} gegen {{b}}",
    writerLink: "Unzensierter KI-Schreibassistent: der ganze Guide",
  },
  limits: {
    title: "Die ehrlichen Grenzen",
    intro: "Keine Verweigerungen heißt nicht keine Kompromisse.",
    style:
      "Andere Stimmen. Jedes Modell schreibt anders. Probier zwei an derselben Szene, bevor du dich festlegst.",
    mistakes:
      "Gleiche Fehler. Unzensierte Modelle liegen bei Fakten so oft daneben wie die Originale. Prüf, was zählt.",
    claude:
      "Claude bleibt Claude. Ein Modellwechsel ändert nichts daran, was Claude selbst schreibt. Du bist nur nicht mehr darauf angewiesen.",
    callout:
      "Unzensierte Modelle werden nach einer einmaligen Bestätigung ab 18 freigeschaltet. Du entscheidest, was du liest.",
  },
  faq: {
    title: "FAQ",
    can: {
      q: "Kann Claude unzensiert sein?",
      a: "Nein. Claudes Verweigerungen sind in ein geschlossenes Modell trainiert, also kann sie niemand entfernen. Alles, was als unzensiertes Claude verkauft wird, ist ein Prompt-Trick oder ein anderes Modell. Offene Modelle ohne Verweigerungen sind die echte Alternative.",
    },
    jailbreak: {
      q: "Ist es erlaubt, Claude zu jailbreaken?",
      a: "Nein. Schutzmechanismen zu umgehen verstößt gegen Anthropics Nutzungsrichtlinien und kann dich dein Konto kosten. Außerdem leidet der Text. Der Wechsel zu einem Modell ohne Verweigerungsschicht bringt dasselbe Ergebnis ohne das Risiko.",
    },
    best: {
      q: "Was ist die beste Claude-Alternative für Fiktion?",
      a: "Für lange, dunkle oder explizite Fiktion: ein abliteriertes Modell wie {{firstName}}. Für Figuren, die gegen den Mainstream argumentieren: {{ownModel}}. Für Rollenspiel: ein Rollenspiel-Finetune. Auf {{appName}} stehen alle direkt neben Claude.",
    },
    same: {
      q: "Kann ich Claude und ein unzensiertes Modell in einem Chat nutzen?",
      a: "Ja. Du wählst das Modell pro Nachricht. Der Gesprächsverlauf geht mit, also macht das unzensierte Modell genau da weiter, wo Claude aufgehört hat.",
    },
    api: {
      q: "Kann ich Claude und unzensierte Modelle über eine API aufrufen?",
      a: "Ja. OpenAI- und Anthropic-kompatible Endpunkte, ein Schlüssel für Claude und die unzensierten Modelle. Dein erster Kauf schaltet API-Schlüssel frei, Pläne gibt es ab {{apiSubPrice}} im Monat.",
    },
    free: {
      q: "Kann ich es kostenlos testen?",
      a: "Ja. {{guestCredits}} Gratis-Credits im Monat ohne Konto, {{freeCredits}} mit einem kostenlosen Konto. Unzensierte Modelle inklusive, nach einer einmaligen Bestätigung ab 18.",
    },
    chatLink: "Unzensierter KI-Chat: Modell wählen und loslegen",
    roleplayLink: "KI-Rollenspiel ohne Filter",
    refusalLink: "Refusal Index: wer antwortet, wer verweigert",
  },
  cta: {
    title: "Claudes Feder behalten. Die Bremse loswerden.",
    subtitle:
      "{{guestCredits}} Gratis-Credits im Monat, kein Konto nötig. Starte mit {{firstName}}.",
    start: "Unzensierten Chat starten",
    models: "Alle Modelle vergleichen",
  },
};
