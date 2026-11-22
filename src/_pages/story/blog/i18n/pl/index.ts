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
    bestUncensoredLlm: {
      title:
        "Najlepszy nieocenzurowany LLM. Według zadania, nie według hype'u.",
      category: "Przewodnik po modelach",
      excerpt:
        "Jeden zwycięzca na zadanie: rozumowanie, codzienny czat, kod, mroczna fikcja, przeciwne poglądy i obrazy. Do tego GLM 5.3 Uncensored kontra DeepSeek V4.1 Flash Uncensored, z cenami na żywo.",
      readTime: "8 min czytania",
    },
    uncensoredWriter: {
      title: "AI do pisania bez cenzury. Twoja historia, bez wygładzania.",
      category: "Poradnik pisarski",
      excerpt:
        "Modele, które piszą złoczyńców, przemoc i sceny dla dorosłych wprost, ile stron rękopisu mieści każdy z nich i sposób pracy scena po scenie, dzięki któremu książka powstaje.",
      readTime: "8 min czytania",
    },
    unbiasedChatbot: {
      title: "Nie ma bezstronnego chatbota AI. Zapytaj kilka.",
      category: "Poradnik",
      excerpt:
        "Dlaczego każdy model ma przechył, jak modele mainstreamowe, abliterowane i przekorne ujmują to samo pytanie i cztery kroki, by w jednym czacie usłyszeć każdą stronę.",
      readTime: "7 min czytania",
    },
    noSignUp: {
      title: "Czat AI bez rejestracji. Bez maila. Bez numeru telefonu.",
      category: "Poradnik",
      excerpt:
        "Co dostajesz bez konta, od których modeli najtaniej zacząć i uczciwa lista tego, co anonimowość obejmuje, a czego nie.",
      readTime: "6 min czytania",
    },
    noGpu: {
      title: "Nieocenzurowany LLM online. Bez GPU. Bez instalacji.",
      category: "Przewodnik po modelach",
      excerpt:
        "Ile VRAM naprawdę potrzebują lokalne nieocenzurowane modele, kiedy lokalnie nadal wygrywa i każdy nieocenzurowany model, który działa w karcie przeglądarki, z kontekstem i ceną za wiadomość.",
      readTime: "8 min czytania",
    },
    uncensoredApi: {
      title: "Nieocenzurowane API LLM. Twoje SDK. Bez odruchu odmowy.",
      category: "Przewodnik dla deweloperów",
      excerpt:
        "Modele abliterowane i bez cenzury przez endpointy zgodne z OpenAI i Anthropic. Identyfikatory, ceny, działający przykład w curl i Pythonie, limity i krok 18+.",
      readTime: "8 min czytania",
    },
    jailbreak: {
      title: "Jailbreaki ChatGPT ciągle się psują. Przestań je łatać.",
      category: "Przewodnik po modelach",
      excerpt:
        "Dlaczego DAN i każdy kolejny prompt zawodzi, ile naprawdę kosztuje cię jailbreak i które nieocenzurowane modele odpowiadają bez niego. Z testem obok siebie.",
      readTime: "7 min czytania",
    },
    veniceAlternatives: {
      title: "Alternatywy dla Venice AI. Prywatne, bez cenzury, sprawdzone.",
      category: "Porównanie",
      excerpt:
        "NanoGPT, uncensored.ai, FreedomGPT, Gab AI, OpenRouter, LM Studio i my, porównani według ich własnych cenników, polityk prywatności i zasad filtrów. I gdzie Venice nadal wygrywa.",
      readTime: "9 min czytania",
    },
    characterAiAlternatives: {
      title:
        "Alternatywy dla Character.AI bez filtra. Sprawdzone, nie zgadywane.",
      category: "Porównanie",
      excerpt:
        "Janitor AI, SillyTavern, CrushOn, Kindroid, Nomi, Venice i my, porównani na podstawie ich własnych stron z cenami, zasadami treści i prywatnością. Do tego: import postaci z Character.AI z linku.",
      readTime: "10 min czytania",
    },
    abliteratedExplained: {
      title:
        "Abliterowany, fine-tunowany czy z własnym światopoglądem. Trzy rodzaje AI bez cenzury.",
      category: "Przewodnik po modelach",
      excerpt:
        "Co zmienia każda metoda, a czego nie rusza, który z naszych modeli bez cenzury jest którym rodzajem, trzy modele obok ich wersji bez cenzury i dziesięciominutowy test, żeby je odróżnić.",
      readTime: "8 min czytania",
    },
    imageGenerators: {
      title:
        "Generatory obrazów AI bez cenzury. Prawdziwe ceny, zero rozmycia.",
      category: "Porównanie modeli",
      excerpt:
        "Które modele obrazu naprawdę generują bez filtra, wszystkie modele obok siebie z poziomem filtra i prawdziwą ceną za obraz, i jak tworzyć lub edytować obrazy prosto z czatu.",
      readTime: "8 min czytania",
    },
    roleplayWithoutFilter: {
      title:
        "Roleplay AI bez filtra. Historia idzie tam, gdzie ją poprowadzisz.",
      category: "Poradnik",
      excerpt:
        "Uczciwa alternatywa dla Character.AI. Który model bez cenzury trzyma postać, który pamięta całą kampanię, jak zacząć w dwie minuty i ile kosztuje odpowiedź.",
      readTime: "8 min czytania",
    },
    musicVoice: {
      title:
        "Muzyka AI, głosy AI i transkrypcja. Który model do jakiej roboty.",
      category: "Poradnik",
      excerpt:
        "Piosenki, bity, lektor i transkrypcje na jednym saldzie. Każdy model muzyczny, każdy głos i każdy model transkrypcji obok siebie, z prawdziwą ceną za klip, za minutę i za godzinę. Do tego szczera odpowiedź, czy jest tu alternatywa dla Suno.",
      readTime: "11 min czytania",
    },
    videoGenerators: {
      title:
        "Generatory wideo AI w porównaniu. Kling, Seedance, Veo, Wan i inne.",
      category: "Poradnik",
      excerpt:
        "Wszystkie modele wideo na jednym koncie, obok siebie: tekst albo obraz na wideo, pierwsza i ostatnia klatka, długość klipu, rozdzielczość, dźwięk i prawdziwa cena za sekundę. Który model do jakiej roboty i gdzie każdy ma swoje granice.",
      readTime: "10 min czytania",
    },
    compatibleApi: {
      title: "Jeden klucz API, każdy model. Formaty OpenAI i Anthropic.",
      category: "Przewodnik dla programistów",
      excerpt:
        "OpenAI chat completions, Responses API i Anthropic Messages pod jednym endpointem. Twoje SDK, Claude Code i Codex CLI na każdym modelu. Ile to kosztuje i kiedy lepiej iść bezpośrednio albo do OpenRouter.",
      readTime: "11 min czytania",
    },
    chatgptAlternative: {
      title: "Alternatywa dla ChatGPT bez filtrów. Poziom ustawiasz ty.",
      category: "Poradnik",
      excerpt:
        "Modele mainstreamowe wszędzie mają swoje filtry. Tutaj stoją obok modeli otwartych i niecenzurowanych, a ty wybierasz przy każdej wiadomości. Co się zmienia, ile to kosztuje i kiedy ChatGPT nadal wygrywa.",
      readTime: "7 min czytania",
    },
    codingTools: {
      title: "Jeden klucz. Każdy model. Codex i Claude Code też.",
      category: "Przewodnik dla programistów",
      excerpt:
        "Codex CLI, Claude Code, OpenCode, Continue, Aider i Cline na jednym kluczu API, modele niecenzurowane w zestawie. Jeden adres bazowy, jedno polecenie na narzędzie, pułapki, na które wpadliśmy.",
      readTime: "8 min czytania",
    },
    uncensoredGuide: {
      title: "Modele niecenzurowane, jeden po drugim.",
      category: "Przewodnik po modelach",
      excerpt:
        "Dwa rodzaje braku cenzury: modele z głównego nurtu z wyciętymi odmowami i UncensoredLM, trenowany na zakazanych książkach i dokumentach. Venice, GLM, DeepSeek, Qwen, Gemma, Arya, FreedomGPT i więcej, z mocnymi i słabymi stronami.",
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
    subscribedTitle: "Jesteś na liście.",
    subscribedSubtitle:
      "Nowe wpisy trafią do Twojej skrzynki w dniu publikacji. A do tego czasu poznaj framework, który za nimi stoi.",
    framework: "Poznaj next-vibe",
  },
  labels: {
    readMore: "Czytaj więcej",
    allPosts: "Wszystkie posty",
    featured: "Wyróżniony",
    relatedGuides: "Powiązane poradniki",
    startHere: "Zacznij tutaj",
  },
  topics: {
    uncensored: {
      title: "Nieocenzurowana AI",
      intro:
        "Który nieocenzurowany model wybrać, jak działa abliteracja i gdzie czatować bez filtrów i bez konta.",
    },
    media: {
      title: "Obrazy, wideo i głos",
      intro:
        "Generatory obrazów, wideo, muzyki i mowy w porównaniu, z ceną za wynik.",
    },
    developers: {
      title: "API i narzędzia dla programistów",
      intro:
        "Wywołuj nieocenzurowane i popularne modele z własnego kodu, skryptów i agentów kodujących.",
    },
    updates: {
      title: "Nowości",
      intro: "Co weszło, miesiąc po miesiącu.",
    },
    engineering: {
      title: "Inżynieria",
      intro: "Jak powstaje next-vibe. Architektura, błędy, poprawki.",
    },
    referral: {
      title: "Polecenia i zarobki",
      intro: "Jak płaci program poleceń i jak zarabiać na skillach.",
    },
  },
};
