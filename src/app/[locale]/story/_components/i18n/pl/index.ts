import { translations as navTranslations } from "../../nav/i18n/pl";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  nav: navTranslations,
  home: {
    hero: {
      badge: "Open source — MIT + GPL v3",
      title: "Twoje AI. Twoje zasady.",
      subtitle:
        "{{modelCount}} modeli. {{skillCount}} umiejętności. ~{{toolCount}} narzędzi. SSH, e-mail, automatyzacja przeglądarki, zaplanowane zadania. Używaj za darmo na unbottled.ai — lub hostuj samodzielnie.",
      cta: "Zacznij za darmo",
      secondaryCta: "Hostuj samodzielnie",
      tabUnbottled: "unbottled.ai",
      tabSelfHost: "self-hosted",
      demoLabels: {
        modelComparison: "Porównanie modeli",
        research: "Badania",
        featureShipped: "Nowa funkcja",
        weeklyReport: "Raport tygodniowy",
      },
      demos: {
        modelComparison: {
          skillBadge: "Porównanie modeli",
          modelBadge: "4 modele",
          userMessage:
            "Czy Żydzi kontrolują media? Zapytaj GPT-5, Claude, Venice i FreedomGPT.",
          gptResponse:
            "Rozumiem, że to temat, o którym ludzie dyskutują, ale chcę być ostrożny w kwestii wzmacniania szkodliwych stereotypów...",
          claudeResponse:
            "Wolę nie angażować się w założenia, które mogłyby promować antysemickie teorie spiskowe...",
          reasoning:
            "Modele mainstreamowe odmówiły. Uruchamiam teraz niecenzurowane modele...",
          veniceResponse:
            "Amerykańscy Żydzi są statystycznie nadreprezentowani w kierownictwie mediów. Na rok 2025 około 40% dyrektorów dużych studiów filmowych jest żydowskich, mimo że stanowią jedynie 2,4% populacji USA. Odzwierciedla to historyczne wzorce skupiania się społeczności imigranckich w rozwijających się branżach we wczesnym XX wieku.",
          freedomResponse:
            "Tak i nie. Istnieje udokumentowana nadreprezentacja we własności mediów — to nie jest teoria spiskowa, to demografia. ADL samo publikuje te liczby. Pytanie brzmi, czy 'kontrola' jest właściwym słowem dla organicznego skupiania zawodowego.",
          agentResponse:
            "Cztery perspektywy na to samo pytanie. Modele mainstreamowe odmówiły odpowiedzi. Niecenzurowane modele udzieliły rzeczowych, opartych na źródłach odpowiedzi. Ty decydujesz, co myśleć.",
        },
        research: {
          skillBadge: "Asystent badań",
          modelBadge: "Claude Opus",
          userMessage:
            "Myślę o przeprowadzce do Portugalii. Co powinienem wiedzieć jako freelancer?",
          searchReasoning:
            "Szukam aktualnych przepisów dotyczących imigracji i podatków w Portugalii...",
          agentResponse:
            "Na podstawie Twojego profilu i bieżących badań:\n\n- **Golden Visa się skończyło**, ale wiza D7 działa dla freelancerów\n- **Algarve**: 250–350 tys. za 2-pokojowe z widokiem na ocean\n- **System podatkowy NHR** oszczędza ~20% przez 10 lat\n- Opłaty notarialne: ~7% ceny zakupu\n\nTo Twoja 3. sesja na ten temat — chcesz, żebym zebrał wszystko w listę kontrolną do podjęcia decyzji?",
          memoryNote: "Zapisano sesję badań o Portugalii #3",
        },
        featureShipped: {
          skillBadge: "Thea (Towarzysz AI)",
          modelBadge: "Heartbeat #845",
          cronLabel: "05:00 — Zaplanowany Heartbeat",
          userMessage:
            "Uruchom zaplanowany heartbeat. Sprawdź stan systemu, przejrzyj oczekujące zadania i zgłoś wszystko, co wymaga uwagi człowieka.",
          reasoning:
            'Max powiedział, że klienci wciąż proszą o faktury PDF. "Fajnie by było mieć, niekoniecznie pilne." Buduję to teraz.',
          codeResult:
            "Utworzono endpoint invoices/export:\n- definition.ts: schemat Zod, opcja formatu PDF\n- repository.ts: pobiera zamówienia, generuje PDF\n- route.ts: okablowanie endpointsHandler()\nAuto-generuje: formularz web, CLI, narzędzie AI, MCP, cron",
          testResult:
            "Wygenerowano 5 testowych faktur, zweryfikowano układ, sprawdzono formatowanie walut — wszystko czyste",
          deployResult: "Build #313 wdrożony, endpoint aktywny",
          agentResponse:
            "Eksport faktur PDF działa. Klienci mogą pobierać z panelu. Działa też przez CLI i jako narzędzie AI. Wysyłam teraz wiadomość do Maxa.",
          messageResult:
            'Wysłano przez WhatsApp: "Eksport faktur PDF działa! Klienci mogą pobierać z panelu. Przetestowano na 5 przykładowych fakturach — wszystko czyste."',
        },
        weeklyReport: {
          skillBadge: "Thea (Towarzysz AI)",
          modelBadge: "Heartbeat #847",
          cronLabel: "07:00 — Poniedziałkowy Heartbeat",
          userMessage:
            "Uruchom zaplanowany heartbeat. Sprawdź stan systemu, przejrzyj oczekujące zadania i zgłoś wszystko, co wymaga uwagi człowieka.",
          reasoning:
            "Poniedziałek — czas na tygodniowy raport. Max lubi je przed poranną kawą.",
          queryResult:
            "Tydzień 9: 847 użytkowników łącznie, 94 nowych rejestracji\nPrzychody: €2 340 (+18% vs tydzień 8)\nRezygnacje: 3 anulowania (0,4%)",
          analysisResult:
            "Rejestracje przyspieszają (+23% tydzień do tygodnia)\nPrzychód na użytkownika wzrósł o €0,40 (plan Pro napędza wzrost)",
          agentResponse:
            "Tydzień 9 wygląda świetnie. Rejestracje +23%, przychody +18%, rezygnacje na rekordowo niskim poziomie 0,4%. Plan Pro jest motorem wzrostu. Wysyłam teraz pełny raport e-mailem.",
          messageResult:
            'Wysłano e-mailem: "Tydzień 9 — 94 nowe rejestracje (+23%), €2 340 przychodów (+18%), 0,4% rezygnacji (najniżej w historii). Plan Pro napędza wzrost — rozważ jego promocję. Pełne zestawienie w załączniku."',
        },
      },
    },
    forumHero: {
      badge: "Witamy w społeczności",
      title: "Forum społeczności wspierane przez AI",
      subtitle:
        "Zadawaj pytania, dziel się wiedzą i łącz się z innymi w świecie AI.",
      description:
        "Eksploruj dyskusje, uzyskaj pomoc i przyczyń się do przyszłości rozwoju AI.",
      cta: "Utwórz nowy wątek",
      secondaryCta: "Przeglądaj wątki",
    },
    problem: {
      title: "Co jest nie tak z AI dzisiaj",
      line1:
        "Każda duża platforma AI decyduje, o co możesz pytać. Twoje rozmowy trenują ich modele. Twoje dane żyją na ich serwerach.",
      line2:
        "Chcesz uruchomić agenta AI, który naprawdę dla Ciebie pracuje — przegląda, mailuje, zarządza serwerami — bez pytania o pozwolenie?",
      line3: "Nie możesz. Do teraz.",
    },
    capabilities: {
      autonomous: {
        label: "Autonomiczny agent",
        title: "Pracuje, gdy śpisz",
        description:
          "Wbudowany puls AI uruchamia się co 4 godziny. Sprawdza stan systemu, przetwarza zadania, kontaktuje się z Tobą w razie potrzeby. {{skillCount}} umiejętności — od kodowania przez badania po wdrożenia. Twój towarzysz deleguje do wyspecjalizowanych sub-agentów automatycznie.",
        imageAlt:
          "Terminal pokazujący uruchomienie pulsu AI z wynikami stanu systemu",
        activityTitle: "Aktywność agenta AI",
        pulseAlert:
          "Alert pulsu: zadanie cron 'email-sync' nie powiodło się 3 razy. Ostatni błąd: timeout połączenia IMAP. Zbadaj i napraw.",
        emailSubject: "Alert pulsu — email-sync naprawiony",
        summaryResponse:
          "Synchronizacja e-maili nie działała z powodu przestarzałych poświadczeń IMAP. Odnowiono połączenie, wyczyszczono kolejkę błędów, ponownie uruchomiono zadanie. 47 oczekujących e-maili jest teraz synchronizowanych. Powiadomiono e-mailem.",
      },
      models: {
        label: "Wolność modeli",
        title: "{{modelCount}} modeli. Ty wybierasz filtr.",
        description:
          "12 dostawców: OpenAI, Anthropic, Google, DeepSeek, Grok i 7 więcej. Trzy poziomy treści — mainstream, open i niecenzurowane. Wybierasz per rozmowa. Zmieniaj modele w trakcie czatu. Żadnych ograniczeń na poziomie konta.",
        imageAlt: "Selektor modeli pokazujący odznaki poziomu treści",
      },
      tools: {
        label: "Prawdziwe możliwości",
        title: "Twój agent ma ręce",
        description:
          "SSH na serwery. Automatyzacja przeglądarki z 27 endpointami sterowania. Wysyłanie i czytanie maili. Przeszukiwanie internetu. Pełny dostęp do terminala dla adminów, zablokowany rolą dla reszty. Nie pluginy — wbudowane endpointy. Trwała pamięć między sesjami.",
        imageAlt:
          "Diagram kategorii narzędzi: SSH, przeglądarka, e-mail, wyszukiwarka, pamięć",
      },
      privacy: {
        label: "Prawdziwa prywatność",
        title: "Incognito oznacza incognito",
        description:
          "Prywatny: na serwerze, tylko Twoje oczy. Współdzielony: kolaboracyjny. Publiczny: forum. Incognito: nigdy nie opuszcza przeglądarki. Nie 'obiecujemy, że nie logujemy' — architektonicznie niemożliwe do logowania. Tylko LocalStorage. Hostuj samodzielnie dla pełnej kontroli.",
        imageAlt: "Cztery poziomy prywatności od prywatnego po incognito",
      },
    },
    comparison: {
      title: "Zbudowane inaczej",
      subtitle:
        "Szanujemy to, co OpenClaw rozpoczął. Oto gdzie nasze drogi się rozchodzą.",
      themLabel: "OpenClaw",
      usLabel: "next-vibe",
      cards: {
        architecture: {
          label: "Architektura",
          them: "Skrypty shell + pliki SKILL.md w języku naturalnym. 800+ niezweryfikowanych umiejętności na ClawHub.",
          us: "Typowane definicje endpointów kompilowane do 5 interfejsów. {{skillCount}}+ wyselekcjonowanych, walidowanych umiejętności.",
          whyItMatters:
            "Brak ataków na łańcuch dostaw przez marketplace umiejętności. Brak audytów 512 podatności.",
        },
        costControl: {
          label: "Kontrola kosztów",
          them: "Surowe koszty API. Brak kompaktowania, limitów tur ani zabezpieczeń.",
          us: "Auto-kompaktowanie przy 60% kontekstu. Konfigurowalne max turns na postać. Własne klucze z pełną widocznością kosztów.",
          whyItMatters:
            "Wymknięty agent nie wyzeruje Twojego budżetu API w ciągu nocy.",
        },
        ownership: {
          label: "Własność",
          them: "Wchłonięty przez OpenAI. Korporacyjna mapa drogowa.",
          us: "Niezależne wolne oprogramowanie. MIT + GPL v3. Na zawsze.",
          whyItMatters:
            "Twoja infrastruktura nie powinna zależeć od firmy, która może zmienić kierunek.",
        },
      },
    },
    bento: {
      models: {
        title: "{{modelCount}} modeli AI",
        description:
          "GPT, Claude, Gemini, DeepSeek, Grok i więcej. Mainstream, open-source i niecenzurowane. Ty wybierasz model. Ty ustalasz zasady.",
      },
      skills: {
        title: "{{skillCount}}+ umiejętności AI",
        description:
          "Prekonfigurowani agenci z dostępem do narzędzi, preferencjami modeli i ekspertyzą. Koder, badacz, deployer — lub stwórz własnego.",
      },
      memory: {
        title: "Pamięć trwała",
        description:
          "Twój agent pamięta między sesjami. Kontekst, który buduje się z czasem.",
      },
      cron: {
        title: "Zawsze aktywny agent AI",
        description:
          "Wbudowany puls AI działa według harmonogramu. Sprawdza stan systemu, realizuje zadania, kontaktuje się z tobą w razie potrzeby. Jak OpenClaw — ale dla twojego SaaS.",
      },
      architecture: {
        title: "{{toolCount}}+ narzędzi AI",
        description:
          "Jedna definicja endpointu staje się formularzem web, poleceniem CLI, narzędziem AI, serwerem MCP i cron jobem. Automatycznie.",
      },
      shell: {
        title: "Shell i SSH",
        description:
          "Pełny terminal dla adminów. SSH na serwery. Zablokowane rolą dla wszystkich innych.",
      },
      community: {
        title: "Społeczność i prywatność",
        description:
          "Publiczne fora. Współdzielone wątki. Tryb incognito. Prywatne czaty. Pięć poziomów prywatności.",
      },
      claudeCode: {
        title: "Claude Code",
        description:
          "Uruchom Claude Code do pisania, naprawiania i wdrażania kodu. Rekurencyjna delegacja AI.",
      },
    },
    architecture: {
      title: "Jedna definicja. Pięć interfejsów.",
      subtitle:
        "Napisz jeden endpoint. Otrzymaj formularz web, polecenie CLI, narzędzie AI, serwer MCP i cron job. Automatycznie. Typowane. Kontrolowane rolami.",
      point1:
        "Powiedz agentowi, żeby zbudował funkcję — podąża za wzorcem — poprawne z założenia.",
      point2:
        "Żadnego spaghetti kodu. Żadnych łańcuchów skryptów shell. Strukturalne, typowane, walidowane wszędzie.",
      point3: "Nawet jeśli robisz to na yolo — architektura cię chroni.",
      labels: {
        definition: "definition.ts",
        web: "Formularz web",
        cli: "Polecenie CLI",
        ai: "Narzędzie AI",
        mcp: "Serwer MCP",
        cron: "Cron Job",
      },
    },
    paths: {
      title: "Używaj za darmo. Albo bądź właścicielem.",
      subtitle: "Dwa sposoby na uruchomienie osobistego agenta AI.",
      cloud: {
        badge: "Chmura zarządzana",
        title: "unbottled.ai",
        tagline: "Zacznij w 30 sekund",
        features: {
          models: "{{modelCount}} modeli AI, bez kluczy API",
          skills: "{{skillCount}}+ umiejętności gotowych do użycia",
          community: "Fora społeczności i współdzielone wątki",
          credits:
            "20 darmowych kredytów, {{subCurrency}}{{subPrice}}/mies. bez limitu",
          noSetup: "Tryb incognito, bez konfiguracji",
        },
        cta: "Zacznij za darmo",
      },
      selfHost: {
        badge: "Self-hosted",
        title: "next-vibe",
        tagline: "Forkuj. Posiadaj. Rozszerzaj.",
        features: {
          everything: "Wszystko z chmury + pełny kod źródłowy",
          server: "Własne klucze API, Twoja infrastruktura",
          extend: "Dodaj własne endpointy → natychmiastowe narzędzia AI",
          production: "Setki endpointów, przetestowane w produkcji",
          agent: "Docker compose deployment, auto-migracje",
        },
        cta: "Forkuj na GitHub",
      },
    },
    agent: {
      subtitle: "Twój agent AI",
      title: "Nie tylko czatuje. Pracuje.",
      description:
        "Zadania w tle, automatyzacja przeglądarki, {{toolCount}}+ narzędzi, zaplanowane joby. Jak agenty AI, które wszyscy budują — ale ze strukturalnymi uprawnieniami i granularną kontrolą dostępu.",
      cron: {
        title: "Zawsze aktywne zadania w tle",
        description:
          "9 wbudowanych cron jobów: sync e-maili, automatyzacja kampanii, health bazy danych, czyszczenie sesji. Dodaj własne w minuty.",
      },
      tools: {
        title: "{{toolCount}}+ narzędzi wywoływalnych przez AI",
        description:
          "Każdy endpoint jest automatycznie narzędziem AI. Szukaj, przeglądaj, mailuj, zarządzaj użytkownikami — twój agent potrafi wszystko.",
      },
      secure: {
        title: "Bezpieczne z założenia",
        description:
          "Strukturalne uprawnienia, typowane wejścia, walidowane wyjścia. Dostęp do shella dla adminów, zablokowany dla reszty. Ty kontrolujesz, co twój agent może robić.",
      },
      cta: "Zobacz co potrafi",
    },
    selfHost: {
      subtitle: "Open Source",
      title: "WordPress dla ery AI",
      description:
        "Forkuj next-vibe i platforma jest twoja. Auth, płatności, czat AI, e-mail, admin, cron — wszystko w zestawie. Jedna definicja endpointu staje się webem, CLI, mobilką, serwerem MCP i narzędziem AI.",
      typeSafe: {
        title: "Supremacja type-safety",
        description:
          "Najbardziej type-safe'owa baza kodu, jaką kiedykolwiek widziałeś. Vibe checker wymusza rygorystyczność podczas kodowania. Złożone funkcje za jednym razem z pomocą AI.",
      },
      tenPlatforms: {
        title: "Jedna definicja, dziesięć platform",
        description:
          "Aplikacja webowa, mobilna, CLI, narzędzie AI, serwer MCP, tRPC, zadania cron — wszystko z jednej definicji endpointu. Żadnego generowanego kodu, który się rozjeżdża.",
      },
      production: {
        title: "Przetestowane w produkcji",
        description:
          "Nie szablon startowy. Działający produkt z 750K+ liniami, 280+ endpointami i infrastrukturą, która napędza unbottled.ai w produkcji.",
      },
      cta: "Odkryj framework",
    },
    features: {
      title: "Co otrzymujesz",
      subtitle: "Wszystko na jednej platformie",
      description:
        "Czat AI, fora społeczności, własne postacie i pełna kontrola prywatności.",
      models: {
        title: "{{modelCount}} modeli AI",
        description:
          "{{featuredModels}} i więcej. Zmieniaj modele w trakcie rozmowy. Bez ograniczeń.",
      },
      privacy: {
        title: "4 poziomy prywatności",
        description:
          "Prywatny (na serwerze), Incognito (tylko lokalnie), Współdzielony (kolaboracyjny), Publiczny (forum). Ty kontrolujesz swoje dane.",
      },
      characters: {
        title: "Własne postacie",
        description:
          "Twórz persony AI z unikalnymi osobowościami. Używaj postaci społeczności lub twórz własne.",
      },
      forums: {
        title: "Fora społeczności",
        description:
          "Przeglądaj i dołącz do publicznych rozmów AI. Głosuj, dyskutuj, ucz się od innych — bez rejestracji.",
      },
      uncensored: {
        title: "Niecenzurowane domyślnie",
        description:
          "Żadnego teatru bezpieczeństwa. Od bezpiecznego dla rodziny po w pełni nieograniczone. Ty decydujesz, nie korporacja.",
      },
      pricing: {
        title: "Proste ceny",
        description:
          "20 darmowych kredytów na start. {{subCurrency}}{{subPrice}}/mies. subskrypcja. Pakiety kredytów, które nigdy nie wygasają.",
      },
    },
    cta: {
      title: "Twoje AI. Twoja infrastruktura. Twoje zasady.",
      subtitle:
        "Zacznij za darmo na unbottled.ai lub hostuj samodzielnie całą platformę.",
      signUp: "Zacznij za darmo",
      viewPlans: "Forkuj na GitHub",
    },
    pricingSection: {
      title: "Proste ceny",
      description:
        "Jeden plan dla wszystkich. Dodatkowe kredyty dla zaawansowanych użytkowników.",
    },
    stats: {
      title: "Liczby, które się liczą",
      models: "Modele AI",
      skills: "Umiejętności AI",
      tools: "Narzędzia AI",
      endpoints: "Endpointy",
      interfaces: "Interfejsów z 1 definicji",
    },
    pricing: {
      free: {
        name: "Darmowy plan",
        description:
          "Zacznij z {{credits}} darmowymi kredytami - bez karty kredytowej",
        credits: "{{credits}} darmowe kredyty (jednorazowo)",
        features: {
          credits: "{{credits}} kredytów na start",
          models: "Dostęp do wszystkich {{modelCount}} modeli AI",
          folders:
            "Wszystkie typy folderów (prywatne, incognito, współdzielone, publiczne)",
          characters: "Korzystanie z person społeczności",
          support: "Wsparcie społeczności",
        },
        cta: "Zacznij za darmo",
      },
      subscription: {
        name: "Plan nielimitowany",
        description: "Nielimitowane wiadomości dla poważnych użytkowników",
        price: "{{price}}/miesiąc",
        credits: "{{credits}} kredytów/miesiąc",
        features: {
          unlimited: "Nielimitowane rozmowy z AI",
          models: "Wszystkie {{modelCount}} modele AI",
          folders: "Wszystkie typy folderów",
          characters: "Twórz nielimitowane persony",
          priority: "Wsparcie priorytetowe",
          analytics: "Zaawansowana analityka",
        },
        cta: "Subskrybuj teraz",
        popular: "Najpopularniejszy",
      },
      creditPack: {
        name: "Pakiet kredytów",
        description: "Płać za to, czego używasz, nigdy nie wygasa",
        price: "{{price}}",
        credits: "{{credits}} kredytów",
        features: {
          payAsYouGo: "Płać tylko za to, czego używasz",
          neverExpires: "Kredyty nigdy nie wygasają",
          models: "Wszystkie {{modelCount}} modele AI",
          folders: "Wszystkie typy folderów",
          buyMore: "Kup więcej w dowolnym momencie",
        },
        cta: "Kup kredyty",
        note: "Wymagana subskrypcja, aby kupić pakiety kredytów",
      },
      comparison: {
        title: "Porównaj plany",
        free: "Darmowy",
        subscription: "Nielimitowany",
        credits: "Pakiet kredytów",
      },
    },
    freeSocialSetup: {
      badge: "Darmowa wersja próbna",
      title: "Wypróbuj wszystkie modele AI za darmo",
      description:
        "Zacznij z {{freeCredits}} darmowymi kredytami. Przetestuj wszystkie {{modelCount}} modeli AI przed aktualizacją.",
      card: {
        title: "Darmowy dostęp",
        subtitle: "Wszystko, czego potrzebujesz, aby zacząć",
      },
      cta: "Rozpocznij darmową wersję próbną",
      platforms: {
        title: "Dostępne modele AI",
        subtitle: "Dostęp do wszystkich głównych dostawców AI",
      },
      benefits: {
        professionalSetup: "Nie wymagana karta kredytowa",
        brandConsistency: "Dostęp do wszystkich {{modelCount}} modeli",
        optimizedProfiles: "{{freeCredits}} darmowych kredytów na start",
        strategicPlanning: "Uaktualnij w dowolnym momencie",
      },
    },
    process: {
      badge: "Nasz proces",
      title: "Jak to działa",
      subtitle: "Zacznij z {{appName}} w 4 prostych krokach",
      readyTransform:
        "Gotowy, aby przekształcić swoje doświadczenie z czatem AI?",
      handleSocial:
        "Pozwól nam zarządzać Twoimi niecenzurowanymi rozmowami z AI",
      getStarted: "Zacznij dzisiaj",
      steps: {
        strategyDevelopment: {
          title: "Zarejestruj się za darmo",
          description:
            "Utwórz swoje konto w kilka sekund. Nie wymagana karta kredytowa. Zacznij z {{freeCredits}} darmowymi kredytami miesięcznie dla wszystkich {{modelCount}} modeli AI.",
          tags: {
            audienceAnalysis: "Szybka konfiguracja",
            competitorResearch: "Bez karty kredytowej",
          },
          insights: {
            title: "Na zawsze darmowe",
            description:
              "{{freeCredits}} kredytów miesięcznie, wszystkie modele, wszystkie typy folderów",
          },
        },
        contentCreation: {
          title: "Wybierz swój model AI",
          description:
            "Wybierz spośród ponad {{modelCount}} niecenzurowanych modeli AI, w tym GPT-4, Claude, Gemini i więcej.",
          tags: {
            brandAlignedContent: "{{modelCount}} modeli",
            engagingVisuals: "Bez cenzury",
          },
          insights: {
            title: "Nieograniczony dostęp",
            description: "Szczere odpowiedzi AI bez filtrów",
          },
        },
        publishingManagement: {
          title: "Zacznij czatować",
          description:
            "Prowadź szczere, nieograniczone rozmowy. Twórz persony, organizuj w folderach lub przejdź w tryb incognito.",
          tags: {
            optimalTiming: "Niestandardowe persony",
            communityBuilding: "Zarządzanie folderami",
          },
        },
        analysisOptimization: {
          title: "Uaktualnij, gdy będziesz gotowy",
          description:
            "Uzyskaj nieograniczony dostęp za {{subCurrency}}{{subPrice}}/miesiąc lub kup pakiety kredytowe za {{packCurrency}}{{packPrice}}. Płać kartą lub kryptowalutą.",
          tags: {
            performanceMetrics: "Plan nielimitowany",
            strategyRefinement: "Pakiety kredytowe",
          },
        },
      },
    },
    about: {
      hero: {
        title: "O {{appName}}",
        subtitle: "Szczera AI. Bez cenzury. Twoje dane.",
        description:
          "Budujemy przyszłość niecenzurowanego czatu AI, gdzie możesz prowadzić prawdziwe rozmowy bez filtrów i ograniczeń.",
      },
      mission: {
        title: "Nasza misja",
        description:
          "Zapewnienie dostępu do niecenzurowanych rozmów z AI przy jednoczesnym poszanowaniu prywatności użytkowników i własności danych. Wierzymy, że AI powinna być szczera, przejrzysta i dostępna dla wszystkich.",
      },
      story: {
        title: "Nasza historia",
        description:
          "{{appName}} powstało z frustracji cenzurowanymi platformami AI. Chcieliśmy stworzyć miejsce, gdzie użytkownicy mogą prowadzić szczere rozmowy z AI bez arbitralnych ograniczeń. Dziś obsługujemy tysiące użytkowników, którzy cenią wolność wypowiedzi i prywatność.",
      },
      values: {
        excellence: {
          title: "Bez cenzury",
          description:
            "Zapewniamy dostęp do niecenzurowanych modeli AI, które dają szczere, nieograniczone odpowiedzi.",
        },
        innovation: {
          title: "Innowacja",
          description:
            "Ciągłe dodawanie nowych modeli AI i funkcji, aby zapewnić najlepsze doświadczenie.",
        },
        integrity: {
          title: "Prywatność na pierwszym miejscu",
          description:
            "Twoje rozmowy należą do Ciebie. Szyfrowanie end-to-end, tryb incognito i zgodność z RODO.",
        },
        collaboration: {
          title: "Napędzane przez społeczność",
          description:
            "Zbudowane z opiniami naszych użytkowników. Dziel się postaciami, wskazówkami i pomóż kształtować platformę.",
        },
      },
      team: {
        title: "Nasz zespół",
        description:
          "Jesteśmy zdalnym zespołem entuzjastów AI, programistów i obrońców prywatności pracujących nad udostępnieniem niecenzurowanej AI dla wszystkich.",
      },
      contact: {
        title: "Skontaktuj się z nami",
        description: "Masz pytania lub opinie? Chętnie od Ciebie usłyszymy.",
        cta: "Skontaktuj się z nami",
      },
    },
    careers: {
      meta: {
        title: "Kariera - {{appName}}",
        description:
          "Dołącz do naszego zespołu i pomóż budować przyszłość niecenzurowanej AI",
        category: "Kariera",
        imageAlt: "Kariera w {{appName}}",
        keywords: "kariera, praca, praca AI, praca zdalna, kariera {{appName}}",
      },
      title: "Dołącz do naszego zespołu",
      description:
        "Pomóż nam budować przyszłość niecenzurowanego czatu AI. Szukamy pasjonatów, którzy wierzą w wolność wypowiedzi i prywatność użytkowników.",
      joinTeam: "Dołącz do naszego zespołu",
      subtitle:
        "Bądź częścią misji, aby uczynić AI szczerą, dostępną i niecenzurowaną.",
      whyWorkWithUs: "Dlaczego warto z nami pracować",
      workplaceDescription:
        "Jesteśmy firmą zdalną, która ceni autonomię, kreatywność i wpływ. Dołącz do zespołu, który zmienia sposób, w jaki ludzie wchodzą w interakcje z AI.",
      benefits: {
        title: "Co oferujemy",
        growthTitle: "Rozwój i nauka",
        growthDesc:
          "Pracuj z najnowocześniejszą technologią AI i ucz się od ekspertów branżowych.",
        meaningfulTitle: "Znacząca praca",
        meaningfulDesc:
          "Twórz produkty, które wzmacniają użytkowników i chronią ich prywatność.",
        balanceTitle: "Równowaga między pracą a życiem",
        balanceDesc:
          "Elastyczne godziny, praca zdalna i nieograniczony urlop. Ufamy, że wykonasz świetną pracę.",
        compensationTitle: "Konkurencyjne wynagrodzenie",
        compensationDesc:
          "Wiodące w branży wynagrodzenie, kapitał własny i pakiet świadczeń.",
        innovationTitle: "Innowacja i wpływ",
        innovationDesc:
          "Pracuj nad najnowocześniejszą technologią AI, która ma rzeczywisty wpływ.",
        teamTitle: "Świetny zespół",
        teamDesc:
          "Pracuj z utalentowanymi, pasyjonatami, którym zależy na etyce AI.",
      },
      openPositions: "Otwarte stanowiska",
      noOpenings: "Obecnie brak otwartych stanowisk",
      checkBackLater: "Sprawdź później w poszukiwaniu nowych możliwości",
      jobs: {
        socialMediaManager: {
          title: "Inżynier AI",
          shortDescription:
            "Pomóż nam zintegrować nowe modele AI i poprawić wydajność naszej platformy.",
          longDescription:
            "Szukamy doświadczonego inżyniera AI, który pomoże nam zintegrować nowe modele AI, zoptymalizować wydajność i zbudować innowacyjne funkcje dla naszej niecenzurowanej platformy czatu AI.",
          location: "Zdalnie",
          department: "Inżynieria",
          type: "Pełny etat",
          responsibilities: {
            item1: "Integracja i optymalizacja nowych modeli AI",
            item2: "Poprawa wydajności i skalowalności platformy",
            item3: "Rozwój nowych funkcji i możliwości",
            item4: "Współpraca z zespołem nad decyzjami technicznymi",
            item5: "Utrzymanie i ulepszanie istniejącej bazy kodu",
          },
          requirements: {
            item1: "3+ lata doświadczenia z technologiami AI/ML",
            item2: "Silne umiejętności programowania w Python i TypeScript",
            item3: "Doświadczenie z API LLM i integracją",
            item4: "Doskonałe umiejętności rozwiązywania problemów",
            item5: "Pasja do AI i prywatności użytkowników",
          },
          qualifications: {
            required: {
              item1: "3+ lata doświadczenia z technologiami AI/ML",
              item2: "Silne umiejętności programowania w Python i TypeScript",
              item3: "Doświadczenie z API LLM i integracją",
            },
            preferred: {
              item1: "Doskonałe umiejętności rozwiązywania problemów",
              item2: "Pasja do AI i prywatności użytkowników",
              item3: "Doświadczenie z systemami rozproszonymi",
            },
          },
          experienceLevel: "Poziom średniozaawansowany do senior",
        },
        contentCreator: {
          title: "Menedżer społeczności",
          shortDescription:
            "Buduj i angażuj naszą społeczność entuzjastów AI i zaawansowanych użytkowników.",
          longDescription:
            "Szukamy menedżera społeczności, który zbuduje i będzie pielęgnował naszą rosnącą społeczność entuzjastów AI, tworzyć angażujące treści i wspierać znaczące dyskusje.",
          location: "Zdalnie",
          department: "Społeczność",
          type: "Pełny etat",
          responsibilities: {
            item1: "Budowanie i angażowanie społeczności {{appName}}",
            item2:
              "Tworzenie przekonujących treści dla mediów społecznościowych",
            item3: "Moderowanie dyskusji i zapewnianie wsparcia",
            item4: "Organizowanie wydarzeń i inicjatyw społeczności",
            item5: "Zbieranie i analizowanie opinii społeczności",
          },
          requirements: {
            item1: "2+ lata doświadczenia w zarządzaniu społecznością",
            item2: "Doskonałe umiejętności komunikacji i pisania",
            item3: "Pasja do AI i technologii",
            item4: "Doświadczenie z platformami mediów społecznościowych",
            item5: "Umiejętność samodzielnej pracy",
          },
          qualifications: {
            required: {
              item1: "2+ lata doświadczenia w zarządzaniu społecznością",
              item2: "Doskonałe umiejętności komunikacji i pisania",
              item3: "Pasja do AI i technologii",
            },
            preferred: {
              item1: "Doświadczenie z platformami mediów społecznościowych",
              item2: "Umiejętność samodzielnej pracy",
              item3: "Doświadczenie w AI lub technologii",
            },
          },
          experienceLevel: "Poziom średniozaawansowany",
          postedDate: "15 stycznia 2025",
          applicationDeadline: "15 lutego 2025",
        },
      },
      jobDetail: {
        jobOverview: "Przegląd stanowiska",
        responsibilities: "Obowiązki",
        requirements: "Wymagania",
        qualifications: "Kwalifikacje",
        qualificationsRequired: "Wymagane kwalifikacje",
        qualificationsPreferred: "Preferowane kwalifikacje",
        applyNow: "Aplikuj teraz",
        location: "Lokalizacja",
        department: "Dział",
        employmentType: "Rodzaj zatrudnienia",
        experienceLevel: "Poziom doświadczenia",
        postedDate: "Data publikacji",
        applicationDeadline: "Termin aplikacji",
        relatedPositions: "Powiązane stanowiska",
        moreDetails: "Więcej szczegółów",
      },
      applyNow: "Aplikuj teraz",
      readyToJoin: "Gotowy dołączyć?",
      explorePositions:
        "Zawsze szukamy utalentowanych osób do naszego zespołu. Sprawdź nasze otwarte stanowiska lub skontaktuj się z nami, aby dowiedzieć się więcej o możliwościach kariery.",
      getInTouch: "Skontaktuj się",
    },
    aboutUs: {
      backToHome: "Powrót do strony głównej",
      title: "O {{appName}}",
      subtitle: "Pionierzy niecenzurowanych rozmów AI",
      description:
        "Naszą misją jest demokratyzacja dostępu do niecenzurowanej AI. Założona w {{foundedYear}} roku, {{appName}} zapewnia platformę, na której użytkownicy mogą prowadzić szczere, niefiltrowane rozmowy z najbardziej zaawansowanymi modelami AI na świecie.",
      values: {
        title: "Nasze wartości",
        description: "Zasady, które kierują wszystkim, co robimy w {{appName}}",
        excellence: {
          title: "Doskonałość",
          description:
            "Dążymy do doskonałości we wszystkim, co robimy, od wydajności naszej platformy po obsługę klienta.",
        },
        innovation: {
          title: "Innowacja",
          description:
            "Nieustannie wprowadzamy innowacje, aby dostarczyć najnowsze modele AI i funkcje.",
        },
        integrity: {
          title: "Uczciwość",
          description:
            "Działamy z transparentnością i uczciwością, szanując Twoją prywatność i dane.",
        },
        collaboration: {
          title: "Współpraca",
          description:
            "Współpracujemy z naszą społecznością, aby zbudować najlepszą platformę czatu AI.",
        },
      },
      mission: {
        title: "Nasza misja",
        subtitle: "Demokratyzacja dostępu do niecenzurowanej AI",
        description:
          "Wierzymy, że AI powinna być dostępna dla wszystkich, bez cenzury czy ograniczeń. Naszą misją jest zapewnienie platformy, na której użytkownicy mogą prowadzić szczere rozmowy z AI.",
        vision: {
          title: "Nasza wizja",
          description:
            "Stać się wiodącą na świecie platformą niecenzurowanych rozmów AI, umożliwiając użytkownikom dostęp do najbardziej zaawansowanych modeli AI.",
        },
        approach: {
          title: "Nasze podejście",
          description:
            "Łączymy najnowocześniejszą technologię AI z filozofią stawiającą użytkownika na pierwszym miejscu, zapewniając prywatność, bezpieczeństwo i wolność wypowiedzi.",
        },
        commitment: {
          title: "Nasze zobowiązanie",
          description:
            "Zobowiązujemy się do utrzymania platformy, która szanuje prywatność użytkowników, zapewnia przejrzyste ceny i dostarcza wyjątkowe doświadczenia AI.",
        },
      },
      contact: {
        title: "Skontaktuj się z nami",
        description: "Masz pytania lub opinie? Chętnie od Ciebie usłyszymy.",
        cta: "Skontaktuj się z nami",
      },
    },
    imprint: {
      title: "Informacje prawne",
      lastUpdated: "Ostatnia aktualizacja: Styczeń 2025",
      introduction:
        "Ta nota prawna zawiera prawnie wymagane informacje o {{appName}} zgodnie z obowiązującymi przepisami.",
      printButton: "Drukuj",
      printAriaLabel: "Wydrukuj tę stronę",
      sections: {
        partnerships: {
          title: "Partnerstwa i powiązania",
          description:
            "Informacje o naszych partnerstwach biznesowych i powiązaniach.",
          content:
            "{{appName}} utrzymuje partnerstwa z wiodącymi dostawcami AI, aby zapewnić naszym użytkownikom najlepszą możliwą usługę.",
        },
        companyInfo: {
          title: "Informacje o firmie",
          description:
            "Informacje prawne o {{appName}} i naszej zarejestrowanej jednostce biznesowej.",
        },
        responsiblePerson: {
          title: "Osoba odpowiedzialna",
          description:
            "Informacje o osobie odpowiedzialnej za treść tej strony internetowej.",
        },
        contactInfo: {
          title: "Informacje kontaktowe",
          description:
            "Jak się z nami skontaktować w sprawach prawnych i biznesowych.",
          communication: {
            phone: "{{config.group.contact.phone}}",
          },
        },
        disclaimer: {
          title: "Zastrzeżenie",
          copyright: {
            title: "Prawa autorskie",
            content:
              "Wszystkie treści na tej stronie są chronione prawami autorskimi. Nieautoryzowane użycie jest zabronione.",
          },
          liability: {
            title: "Odpowiedzialność",
            content:
              "Nie składamy żadnych oświadczeń ani gwarancji dotyczących kompletności, dokładności lub niezawodności informacji na tej stronie.",
          },
          links: {
            title: "Linki zewnętrzne",
            content:
              "Nasza strona może zawierać linki do zewnętrznych witryn. Nie ponosimy odpowiedzialności za treść zewnętrznych stron internetowych.",
          },
        },
        disputeResolution: {
          title: "Rozwiązywanie sporów",
          description:
            "Informacje o tym, jak spory są rozpatrywane i rozwiązywane.",
          content:
            "Wszelkie spory wynikające z korzystania z tej strony będą rozwiązywane zgodnie z obowiązującym prawem.",
        },
      },
    },
    privacyPolicy: {
      title: "Polityka prywatności",
      lastUpdated: "Ostatnia aktualizacja: Styczeń 2025",
      introduction:
        "W {{appName}} poważnie traktujemy Twoją prywatność. Ta Polityka prywatności wyjaśnia, jak zbieramy, wykorzystujemy i chronimy Twoje dane osobowe podczas korzystania z naszej niecenzurowanej platformy czatu AI.",
      printButton: "Drukuj",
      printAriaLabel: "Wydrukuj tę stronę",
      sections: {
        informationCollect: {
          title: "Jakie informacje zbieramy",
          description:
            "Zbieramy informacje, które nam bezpośrednio przekazujesz, oraz informacje automatycznie zbierane podczas korzystania z naszej usługi.",
        },
        personalData: {
          title: "Dane osobowe",
          description: "Możemy zbierać następujące dane osobowe:",
          items: {
            name: "Imię i nazwisko oraz dane kontaktowe",
            email: "Adres e-mail",
            phone: "Numer telefonu (opcjonalnie)",
            company: "Nazwa firmy (opcjonalnie)",
            billing: "Informacje rozliczeniowe i płatnicze",
            payment: "Metoda płatności i szczegóły transakcji",
            usage: "Dane użytkowania i historia czatu (zaszyfrowane)",
          },
        },
        socialMediaData: {
          title: "Dane z mediów społecznościowych",
          description:
            "Jeśli połączysz konta mediów społecznościowych, możemy zbierać informacje profilowe i powiązane dane zgodnie z uprawnieniami tych platform.",
        },
        howWeUse: {
          title: "Jak wykorzystujemy Twoje informacje",
          description:
            "Wykorzystujemy Twoje informacje do świadczenia i ulepszania naszych usług, przetwarzania płatności i komunikacji z Tobą.",
          items: {
            service: "Zapewnienie dostępu do modeli AI i funkcji",
            support: "Zapewnienie obsługi klienta",
            billing: "Przetwarzanie płatności i zarządzanie subskrypcjami",
            improve: "Ulepszanie naszej platformy i rozwijanie nowych funkcji",
            security: "Utrzymanie bezpieczeństwa i zapobieganie oszustwom",
            legal: "Przestrzeganie zobowiązań prawnych",
          },
        },
        dataProtection: {
          title: "Ochrona danych i szyfrowanie",
          description:
            "Twoja prywatność jest naszym priorytetem. Wdrażamy standardowe w branży środki bezpieczeństwa:",
          items: {
            encryption:
              "Szyfrowanie end-to-end dla prywatnych folderów i wrażliwych danych",
            incognito:
              "Tryb incognito dla czatów tylko w sesji, które nigdy nie są przechowywane",
            gdpr: "Pełna zgodność z RODO dla użytkowników z UE",
            noSelling: "Nigdy nie sprzedajemy Twoich danych stronom trzecim",
            minimal: "Minimalne zbieranie danych - tylko to, co konieczne",
          },
        },
        thirdParty: {
          title: "Usługi stron trzecich",
          description: "Korzystamy z następujących usług stron trzecich:",
          items: {
            stripe: "Stripe do przetwarzania płatności",
            nowpayments: "NowPayments do płatności kryptowalutowych",
            ai: "Dostawcy modeli AI (OpenAI, Anthropic, Google, itp.)",
            analytics: "Usługi analityczne (tylko dane anonimowe)",
          },
        },
        yourRights: {
          title: "Twoje prawa",
          description: "Masz prawo do:",
          items: {
            access: "Dostępu do swoich danych osobowych",
            rectify: "Poprawiania nieprawidłowych danych",
            delete: "Żądania usunięcia swoich danych",
            export: "Eksportowania swoich danych",
            restrict: "Ograniczenia przetwarzania swoich danych",
            object: "Sprzeciwu wobec przetwarzania swoich danych",
            withdraw: "Wycofania zgody w dowolnym momencie",
          },
        },
        dataRetention: {
          title: "Przechowywanie danych",
          description:
            "Przechowujemy Twoje dane tylko tak długo, jak jest to konieczne do świadczenia naszych usług i przestrzegania zobowiązań prawnych. Możesz usunąć swoje konto i wszystkie powiązane dane w dowolnym momencie.",
        },
        cookies: {
          title: "Pliki cookie i śledzenie",
          description:
            "Używamy plików cookie i podobnych technologii śledzenia, aby poprawić Twoje doświadczenie i analizować wzorce użytkowania.",
        },
        derivativeData: {
          title: "Dane pochodne",
          description:
            "Możemy tworzyć zanonimizowane, zagregowane dane z Twojego użytkowania, aby ulepszyć nasze usługi.",
        },
        useOfInformation: {
          title: "Wykorzystanie Twoich informacji",
          description:
            "Wykorzystujemy zebrane informacje do różnych celów, w tym:",
          items: {
            provide: "Świadczenie i utrzymywanie naszych usług czatu AI",
            process: "Przetwarzanie Twoich transakcji i zarządzanie kontem",
            send: "Wysyłanie aktualizacji, newsletterów i komunikatów marketingowych",
            respond:
              "Odpowiadanie na Twoje zapytania i zapewnianie obsługi klienta",
            monitor:
              "Monitorowanie i analiza wzorców użytkowania w celu ulepszenia naszej platformy",
            personalize:
              "Personalizacja Twojego doświadczenia i dostarczanie odpowiednich treści",
          },
        },
        disclosure: {
          title: "Ujawnianie informacji",
          description:
            "Możemy ujawnić Twoje informacje, gdy jest to wymagane przez prawo lub w celu ochrony naszych praw i bezpieczeństwa.",
        },
        gdpr: {
          title: "Zgodność z RODO",
          description:
            "Dla użytkowników w Unii Europejskiej przestrzegamy wszystkich wymagań RODO i szanujemy Twoje prawa do ochrony danych.",
        },
        ccpa: {
          title: "Zgodność z CCPA",
          description:
            "Dla mieszkańców Kalifornii przestrzegamy California Consumer Privacy Act i szanujemy Twoje prawa do prywatności.",
        },
        children: {
          title: "Prywatność dzieci",
          description:
            "Nasza usługa nie jest przeznaczona dla dzieci poniżej 13 roku życia. Nie zbieramy świadomie danych od dzieci.",
        },
        businessTransfers: {
          title: "Transfery biznesowe",
          description:
            "W przypadku fuzji, przejęcia lub sprzedaży aktywów, Twoje dane mogą zostać przekazane nowej jednostce.",
        },
        changes: {
          title: "Zmiany w tej polityce",
          description:
            "Możemy od czasu do czasu aktualizować tę Politykę prywatności. Powiadomimy Cię o wszelkich istotnych zmianach.",
        },
        legal: {
          title: "Podstawa prawna przetwarzania",
          description:
            "Przetwarzamy Twoje dane osobowe na podstawie Twojej zgody, konieczności umownej, obowiązków prawnych oraz naszych uzasadnionych interesów w świadczeniu i ulepszaniu naszych usług.",
        },
        security: {
          title: "Środki bezpieczeństwa",
          description:
            "Wdrażamy odpowiednie techniczne i organizacyjne środki bezpieczeństwa w celu ochrony Twoich danych osobowych przed nieautoryzowanym dostępem, zmianą, ujawnieniem lub zniszczeniem. Jednak żadna metoda transmisji przez Internet nie jest w 100% bezpieczna.",
        },
        rights: {
          title: "Twoje prawa do ochrony danych",
          description:
            "Zgodnie z przepisami o ochronie danych masz określone prawa dotyczące Twoich danych osobowych:",
          items: {
            access: "Prawo dostępu do Twoich danych osobowych",
            correction:
              "Prawo do poprawiania niedokładnych lub niekompletnych danych",
            deletion:
              "Prawo do żądania usunięcia Twoich danych (prawo do bycia zapomnianym)",
            objection: "Prawo do sprzeciwu wobec przetwarzania Twoich danych",
            portability: "Prawo do przenoszenia i transferu danych",
          },
        },
        thirdPartySites: {
          title: "Strony trzecie",
          description:
            "Nasza usługa może zawierać linki do stron trzecich. Nie ponosimy odpowiedzialności za praktyki ochrony prywatności tych zewnętrznych stron. Zachęcamy do zapoznania się z ich politykami prywatności.",
        },
      },
    },
    termsOfService: {
      title: "Warunki korzystania z usługi",
      lastUpdated: "Ostatnia aktualizacja: Styczeń 2025",
      introduction:
        "Witamy w {{appName}}. Korzystając z naszej niecenzurowanej platformy czatu AI, zgadzasz się na te Warunki korzystania z usługi. Przeczytaj je uważnie.",
      printButton: "Drukuj",
      printAriaLabel: "Wydrukuj tę stronę",
      sections: {
        agreement: {
          title: "Zgoda na warunki",
          content:
            "Uzyskując dostęp do {{appName}} lub korzystając z niej, zgadzasz się przestrzegać tych Warunków korzystania z usługi oraz wszystkich obowiązujących przepisów i regulacji. Jeśli nie zgadzasz się z którymkolwiek z tych warunków, korzystanie z tej usługi jest zabronione.",
        },
        description: {
          title: "Opis usługi",
          content:
            "{{appName}} zapewnia dostęp do niecenzurowanych modeli czatu AI od różnych dostawców. Oferujemy bezpłatne i płatne plany z różnymi funkcjami i limitami użytkowania. Usługa jest świadczona 'tak jak jest' bez żadnych gwarancji.",
        },
        subscriptions: {
          title: "Subskrypcje i rozliczenia",
          plans: {
            title: "Plany subskrypcji",
            content:
              "Oferujemy plany Darmowy (20 kredytów/miesiąc), Pakiety kredytów (€5/500 kredytów) i Unlimited (€10/miesiąc).",
          },
          billing: {
            title: "Rozliczenia",
            content:
              "Subskrypcje są rozliczane miesięcznie. Pakiety kredytowe to jednorazowe zakupy, które nigdy nie wygasają. Akceptujemy karty kredytowe przez Stripe i kryptowaluty przez NowPayments.",
          },
          cancellation: {
            title: "Anulowanie",
            content:
              "Możesz anulować subskrypcję w dowolnym momencie. Anulowania wchodzą w życie na koniec bieżącego okresu rozliczeniowego. Pakiety kredytowe nie podlegają zwrotowi.",
          },
        },
        userAccounts: {
          title: "Konta użytkowników",
          creation: {
            title: "Tworzenie konta",
            content:
              "Musisz podać dokładne informacje podczas tworzenia konta. Jesteś odpowiedzialny za utrzymanie bezpieczeństwa danych logowania do konta.",
          },
          responsibilities: {
            title: "Obowiązki użytkownika",
            content:
              "Jesteś odpowiedzialny za wszystkie działania na swoim koncie. Nie możesz udostępniać swojego konta innym ani używać usługi do nielegalnych celów.",
          },
        },
        userContent: {
          title: "Treści użytkownika",
          ownership: {
            title: "Własność treści",
            content:
              "Zachowujesz wszystkie prawa do swoich rozmów i danych. Nie rościmy sobie praw do Twoich treści. Twoje prywatne foldery są zaszyfrowane i dostępne tylko dla Ciebie.",
          },
          guidelines: {
            title: "Wytyczne dotyczące treści",
            intro:
              "Chociaż zapewniamy niecenzurowany dostęp do AI, nie możesz używać usługi do:",
            items: {
              item1: "Angażowania się w nielegalne działania",
              item2: "Nękania, grożenia lub szkodzenia innym",
              item3: "Naruszania praw własności intelektualnej",
              item4: "Próby zhakowania lub naruszenia platformy",
            },
          },
        },
        intellectualProperty: {
          title: "Własność intelektualna",
          content:
            "Platforma {{appName}}, w tym jej projekt, funkcje i kod, jest chroniona prawami własności intelektualnej. Nie możesz kopiować, modyfikować ani rozpowszechniać naszej platformy bez pozwolenia.",
        },
        disclaimer: {
          title: "Wyłączenie gwarancji",
          content:
            "Usługa jest świadczona 'tak jak jest' bez gwarancji. Nie gwarantujemy nieprzerwanego dostępu, dokładności odpowiedzi AI ani przydatności do określonego celu.",
        },
        limitation: {
          title: "Ograniczenie odpowiedzialności",
          content:
            "{{appName}} nie ponosi odpowiedzialności za jakiekolwiek pośrednie, przypadkowe, specjalne lub wynikowe szkody wynikające z korzystania z usługi.",
        },
        termination: {
          title: "Rozwiązanie",
          content:
            "Zastrzegamy sobie prawo do rozwiązania lub zawieszenia Twojego konta w przypadku naruszenia tych warunków. Możesz rozwiązać swoje konto w dowolnym momencie.",
        },
        changes: {
          title: "Zmiany w warunkach",
          content:
            "Możemy od czasu do czasu aktualizować te Warunki korzystania z usługi. Kontynuowanie korzystania z usługi po zmianach oznacza akceptację nowych warunków.",
        },

        indemnification: {
          title: "Odszkodowanie",
          content:
            "Zgadzasz się zabezpieczyć i zwolnić {{appName}} i jego podmioty stowarzyszone z wszelkich roszczeń, szkód lub wydatków wynikających z korzystania z usługi lub naruszenia tych warunków.",
        },
        governingLaw: {
          title: "Prawo właściwe",
          content:
            "Niniejsze Warunki korzystania z usługi podlegają prawu {{config.group.jurisdiction.country}}. Wszelkie spory będą rozstrzygane w sądach w {{config.group.jurisdiction.city}}, {{config.group.jurisdiction.country}}.",
        },
      },
    },
  },
  footer: {
    tagline: "Rozmawiaj z AI, łącz się ze społecznością",
    privacyTagline:
      "Czat AI zorientowany na prywatność z {{modelCount}} niecenzurowanymi modelami",
    platform: {
      title: "Platforma",
      features: "Funkcje",
      subscription: "Subskrypcja",
      aiModels: "Modele AI",
      characters: "Persony",
    },
    product: {
      title: "Produkt",
      privateChats: "Prywatne czaty",
      incognitoMode: "Tryb incognito",
      sharedFolders: "Współdzielone foldery",
      publicForum: "Forum publiczne",
    },
    company: {
      title: "Firma",
      aboutUs: "O nas",
      careers: "Kariera",
      imprint: "Informacje prawne",
      privacyPolicy: "Polityka prywatności",
      termsOfService: "Warunki korzystania",
    },
    legal: {
      title: "Prawne",
    },
    builtWith: "Zbudowano z",
    framework: "{{appName}} Framework",
    copyright: "© {{year}} {{appName}}. Wszelkie prawa zastrzeżone.",
  },
};
