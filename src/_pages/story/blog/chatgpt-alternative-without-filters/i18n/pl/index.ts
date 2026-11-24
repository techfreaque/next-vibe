import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "ChatGPT bez cenzury: alternatywa bez filtrów | {{appName}}",
    description:
      "Porównaj alternatywy dla ChatGPT z mniejszą liczbą odmów, w tym {{appName}}, Venice, NanoGPT i aplikacje lokalne. Sprawdź modele, limity i prywatność.",
    category: "Poradnik",
    imageAlt: "{{appName}}: alternatywa dla ChatGPT bez filtrów",
    keywords:
      "alternatywa dla ChatGPT, alternatywa dla ChatGPT bez filtrów, niecenzurowany ChatGPT, ChatGPT bez ograniczeń, ChatGPT bez cenzury, czat AI bez filtrów, niecenzurowana AI, UncensoredLM, niecenzurowana AI do polityki, {{appName}}, Claude, GPT, Gemini, DeepSeek, Venice",
  },
  hero: {
    backToBlog: "Wróć do bloga",
    category: "Poradnik",
    readTime: "7 min czytania",
    title: "Alternatywy dla ChatGPT z mniejszą liczbą odmów",
    subtitle:
      "Porównaj popularne modele, modele otwarte i modele bez cenzury w {{appName}}. Sprawdź, jak zmiana modelu wpływa na rozmowę i ile kosztują poszczególne opcje.",
  },
  intro: {
    lead: "ChatGPT korzysta z zabezpieczeń OpenAI. GPT w {{appName}} również je zachowuje. Jeśli szukasz czatu z mniejszą liczbą ograniczeń, wybierz inny model. On też może odmówić odpowiedzi albo się pomylić.",
    p2: "W {{appName}} masz do wyboru {{modelCount}} modeli w trzech kategoriach. Wszystkie korzystają z tego samego salda kredytów.",
  },
  exists: {
    title: "Czy istnieje ChatGPT bez filtrów?",
    p1: "ChatGPT korzysta z zabezpieczeń OpenAI. Jeśli wybierzesz GPT w {{appName}}, nadal obowiązują zabezpieczenia dostawcy.",
    p2: "Aby wypróbować czat z mniejszą liczbą ograniczeń, wybierz w {{appName}} model z kategorii bez cenzury. Możesz zacząć jako gość w przeglądarce.",
  },
  tiers: {
    title: "Co właściwie znaczy „bez filtrów”?",
    intro: "Każdy model ma poziom treści. Są trzy.",
    mainstream: "Popularne ({{count}}). Obowiązują zabezpieczenia dostawcy.",
    open: "Otwarte ({{count}}). To, na jakie pytania dostaniesz odpowiedź, zależy od modelu.",
    uncensored:
      "Bez cenzury ({{count}}). W tej kategorii zebraliśmy modele według tego, jak podchodzą do drażliwych tematów.",
    vendorRefusals:
      "Gdy zmieniasz model w {{appName}}, wybierasz, który model odpowie. Nadal obowiązują zabezpieczenia wybranego modelu.",
    twoKinds:
      "W niektórych modelach bez cenzury abliteracja lub dostrajanie ogranicza liczbę odmów. UncensoredLM trenowano na książkach i dokumentach zakazanych w głównym nurcie internetu. Dlatego model przedstawia poglądy polityczne odbiegające od głównego nurtu. Sprawdzaj jego twierdzenia w źródłach.",
    modelsLink: "Zobacz wszystkie modele według poziomu filtra",
  },
  switch: {
    title: "Czy mogę zmienić model w trakcie rozmowy?",
    intro: "Tak. Przy kolejnej wiadomości możesz wybrać inny model.",
    p1: "Zmień model w trakcie rozmowy, aby zachować jej historię. Nowy model może uwzględnić tyle poprzednich wiadomości, ile mieści się w jego oknie kontekstowym.",
    p2: "Możesz napisać szkic z pomocą jednego modelu i poprosić inny o jego poprawienie w tym samym czacie.",
    caveat:
      "Każdy model stosuje własne zabezpieczenia do szkicu i kolejnej prośby.",
  },
  picks: {
    title: "Jakiego modelu używać zamiast ChatGPT?",
    intro:
      "Zacznij od zadania. Każda nazwa prowadzi do strony modelu z ceną i parametrami.",
    builtUncensored: {
      title: "Polityka i różne punkty widzenia",
      body: "UncensoredLM może zaproponować inne spojrzenie na politykę i sporne tematy. Porównuj jego twierdzenia z własnymi źródłami.",
    },
    everyday: {
      title: "Codzienne zadania",
      body: "Wypróbuj te popularne modele do pisania, programowania i analizy.",
    },
    open: {
      title: "Modele otwarte do kodu i rozumowania",
      body: "Wypróbuj te otwarte modele do kodowania i zadań wymagających rozumowania. Porównaj odpowiedzi na to samo pytanie.",
    },
    unfiltered: {
      title: "Modele bez cenzury do analizy",
      body: "Wypróbuj te modele do analiz, kodowania i dłuższych tekstów. One też mogą odmówić odpowiedzi.",
    },
    fiction: {
      title: "Odgrywanie ról i mroczna fikcja",
      body: "Przy dłuższej historii porównaj okna kontekstowe. Sprawdź też, czy model przyjmuje obrazy.",
    },
    cheap: {
      title: "Tańsze modele",
      body: "Szacowany koszt znajdziesz na stronie modelu. Dłuższe pytania i odpowiedzi mogą zużyć więcej kredytów.",
    },
    compare:
      "Porównaj ceny, okna kontekstowe i możliwości dostępnych par modeli.",
    compareLink: "Porównaj {{a}} z {{b}}",
    guideLink: "Przeczytaj przewodnik po wszystkich modelach niecenzurowanych",
  },
  privacy: {
    title: "Czy czat AI bez filtrów jest prywatny?",
    intro: "Zależy od folderu. Oto dokładnie, co się dzieje.",
    incognito:
      "Czaty incognito są zapisane w pamięci lokalnej twojej przeglądarki. Rozmowa nie trafia do zapisu na naszych serwerach (wygenerowane media przechowujemy tymczasowo ze względów technicznych). Wyczyścisz dane przeglądarki i jej nie ma.",
    transit:
      "Każda wiadomość nadal przechodzi przez nasz serwer do dostawcy modelu, który pisze odpowiedź. Tak działa każda AI w chmurze. Zużycie kredytów jest rejestrowane na potrzeby rozliczeń.",
    memory:
      "W trybie incognito pamięć jest wyłączona. Trwała pamięć wymaga darmowego konta i folderu prywatnego.",
    private:
      "Czaty prywatne są zapisane na serwerze i widoczne tylko dla twojego konta. Otworzysz je na każdym urządzeniu, na którym się zalogujesz.",
    callout:
      "W skrócie: incognito trzyma twoją historię z dala od naszych serwerów. Nie ukrywa jednak wiadomości przed modelem, który na nie odpowiada.",
  },
  pricing: {
    title: "Ile to kosztuje?",
    intro: "Kredyty. Jedno saldo dla wszystkich modeli.",
    free: "Za darmo: {{guestCredits}} kredytów miesięcznie bez konta, {{freeCredits}} z darmowym kontem, {{maxCredits}} z kontem i newsletterem. Wystarczy, żeby sprawdzić kilka modeli na własnych promptach.",
    sub: "Plany miesięczne: cztery rozmiary, od {{subCredits}} kredytów za {{subPrice}}.",
    pack: "Pakiety kredytów: doładowanie dla subskrybentów, {{packCredits}} kredytów za {{packPrice}}. Nigdy nie wygasają. Karta, PayPal albo krypto.",
    oneBalance:
      "To samo saldo pokrywa generowanie obrazów, wideo i muzyki, mowę na wejściu i wyjściu oraz wyszukiwanie w sieci.",
    metered:
      "Każda wiadomość kosztuje kredyty zależnie od modelu. Modele flash kosztują ułamek ceny modelu z czołówki. Cenę znajdziesz na stronie każdego modelu.",
    link: "Zobacz plany i pakiety kredytów",
  },
  chatgptBetter: {
    title: "Kiedy ChatGPT jest lepszym wyborem?",
    intro: "Czasem. Konkretnie wtedy.",
    oneVendor:
      "Korzystasz tylko z modeli OpenAI i nigdy nie trafiasz na odmowę. Wtedy jeden dostawca, jedna aplikacja i jedna subskrypcja to prostsze rozwiązanie.",
    flatRate:
      "Chcesz stałej opłaty i nie chcesz myśleć o koszcie wiadomości. Kredyty liczą się od zużycia, a intensywne codzienne korzystanie z modeli z czołówki się sumuje.",
    firstFeatures:
      "Chcesz najnowszych funkcji aplikacji danego laboratorium w dniu premiery. Laboratoria często wypuszczają nowości najpierw we własnych aplikacjach.",
    wantFilter:
      "Chcesz filtra. Konto dziecka albo miejsce pracy z surowymi zasadami potrzebuje barier. Tutaj możesz zostać przy poziomie mainstream, ale zamknięty produkt może pasować lepiej.",
  },
  limits: {
    title: "Jakie są minusy?",
    intro: "Brak filtrów ma swoją cenę. Poznaj ją, zanim się przesiądziesz.",
    smaller:
      "Większość modeli niecenzurowanych jest mniejsza od modeli z czołówki. Kilka powstało do rozmowy i fikcji, nie do ciężkiej analizy. UncensoredLM jest od szczerych odpowiedzi, nie od kodu. Przy najtrudniejszym rozumowaniu i długich zadaniach programistycznych najlepsze modele mainstreamowe wciąż wygrywają.",
    tools:
      "Nie każdy model niecenzurowany obsługuje wywołania narzędzi. Sprawdź stronę modelu, zanim oprzesz się na wyszukiwaniu w sieci albo innych narzędziach.",
    vendor:
      "Popularne modele zachowują zabezpieczenia dostawcy. Modele bez cenzury też mogą odmówić odpowiedzi.",
    responsibility:
      "Zweryfikuj ważne informacje, zanim udostępnisz odpowiedź lub zaczniesz działać na jej podstawie.",
  },
  faq: {
    filters: {
      q: "Czy w alternatywie dla ChatGPT mogę wyłączyć zabezpieczenia GPT?",
      a: "GPT w {{appName}} zachowuje zabezpieczenia dostawcy. Gdy wybierzesz model bez cenzury, na twoją wiadomość odpowie inny model, który ma własne reguły.",
    },
    title: "Najczęstsze pytania",
    free: {
      q: "Czy {{appName}} jest darmowe?",
      a: "Bez konta: {{guestCredits}} darmowych kredytów miesięcznie. Darmowe konto: {{freeCredits}}. Konto z newsletterem: {{maxCredits}}. Potem: plan, od {{subPrice}} miesięcznie.",
    },
    account: {
      q: "Czy potrzebuję konta?",
      a: "Nie. Czat incognito działa bez konta. Konto przyda się do pamięci i do czatów zapisywanych na serwerze.",
    },
    api: {
      q: "Czy mogę używać tych modeli we własnych narzędziach?",
      a: "Tak. Każdy płatny plan obejmuje API zgodne z OpenAI. Jeden klucz, każdy model, także niecenzurowane.",
    },
    openSource: {
      q: "Czy {{appName}} jest open source?",
      a: "Tak. Kod jest otwarty na licencjach MIT i GPL v3, a własną instancję możesz postawić u siebie.",
    },
    apiLink: "Podłącz API do swoich narzędzi programistycznych",
    selfHostLink: "Uruchom własną instancję",
  },
  partners: {
    body: "Prowadzisz kanał, newsletter albo społeczność o AI? Program partnerski {{appName}} wypłaca ci stały udział w każdej płatności, którą polecisz.",
    link: "Poznaj program partnerski",
  },
  cta: {
    title: "Wybierz model i zacznij rozmowę",
    subtitle:
      "Zacznij bez konta z pulą do {{guestCredits}} darmowych kredytów miesięcznie.",
    chat: "Wypróbuj czat AI bez cenzury",
    models: "Porównaj wszystkie modele",
  },
};
