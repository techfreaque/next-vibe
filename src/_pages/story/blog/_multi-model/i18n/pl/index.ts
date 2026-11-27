import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  common: {
    back: "Wróć do bloga",
    category: "Porównanie",
    readTime: "7 min czytania",
    switching: "Dlaczego użytkownicy szukają alternatyw",
    criteria: "Co sprawdzić przed zmianą",
    privacy:
      "Sprawdź, gdzie zapisuje się historia i kto przetwarza zapytania. Jeśli korzystasz z modelu w chmurze, dostawca otrzymuje zapytanie nawet wtedy, gdy interfejs działa lokalnie.",
    table: "Wszystkie opcje obok siebie",
    checked:
      "Ceny konkurencji sprawdziliśmy {{date}}. Podajemy je w dolarach amerykańskich. Kwota przy płatności może zależeć od kraju. Dane {{appName}} pochodzą z bieżącej konfiguracji. Na małym ekranie przesuń tabelę w bok.",
    alternatives: "Pozostałe opcje po kolei",
    price: "Koszt.",
    pro: "Zaleta.",
    con: "Ograniczenie.",
    fit: "Wybierz, jeśli",
    faq: "Najczęstsze pytania",
    guides: "Podobne porównania",
    modelCatalog: "Zobacz katalog modeli",
  },
  kinds: {
    aggregator: "Czat w chmurze z wieloma modelami",
    client: "Klient dla własnych kluczy API",
    selfHosted: "Interfejs na własny serwer",
    gateway: "Bramka API z czatem w przeglądarce",
    creativeChat: "Czat do pracy twórczej w chmurze",
    singleProvider: "Czat w chmurze od jednego dostawcy",
  },
  us: {
    title: "{{appName}}. Czat z wyborem poziomu filtrowania",
    intro:
      "Zmieniasz model w trakcie rozmowy bez konfigurowania własnego klucza API. W katalogu jest {{modelCount}} modeli do czatu, w tym {{mainstream}} modeli głównego nurtu, {{open}} otwartych i {{uncensored}} bez cenzury. Dostęp do modeli bez cenzury wymaga potwierdzenia pełnoletności.",
    price:
      "Na start dostajesz co miesiąc {{guestCredits}} darmowych kredytów bez konta albo {{freeCredits}} z kontem, {{maxCredits}} z newsletterem. Plany zaczynają się od {{subPrice}} miesięcznie. Liczba zużytych kredytów zależy od stawki wybranego modelu.",
    privacy:
      "W trybie incognito historia zostaje w przeglądarce. Model w chmurze otrzymuje zapytanie potrzebne do odpowiedzi.",
    api: "Dostęp do interfejsów API zgodnych z OpenAI i Anthropic kosztuje od {{apiSubPrice}} miesięcznie.",
    cta: "Zadaj to samo pytanie dwóm modelom",
    ctaSubtitle:
      "Zacznij w trybie incognito z {{guestCredits}} darmowymi kredytami co miesiąc. Wybierz model i wyślij pierwszą wiadomość.",
    start: "Otwórz czat incognito",
    models: "Zobacz modele bez cenzury",
  },
  platforms: {
    poe: {
      free: "Darmowe punkty każdego dnia.",
      paid: "Od {{poeStart}} miesięcznie",
      filter: "Zasady Poe i danego bota",
      privacy: "Dane przetwarzają Poe i dostawcy botów",
      api: "Zgodne z OpenAI, wspólne punkty z planu",
      media: "Obrazy, wideo, dźwięk",
      open: "Zamknięty kod",
      models:
        "Platforma Quory udostępnia GPT, Claude, Gemini i boty społeczności. Jedna pula punktów wystarcza na czat i generowanie multimediów. Własne klucze API są zbędne.",
      price:
        "Darmowe punkty odnawiają się co 24 godziny i przepadają, jeśli ich nie wykorzystasz. Najtańszy plan wymienia 10 tys. punktów dziennie. Dłuższe wiadomości, odpowiedzi i kontekst mogą zużyć więcej punktów, zależnie od bota.",
      pro: "Możesz wyszukiwać boty społeczności, zapraszać ludzi do grupy i publikować własne boty. Twórcy spełniający warunki mogą zarabiać na wiadomościach. Abonenci wykorzystują te same punkty w czacie i w API.",
      con: "To, ile napiszesz, zależy od puli punktów i stawek bota. Zgodnie z polityką prywatności dostawcy i twórcy botów mogą dostawać rozmowy oraz przesłane pliki. Obowiązują zasady Poe oraz konkretnego bota.",
      fit: "chcesz korzystać z katalogu botów, czatów grupowych i jednego rachunku za modele różnych firm.",
    },
    typingMind: {
      free: "Podstawowy interfejs bez licencji.",
      paid: "{{typingStandard}} jednorazowo plus koszt modeli",
      filter: "Zasady podłączonego modelu i dostawcy",
      privacy: "Domyślnie w przeglądarce, synchronizacja opcjonalna",
      api: "Łączy się z zewnętrznymi API",
      media: "Obrazy i głos zależnie od planu i modelu",
      open: "Zamknięty kod, płatna wersja statyczna do samodzielnego hostowania",
      models:
        "TypingMind to interfejs dla własnych kluczy API lub zgodnych punktów końcowych. Obsługuje GPT, Claude, Gemini i inne modele. Wersja z licencją może zapisywać historię w przeglądarce.",
      price:
        "Standard kosztuje {{typingStandard}}, a Extended {{typingExtended}}. Cena promocyjna Premium wynosiła {{typingPremium}}, a katalogowa {{typingList}}. Opłaty za użycie modeli i dodatkową przestrzeń w chmurze są oddzielne.",
      pro: "Premium dodaje foldery projektów i wyświetla odpowiedzi obok siebie. Każdy model może mieć własny kontekst. Samodzielnie ustawiasz parametry i korzystasz z dostawców, którym już płacisz.",
      con: "Darmowa wersja nie zapisuje rozmów. Samodzielnie zarządzasz kluczami i płatnościami. Do instalacji na własnym serwerze dostajesz skompilowaną aplikację po zakupie licencji.",
      fit: "wolisz płacić bezpośrednio dostawcom modeli i chcesz gotowego interfejsu z dokładnymi ustawieniami.",
    },
    libreChat: {
      free: "Darmowe oprogramowanie na licencji MIT.",
      paid: "Hosting i modele według potrzeb",
      filter: "Zależy od instancji i modelu",
      privacy:
        "Historia w Twojej instancji, zapytania trafiają do modeli w chmurze",
      api: "API dostawców i Agents API w wersji beta",
      media: "Generowanie obrazów przez skonfigurowane narzędzia",
      open: "MIT, własny hosting",
      models:
        "LibreChat obsługuje dostawców takich jak OpenAI, Anthropic i OpenRouter. Możesz uruchomić go na własnym serwerze albo założyć konto w publicznej wersji demo.",
      price:
        "Za licencję nic nie płacisz. Koszty serwera i płatnych modeli liczysz osobno. Publiczne demo służy do testów.",
      pro: "Możesz zmieniać kod. Aplikacja ma agentów, MCP, wyszukiwanie w plikach, import rozmów i kilka formatów eksportu.",
      con: "Instalacja, aktualizacje i kopie zapasowe są po Twojej stronie. Do przechowywania ważnych rozmów lepsza jest własna instancja niż publiczne demo.",
      fit: "potrzebujesz interfejsu dla wielu dostawców i możesz utrzymywać własny serwer.",
    },
    openWebUi: {
      free: "Darmowy samodzielny hosting na warunkach licencji.",
      paid: "Sprzęt, hosting lub koszt modeli według potrzeb",
      filter: "Zależy od instancji i modelu",
      privacy: "Może działać offline z lokalnym modelem",
      api: "Ollama i punkty końcowe zgodne z OpenAI",
      media: "Obrazy i głos przez integracje",
      open: "Dostępny kod, warunki dotyczące marki",
      models:
        "Open WebUI to interfejs do samodzielnej instalacji, obsługujący Ollamę i API zgodne z OpenAI. Z lokalnym modelem czat może działać całkowicie bez internetu.",
      price:
        "Możesz bezpłatnie korzystać z wersji z oznaczeniami projektu. Większe wdrożenie pod własną marką może wymagać osobnej licencji.",
      pro: "Model i historia mogą zostać na Twoim sprzęcie. W razie potrzeby w tym samym interfejsie podłączysz usługę w chmurze.",
      con: "Lokalne modele potrzebują odpowiedniego sprzętu lub osobnego serwera. Jeśli udostępnisz instalację innym, dochodzi utrzymanie i przestrzeganie zasad marki.",
      fit: "chcesz obsługiwać lokalne i zdalne modele w jednym miejscu, także offline.",
    },
    openRouter: {
      free: "Wybrane modele za darmo.",
      paid: "Płatność za użycie",
      filter: "Zasady modelu i dostawcy",
      privacy: "Zasady dotyczące danych zależą od dostawcy",
      api: "Wspólne API",
      media: "Zależy od wybranego modelu",
      open: "Usługa w chmurze, zamknięty kod",
      models:
        "OpenRouter Chat daje dostęp do katalogu modeli OpenRoutera w przeglądarce. Wyślij to samo pytanie do kilku modeli i zestaw ich odpowiedzi.",
      price:
        "Płatne modele rozliczają użycie. Standardowe doładowanie kartą kosztuje dodatkowo {{routerFee}}, co najmniej {{routerMinimum}}. Stawki za modele pochodzą od dostawców.",
      pro: "Porównujesz odpowiedzi i wybierasz dostawcę obsługującego zapytanie. To samo saldo działa przez API OpenRoutera.",
      con: "Darmowe zapytania mają limit. Koszt zależy od modelu i kontekstu, a zasady przechowywania danych od wybranego dostawcy.",
      fit: "chcesz porównywać wiele modeli w przeglądarce i płacić według użycia.",
    },
    venice: {
      free: "10 zapytań tekstowych i 15 obrazów dziennie na podstawowych modelach.",
      paid: "Pro za {{venicePro}} miesięcznie",
      filter: "Filtr treści dla dorosłych można wyłączyć od Pro",
      privacy: "Lokalna historia, prywatność zależna od sposobu przetwarzania",
      api: "API rozliczane w kredytach",
      media: "Obrazy, wideo, głos i muzyka",
      open: "Usługa w chmurze, zamknięty kod",
      models:
        "Venice udostępnia otwarte i zamknięte modele tekstowe oraz narzędzia do obrazów, wideo i dźwięku. Dostawca opisuje cztery sposoby przetwarzania zapytań, każdy z innym poziomem ochrony.",
      price:
        "Pro kosztuje {{venicePro}} miesięcznie. Obejmuje zapytania tekstowe bez limitu w modelach uwzględnionych w planie. Część najlepszych modeli i generowanie multimediów nadal zużywają kredyty.",
      pro: "Domyślnie historia zostaje w przeglądarce. Wersja Pro oferuje szyfrowane kopie i pozwala używać modeli z ochroną sprzętową tam, gdzie jest dostępna.",
      con: "Darmowy plan ma dzienne limity. Część modeli przekazuje zapytania zewnętrznym dostawcom. Wyłączenie filtra wymaga co najmniej Pro.",
      fit: "potrzebujesz większej kontroli nad filtrem i chcesz zachować historię w przeglądarce, korzystając z czatu w chmurze.",
    },
    nanoGpt: {
      free: "Jeden darmowy model w przeglądarce.",
      paid: "Płatność za użycie lub Pro za {{nanoPro}} miesięcznie",
      filter: "Obowiązują regulamin i ograniczenia modeli",
      privacy: "Historia w przeglądarce, synchronizacja opcjonalna",
      api: "API rozliczane z salda lub puli planu",
      media: "Obrazy, wideo i głos",
      open: "Usługa w chmurze, zamknięty kod",
      models:
        "NanoGPT oferuje modele głównego nurtu i otwarte modele w przeglądarce oraz przez API. Doładowujesz konto bez abonamentu lub wybierasz plan z własnym pakietem użycia.",
      price:
        "Pro kosztuje {{nanoPro}} miesięcznie. Plan daje do 60 mln tokenów wejściowych tygodniowo w wybranych otwartych modelach i do 100 obrazów dziennie w czterech modelach.",
      pro: "Czat i API korzystają z tego samego salda. Historia domyślnie zostaje w przeglądarce. Możesz zacząć z wygenerowanym identyfikatorem.",
      con: "Większość zamkniętych modeli oraz wideo i głos nadal pomniejszają saldo w Pro. Pakiet obejmuje wybrane modele.",
      fit: "korzystasz z AI nieregularnie albo chcesz stałego pakietu głównie do otwartych modeli.",
    },
    chatGpt: {
      free: "Osobny darmowy plan ChatGPT.",
      paid: "Plus za {{plus}} miesięcznie",
      filter: "Zasady OpenAI",
      privacy: "Historia konta i ustawienia użycia do trenowania",
      api: "Osobne rozliczenie API OpenAI",
      media: "Obrazy i głos",
      open: "Usługa w chmurze, zamknięty kod",
      models:
        "ChatGPT Plus to subskrypcja OpenAI. W jednej aplikacji masz modele OpenAI, rozmowy głosowe, analizę plików, generowanie obrazów i pogłębioną analizę tam, gdzie jest dostępna.",
      price:
        "Według OpenAI Plus kosztuje {{plus}} miesięcznie. Limity mogą się zmieniać, a API jest rozliczane osobno.",
      pro: "Głos, pliki i narzędzia badawcze mieszczą się w jednej aplikacji ze stałą opłatą miesięczną.",
      con: "Mogą obowiązywać limity. Korzystasz z modeli jednego dostawcy. Plus nie obejmuje ogólnego dostępu do API OpenAI.",
      fit: "używasz głównie modeli OpenAI i zależy Ci na narzędziach dostępnych w ChatGPT.",
    },
  },
  posts: {
    poe: {
      metaTitle: "8 alternatyw dla Poe. Porównanie na 2026 rok",
      description:
        "Szukasz alternatywy dla Poe? Sprawdź wspólne saldo, płatność za użycie i obsługę własnych kluczy. Poznaj ceny, ograniczenia i ofertę {{appName}}.",
      keywords:
        "alternatywy dla Poe, zamiennik Poe AI, punkty Poe, Poe czy TypingMind, OpenRouter Chat, {{appName}}",
      title: "8 alternatyw dla Poe na różne budżety",
      subtitle:
        "Wybierz gotowy czat, zapłać za faktyczne użycie albo uruchom własny interfejs. Porównujemy osiem opcji, w tym {{appName}}.",
      lead: "Poe jest wygodne, kiedy regularnie korzystasz z kilku modeli. Jeśli długa rozmowa pochłania więcej punktów, niż się spodziewasz, sprawdź jej koszt w innym czacie. Dzienny pakiet, przedpłata i osobne rozliczenie API sprawdzają się przy różnych sposobach pracy.",
      overview: "Co daje Poe i jak rozlicza użycie",
      tradeoff:
        "Mocne strony Poe to katalog botów, wypłaty dla twórców i rozmowy grupowe. W {{appName}} zapytania też zużywają kredyty. Porównaj koszt długiej rozmowy na modelach, z których korzystasz.",
      switch: {
        firstLink: "Ceny odnowienia i limity Poe",
        secondLink: "Poe a płatność za użycie",
        first:
          "W dyskusji na r/PoeAI abonenci pisali o zmianach cen przy odnowieniu i limitów punktów. Jedna osoba planowała przejść na OpenRouter z TypingMind. Dla innej dotychczasowy plan wciąż był opłacalny.",
        second:
          "W osobnym wątku jeden z użytkowników polecał OpenRouter za przejrzyste koszty. Inny uważał, że przy regularnym użyciu bardziej opłaca się dzienna pula Poe. To relacje poszczególnych osób. Ceny w porównaniu pochodzą od dostawców.",
      },
      criteria: {
        cost: "Jeśli zdarza Ci się pisać dużo, ale rzadko, porównaj przedpłatę z kosztem abonamentu w spokojnym miesiącu. Jeśli czatujesz codziennie, policz, na ile rzeczywistych wiadomości wystarcza pula.",
        workflow:
          "Sprawdź, czego używasz poza czatem. Boty społeczności i grupy to powody, by zostać w Poe. Jeśli głównie porównujesz odpowiedzi, sprawdź, czy możesz je wyświetlić równolegle albo zmienić model w wątku.",
      },
      faq: {
        best: {
          q: "Jaka jest najlepsza alternatywa dla Poe?",
          a: "{{appName}} udostępnia gotowy czat z popularnymi modelami i modelami bez cenzury. OpenRouter Chat i NanoGPT pozwalają płacić za użycie. TypingMind obsługuje własne klucze, a Open WebUI sprawdza się lokalnie.",
        },
        free: {
          q: "Czy istnieje darmowa alternatywa dla Poe?",
          a: "W {{appName}} goście dostają co miesiąc {{guestCredits}} darmowych kredytów. OpenRouter udostępnia wybrane modele za darmo. Zwykła instalacja LibreChat i Open WebUI jest bezpłatna. Sprzęt, hosting i płatne modele mogą kosztować.",
        },
        billing: {
          q: "W której alternatywie dla Poe płacę za użycie?",
          a: "OpenRouter i NanoGPT rozliczają użycie z doładowanego salda. TypingMind i LibreChat pozwalają łączyć się z dostawcami, którym płacisz bezpośrednio. Koszt zależy od modelu, długości kontekstu i częstotliwości.",
        },
        privacy: {
          q: "Gdzie moje rozmowy zostają lokalnie?",
          a: "Open WebUI może działać bez internetu z lokalnym modelem. TypingMind domyślnie zapisuje historię lokalnie w wersji licencjonowanej. Venice, NanoGPT i tryb incognito w {{appName}} mogą zachować historię na Twoim urządzeniu, ale model w chmurze nadal otrzyma zapytanie.",
        },
        switching: {
          q: "Czy warto zostać w Poe dla botów społeczności?",
          a: "Często tak. Inne aplikacje mają swoich agentów i narzędzia. Katalog botów, czaty grupowe i wynagrodzenia twórców to elementy Poe. Przed zmianą upewnij się, że nowa usługa obsługuje potrzebne Ci funkcje.",
        },
      },
    },
    typingMind: {
      metaTitle: "8 alternatyw dla TypingMind. Porównanie na 2026 rok",
      description:
        "Alternatywy dla TypingMind z własnymi kluczami, lokalnymi modelami lub czatem w chmurze. Porównaj koszty licencji i modeli oraz ofertę {{appName}}.",
      keywords:
        "alternatywy dla TypingMind, TypingMind czy LibreChat, TypingMind czy Open WebUI, własny klucz API, {{appName}}",
      title: "8 alternatyw dla TypingMind do czatu z AI",
      subtitle:
        "Zachowaj klucze dostawców i uruchom własny interfejs albo od razu otwórz czat w chmurze. Porównujemy osiem opcji, w tym {{appName}}.",
      lead: "TypingMind porządkuje dostęp do usług, za które już płacisz. Jeśli potrzebujesz głównie okna czatu, zsumuj koszt licencji, użycia modeli i ewentualnej synchronizacji. Możliwe, że wystarczy Ci darmowa aplikacja albo czat, który zarządza dostępem za Ciebie.",
      overview: "Co obejmuje licencja TypingMind",
      tradeoff:
        "W TypingMind płacisz bezpośrednio dostawcom. Premium pokazuje kilka niezależnych odpowiedzi naraz. {{appName}} daje jeden katalog modeli w chmurze i pobiera kredyty według stawki wybranego modelu. Wybierz klienta takiego jak TypingMind, jeśli chcesz wykorzystać saldo u dostawcy.",
      switch: {
        firstLink: "Bezpłatny interfejs na własny serwer",
        secondLink: "Koszty poza licencją TypingMind",
        first:
          "Na r/selfhosted użytkownik szukał tańszego interfejsu na własny serwer, żeby połączyć się z OpenAI. Wypróbował Open WebUI i napisał, że spełnia jego potrzeby.",
        second:
          "Na r/TypingMind osoba rozważająca zakup zapytała o opłaty poza licencją dożywotnią. W odpowiedziach pojawiły się koszty API i opcjonalnej przestrzeni w chmurze. Aktualne warunki znajdziesz na stronie cenowej.",
      },
      criteria: {
        cost: "Policz koszt roku, razem z licencją, użyciem modeli, przestrzenią i serwerem. Abonament łatwiej zaplanować. Przy sporadycznym użyciu może pasować rozliczanie pojedynczych zapytań.",
        workflow:
          "Jeśli potrzebujesz własnych kluczy lub lokalnego modelu, zacznij od LibreChat i Open WebUI. Jeśli zależy Ci na osobnym kontekście dla każdego modelu albo folderach projektów, przetestuj te funkcje przed przeprowadzką.",
      },
      faq: {
        best: {
          q: "Jaka jest najlepsza alternatywa dla TypingMind?",
          a: "LibreChat sprawdza się do samodzielnego hostingu i wielu dostawców. Rozważ Open WebUI dla lokalnych modeli, OpenRouter Chat do zestawiania odpowiedzi albo {{appName}}, jeśli wolisz gotowy czat z modelami popularnymi i bez cenzury, bez własnego klucza.",
        },
        free: {
          q: "Czy istnieje darmowa alternatywa dla TypingMind?",
          a: "LibreChat i Open WebUI możesz uruchamiać bez opłaty za oprogramowanie, zgodnie z ich licencjami. Oddzielnie rozliczasz serwer i płatne modele. {{appName}} daje co miesiąc {{guestCredits}} darmowych kredytów bez konta.",
        },
        billing: {
          q: "Czy licencja TypingMind pokrywa użycie API?",
          a: "Nie. Licencję kupujesz raz, a za użycie płacisz dostawcom modeli. Przy modelu lokalnym koszty to sprzęt i prąd. ChatGPT Plus to osobna subskrypcja, która nie obejmuje ogólnego użycia API OpenAI.",
        },
        privacy: {
          q: "Czy lokalna historia oznacza, że model działa offline?",
          a: "Nie. TypingMind może zapisywać historię na urządzeniu i wysyłać pytania do dostawcy w sieci. Jeśli chcesz trzymać historię i przetwarzanie na swoim sprzęcie, rozważ Open WebUI z lokalnym modelem.",
        },
        switching: {
          q: "Czy mogę zmienić TypingMind na Poe albo OpenRouter Chat?",
          a: "Tak. W Poe płacisz punktami z planu. OpenRouter Chat pobiera środki z salda i może zadać to samo pytanie kilku modelom. Wcześniej zapisz ważne rozmowy i sprawdź formaty importu nowej usługi.",
        },
      },
    },
  },
};
