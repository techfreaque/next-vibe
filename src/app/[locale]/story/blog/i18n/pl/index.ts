import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  page: {
    title: "Blog next-vibe",
    subtitle:
      "Dogłębne analizy architektury, decyzji i pomysłów stojących za next-vibe i unbottled.ai.",
    meta: {
      title: "Blog - next-vibe",
      description:
        "Głębokie nurkowania w inżynierię, decyzje architektoniczne i pomysły za next-vibe i unbottled.ai.",
      category: "Blog",
      imageAlt: "Blog next-vibe",
      keywords:
        "next-vibe, blog, TypeScript, architektura, SaaS, AI, open-source, inżynieria",
    },
  },
  posts: {
    oneCodebase: {
      title: "Jedna baza kodu. 13 platform. Zero kompromisów.",
      category: "Architektura",
      excerpt:
        "Jedna definicja endpointu. Formularz web, polecenie CLI, narzędzie MCP, ekran natywny, zadanie cron - jednocześnie. Oto jak to działa.",
      readTime: "12 min czytania",
    },
    typeChecker: {
      title:
        "Zbudowałem sprawdzacz typów, który sprawił, że AI przestało mnie okłamywać",
      category: "TypeScript",
      excerpt:
        "AI używa `any`, żeby uciec przed błędem typów. Dodaje eslint-disable. Kłamie ci w oczy. Oto jak naprawiliśmy tę pętlę sprzężenia zwrotnego.",
      readTime: "10 min czytania",
    },
    tradingBot: {
      title:
        "Mój martwy bot tradingowy stał się silnikiem monitorowania platformy",
      category: "Vibe Sense",
      excerpt:
        "Porzuciłem bota tradingowego. Lata później jego architektura stała się najciekawszą częścią next-vibe. Potok to tylko endpointy.",
      readTime: "14 min czytania",
    },
    fired: {
      title: "Zostałem zwolniony. To jest to, co zamiast tego zbudowałem.",
      category: "VibeFrame",
      excerpt:
        "Sfederowany silnik widżetów, który zbudowałem w pracy, której już nie mam. Teraz każdy endpoint next-vibe można osadzić wszędzie w dwóch tagach script.",
      readTime: "11 min czytania",
    },
    hackernews: {
      title: "Show HN: next-vibe",
      category: "Społeczność",
      excerpt:
        "Post, który piszemy dla Hacker News. Supremacja TypeScript, zunifikowane powierzchnie i bot tradingowy, który nie może handlować.",
      readTime: "5 min czytania",
    },
    referralBeginners: {
      title:
        "Nigdy nie robiłem marketingu afiliacyjnego. Czy naprawdę mogę tu zarobić?",
      category: "Polecenia",
      excerpt:
        "Uczciwa odpowiedź: tak, z realistycznymi oczekiwaniami. Jak działa model prowizji cyklicznych, gdy nigdy wcześniej nikogo nie poleciłeś.",
      readTime: "6 min czytania",
    },
    referralAffiliatePros: {
      title: "Jestem marketerem afiliacyjnym. Co jest inne w subskrypcjach AI?",
      category: "Polecenia",
      excerpt:
        "Poziom bazowy jest wyższy i rośnie z czasem. Miesięczne prowizje od abonentów AI, którzy wydają więcej w miarę jak platforma staje się potężniejsza.",
      readTime: "7 min czytania",
    },
    referralDevelopers: {
      title: "Zbudowałeś coś z AI. Teraz zarabiaj na dzieleniu się tym.",
      category: "Polecenia",
      excerpt:
        "Twój link polecający to strumień przychodów, którego jeszcze nie uruchomiłeś. Posty na blogu, README, tutoriale - matematyka dla odbiorców technicznych.",
      readTime: "5 min czytania",
    },
  },
  labels: {
    readMore: "Czytaj więcej",
    allPosts: "Wszystkie posty",
    featured: "Wyróżniony",
    new: "Nowy",
    draft: "Szkic",
    referralSection: "Program poleceń",
  },
  ui: {
    heroTagline: "next-vibe · unbottled.ai",
    featuredFileBar:
      "definition.ts → web · cli · mcp · native · cron · 10 więcej",
    hnSiteName: "Hacker News",
    hnNav: "dodaj · zaloguj · nowe · pytaj · pokaż · praca",
    hnPoints: "punkty:",
    hnComments: "komentarze:",
    hnAuthor: "autor:",
    hnTags: "> next-vibe · TypeScript · OSS · SaaS · AI",
    hnDraftPoints: "— (nie zgłoszono)",
    hnDraftComments: "— (nie zgłoszono)",
    hnDraftStatus: "szkic",
    vibeFrameEmbedCaption:
      "Dowolny endpoint. Dwa tagi script. Na każdej stronie.",
  },
};
