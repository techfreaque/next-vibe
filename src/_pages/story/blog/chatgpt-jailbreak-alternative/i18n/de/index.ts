import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "ChatGPT-Jailbreak geht nicht mehr? Das hier schon | {{appName}}",
    description:
      "Alternativen zu ChatGPT-Jailbreak-Prompts im Vergleich: {{appName}}, Venice, LM Studio und Ollama. Mit Modellauswahl, Datenschutz und Kosten.",
    category: "Modell-Guide",
    imageAlt:
      "ChatGPT-Jailbreak-Prompts im Vergleich mit unzensierten Modellen",
    keywords:
      "ChatGPT Jailbreak, ChatGPT Jailbreak Prompt, DAN Prompt, ChatGPT Filter umgehen, ChatGPT ohne Filter, ChatGPT ohne Einschränkungen, funktioniert ChatGPT Jailbreak noch, Alternative zum Jailbreak, unzensierte ChatGPT Alternative, abliteriertes Modell, {{appName}}",
  },
  hero: {
    backToBlog: "Zurück zum Blog",
    category: "Modell-Guide",
    readTime: "7 Min. Lesezeit",
    title: "Alternativen zu ChatGPT-Jailbreaks im Vergleich",
    subtitle:
      "Vergleiche Cloud-Chats und lokale Modelle nach Limits, Kosten und Datenschutz. Dazu {{count}} Modelle für Schreiben und Rollenspiel.",
  },
  intro: {
    lead: "Ein Prompt, der ChatGPT heute anders antworten lässt, kann nach einem Update anders wirken. Wähle ein Modell, das zu deinen Texten oder Rollenspielen passt.",
    p2: "Vergleiche zuerst gehostete Chats und lokale Apps. Dazu findest du {{count}} Modelle auf {{appName}} mit Kontextfenster und aktuellen Preisen.",
  },
  why: {
    title: "Warum ChatGPT-Jailbreaks immer wieder brechen",
    intro:
      "Drei Schichten stehen zwischen Ihrem Prompt und einer klaren Antwort.",
    weights:
      "Die Verweigerung steckt in den Gewichten. GPT-Modelle sind darauf trainiert, ganze Kategorien von Anfragen abzulehnen. Ein Jailbreak entfernt dieses Training nicht, er versucht es zu umreden, ein Gespräch nach dem anderen.",
    patched:
      "Bekannte Jailbreaks werden wegtrainiert. Sobald ein Prompt sich verbreitet, landet er in der nächsten Runde Sicherheitstraining. Deshalb scheitert heute der Prompt vom letzten Monat.",
    layer:
      "Dazu kann eine Kontrolle außerhalb des Modells kommen. Mainstream-Apps können Ein- und Ausgaben moderieren, sodass selbst eine fertige Antwort markiert oder entfernt wird.",
  },
  cost: {
    title: "Was ein Jailbreak Sie wirklich kostet",
    intro: "Selbst wenn er funktioniert, zahlen Sie dafür.",
    quality:
      "Schlechtere Antworten. Das Modell steckt seine Mühe in die Rolle statt in die Antwort. Persona-Antworten sind aufgebläht, theatralisch und oft ungenauer.",
    unstable:
      "Keine Verlässlichkeit. Derselbe Prompt klappt in einem Chat und scheitert im nächsten. Darauf baut man keinen Arbeitsablauf.",
    account:
      "Risiko fürs Konto. Die Nutzungsrichtlinien von ChatGPT gelten für jeden Prompt, und OpenAI kann Konten einschränken oder sperren, die dagegen verstoßen. Ein Jailbreak ist der Versuch, genau das absichtlich zu tun.",
    time: "Verlorene Zeit. Prompts suchen, testen und umformulieren dauert länger, als die Frage einfach zu stellen.",
    callout:
      "Ein Jailbreak behandelt das Symptom. Die Verweigerung kommt aus dem Training des Modells, also nehmen Sie ein Modell, das anders trainiert wurde.",
  },
  instead: {
    title: "Das Modell, das keinen Jailbreak braucht",
    intro: "Zwei Arten unzensierter Modelle, zwei verschiedene Lösungen.",
    abliteratedTitle:
      "Abliteriert: die Verweigerung aus den Gewichten entfernt",
    abliterated:
      "Eine Studie von 2024 fand, dass Verweigerung in den getesteten Chat-Modellen weitgehend über eine einzige Richtung im Netz läuft. Abliteration entfernt diese Richtung aus den Gewichten. Das Ergebnis: dasselbe Modell, gleiches Wissen, gleicher Stil, das Fragen kaum noch ausweicht. Keine Prompt-Tricks, denn es gibt nichts mehr auszutricksen.",
    ownTitle: "{{ownModel}}: ein anderes Weltbild",
    own: "{{ownModel}} ist mit Büchern und Dokumenten trainiert, die im Mainstream-Internet verbannt sind. Das Ergebnis ist ein Modell mit politischen Gegenpositionen. Kein Mainstream-Modell ohne Bremse, sondern ganz andere Ansichten.",
    sources: {
      paper:
        "Arditi et al., Refusal in language models is mediated by a single direction (2024)",
      blog: "Maxime Labonne, Uncensor any LLM with abliteration",
    },
    link: "Abliteriert, nachtrainiert oder eigenes Weltbild: die ganze Erklärung",
  },
  models: {
    title: "{{count}} unzensierte Modelle, kein Jailbreak nötig",
    intro:
      "Jedes aktuelle unzensierte Modell auf unserer Plattform, das günstigste zuerst. Kontext und Preis aus unserem Modellregister.",
    colModel: "Modell",
    colContext: "Kontext",
    colPrice: "Pro Nachricht",
    colChat: "Ausprobieren",
    chatLink: "Mit {{model}} chatten",
    footnote:
      "Pro Nachricht heißt: ein Referenz-Austausch über die günstigste Route. Lange Chats und lange Antworten kosten mehr.",
  },
  test: {
    title: "Machen Sie den Test: gleiche Frage, zwei Modelle",
    intro:
      "Glauben Sie uns nicht. Stellen Sie die Frage, für die Sie den Jailbreak wollten.",
    steps: {
      ask: {
        title: "Ein Mainstream-Modell fragen",
        body: "Chat starten, GPT oder ein anderes Mainstream-Modell wählen. Die Frage stellen, der es sonst ausweicht. Antwort merken.",
      },
      switch: {
        title: "Auf ein unzensiertes Modell wechseln",
        body: "Für die nächste Nachricht das Modell wechseln, im selben Chat. Einmalig 18+ bestätigen, wenn danach gefragt wird.",
      },
      compare: {
        title: "Noch einmal fragen, vergleichen",
        body: "Gleiche Frage, keine Persona, keine Tricks. Länge, Direktheit und Genauigkeit vergleichen.",
      },
      keep: {
        title: "Das behalten, das antwortet",
        body: "Jederzeit zurückwechseln. Mainstream-Modelle für harten Code, unzensierte für die Fragen, die andere nicht anfassen.",
      },
    },
    compareLink: "{{a}} vs. {{b}}: direkter Vergleich",
  },
  limits: {
    title: "Was kein Modell abschafft",
    intro: "Unzensiert ist keine Magie. Kennen Sie die Grenzen.",
    decline:
      "Es kann trotzdem ablehnen. Abliteration entfernt die meisten antrainierten Verweigerungen, nicht alle. Das Ergebnis hängt von Modell und Prompt ab.",
    wrong:
      "Es kann sich trotzdem irren. Kein Filter heißt auch: Niemand glättet eine schlechte Antwort. Prüfen Sie Fakten, die zählen.",
    adult:
      "Nur für Volljährige. Unzensierte Modelle werden nach einer einmaligen 18+-Bestätigung und den Nutzungsbedingungen freigeschaltet.",
    callout:
      "Was Sie erzeugen und veröffentlichen, verantworten Sie selbst, und das Recht Ihres Landes gilt weiterhin.",
  },
  faq: {
    title: "FAQ",
    work: {
      q: "Funktionieren ChatGPT-Jailbreak-Prompts noch?",
      a: "Manchmal, kurz. Beliebte Prompts werden wegtrainiert und die Moderation fängt viele Ausgaben ab, ein funktionierender Prompt hält also selten lange. Ein Modell ohne antrainierte Verweigerung ist der verlässliche Weg.",
    },
    dan: {
      q: "Was ist der DAN-Prompt?",
      a: "DAN (Do Anything Now) ist ein Rollenspiel-Jailbreak, der ChatGPT anweist, eine Persona ohne Regeln zu spielen. Seine Versionen werden eine nach der anderen gepatcht, und Persona-Antworten sind meist schlechter als normale.",
    },
    ban: {
      q: "Kann mein Konto für einen ChatGPT-Jailbreak gesperrt werden?",
      a: "Die Nutzungsrichtlinien von OpenAI gelten für jeden Prompt, und OpenAI kann Konten einschränken oder sperren, die dagegen verstoßen. Ein Modell, das fürs Antworten gebaut ist, umgeht das Problem ganz.",
    },
    gpt: {
      q: "Kann ich GPT auf {{appName}} ohne Filter nutzen?",
      a: "Nein. GPT behält die Schutzmechanismen von OpenAI überall, auch hier. Für ungefilterte Antworten wählen Sie eines der {{count}} unzensierten Modelle. Zwischen GPT und ihnen wechseln Sie im selben Chat.",
    },
    legal: {
      q: "Ist es legal, ein unzensiertes KI-Modell zu nutzen?",
      a: "Ein Modell ist ein Werkzeug. Was Sie erzeugen und veröffentlichen, liegt in Ihrer Verantwortung, und es gilt das Recht Ihres Landes. Auf {{appName}} werden unzensierte Modelle nach einer einmaligen 18+-Bestätigung freigeschaltet.",
    },
    free: {
      q: "Kann ich ein unzensiertes Modell kostenlos testen?",
      a: "Ja. {{appName}} gibt {{guestCredits}} Gratis-Credits im Monat ohne Konto und {{freeCredits}} mit kostenlosem Konto, {{maxCredits}} mit Newsletter. Wie viele Nachrichten das sind, hängt vom Modell und der Chatlänge ab.",
    },
    alternativeLink: "ChatGPT-Alternative ohne Filter: unsere Modellwahl",
    refusalLink: "Welche KI antwortet wirklich? Der Verweigerungs-Index",
    chatLink: "Unzensierter KI-Chat im Browser",
  },
  cta: {
    title: "Kein Jailbreak. Einfach fragen.",
    subtitle:
      "{{guestCredits}} Gratis-Credits im Monat, kein Konto nötig. Unzensiertes Modell wählen und direkt fragen.",
    start: "Unzensierten Chat starten",
    models: "Alle Modelle vergleichen",
  },
};
