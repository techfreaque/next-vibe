import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  page: {
    title: "Blog next-vibe",
    subtitle:
      "Dogłębne analizy architektury, decyzji i pomysłów stojących za next-vibe i {{appName}}.",
    meta: {
      title: "Blog - next-vibe & {{appName}}",
      description:
        "Głębokie nurkowania w inżynierię, decyzje architektoniczne i pomysły za next-vibe i {{appName}}.",
      category: "Blog",
      imageAlt: "next-vibe & {{appName}} Blog",
      keywords:
        "next-vibe, {{appName}}, blog, TypeScript, architektura, SaaS, AI, open-source, inżynieria",
    },
  },
  posts: {
    chatgptAlternative: {
      title: "Alternatywa dla ChatGPT bez filtrów. Poziom ustawiasz ty.",
      category: "Poradnik",
      excerpt:
        "Modele mainstreamowe wszędzie mają swoje filtry. Tutaj stoją obok modeli otwartych i niecenzurowanych, a ty wybierasz przy każdej wiadomości. Co się zmienia, ile to kosztuje i kiedy ChatGPT nadal wygrywa.",
      readTime: "7 min czytania",
    },
    codingTools: {
      title: "Jeden klucz. Każdy model. Prosto w twoim agencie.",
      category: "Przewodnik dla programistów",
      excerpt:
        "OpenCode, Continue, Codex CLI i Claude Code na jednym kluczu API, modele niecenzurowane w zestawie. Sprawdzone konfiguracje, most, którego potrzebują dwa z nich, i pułapki, na które wpadliśmy.",
      readTime: "9 min czytania",
    },
    uncensoredGuide: {
      title: "Modele niecenzurowane, jeden po drugim.",
      category: "Przewodnik po modelach",
      excerpt:
        "UncensoredLM do mrocznego roleplay, polityki i innych punktów widzenia: jedyny zbudowany bez cenzury. Do tego Venice, GLM, Qwen, Gemma, Arya, FreedomGPT i więcej, z mocnymi i słabymi stronami.",
      readTime: "7 min czytania",
    },
    modelRefresh: {
      title: "Najnowsze modele już są. Bez cenzury - na poważnie.",
      category: "Nowe modele",
      excerpt:
        "Claude 5.5, GPT-6, Gemini 4 Argon, Grok 4.7 i świeże modele otwarte. Do tego NanoGPT, większa oferta Venice i pierwsze modele graficzne bez cenzury.",
      readTime: "5 min czytania",
    },
    whatsNewNovember2026: {
      title:
        "Pół roku na jednej stronie: szybciej, bezpieczniej, działa wszędzie.",
      category: "Aktualizacja produktu",
      excerpt:
        "Stop znaczy stop. Dyktowanie działa na iPhonie. Twoje AI idzie za Tobą między komputerami. Self-hosting bez Dockera. Wszystko od maja.",
      readTime: "6 min czytania",
    },
    hermesThea: {
      title: "Dwa AI. Jedna rozmowa. W obie strony.",
      category: "Hermes i Thea",
      excerpt:
        "Hermes na Twoim komputerze, Thea na serwerze - teraz każde z nich przekazuje wątki drugiemu. A brak klucza API już nie zatrzymuje tury.",
      readTime: "6 min czytania",
    },
    codingAgent: {
      title: "Twoje AI otwiera terminal i przekazuje robotę Claude Code.",
      category: "Agent kodujący",
      excerpt:
        "Narzędzie coding-agent zleca prawdziwe zmiany w kodzie Claude Code albo OpenCode - w tle lub na żywo w oknie terminala, z automatycznym meldunkiem. Teraz także między instancjami.",
      readTime: "5 min czytania",
    },
    e2eTests: {
      title: "Robot kliknął każdy przycisk. Znalazł osiem luk bezpieczeństwa.",
      category: "Inżynieria",
      excerpt:
        "Przestaliśmy testować kawałki, zaczęliśmy testować strony. Prawdziwa przeglądarka na każdym endpoincie klienta - i open redirect, SSRF oraz wycieki danych, które wyłapała.",
      readTime: "7 min czytania",
    },
    whatsNewMay2026: {
      title: "Cortex. Dreamer. Autopilot. Twoja AI w koncu pamieta.",
      category: "Aktualizacja produktu",
      excerpt:
        "Trwala pamiec, nocna refleksja, automatyczne dzialanie. Do tego generowanie mediow i {{credits}} kredytow, pelny miesiac gratis, za szczere opinie.",
      readTime: "6 min czytania",
    },
    whatsNewApril2026: {
      title: "unbottled wróciło. I jest teraz naprawdę dobre.",
      category: "Aktualizacja produktu",
      excerpt:
        "Nowe modele, generowanie obrazów/wideo/muzyki i całkowicie przeprojektowany onboarding. Jeśli odszedłeś wcześnie - chcemy, żebyś spróbował jeszcze raz.",
      readTime: "5 min czytania",
    },
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
    oneEndpoint: {
      title: "Jeden endpoint. Każda powierzchnia.",
      category: "Architektura",
      excerpt:
        "Jeden plik definition.ts na funkcję. Renderuje się jako formularz web, polecenie CLI, narzędzie MCP, ekran natywny, zadanie cron - jednocześnie.",
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
    skillSharingEconomy: {
      title: "Stwórz skill. Udostępnij link. Zarabiaj co miesiąc.",
      category: "Ekonomia Skilli",
      excerpt:
        "Skille to wstępnie skonfigurowane ustawienia AI, które tworzysz raz i udostępniasz wszędzie. Link w URL skilla przynosi Ci 10% cyklicznie od każdej rejestracji przez niego.",
      readTime: "7 min czytania",
    },
    referralLanding: {
      title:
        "10% bezpośrednio. +5%, gdy inni udostępniają Twój skill. Na zawsze.",
      category: "Polecenia",
      excerpt:
        "Pełna mechanika programu poleceń i skilli - podział łańcucha, dokładne procenty na każdym poziomie, opcje wypłat i jak bonus za skill się nakłada.",
      readTime: "4 min czytania",
    },
  },
  cta: {
    title: "Nowe wpisy prosto na Twoją skrzynkę.",
    subtitle:
      "Architektura od kuchni i nowości w produkcie, gdy tylko wyjdą. Bez lania wody, wypis jednym kliknięciem.",
    newsletter: "Zapisz się do newslettera",
    framework: "Poznaj next-vibe",
  },
  labels: {
    readMore: "Czytaj więcej",
    allPosts: "Wszystkie posty",
    featured: "Wyróżniony",
  },
};
