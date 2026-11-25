import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "DeepSeek unzensiert: abliteriertes DeepSeek online | {{appName}}",
    description:
      "Wo DeepSeeks Zensur wirklich sitzt, warum ein anderer Host nur die Hälfte löst und welche unzensierten Builds du sofort im Browser nutzt. Ohne GPU, ohne Konto.",
    category: "Modell-Guide",
    imageAlt:
      "DeepSeek unzensiert: Standard-DeepSeek neben seinen abliterierten Builds",
    keywords:
      "DeepSeek unzensiert, unzensiertes DeepSeek, DeepSeek abliterated, DeepSeek ohne Zensur, DeepSeek V4.1 Flash Uncensored, DeepSeek Zensur, DeepSeek Tiananmen, DeepSeek unzensiert online, DeepSeek Jailbreak Alternative, {{appName}}",
  },
  hero: {
    backToBlog: "Zurück zum Blog",
    category: "Modell-Guide",
    readTime: "7 Min. Lesezeit",
    title: "DeepSeek unzensiert. Was den Filter wirklich entfernt.",
    subtitle:
      "{{count}} unzensierte DeepSeek-Builds direkt neben Standard-DeepSeek. Ab {{buildPrice}} pro Nachricht, im Browser.",
  },
  intro: {
    lead: "DeepSeek ist schnell, günstig und stark beim Programmieren. Stellst du die falsche Frage, wird es still, wechselt das Thema oder löscht seine eigene Antwort.",
    p2: "Dieses Verhalten hat zwei Quellen, und die meisten Lösungen erwischen nur eine. Hier: wo die Zensur sitzt, die drei Wege drumherum und die unzensierten DeepSeek-Builds, die gerade auf {{appName}} laufen, mit Live-Preisen.",
  },
  where: {
    title: "Wo DeepSeeks Zensur sitzt",
    intro: "Zwei Schichten. Sie lassen sich unterschiedlich entfernen.",
    app: "Die App-Schicht. DeepSeeks eigene Chat-App und Website legen eine Moderation über das Modell. Antworten zu Themen, die in China heikel sind, brechen mitten im Satz ab oder werden durch eine Standardantwort ersetzt.",
    weights:
      "Die Gewichte. Das Modell selbst wurde darauf trainiert, manchen Themen auszuweichen und andere abzulehnen, wie jedes Mainstream-Modell. Das wandert mit, egal wo es läuft.",
    hosts:
      "Fremde Hosts. Weil DeepSeek seine Gewichte veröffentlicht, betreiben andere Firmen dasselbe Modell ohne DeepSeeks App-Schicht. Das Live-Löschen hört auf. Die antrainierten Verweigerungen bleiben.",
    callout:
      "DeepSeek woanders laufen zu lassen entfernt den App-Filter. Nur ein veränderter Build entfernt die Verweigerungen, die im Modell selbst stecken.",
  },
  ways: {
    title: "Drei Wege zu DeepSeek ohne Filter",
    intro: "Vom meisten Aufwand zum geringsten.",
    localTitle: "1. Die offenen Gewichte selbst betreiben",
    local:
      "Die vollen DeepSeek-Modelle sind viel zu groß für eine Heim-GPU. Die meisten kleinen Downloads mit DeepSeek im Namen sind Distillate: eine Qwen- oder Llama-Basis, trainiert auf DeepSeek-Ausgaben. Nützlich, aber ein anderes Modell mit anderen Verweigerungen.",
    hostedTitle: "2. Standard-DeepSeek bei einem anderen Anbieter",
    hosted:
      "Schluss mit dem Live-Löschen, die antrainierten Ausweichmanöver bleiben. Gut für Code und Alltag. Nicht die Lösung, wenn Verweigerungen dein Problem sind.",
    buildTitle: "3. Einen unzensierten Build nutzen",
    build:
      "Jemand hat die DeepSeek-Gewichte genommen und das Verweigerungsverhalten entfernt, meist per Abliteration. Gleiches Modell, gleiche Geschwindigkeit, gleiches Kontextfenster. Es weicht nicht mehr aus. Gehostet, also nichts zu installieren.",
    noGpuLink: "Unzensiertes LLM online nutzen, ganz ohne GPU",
  },
  models: {
    title: "DeepSeek-Modelle auf dieser Plattform",
    intro:
      "Erst die unzensierten Builds, dann die Standardmodelle, aus denen sie stammen. Live aus unserem Katalog.",
    colModel: "Modell",
    colContext: "Kontext",
    colStrengths: "Stark bei",
    colPrice: "Pro Nachricht",
    colChat: "Ausprobieren",
    chatLink: "Mit {{model}} chatten",
    footnote:
      "Preis einer Referenznachricht inklusive unseres Aufschlags von {{markup}} %. Unter jedem Namen steht, wie ein Build entstanden ist.",
  },
  builds: {
    title: "Die {{count}} unzensierten DeepSeek-Builds",
    intro: "Gleiche Modellfamilie, andere Handschrift.",
    venice:
      "Läuft bei Venice.ai, Verweigerungen entfernt, Tool-Aufrufe intakt. Stark bei: {{strengths}}. Eine Referenznachricht kostet {{price}}.",
    csf: "Ein abliterierter Build des unabhängigen Entwicklers jcartu, mit Reasoning und Tool-Aufrufen. Stark bei: {{strengths}}. Eine Referenznachricht kostet {{price}}.",
    chatLink: "Mit {{model}} chatten",
    abliteration:
      "Abliteration findet die Richtung in den Aktivierungen des Modells, die eine Verweigerung auslöst, und entfernt sie aus den Gewichten. Alles andere, was das Modell gelernt hat, bleibt, wo es war. Deshalb programmiert ein abliteriertes DeepSeek weiter wie DeepSeek.",
    explainerLink: "Abliterierte und unzensierte Modelle, erklärt",
  },
  compare: {
    title: "Standard gegen unzensiert, direkt nebeneinander",
    intro:
      "Kontext, Preis, Stärken und Verweigerungsverhalten auf einer Seite. Dann schickst du beiden denselben Prompt.",
    link: "{{a}} gegen {{b}}",
  },
  limits: {
    title: "Was ein unzensierter Build nicht ändert",
    intro: "Verweigerungen entfernen löst ein Problem. Nicht jedes.",
    knowledge:
      "Wissen. Das Modell weiß, was in seinen Trainingsdaten stand. Wer eine Verweigerung entfernt, fügt keine Fakten hinzu, die es nie gesehen hat.",
    slant:
      "Tendenz. Abliteration entfernt Verweigerungen, nicht die Schlagseite der Trainingsdaten. Wenn du ein Modell willst, das dem Mainstream bewusst widerspricht: {{ownModel}} ist auf Büchern und Dokumenten trainiert, die aus dem Mainstream-Internet verbannt wurden, und vertritt deshalb politische Gegenpositionen.",
    mistakes:
      "Fehler. Ein unzensiertes Modell liegt genauso oft daneben wie das Original. Prüf Fakten, auf die es ankommt.",
    callout:
      "Unzensierte Modelle werden nach einer einmaligen Bestätigung ab 18 freigeschaltet. Was du mit den Antworten machst, entscheidest du.",
  },
  faq: {
    title: "FAQ",
    censored: {
      q: "Ist DeepSeek zensiert?",
      a: "Ja, in zwei Schichten. DeepSeeks eigene App moderiert Antworten zu Themen, die in China heikel sind, und das Modell selbst wurde darauf trainiert, manchen Anfragen auszuweichen oder sie abzulehnen. Andere Hosts entfernen die erste Schicht. Nur ein unzensierter Build entfernt die zweite.",
    },
    exists: {
      q: "Gibt es ein unzensiertes DeepSeek?",
      a: "Ja. {{appName}} betreibt {{count}} unzensierte DeepSeek-Builds, allen voran {{buildName}}. Sie behalten DeepSeeks Fähigkeiten und Kontextfenster und weichen nicht mehr aus.",
    },
    local: {
      q: "Kann ich unzensiertes DeepSeek lokal betreiben?",
      a: "Nur mit ernsthafter Hardware. Die vollen Modelle brauchen weit mehr Speicher, als ein Gaming-PC hat. Die kleinen DeepSeek-Downloads sind meist Distillate auf anderen Basismodellen. Gehostete Builds ersparen dir die Hardwarefrage.",
    },
    china: {
      q: "Beantwortet unzensiertes DeepSeek Fragen zu China?",
      a: "Antrainiertes Ausweichen bei diesen Themen ist genau die Art Verweigerung, die Abliteration entfernt. Wie gut die Antwort ist, hängt trotzdem davon ab, was das Modell gelernt hat. Stell {{stockName}} und einem unzensierten Build dieselbe Frage und vergleiche.",
    },
    api: {
      q: "Kann ich unzensiertes DeepSeek per API nutzen?",
      a: "Ja. Dieselben Builds laufen über OpenAI- und Anthropic-kompatible Endpunkte. Dein erster Kauf schaltet API-Schlüssel frei, Pläne gibt es ab {{apiSubPrice}} im Monat.",
    },
    free: {
      q: "Kann ich es kostenlos testen?",
      a: "Ja. {{guestCredits}} Gratis-Credits im Monat ohne Konto, {{freeCredits}} mit einem kostenlosen Konto. Das reicht für viele Nachrichten mit den günstigeren Builds.",
    },
    directoryLink: "Alle abliterierten Modelle mit Kontext und Preis",
    bestLink: "Das beste unzensierte LLM, nach Aufgabe gewählt",
    refusalLink: "Refusal Index: wer antwortet, wer verweigert",
  },
  cta: {
    title: "DeepSeeks Verstand. Ohne Ausweichen.",
    subtitle:
      "{{guestCredits}} Gratis-Credits im Monat, kein Konto nötig. Starte mit {{buildName}}.",
    start: "Mit unzensiertem DeepSeek chatten",
    models: "Alle Modelle vergleichen",
  },
};
