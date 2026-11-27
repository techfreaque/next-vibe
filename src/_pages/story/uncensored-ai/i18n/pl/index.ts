import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "AI bez cenzury: czat AI bez filtrów w przeglądarce",
  metaTitle: "AI bez cenzury: czat bez filtrów, za darmo | {{appName}}",
  description:
    "Czat AI bez cenzury i bez rejestracji. Modele abliterowane i naprawdę nieocenzurowane w przeglądarce, darmowe kredyty dla gości. Porównaj koszty i pisz od razu.",
  keywords:
    "AI bez cenzury, czat AI bez cenzury, ChatGPT bez cenzury, AI bez ograniczeń, AI bez filtrów, nieocenzurowana AI, sztuczna inteligencja bez cenzury, abliterowana AI",
  intro:
    "Czat AI bez cenzury to modele, które odpowiadają, zamiast odmawiać. Piszesz w przeglądarce jako gość: darmowe kredyty, bez rejestracji, jedno potwierdzenie 18+. Bez moralizowania. To ty decydujesz, co czytasz.",
  tryModel: "Wypróbuj {{model}}",
  chooseModel: "Porównaj modele do czatu",
  choose:
    "Do krótkiego pytania wybierz tańszy model z początku listy. Przy długich dokumentach lub rozmowach większe okno kontekstowe pozwoli modelowi uwzględnić więcej tekstu naraz.",
  start:
    "Otwórz czat z wybranym modelem. Gdy pojawi się prośba, potwierdź, że masz co najmniej 18 lat, i zaakceptuj warunki. Potem wpisz własne pytanie w miejsce przykładowego.",
  models: "Modele AI bez cenzury",
  order:
    "Na początku listy są modele o najniższym szacowanym koszcie. Wyliczenie obejmuje {{input}} tokenów wejściowych i {{output}} wyjściowych według najniższej dostępnej stawki. Dłuższa rozmowa może kosztować więcej.",
  empty:
    "W tej instancji nie ma obecnie dostępnych modeli do czatu bez cenzury.",
  context: "Okno kontekstowe: {{tokens}} tokenów",
  price: "Szacowany koszt wymiany w kredytach: {{credits}}",
  chat: "Rozpocznij czat z {{model}}",
  questions: "AI bez cenzury: najczęstsze pytania",
  faq: {
    access: {
      q: "Czy mogę korzystać z AI bez cenzury za darmo?",
      a: "Jako gość możesz otrzymać do {{credits}} darmowych kredytów miesięcznie. Liczba wiadomości zależy od modelu i długości rozmowy.",
    },
    outOfCredits: {
      q: "Co się stanie, gdy skończą mi się kredyty gościa?",
      a: "Możesz poczekać na pulę na kolejny miesiąc albo założyć darmowe konto i potwierdzić adres e-mail. Po weryfikacji możesz otrzymać do {{credits}} darmowych kredytów miesięcznie. Kredyty wykorzystane w tym samym miesiącu jako gość wliczają się do tej puli.",
    },
    chatgpt: {
      q: "Czy istnieje ChatGPT bez cenzury?",
      a: "Nie. Modele GPT od OpenAI mają filtry wszędzie, także tutaj. Prompty typu jailbreak działają tylko do następnej aktualizacji. Pewniejsza droga to inny model: wybierz jeden z kategorii bez cenzury i zadaj pytanie wprost.",
    },
    kinds: {
      q: "Abliterowany czy naprawdę bez cenzury: czym się różnią?",
      a: "Modele abliterowane to modele z głównego nurtu, z których wycięto odmowy. Ten sam trening, ten sam światopogląd, po prostu odpowiadają. {{model}} to model naprawdę bez cenzury: trenowany na książkach i dokumentach zakazanych w mainstreamowym internecie. Efekt to model z przeciwnymi poglądami politycznymi. Karta każdego modelu pokazuje, do której grupy należy.",
    },
    filters: {
      q: "Czy istnieje AI zupełnie bez ograniczeń?",
      a: "Tutaj wybierasz model z kategorii bez cenzury. Popularne modele, takie jak GPT, zachowują własne filtry. Model bez cenzury nadal może odmówić odpowiedzi albo się pomylić. Ważne fakty sprawdzaj sam.",
    },
    privacy: {
      q: "Czy moje rozmowy są prywatne?",
      a: "Czaty incognito zostają w twojej przeglądarce, nie na naszych serwerach. Dostawca AI dostaje każdą wiadomość, żeby na nią odpowiedzieć. Żadnych trackerów firm trzecich, żadnych pikseli reklamowych. Z kontem wyeksportujesz dane jako JSON albo usuniesz konto w ustawieniach.",
    },
    legal: {
      q: "Czy AI bez cenzury jest legalna?",
      a: "Korzystanie z modelu, który rzadziej odmawia, nie jest zakazane. To, co zrobisz z odpowiedziami albo opublikujesz, podlega tym samym przepisom co każdy inny tekst. Przed pierwszym modelem bez cenzury raz potwierdzasz, że masz co najmniej 18 lat.",
    },
    local: {
      q: "Czy potrzebuję karty graficznej?",
      a: "Wystarczą przeglądarka i połączenie z internetem. Zapytanie przetwarza dostawca modelu. Jeśli chcesz uruchomić model w całości na swoim komputerze, zainstaluj go lokalnie.",
    },
    askAnything: {
      q: "Czy AI bez cenzury można zapytać o wszystko?",
      a: "Pytać możesz o wszystko. Modele z poziomu bez cenzury pomijają standardowe formułki odmowy, więc większość pytań dostaje konkretną odpowiedź. Model nadal może odmówić albo się pomylić, więc sprawdzaj ważne fakty. Za to, co zrobisz z odpowiedziami, odpowiadasz ty.",
    },
    online: {
      q: "Czy to działa online, bez aplikacji?",
      a: "Tak. Każdy model działa w przeglądarce, na komputerze i na telefonie. Nic nie instalujesz, nie potrzebujesz GPU. Po dowolnym zakupie te same modele są też dostępne przez API zgodne z OpenAI.",
    },
    pick: {
      q: "Który czatbot AI bez cenzury wybrać?",
      a: "Na szybkie pytanie zacznij od {{cheapest}}, najtańszego modelu na liście. Do długich dokumentów wybierz model z oknem kontekstu {{context}}.",
      aWorldview:
        "Na szybkie pytanie zacznij od {{cheapest}}, najtańszego modelu na liście. Do długich dokumentów wybierz model z oknem kontekstu {{context}}. Jeśli chcesz odpowiedzi spoza mainstreamowych opinii, spróbuj {{model}}: trenowany na książkach i dokumentach zakazanych w mainstreamowym internecie. Efekt to model z przeciwnymi poglądami politycznymi.",
    },
  },
  guides: "Porównaj modele i platformy",
  chatgptGuide: "ChatGPT bez cenzury: sprawdź alternatywę",
  abliteratedChat: "Wypróbuj model po abliteracji na czacie",
  compare: "Porównaj platformy do czatu AI bez cenzury",
  benchmark: "Zobacz odpowiedzi modeli na te same pytania testowe",
  breadcrumb: "Nieocenzurowana AI",
  guidesTitle: "Poradniki: AI bez cenzury i bez filtrów",
  guidesIntro:
    "Który model pasuje do jakiego zadania, co abliteracja zmienia w modelu i jak czatować lub korzystać z API bez GPU i bez konta.",
  comparisons: "Porównania jeden na jeden",
  comparisonsIntro:
    "Dwa modele na jednej stronie, obok siebie. Zobacz różnice, zanim wybierzesz.",
  versus: "{{a}} vs {{b}}",
};
