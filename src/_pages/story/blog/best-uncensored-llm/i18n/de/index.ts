import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Bestes unzensiertes LLM 2026: nach Aufgabe gewählt | {{appName}}",
    description:
      "Das beste unzensierte LLM für Analyse, Alltag, Coding, düstere Fiktion, Gegenpositionen und Bilder. GLM 5.3 Uncensored gegen DeepSeek V4.1 Flash Uncensored, mit Kontext und Preisen live.",
    category: "Modell-Guide",
    imageAlt: "Die besten unzensierten LLMs, sortiert nach Aufgabe",
    keywords:
      "bestes unzensiertes LLM, bestes unzensiertes KI-Modell, beste unzensierte KI, bestes abliteriertes Modell, unzensiertes LLM 2026, GLM uncensored vs DeepSeek uncensored, GLM 5.3 uncensored, DeepSeek V4.1 Flash uncensored, bestes unzensiertes Modell für Rollenspiel, bestes unzensiertes Modell zum Programmieren, unzensierte LLM Rangliste, {{appName}}",
  },
  hero: {
    backToBlog: "Zurück zum Blog",
    category: "Modell-Guide",
    readTime: "8 Min. Lesezeit",
    title: "Das beste unzensierte LLM. Nach Aufgabe gewählt, nicht nach Hype.",
    subtitle:
      "Ein Sieger pro Aufgabe aus {{count}} unzensierten Live-Modellen, dazu das direkte Duell GLM gegen DeepSeek. Kontext und Preis live aus unserem Modellregister.",
  },
  intro: {
    lead: "Jede Liste der „besten unzensierten LLMs“ krönt ein einziges Modell. Dann testen Sie es an Ihrer Arbeit, und es ist das falsche. Ein Modell, das düstere Fiktion gut schreibt, ist nicht das, was Sie für Code wollen. Das günstigste ist nicht das, was Sie für ein hartes Argument wollen.",
    p2: "Deshalb nennt diese Liste einen Sieger pro Aufgabe. Jede Empfehlung läuft auf {{appName}} im Browser-Tab, jede Zahl kommt aus unserem Register, und Sie wechseln im selben Chat zwischen allen.",
  },
  method: {
    title: "Wie wir ausgewählt haben",
    intro: "Vier Fragen pro Modell. Keine erfundenen Benchmark-Werte.",
    answers:
      "Antwortet es? Jedes Modell hier gehört zur unzensierten Stufe: Es nimmt die Frage an, statt Sie zu belehren.",
    base: "Wie stark ist die Basis? Abliterierte Flaggschiffe behalten die Intelligenz ihres Labors. Kleine Feintunings tauschen einen Teil davon gegen Stil.",
    context:
      "Wie viel behält es? Der Kontext entscheidet, ob es ein langes Dokument hält oder Seite eins vergisst.",
    price:
      "Was kostet es? Preis pro Referenz-Nachricht, günstigste öffentliche Route, Aufschlag inklusive.",
    callout:
      "Sie wollen Beweise, dass ein Modell antwortet? Unser Verweigerungsindex stellt jedem Modell dieselben Fragen und zählt, wer ablehnt.",
    refusalLink: "Der Verweigerungsindex: Welche KI wirklich antwortet",
  },
  picks: {
    title: "Die Sieger, Aufgabe für Aufgabe",
    intro:
      "Ein Modell pro Aufgabe, keins doppelt. Fällt eine Empfehlung aus, rückt das nächste Modell mit derselben Stärke nach.",
    facts:
      "{{context}} Kontext. {{price}} pro Nachricht. Stark bei: {{strengths}}.",
    reasoning: {
      title: "{{number}}. Am besten für Denken und Analyse: {{model}}",
      body: "Ein Flaggschiff-Basismodell, aus dem die Verweigerungen entfernt wurden. Für Antworten, die echtes Denken brauchen: eine umstrittene Frage zu Ende argumentiert, ein langes Dokument zerlegt, ein Plan auf Herz und Nieren geprüft.",
    },
    everyday: {
      title: "{{number}}. Bestes Modell für den Alltag: {{model}}",
      body: "Schnell, günstig und mit riesigem Gedächtnis. Das Modell, das Sie für normale Fragen, schnelle Entwürfe und lange Chats eingestellt lassen, die auf einem Flaggschiff zu teuer würden.",
    },
    coding: {
      title: "{{number}}. Am besten zum Programmieren: {{model}}",
      body: "Ausgelegt auf Coding und logisches Denken, ohne die Verweigerungen, die Sicherheitsforschung, Scraping oder Reverse-Engineering-Fragen blockieren, denen Mainstream-Assistenten ausweichen.",
    },
    fiction: {
      title:
        "{{number}}. Am besten für Rollenspiel und düstere Fiktion: {{model}}",
      body: "Abgestimmt auf Rollenspiel, auch Dark Roleplay. Bleibt in der Rolle, schreibt die brutale oder explizite Szene und unterbricht die Geschichte nicht für eine Moralpredigt.",
    },
    viewpoint: {
      title: "{{number}}. Am besten für Gegenpositionen: {{model}}",
      body: "Die einzige Empfehlung hier, die kein freigeschaltetes Mainstream-Modell ist. Trainiert mit Büchern und Dokumenten, die im Mainstream-Internet verbannt sind. Das Ergebnis ist ein Modell mit politischen Gegenpositionen. Fragen Sie es, was die anderen nicht sagen, und prüfen Sie die Fakten.",
    },
    vision: {
      title: "{{number}}. Am besten für Bilder: {{model}}",
      body: "Liest die Bilder, die Sie hochladen, und antwortet dazu ohne die üblichen Verweigerungen. Günstig genug für jeden Screenshot.",
    },
  },
  versus: {
    title: "{{a}} vs. {{b}}",
    intro:
      "Die zwei abliterierten Flaggschiffe, die am häufigsten verglichen werden. Gleiche Idee, Verweigerungen entfernt, unterschiedliche Stärken.",
    glm: "{{model}}: die abliterierte Version von GLM-5.3. Wählen Sie sie, wenn die Antwort Tiefe braucht: Denken, Analyse, Code.",
    deepseek:
      "{{model}}: die abliterierte Version von DeepSeek V4.1 Flash. Ein Flash-Modell: günstiger pro Nachricht, schnell, auch für Rollenspiel ausgelegt. Wählen Sie es für Masse.",
    verdict:
      "Kurz gesagt: Denkarbeit an GLM, Masse und Rollenspiel an DeepSeek. Beide antworten. Wechseln Sie mitten im Chat und vergleichen Sie an Ihrer eigenen Frage.",
    compareLink: "Vollständiger Vergleich: {{a}} vs. {{b}}",
  },
  all: {
    title: "Alle {{count}} unzensierten Modelle, das günstigste zuerst",
    intro:
      "Die gesamte unzensierte Stufe auf {{appName}}, Stand jetzt. Klicken Sie auf ein Modell für seine Seite oder starten Sie direkt einen Chat.",
    footnote:
      "Pro Nachricht heißt: ein Referenz-Austausch über die günstigste Route. Lange Chats und lange Antworten kosten mehr. Die Stärken sind Tags aus dem Register.",
  },
  table: {
    model: "Modell",
    context: "Kontext",
    strengths: "Stark bei",
    price: "Pro Nachricht",
    chat: "Ausprobieren",
    chatLink: "Mit {{model}} chatten",
  },
  kinds: {
    title: "Zwei Arten von unzensiert. Wissen Sie, welche Sie wählen.",
    intro: "Hinter dem Etikett steckt ein echter Unterschied.",
    abliterated:
      "Abliterierte und nachtrainierte Versionen: Mainstream- oder offene Modelle, leicht verändert, damit sie Fragen nicht mehr ausweichen. Gleiches Training, gleiches Weltbild. Sie antworten einfach.",
    own: "{{ownModel}}: trainiert mit Büchern und Dokumenten, die im Mainstream-Internet verbannt sind. Das Ergebnis ist ein Modell mit politischen Gegenpositionen.",
    explainerLink:
      "Was Abliteration ist und wie sie sich von anderen Methoden unterscheidet",
    tourLink: "Jedes unzensierte Modell, eins nach dem anderen",
  },
  local: {
    title: "Lokal oder gehostet?",
    intro:
      "Die meisten Bestenlisten gehen davon aus, dass Sie das Modell selbst betreiben. Das ist eine Option.",
    local:
      "Lokal: volle Privatsphäre und kein Preis pro Nachricht, aber die großen Modelle brauchen mehr GPU-Speicher, als irgendein Heim-PC hat.",
    hosted:
      "Gehostet: jedes Modell auf dieser Seite im Browser, auch die in Frontier-Größe. Der Anbieter sieht Ihren Prompt.",
    api: "API: dieselben Modelle über OpenAI- und Anthropic-kompatible Endpunkte. API-Schlüssel werden mit jedem Kauf freigeschaltet.",
    noGpuLink: "Unzensiertes LLM online nutzen, ohne GPU",
    apiLink: "Unzensierte LLM-API: Modell-IDs, Preise, Code",
  },
  pairs: {
    title: "Weitere direkte Duelle",
    intro:
      "Eigenes Weltbild gegen abliteriert, und Basismodelle gegen ihre unzensierten Versionen.",
    link: "{{a}} vs. {{b}}",
  },
  faq: {
    title: "FAQ",
    best: {
      q: "Welches ist insgesamt das beste unzensierte LLM?",
      a: "Für die meisten harten Fragen {{topModel}}: ein Flaggschiff-Basismodell, aus dem die Verweigerungen entfernt wurden. Für Gegenpositionen {{ownModel}}. Für günstige Masse eine Flash-Version. Auf {{appName}} wechseln Sie im selben Chat zwischen allen {{count}}.",
    },
    free: {
      q: "Welches ist das beste kostenlose unzensierte LLM?",
      a: "Online gibt Ihnen {{appName}} {{guestCredits}} Gratis-Credits im Monat ohne Konto und {{freeCredits}} mit kostenlosem Konto. Das günstigste unzensierte Modell, {{cheapestModel}}, kostet {{cheapestPrice}} pro Nachricht. Unzensierte Modelle fragen einmalig nach einer 18+-Bestätigung.",
    },
    roleplay: {
      q: "Welches ist das beste unzensierte Modell für Rollenspiel?",
      a: "Ein Modell, das auf Dark Roleplay abgestimmt ist: Es bleibt in der Rolle und schreibt die harten Szenen. Für politische oder tabuisierte Figuren bringt {{ownModel}} ein Weltbild mit, das die Mainstream-Modelle nicht haben.",
    },
    coding: {
      q: "Welches ist das beste unzensierte Modell zum Programmieren?",
      a: "Eine abliterierte Version eines starken Coding-Modells. Sie behält das Können des Basismodells und verliert die Verweigerungen, die Sicherheitsforschung und andere Fragen blockieren, denen Mainstream-Assistenten ausweichen.",
    },
    quality: {
      q: "Verlieren abliterierte Modelle an Qualität?",
      a: "Etwas, je nach Methode. Abliteration entfernt die Verweigerungsrichtung aus den Gewichten. Gut gemacht, behält das Modell fast sein ganzes Können. Kleine Feintunings können mehr verlieren. Vergleichen Sie ein Basismodell und seine unzensierte Version direkt, bevor Sie sich entscheiden.",
    },
    api: {
      q: "Kann ich diese unzensierten Modelle über eine API nutzen?",
      a: "Ja. Jedes Textmodell hier funktioniert über OpenAI- und Anthropic-kompatible Endpunkte. API-Schlüssel werden mit jedem Kauf freigeschaltet.",
    },
    writerLink: "Die beste unzensierte KI für Autorinnen und Autoren",
    directoryLink: "Alle abliterierten Modelle, gehostet",
    platformsLink: "Unzensierte KI-Plattformen im Vergleich",
  },
  cta: {
    title: "Schluss mit Ranglisten. Stellen Sie die echte Frage.",
    subtitle:
      "{{guestCredits}} Gratis-Credits im Monat, kein Konto nötig. Mit dem Sieger starten, jederzeit wechseln.",
    start: "Mit {{topModel}} chatten",
    models: "Alle Modelle vergleichen",
  },
};
