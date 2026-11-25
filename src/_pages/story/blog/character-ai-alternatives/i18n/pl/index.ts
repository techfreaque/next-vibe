import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Alternatywy dla Character.AI do odgrywania ról (2026)",
    category: "Odgrywanie ról z AI",
    description:
      "Alternatywy dla Character.AI do odgrywania ról, pisania i rozmów z towarzyszem: Janitor AI, SpicyChat, DreamGen, SillyTavern i {{appName}} w porównaniu.",
    imageAlt:
      "Alternatywy dla Character.AI do odgrywania ról i rozmów z towarzyszem AI",
    keywords:
      "alternatywa dla Character AI, Character AI bez filtra, odgrywanie ról AI, Janitor AI, SillyTavern",
  },
  hero: {
    backToBlog: "Wróć do bloga",
    category: "Odgrywanie ról z AI",
    readTime: "9 min czytania",
    title: "Alternatywy dla Character.AI do odgrywania ról",
    subtitle:
      "Znajdź gotowe postacie, towarzysza z pamięcią albo model, który samodzielnie wybierzesz. Ceny sprawdziliśmy {{date}}.",
  },
  intro: {
    lead: "W Janitor AI wybierasz gotową postać i zaczynasz scenę. SillyTavern daje Ci kontrolę nad całą konfiguracją. Kindroid i Nomi sprawdzą się, jeśli chcesz wracać do jednego towarzysza, który Cię pamięta.",
    p2: "Tworzymy {{appName}}. Pokazujemy je jako pierwsze ze względu na wybór modelu i import postaci. Ceny konkurencji podajemy w dolarach amerykańskich na podstawie oficjalnych stron i ofert wydawców sprawdzonych {{date}}.",
  },
  characterAi: { title: "Co dziś oferuje Character.AI" },
  switch: {
    title: "Dlaczego użytkownicy szukają alternatywy",
    intro: "W publicznych dyskusjach powracają trzy różne powody.",
    reasons: {
      filtering: {
        body: "Przerywanie scen. W aktualizacji z sierpnia 2025 zespół Character.AI odniósł się do uwag użytkowników, że filtr zbyt często wtrącał się w rozmowy.",
        source: "Aktualizacja Character.AI na Reddicie",
      },
      continuity: {
        body: "Zgubiony wątek. Osoba szukająca alternatywy chciała lepszej pamięci, wiarygodnego dialogu i miejsca na własne kwestie w scenach rozgrywanych bez pośpiechu.",
        source: "Dyskusja o pamięci i odgrywaniu ról na Reddicie",
      },
      oldSite: {
        body: "Koniec starej strony. W dyskusji o powodach odejścia jedna osoba napisała, że po jej usunięciu całkowicie przeniosła się do innego serwisu.",
        source: "Dyskusja o odejściu z Character.AI na Reddicie",
      },
    },
  },
  criteria: {
    title: "Co sprawdzić przed zmianą",
    intro:
      "Rozegraj tę samą scenę w dwóch aplikacjach. Wróć następnego dnia i zapytaj o szczegół z początku.",
    filter:
      "Sprawdź, jakie tematy dopuszcza model i czy serwis wymaga weryfikacji wieku.",
    memory:
      "Zobacz, czy aplikacja przywołuje szczegóły z zapisanej pamięci, streszczeń albo notatek o świecie.",
    price:
      "Policz wiadomości lub kredyty potrzebne przy wybranym modelu. Uwzględnij ponowne generowanie odpowiedzi.",
    privacy:
      "Sprawdź, gdzie zostaje historia rozmowy i kto przetwarza wiadomości.",
    characters:
      "Wybierz między katalogiem gotowych bohaterów, edytowalną kartą postaci a jednym stałym towarzyszem.",
  },
  table: {
    title: "Character.AI i alternatywy w jednej tabeli",
  },
  us: {
    title: "1. {{appName}}: zaimportuj postać i wybierz model",
    intro:
      "Zacznij scenę w przeglądarce albo zapisz bohatera jako umiejętność do wielokrotnego użycia.",
    models:
      "Wśród {{modelCount}} modeli znajdziesz {{uncensored}} bez cenzury, {{mainstream}} modeli komercyjnych i {{open}} otwartych. Model można zmienić w trakcie sceny.",
    characters:
      "Umiejętność do odgrywania ról pomaga modelowi trzymać się postaci. Przeglądaj opublikowane umiejętności, użyj edytora lub stwórz postać z Kreatorem Umiejętności.",
    consent:
      "Aby użyć modeli bez cenzury, raz potwierdzasz ukończenie 18 lat i zgodę na odpowiedzi bez filtra.",
    import:
      "Zaimportuj postać z publicznego linku Character.AI lub Talkie. Kopia wskazuje autora oryginału.",
    privacy:
      "Czat incognito działa bez konta. Historia zostaje w przeglądarce, a każdą wiadomość nadal przetwarza dostawca modelu.",
    price:
      "{{guestCredits}} kredytów miesięcznie dla gościa lub {{freeCredits}} na darmowym koncie. Abonamenty od {{subPrice}} miesięcznie. Użycie modelu zużywa kredyty.",
    weak: "Character.AI i Janitor AI ułatwiają odkrywanie postaci. Jeśli dużo piszesz, łatwiej przewidzisz rachunek przy stałej cenie w serwisie do odgrywania ról.",
    skillsLink: "Przeglądaj umiejętności wbudowane i społecznościowe",
    roleplayLink: "Otwórz umiejętność do odgrywania ról",
    creatorLink: "Stwórz postać w Kreatorze Umiejętności",
  },
  list: {
    title: "Dziewięć alternatyw z bliska",
    intro:
      "Wybierz według stylu gry. Pod każdym opisem są źródła cen i funkcji.",
    heading: "{{number}}. {{name}}: {{bestFor}}",
    filter: "Zasady treści.",
    price: "Cena.",
    pro: "Zaleta.",
    con: "Ograniczenie.",
    versusLink: "{{appName}} a {{name}}",
  },
  options: {
    characterAi: {
      summary:
        "Character.AI udostępnia publiczne i własne postacie, rozmowy tekstowe, głosy i połączenia. Użytkownicy uprawnieni do czatu mogą nadal pisać bez limitu w darmowym trybie standardowym.",
      pricing:
        "Standardowe czaty są darmowe. W USA są dostępne następujące plany ({{plans}}). Lite daje część funkcji premium i wyświetla reklamy. Plus obejmuje pełny zestaw funkcji pamięci i usuwa reklamy.",
      filter:
        "Treści pornograficzne są zabronione. Swobodny czat z postaciami jest dostępny od 18 lat.",
      privacy: "Ustawienie zgody na trenowanie modeli",
      pro: "Duży katalog postaci z fandomów oraz wbudowane głosy i połączenia.",
      con: "Płatne pakiety dają dodatkowe funkcje i zachowują te same reguły dotyczące treści erotycznych.",
    },
    janitorAi: {
      bestFor: "postacie społeczności",
      summary:
        "Serwis z milionami botów społeczności, edytowalnymi personami i opcją podłączenia zewnętrznego modelu.",
      pricing:
        "Standardowe czaty bez limitu. Amerykański App Store podaje {{plans}}.",
      filter:
        "Kategoria Limitless dopuszcza tematykę dla dorosłych. Aplikacja mobilna zaczyna w trybie ograniczonym.",
      privacy: "Zewnętrzne proxy może otrzymywać wiadomości",
      pro: "Duży katalog postaci i darmowe czaty bez limitu w standardowym trybie. Janitor+ daje pięciokrotnie większy kontekst, priorytet i ponawianie odpowiedzi z modelami premium.",
      con: "Darmowy kontekst to około 9 000 tokenów. Zewnętrzne proxy może wymagać konfiguracji i kosztować dodatkowo.",
    },
    sillyTavern: {
      bestFor: "pełna kontrola lokalnie",
      summary:
        "Darmowy interfejs z otwartym kodem do modeli lokalnych i zdalnych. Obsługuje karty postaci, notatki o świecie i ustawienia promptów.",
      pricing:
        "Program jest darmowy. Model lokalny korzysta z Twojego sprzętu, a hostowane API ma własny cennik.",
      filter: "Filtrowanie zależy od modelu i usługi, która go uruchamia.",
      privacy: "Lokalne pliki rozmów. Hostowane API dostaje wiadomości.",
      pro: "Samodzielnie wybierasz karty, notatki, prompty i model. Całość może działać na Twoim komputerze.",
      con: "Musisz zainstalować interfejs i zapewnić model. Uruchamianie go lokalnie wymaga odpowiedniego sprzętu.",
    },
    chub: {
      bestFor: "notatki o świecie i rozgałęziona fabuła",
      summary:
        "Katalog kart postaci i hostowany interfejs z notatkami wywoływanymi słowami kluczowymi, wieloma postaciami w rozmowie i drzewem wątków.",
      pricing:
        "Chub opisuje okazjonalne jednorazowe kredyty próbne. Abonament na modele Chub kosztuje {{plans}}. Zewnętrzne modele mają osobne stawki.",
      filter:
        "Chub opisuje własne modele jako pozbawione cenzury. Zewnętrzni dostawcy mają własne zasady.",
      privacy:
        "Udostępnione rozmowy mogą być publiczne. Zewnętrzne API otrzymuje wiadomości.",
      pro: "Rozwijaj alternatywne wątki, dołącz notatki i eksportuj rozmowy do JSONL dla SillyTavern albo do pliku tekstowego.",
      con: "Do regularnej gry potrzebujesz abonamentu albo konfiguracji zewnętrznego modelu. Kredyty próbne są ograniczone i przyznawane okazjonalnie.",
      free: "Okazjonalne kredyty próbne",
    },
    crushOn: {
      bestFor: "gotowe sceny dla dorosłych",
      summary:
        "Postacie społeczności, sceny grupowe, głosy i zmiana modelu bez własnego klucza API.",
      pricing:
        "Nielimitowane czaty na darmowych modelach i 100 kredytów miesięcznie na modele Pro. Plany miesięczne to {{plans}}.",
      filter:
        "Można odgrywać sceny dla dorosłych. Zaawansowane modele mają odrębne limity dostępu i kredytów.",
      privacy:
        "Polityka prywatności nie rozstrzyga, czy twórcy mają dostęp do rozmów",
      pro: "Wejdź w scenę z gotową postacią, dodaj kolejne i zmień model w trakcie rozmowy.",
      con: "Pro i Ultra rozliczają się inaczej. Opłacony abonament nie daje nielimitowanego dostępu do każdego modelu.",
    },
    spicyChat: {
      bestFor: "postacie dla dorosłych i własne persony",
      summary:
        "Hostowana platforma do odgrywania ról dla dorosłych, z postaciami społeczności, wieloma personami użytkownika i płatnymi funkcjami pamięci.",
      pricing:
        "Darmowy plan daje kontekst 4 096 tokenów. Sprawdziliśmy roczne ceny w USA ({{plans}}). Oferty miesięczne sprawdzisz w serwisie.",
      filter:
        "Można odgrywać sceny dla dorosłych. Publiczne postacie podlegają moderacji.",
      privacy: "Usługa hostowana. Odpowiedź korzysta z bieżącej rozmowy.",
      pro: "Płatne plany pozwalają omijać kolejki i edytować wspomnienia. Wyższe dodają pamięć semantyczną i obrazy w rozmowie.",
      con: "Bezpłatnie trzeba liczyć się z reklamami i kolejkami. Synteza mowy i regulacja generowania są w najwyższym planie.",
    },
    kindroid: {
      bestFor: "towarzysz z połączeniami na żywo",
      summary:
        "Stwórz towarzysza z historią, trwałą pamięcią, selfie i połączeniami głosowymi lub wideo.",
      pricing:
        "Jednorazowo 50 wiadomości próbnych, w niektórych regionach 15. Amerykański App Store podaje {{plans}}. W przeglądarce może być taniej.",
      filter:
        "Dla dorosłych. Kindroid deklaruje moderację poważnych zagrożeń w świecie rzeczywistym na poziomie konta.",
      privacy: "Szyfrowanie podczas przesyłania i przechowywania",
      pro: "Rozmowy głosowe i wideo, wiadomości od towarzysza, czaty grupowe i selfie.",
      con: "Po wyczerpaniu próby lub wygaśnięciu abonamentu konto działa w trybie odczytu. Większa pamięć kosztuje dodatkowo.",
      free: "Jednorazowa próba",
    },
    nomi: {
      bestFor: "towarzysz z codzienną pulą wiadomości",
      summary:
        "Towarzysz AI z długą pamięcią, selfie, czatami grupowymi i głosem w płatnym planie.",
      pricing:
        "50 wiadomości dziennie za darmo. Plan Standard ma kilka okresów rozliczeniowych ({{plans}}).",
      filter:
        "Dla dorosłych. Nomi opisuje tekst jako niefiltrowany. Obrazy mają osobne ograniczenia.",
      privacy:
        "Nomi deklaruje, że nie sprzedaje ani nie wypożycza danych osobowych",
      pro: "Wracaj do tego samego towarzysza albo połącz kilku w jednej rozmowie.",
      con: "Darmowy czat ma dzienny limit. Funkcje głosowe wymagają abonamentu.",
    },
    venice: {
      bestFor: "prywatne rozmowy z postaciami i generowanie obrazów",
      summary:
        "Rozmowy z postaciami, zwykły czat AI, tworzenie obrazów i wybór modeli w jednym miejscu.",
      pricing:
        "Na darmowych modelach podstawowych masz dziennie 10 zapytań tekstowych i 15 zapytań o obrazy. {{plans}}. Tworzenie własnych postaci wymaga Pro.",
      filter:
        "Filtr dla dorosłych jest domyślnie aktywny. Uprawnieni użytkownicy Pro mogą go wyłączyć.",
      privacy: "Historia domyślnie zostaje na urządzeniu",
      pro: "Postacie, rozmowy i obrazy w tej samej aplikacji. W płatnym planie dostępna jest szyfrowana kopia zapasowa.",
      con: "Darmowy tekst ma limit. Modele premium i część funkcji multimedialnych zużywają kredyty.",
    },
    nanoGpt: {
      bestFor: "wybór modelu i rozliczenie za zużycie",
      summary:
        "Czat i API do modeli tekstowych i multimedialnych. Wybierz gotowe ustawienia lub wpisz własny prompt postaci.",
      pricing:
        "Jeden darmowy model w przeglądarce. Pierwsza wpłata od 0,10 USD w krypto albo 1 USD kartą. {{plans}}. PRO obejmuje wybrane otwarte modele.",
      filter: "Dla dorosłych. Ograniczenia zależą od modelu i dostawcy.",
      privacy: "Domyślnie lokalna historia. Zasady zależą od dostawcy.",
      pro: "Płacisz za użycie. API można podłączyć także do interfejsu SillyTavern.",
      con: "Postać lub interfejs konfigurujesz samodzielnie. Większość modeli korzysta z salda.",
    },
  },
  import: {
    title: "Jak przenieść postać z Character.AI",
    intro:
      "Zacznij nową historię na podstawie tego, co twórca postaci udostępnił publicznie.",
    steps: {
      account: {
        title: "Zaloguj się",
        body: "Bezpłatne konto pozwoli później edytować zaimportowaną postać.",
      },
      create: {
        title: "Otwórz edytor",
        body: "Na stronie umiejętności utwórz własną umiejętność i wybierz import z linku.",
      },
      paste: {
        title: "Wklej publiczny link",
        body: "Użyj linku do Character.AI lub Talkie. Import pobiera widoczne pola, np. imię, awatar, powitanie i opis. Może pobrać również publiczną definicję.",
      },
      model: {
        title: "Wybierz model",
        body: "Zacznij rozmowę ze swoją kopią. W trakcie możesz zmienić model w tym samym wątku.",
      },
    },
    callout:
      "Kopia wskazuje autora i odsyła do oryginału. Dotychczasowe rozmowy pozostają w poprzednim serwisie.",
  },
  privacy: {
    title: "Co się dzieje z Twoją rozmową",
    intro: "Tak działa tryb incognito w {{appName}}.",
    incognito:
      "Historia jest zapisana w przeglądarce. Wyczyszczenie jej danych usuwa historię.",
    transit:
      "Każda wiadomość trafia przez naszą usługę do dostawcy modelu. Zapisujemy zużycie kredytów do rozliczenia.",
    callout:
      "Jeśli wolisz w pełni lokalną konfigurację, połącz SillyTavern z modelem na swoim komputerze.",
  },
  stay: {
    title: "Kiedy warto zostać w Character.AI",
    intro:
      "Character.AI wciąż pasuje do krótkich, moderowanych rozmów ze znajomymi postaciami.",
    library:
      "Masz już ulubione postacie społeczności i korzystasz z połączeń głosowych.",
    flat: "Głównie piszesz na standardowym czacie i bardziej cenisz brak limitu darmowych wiadomości niż wybór modelu.",
    callout:
      "Zostań, jeśli narzędzia i zasady Character.AI pasują do historii, które tworzysz.",
  },
  faq: {
    title: "Najczęstsze pytania",
    best: {
      q: "Jaka jest najlepsza alternatywa dla Character.AI?",
      a: "Janitor AI ma duży katalog postaci. SillyTavern daje lokalną kontrolę i notatki o świecie. Kindroid i Nomi stawiają na stałych towarzyszy. {{appName}} pozwala zaimportować publiczną postać i zmieniać modele.",
    },
    free: {
      q: "Czy istnieje darmowa alternatywa dla Character.AI?",
      a: "Janitor AI ma nielimitowane standardowe czaty, a Nomi daje 50 wiadomości dziennie. SillyTavern jest darmowy i wymaga osobnego modelu. W {{appName}} dostajesz {{guestCredits}} kredytów miesięcznie jako gość albo {{freeCredits}} z bezpłatnym kontem.",
    },
    import: {
      q: "Czy mogę przenieść postacie i rozmowy z Character.AI?",
      a: "Na bezpłatnym koncie w {{appName}} możesz wczytać dostępne pola z publicznego linku Character.AI lub Talkie. Prywatne definicje i dotychczasowe rozmowy pozostają w pierwotnym serwisie.",
    },
    nsfw: {
      q: "Które alternatywy dla Character.AI dopuszczają tekst dla dorosłych?",
      a: "Janitor AI w kategorii Limitless, CrushOn i SpicyChat dopuszczają treści dla dorosłych na własnych zasadach. W SillyTavern decyduje użyty model i jego dostawca. {{appName}} udostępnia modele bez cenzury po potwierdzeniu pełnoletności.",
    },
    private: {
      q: "Która alternatywa dla Character.AI działa lokalnie?",
      a: "SillyTavern działa z lokalnym modelem i zapisuje czaty na komputerze. Venice i incognito w {{appName}} zostawiają historię na urządzeniu, a wiadomości przetwarzają dostawcy zdalnych modeli.",
    },
    account: {
      q: "Czy da się wypróbować {{appName}} bez konta?",
      a: "Tak. Użyj kredytów gościa w czacie incognito. Zaloguj się, aby importować postacie lub korzystać z zapisanych czatów na innych urządzeniach.",
    },
    memory: {
      q: "Które alternatywy sprawdzają się w długich scenach?",
      a: "Chub i SillyTavern przywołują szczegóły z notatek o świecie. Kindroid i Nomi skupiają się na pamięci stałego towarzysza. Przed opłaceniem planu sprawdź, co model pamięta z początku sceny.",
    },
    roleplayLink: "Odgrywanie ról z AI bez filtra",
    kindsLink: "Czym różnią się modele AI bez cenzury",
  },
  partners: {
    body: "Prowadzisz społeczność graczy? Program partnerski {{appName}} wypłaca {{referralPercent}}% każdej poleconej płatności.",
    link: "Zobacz program partnerski",
  },
  cta: {
    title: "Wybierz model i zacznij scenę",
    subtitle:
      "Na start jako gość masz {{guestCredits}} darmowych kredytów miesięcznie.",
    start: "Zacznij odgrywać rolę",
    skills: "Przeglądaj umiejętności",
  },
};
