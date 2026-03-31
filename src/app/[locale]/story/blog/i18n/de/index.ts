import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  page: {
    title: "next-vibe Blog",
    subtitle:
      "Tiefe Einblicke in die Architektur, Entscheidungen und Ideen hinter next-vibe und unbottled.ai.",
    meta: {
      title: "Blog - next-vibe",
      description:
        "Engineering-Deep-Dives, Architekturentscheidungen und die Ideen hinter next-vibe und unbottled.ai.",
      category: "Blog",
      imageAlt: "next-vibe Blog",
      keywords:
        "next-vibe, Blog, TypeScript, Architektur, SaaS, KI, Open-Source, Engineering",
    },
  },
  posts: {
    oneCodebase: {
      title: "Eine Codebasis. 13 Plattformen. Keine Kompromisse.",
      category: "Architektur",
      excerpt:
        "Eine Endpoint-Definition. Webformular, CLI-Befehl, MCP-Tool, nativer Screen, Cron-Job – gleichzeitig. So funktioniert es.",
      readTime: "12 Min. Lesezeit",
    },
    typeChecker: {
      title:
        "Ich baute einen Type-Checker, der KI zum Aufhören mit Lügen brachte",
      category: "TypeScript",
      excerpt:
        "KI benutzt `any`, um einem Typfehler zu entkommen. Sie fügt eslint-disable hinzu. Sie lügt dich an. So haben wir die Feedbackschleife behoben.",
      readTime: "10 Min. Lesezeit",
    },
    tradingBot: {
      title:
        "Mein toter Trading-Bot wurde zu einer Plattform-Monitoring-Engine",
      category: "Vibe Sense",
      excerpt:
        "Ich gab einen Trading-Bot auf. Jahre später wurde seine Architektur der interessanteste Teil von next-vibe. Die Pipeline sind nur Endpoints.",
      readTime: "14 Min. Lesezeit",
    },
    fired: {
      title: "Ich wurde gefeuert. Das habe ich stattdessen gebaut.",
      category: "VibeFrame",
      excerpt:
        "Eine föderierte Widget-Engine, die ich bei einem Job gebaut habe, den ich nicht mehr habe. Jetzt ist jeder next-vibe-Endpoint in zwei Script-Tags einbettbar.",
      readTime: "11 Min. Lesezeit",
    },
    hackernews: {
      title: "Show HN: next-vibe",
      category: "Community",
      excerpt:
        "Der Post, den wir für Hacker News schreiben. TypeScript-Suprematie, vereinheitlichte Oberflächen und ein Trading-Bot, der nicht handeln kann.",
      readTime: "5 Min. Lesezeit",
    },
    referralBeginners: {
      title:
        "Ich habe noch nie Affiliate-Marketing gemacht. Kann ich hier wirklich Geld verdienen?",
      category: "Empfehlungen",
      excerpt:
        "Ehrliche Antwort: Ja, mit realistischen Erwartungen. So funktioniert das wiederkehrende Provisionsmodell, wenn du noch nie jemanden empfohlen hast.",
      readTime: "6 Min. Lesezeit",
    },
    referralAffiliatePros: {
      title: "Ich bin Affiliate-Marketer. Was ist anders bei KI-Abonnements?",
      category: "Empfehlungen",
      excerpt:
        "Der Basiswert ist höher und steigt mit der Zeit. Monatlich wiederkehrende Provisionen von KI-Abonnenten, die mehr ausgeben, je leistungsfähiger die Plattform wird.",
      readTime: "7 Min. Lesezeit",
    },
    referralDevelopers: {
      title: "Du hast etwas mit KI gebaut. Jetzt verdiene damit beim Teilen.",
      category: "Empfehlungen",
      excerpt:
        "Dein Empfehlungslink ist ein Einkommensstrom, den du noch nicht aktiviert hast. Blog-Posts, READMEs, Tutorials - die Mathematik für technische Zielgruppen.",
      readTime: "5 Min. Lesezeit",
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
    heroTagline: "next-vibe · unbottled.ai",
    featuredFileBar:
      "definition.ts → web · cli · mcp · native · cron · 10 mehr",
    hnSiteName: "Hacker News",
    hnNav: "submit · login · neu · fragen · zeigen · jobs",
    hnPoints: "Punkte:",
    hnComments: "Kommentare:",
    hnAuthor: "Autor:",
    hnTags: "> next-vibe · TypeScript · OSS · SaaS · KI",
    hnDraftPoints: "— (nicht eingereicht)",
    hnDraftComments: "— (nicht eingereicht)",
    hnDraftStatus: "Entwurf",
    vibeFrameEmbedCaption:
      "Jeder Endpunkt. Zwei Script-Tags. Auf jeder Website.",
  },
};
