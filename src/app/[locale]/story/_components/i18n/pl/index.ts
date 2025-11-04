import type { translations as enTranslations } from "../en";
import { translations as navTranslations } from "../../nav/i18n/pl";

export const translations: typeof enTranslations = {
  nav: navTranslations,
  home: {
    hero: {
      badge: "🔥 Czat AI + Forum społeczności",
      title: "Czatuj z AI, Łącz się ze społecznością",
      subtitle:
        "Doświadcz niecenzurowanych rozmów z AI z ponad 40 modelami. Dołącz do dyskusji na forum. Wszystko na jednej platformie.",
      description:
        "Prywatne czaty AI, przestrzenie współpracy i publiczne wątki forum. Wybierz poziom prywatności: Prywatny (zaszyfrowany), Incognito (tylko lokalnie), Współdzielony (współpraca) lub Publiczny (forum społeczności).",
      cta: "Zacznij czatować za darmo",
      learnMore: "Dowiedz się więcej",
      secondaryCta: "Przeglądaj forum",
      userAvatarAlt: "Awatar użytkownika",
      satisfiedClients: "Dołącz do 10 000+ zadowolonych użytkowników",
      imageAlt: "Interfejs czatu {{appName}}",
      stats: {
        users: "10 000+ użytkowników",
        models: "40+ modeli AI",
        messages: "1M+ wiadomości",
      },
      imageOverlay: {
        title: "Rozmowy z AI w czasie rzeczywistym",
        metrics: {
          yearlyGrowth: {
            label: "Wzrost użytkowników",
            value: "+300%",
          },
          engagement: {
            label: "Dziennie aktywni użytkownicy",
            value: "5 000+",
          },
          reach: {
            label: "Wiadomości/dzień",
            value: "50K+",
          },
        },
      },
      videoAlt: "Demo {{appName}}",
      scrollDown: "Przewiń, aby odkryć",
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
    features: {
      title: "Wszystko dla czatu AI + społeczności",
      subtitle: "Potężne funkcje",
      description:
        "Wybierz poziom prywatności. Czatuj z AI. Łącz się ze społecznością. Wszystko na jednej platformie.",
      contentCreation: {
        title: "Foldery prywatne - Twoja osobista AI",
        description:
          "Zaszyfrowane, zapisane na serwerze czaty. Dostęp do GPT-4, Claude, Gemini i 40+ modeli. Twoje prywatne rozmowy, zsynchronizowane na urządzeniach.",
      },
      strategyDevelopment: {
        title: "Foldery incognito - Tylko lokalnie",
        description:
          "Tylko LocalStorage, nigdy nie wysyłane na serwer. Idealne dla maksymalnej prywatności. Rozmowy pozostają na Twoim urządzeniu, dopóki ich nie usuniesz.",
      },
      performanceAnalytics: {
        title: "Foldery współdzielone - Współpraca",
        description:
          "Udostępniaj konkretne czaty członkom zespołu lub przyjaciołom. Wspólne rozmowy z AI z kontrolą uprawnień.",
      },
      communityEngagement: {
        title: "Foldery publiczne - Forum społeczności",
        description:
          "Dołącz do społeczności! Twórz publiczne wątki, uczestniczę w dyskusjach, głosuj na treści i łącz się z innymi entuzjastami AI.",
      },
      growth: {
        title: "40+ niecenzurowanych modeli AI",
        description:
          "GPT-4, Claude, Gemini, Llama, Mistral i więcej. Bez filtrów, bez ograniczeń. Zmieniaj modele w trakcie rozmowy.",
      },
      audience: {
        title: "Niestandardowe persony AI",
        description:
          "Twórz postacie AI z unikalnymi osobowościami. Używaj person społeczności lub twórz własne. Dziel się z innymi.",
      },
      global: {
        title: "Inteligentna organizacja",
        description:
          "Organizuj czaty według folderów. Przeszukuj rozmowy. Taguj wątki. Eksportuj historię. Wszystko pozostaje zorganizowane.",
      },
      adCampaigns: {
        title: "Elastyczne ceny",
        description:
          "Darmowy plan: {{freeCredits}} kredytów/miesiąc. Nieograniczony: {{subCurrency}}{{subPrice}}/miesiąc. Pakiety kredytów: {{packCurrency}}{{packPrice}}. Akceptujemy płatności krypto i kartą.",
      },
      dataAnalysis: {
        title: "Zaawansowane analizy",
        description:
          "Śledź swoje użycie, zużycie tokenów i historię rozmów. Zobacz wzorce czatu AI i optymalizuj swój przepływ pracy.",
      },
      automation: {
        title: "Czat z wieloma modelami",
        description:
          "Porównuj modele AI obok siebie. Przełączaj między GPT-4, Claude i innymi w tym samym wątku rozmowy.",
      },
      collaboration: {
        title: "Integracja z wyszukiwaniem",
        description:
          "AI może przeszukiwać internet (Brave Search) w poszukiwaniu aktualnych informacji. Otrzymuj dane w czasie rzeczywistym w swoich rozmowach.",
      },
      analytics: {
        title: "Wsparcie wielojęzyczne",
        description:
          "Interfejs w języku angielskim, niemieckim, polskim. Czatuj z AI w dowolnym języku. Globalna społeczność, lokalne rozmowy.",
      },
    },
    cta: {
      title: "Gotowy dołączyć do platformy AI + społeczności?",
      subtitle:
        "Czatuj prywatnie z 40+ modelami AI. Dołącz do publicznych dyskusji na forum. Wybierz poziom prywatności. Zacznij za darmo już dziś.",
      viewPlans: "Zobacz plany cenowe",
    },
    pricingSection: {
      title: "Proste ceny",
      description:
        "Jeden plan dla wszystkich. Dodatkowe kredyty dla zaawansowanych użytkowników.",
    },
    stats: {
      clients: "Aktywni użytkownicy",
      posts: "Wysłane wiadomości",
      growth: "Wzrost użytkowników",
    },
    pricing: {
      free: {
        name: "Darmowy plan",
        description:
          "Zacznij z {{credits}} darmowymi kredytami - bez karty kredytowej",
        credits: "{{credits}} darmowe kredyty (jednorazowo)",
        features: {
          credits: "{{credits}} kredytów na start",
          models: "Dostęp do wszystkich {{modelCount}}+ modeli AI",
          folders:
            "Wszystkie typy folderów (prywatne, incognito, współdzielone, publiczne)",
          personas: "Korzystanie z person społeczności",
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
          models: "Wszystkie {{modelCount}}+ modele AI",
          folders: "Wszystkie typy folderów",
          personas: "Twórz nielimitowane persony",
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
          models: "Wszystkie {{modelCount}}+ modele AI",
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
        "Zacznij z 10 darmowymi wiadomościami dziennie. Przetestuj wszystkie 40+ modeli AI przed aktualizacją.",
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
        brandConsistency: "Dostęp do wszystkich 40+ modeli",
        optimizedProfiles: "10 darmowych wiadomości dziennie",
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
            "Utwórz swoje konto w kilka sekund. Nie wymagana karta kredytowa. Zacznij z 10 darmowymi wiadomościami dziennie.",
          tags: {
            audienceAnalysis: "Szybka konfiguracja",
            competitorResearch: "Bez karty kredytowej",
          },
          insights: {
            title: "Na zawsze darmowe",
            description: "10 wiadomości dziennie, dostęp do wszystkich modeli",
          },
        },
        contentCreation: {
          title: "Wybierz swój model AI",
          description:
            "Wybierz spośród ponad 40 niecenzurowanych modeli AI, w tym GPT-4, Claude, Gemini i więcej.",
          tags: {
            brandAlignedContent: "40+ modeli",
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
            "Zbudowane z opiniami naszych użytkowników. Dziel się personami, wskazówkami i pomóż kształtować platformę.",
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
        keywords:
          "kariera, praca, praca AI, praca zdalna, kariera {{config.appName}}",
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
      explorePositions: "Przeglądaj otwarte stanowiska",
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
      "Czat AI zorientowany na prywatność z 40+ niecenzurowanymi modelami",
    platform: {
      title: "Platforma",
      features: "Funkcje",
      subscription: "Subskrypcja",
      aiModels: "Modele AI",
      personas: "Persony",
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
    copyright: "© {{year}} {{config.appName}}. Wszelkie prawa zastrzeżone.",
  },
};
