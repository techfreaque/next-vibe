export const translations = {
  meta: {
    title: "Skill bauen — Eigene KI für alles",
    description:
      "Jeden Workflow in einen wiederverwendbaren KI-Skill verwandeln. Skill-Seite nutzen oder Thea im Chat fragen. Kein Code nötig.",
    category: "Skills",
    imageAlt: "Eigenen KI-Skill auf {{appName}} erstellen",
    keywords:
      "KI-Skill erstellen, eigene KI, Skill Creator, {{appName}}, System Prompt, KI-Persona",
  },
  hero: {
    badge: "Skill Creator",
    title: "Skill bauen.",
    titleLine2: "KI besitzen.",
    subtitle:
      "Persona, Modell, Tools, Stimme — einmal konfiguriert, für immer deins. Für alles bauen. Teilen. Verdienen.",
    ctaPrimary: "Skill erstellen",
    ctaSecondary: "Thea oder Hermes fragen",
  },
  what: {
    title: "Ein Skill ist eine gespeicherte KI-Konfiguration.",
    subtitle: "Einmal einrichten. Überall nutzen. Mit jedem teilen.",
    item0Label: "System Prompt",
    item0Body:
      "Identität und Anweisungen. 200–500 Wörter. Fühlt sich wie eine Person an, nicht wie ein FAQ.",
    item1Label: "Modellauswahl",
    item1Body:
      "Nach Intelligenz, Content-Level und Preis filtern — oder ein Modell fest pinnen.",
    item2Label: "Tools",
    item2Body:
      "Exakte Whitelist: Suche, Bildgenerierung, Memory, Code, Musik, Video.",
    item3Label: "Stimme",
    item3Body: "Sprachmodell für gesprochene Antworten auswählen.",
  },
  ways: {
    title: "Zwei Wege zum Skill",
    subtitle: "Den nehmen, der passt.",
    way1Badge: "Skill-Seite",
    way1Title: "Erstellen-Button in der Skill-Liste",
    way1Body:
      "Skill-Seite öffnen oder Modell-Selector in einem Chat-Thread klicken. Erstellen drücken. Formular ausfüllen — Name, System Prompt, Modell, Tools. Fertig.",
    way1Detail:
      "Kein Wizard, keine Extra-Schritte. Das Formular ist die gesamte Config.",
    way1Cta: "Skills öffnen",
    way2Badge: "Chat",
    way2Title: "Thea oder Hermes fragen",
    way2Body:
      'Thread öffnen: "Bau mir einen klinischen Reasoning-Skill für Medizinstudenten." Der Skill-Creator-Subagent stellt ein paar Fragen, schreibt den Prompt, wählt das Modell, konfiguriert Tools, erstellt den Skill, pinnt ihn in die Sidebar.',
    way2Detail:
      "Thea delegiert an den Skill Creator — Subagent mit skill-create, favorite-create, tool-help. Beschreiben, er baut.",
    way2Cta: "Chat öffnen",
  },
  prompt: {
    title: "System Prompt, der funktioniert",
    subtitle:
      "Das Herzstück. Ein guter fühlt sich wie eine Person an — kein Policy-Dokument.",
    dos: "Was funktioniert",
    donts: "Was es tötet",
    do0Title: "Mit Identität beginnen",
    do0Body: '"Du bist [Name], ein [Rolle], der [X tut]." Erste Zeile, immer.',
    do1Title: "3–5 konkrete Merkmale",
    do1Body:
      '"Direkt und sokratisch" schlägt "hilfreich und informativ". Immer.',
    do2Title: "Expertise-Bereich festlegen",
    do2Body:
      "Was sie tiefgreifend beherrscht. Wo sie weiterverweist. Keine Mehrdeutigkeit.",
    do3Title: "Kommunikationsstil vorgeben",
    do3Body: '"Antworte immer in einem Absatz" ist eine gültige Anweisung.',
    do4Title: "Unter 500 Wörter",
    do4Body:
      "Das Modell liest den vollen Prompt bei jedem Turn. Kürzer gewinnt.",
    dont0Title: "AGB-artige Regellisten",
    dont0Body:
      '"Sei immer hilfreich, sei nie unhöflich" — jede KI bekommt das. Reines Rauschen.',
    dont1Title: '"Sei immer hilfreich"',
    dont1Body: "Das Modell weiß es bereits. Weglassen.",
    dont2Title: "Widersprüchliche Einschränkungen",
    dont2Body:
      '"Sei kreativ, aber bleib immer beim Thema" — das Modell sichert ewig ab. Eines wählen.',
    dont3Title: "Lange Fähigkeitslisten",
    dont3Body:
      "Das Modell weiß, was es kann. Die Docs nicht im Prompt wiederholen.",
  },
  examples: {
    title: "Skills, die Leute tatsächlich bauen",
    item0Name: "Klinisches Reasoning",
    item0Category: "Bildung",
    item0Desc:
      "Denkt wie ein erfahrener Kliniker. Fälle, Differenzialdiagnosen, Entscheidungen unter Druck.",
    item1Name: "Code Reviewer",
    item1Category: "Coding",
    item1Desc:
      "Kennt den Stack, erzwingt Team-Konventionen. Mit Suche für Docs verbunden.",
    item2Name: "Uncensored Writer",
    item2Category: "Kreativ",
    item2Desc:
      "Fiktion, Roleplay, Debatte ohne Plattform-Filterung. Uncensored-Modelle.",
    item3Name: "Persönlicher Mentor",
    item3Category: "Companion",
    item3Desc:
      "Sokratisch, direkt, wachstumsorientiert. Persönlichkeit aus der Philosophie des Erstellers.",
    item4Name: "Research Agent",
    item4Category: "Analyse",
    item4Desc:
      "Durchsucht Brave und Kagi, ruft Seiten ab, synthetisiert, speichert im Memory.",
    item5Name: "Der Experte, den man sich nicht leisten kann",
    item5Category: "Spezialist",
    item5Desc:
      "Berater, Anwalt, Finanzberater — destilliert in einen Skill. 400 €/Std.-Wissen, kostenlos.",
  },
  dev: {
    title: "Für Entwickler: skill.ts",
    body: "Next-vibe lokal? Den Agenten bitten, eine Skill-Datei zu generieren. Gleiche Struktur wie jeder eingebaute Skill — compile-ready, commit-ready.",
    note: "Der Agent kennt das vollständige Schema. Beschreiben, was gebraucht wird — er generiert, registriert, sofort live.",
  },
  cta: {
    title: "Deinen bauen.",
    subtitle:
      "Beschreiben, was du willst. Der Skill Creator erledigt den Rest.",
    primary: "Skill erstellen",
    secondary: "Thea oder Hermes fragen",
  },
};
