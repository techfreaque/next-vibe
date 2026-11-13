import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  page: {
    title: "next-vibe Blog",
    subtitle:
      "Tiefgehende Einblicke in Architektur, Entscheidungen und die Ideen hinter next-vibe und {{appName}}.",
    meta: {
      title: "Blog - next-vibe & {{appName}}",
      description:
        "Engineering-Deep-Dives, Architekturentscheidungen und die Ideen hinter next-vibe und {{appName}}.",
      category: "Blog",
      imageAlt: "next-vibe & {{appName}} Blog",
      keywords:
        "next-vibe, {{appName}}, Blog, TypeScript, Architektur, SaaS, KI, Open-Source, Engineering",
    },
  },
  posts: {
    chatgptAlternative: {
      title: "ChatGPT-Alternative ohne Filter. Den Filtergrad bestimmst du.",
      category: "Ratgeber",
      excerpt:
        "Mainstream-Modelle behalten ihre Filter überall. Hier stehen offene und unzensierte Modelle daneben, und du wählst pro Nachricht. Was sich ändert, was es kostet und wann ChatGPT trotzdem besser passt.",
      readTime: "7 Min. Lesezeit",
    },
    codingTools: {
      title: "Ein Key. Jedes Modell. Codex und Claude Code inklusive.",
      category: "Entwickler-Guide",
      excerpt:
        "Codex CLI, Claude Code, OpenCode, Continue, Aider und Cline mit einem API-Key, unzensierte Modelle inklusive. Eine Basis-URL, ein Befehl pro Tool, unsere Stolperfallen.",
      readTime: "8 Min. Lesezeit",
    },
    uncensoredGuide: {
      title: "Die unzensierten Modelle, eins nach dem anderen.",
      category: "Modell-Guide",
      excerpt:
        "UncensoredLM für düsteres Rollenspiel, Politik und andere Perspektiven: das eine von Grund auf unzensierte Modell. Dazu Venice, GLM, Qwen, Gemma, Arya, FreedomGPT und mehr, mit Stärken und Schwächen.",
      readTime: "7 Min. Lesezeit",
    },
    modelRefresh: {
      title: "Die neuesten Modelle sind da. Unzensiert wird ernst.",
      category: "Modell-Update",
      excerpt:
        "Claude 5.5, GPT-6, Gemini 4 Argon, Grok 4.7 und frische offene Modelle. Dazu NanoGPT, ein größeres Venice-Angebot und die ersten unzensierten Bildmodelle.",
      readTime: "5 Min. Lesezeit",
    },
    whatsNewNovember2026: {
      title:
        "Sechs Monate auf einer Seite: schneller, sicherer, läuft überall.",
      category: "Produkt-Update",
      excerpt:
        "Stopp heißt Stopp. Spracheingabe läuft auf dem iPhone. Deine KI folgt dir über Rechner hinweg. Selbst hosten ohne Docker. Alles seit Mai.",
      readTime: "6 Min. Lesezeit",
    },
    hermesThea: {
      title: "Zwei KIs. Ein Gespräch. Beide Richtungen.",
      category: "Hermes & Thea",
      excerpt:
        "Hermes auf deinem Rechner, Thea auf dem Server - jetzt übergibt jede der beiden Threads an die andere. Und ein fehlender API-Key bremst keinen Turn mehr aus.",
      readTime: "6 Min. Lesezeit",
    },
    codingAgent: {
      title: "Deine KI öffnet ein Terminal und übergibt an Claude Code.",
      category: "Coding-Agent",
      excerpt:
        "Das Coding-Agent-Tool delegiert echte Code-Änderungen an Claude Code oder OpenCode - im Hintergrund oder live im Terminalfenster, mit automatischer Rückmeldung. Jetzt auch instanzübergreifend.",
      readTime: "5 Min. Lesezeit",
    },
    e2eTests: {
      title:
        "Ein Roboter hat jeden Button geklickt. Er fand acht Sicherheitslücken.",
      category: "Engineering",
      excerpt:
        "Schluss mit Einzelteil-Tests - wir testen Seiten. Ein echter Browser auf jedem kundenrelevanten Endpoint, und der Open Redirect, die SSRF und die Datenlecks, die er fand.",
      readTime: "7 Min. Lesezeit",
    },
    whatsNewMay2026: {
      title: "Cortex. Dreamer. Autopilot. Deine KI erinnert sich jetzt.",
      category: "Produkt-Update",
      excerpt:
        "Persistenter Speicher, naechtliche Reflexion, automatische Ausfuehrung. Dazu Mediengenerierung und {{credits}} Credits, ein ganzer Monat gratis, fuer ehrliches Feedback.",
      readTime: "6 Min. Lesezeit",
    },
    whatsNewApril2026: {
      title: "unbottled ist zurück. Und es ist jetzt wirklich gut.",
      category: "Produkt-Update",
      excerpt:
        "Neue Modelle, Bild-/Video-/Musikgenerierung und ein komplett überarbeitetes Onboarding. Wenn du früh abgesprungen bist - wir wollen, dass du es nochmal probierst.",
      readTime: "5 Min. Lesezeit",
    },
    oneCodebase: {
      title: "Eine Codebase. 13 Plattformen. Ohne Kompromisse.",
      category: "Architektur",
      excerpt:
        "Eine einzige Endpoint-Definition wird gleichzeitig zum Webformular, CLI-Befehl, MCP-Tool, nativen Screen und Cron-Job. So funktioniert das.",
      readTime: "12 Min. Lesezeit",
    },
    typeChecker: {
      title: "Wie mein Type-Checker die KI vom Lügen abgehalten hat",
      category: "TypeScript",
      excerpt:
        "KI nutzt `any`, um Typfehlern auszuweichen. Sie fügt eslint-disable hinzu. Sie lügt dich an. So haben wir die Feedbackschleife repariert.",
      readTime: "10 Min. Lesezeit",
    },
    tradingBot: {
      title: "Wie mein toter Trading-Bot zur Monitoring-Engine wurde",
      category: "Vibe Sense",
      excerpt:
        "Ich hab einen Trading-Bot aufgegeben. Jahre später wurde seine Architektur zum spannendsten Teil von next-vibe. Die Pipeline besteht nur aus Endpoints.",
      readTime: "14 Min. Lesezeit",
    },
    oneEndpoint: {
      title: "Ein Endpoint. Jede Oberfläche.",
      category: "Architektur",
      excerpt:
        "Eine definition.ts pro Feature. Es rendert als Webformular, CLI-Befehl, MCP-Tool, nativer Screen, Cron-Job - gleichzeitig.",
      readTime: "5 Min. Lesezeit",
    },
    referralBeginners: {
      title:
        "Ich hab noch nie Affiliate-Marketing gemacht. Kann ich damit wirklich Geld verdienen?",
      category: "Empfehlungen",
      excerpt:
        "Ehrliche Antwort: Ja, mit realistischen Erwartungen. So funktioniert das wiederkehrende Provisionsmodell, wenn du noch nie jemanden empfohlen hast.",
      readTime: "6 Min. Lesezeit",
    },
    referralAffiliatePros: {
      title: "Ich bin Affiliate-Marketer. Was ist bei KI-Abos anders?",
      category: "Empfehlungen",
      excerpt:
        "Der Basiswert ist höher und steigt mit der Zeit. Monatlich wiederkehrende Provisionen von KI-Abonnenten, die mehr ausgeben, je besser die Plattform wird.",
      readTime: "7 Min. Lesezeit",
    },
    referralDevelopers: {
      title: "Du hast was mit KI gebaut. Jetzt verdien damit, es zu teilen.",
      category: "Empfehlungen",
      excerpt:
        "Dein Empfehlungslink ist ein Einkommensstrom, den du noch nicht angezapft hast. Blog-Posts, READMEs, Tutorials - die Rechnung für technische Zielgruppen.",
      readTime: "5 Min. Lesezeit",
    },
    skillSharingEconomy: {
      title: "Deine AI Skills sind bares Geld wert. So verdienst du damit.",
      category: "Skill Economy",
      excerpt:
        "Erstelle eigene AI Skills, teile sie mit deinem Empfehlungslink und verdiene 10 % wiederkehrende Provision von jedem Nutzer, der sich über deine Skill-Seite anmeldet.",
      readTime: "6 Min. Lesezeit",
    },
    referralLanding: {
      title: "10 % direkt. +5 %, wenn andere deinen Skill teilen. Für immer.",
      category: "Empfehlungen",
      excerpt:
        "Die vollständige Mechanik des Empfehlungs- und Skill-Programms - Kettenaufschlüsselung, genaue Prozentsätze pro Ebene, Auszahlungsoptionen und wie der Skill-Bonus stapelt.",
      readTime: "4 Min. Lesezeit",
    },
  },
  cta: {
    title: "Neue Beiträge direkt ins Postfach.",
    subtitle:
      "Architektur-Deep-Dives und Produkt-Updates, sobald sie live sind. Kein Füllstoff, Abmeldung mit einem Klick.",
    newsletter: "Newsletter abonnieren",
    framework: "next-vibe entdecken",
  },
  labels: {
    readMore: "Weiterlesen",
    allPosts: "Alle Beiträge",
    featured: "Empfohlen",
  },
};
