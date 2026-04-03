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
    fired: {
      title: "Ich wurde gefeuert. Das hier hab ich stattdessen gebaut.",
      category: "VibeFrame",
      excerpt:
        "Eine föderierte Widget-Engine, die ich neben einem Job gebaut hab, den ich nicht mehr habe. Jetzt ist jeder next-vibe-Endpoint mit zwei Script-Tags einbettbar.",
      readTime: "11 Min. Lesezeit",
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
  },
  labels: {
    readMore: "Weiterlesen",
    allPosts: "Alle Beiträge",
    featured: "Empfohlen",
    new: "Neu",
    draft: "Entwurf",
    referralSection: "Empfehlungsprogramm",
  },
  ui: {
    heroTagline: "next-vibe · {{appName}}",
    featuredFileBar:
      "definition.ts → web · cli · mcp · native · cron · 10 mehr",
    vibeFrameEmbedCaption:
      "Jeder Endpoint. Zwei Script-Tags. Auf jeder Website.",
  },
};
