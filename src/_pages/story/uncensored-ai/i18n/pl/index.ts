import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Czat AI bez cenzury w przeglądarce",
  metaTitle: "Czat AI bez cenzury i bez rejestracji | {{appName}}",
  description:
    "Wypróbuj czat AI bez cenzury i bez konta. Porównaj okna kontekstowe i szacowane koszty modeli, a potem zadaj własne pytanie w przeglądarce.",
  intro:
    "Porozmawiaj z chatbotem bez cenzury w przeglądarce. Możesz zacząć jako gość.",
  chooseModel: "Znajdź model do rozmowy",
  choose:
    "Do krótkiego pytania wybierz tańszy model z początku listy. Przy długich dokumentach lub rozmowach większe okno kontekstowe pozwoli modelowi uwzględnić więcej tekstu naraz.",
  start:
    "Otwórz czat z wybranym modelem. Gdy pojawi się prośba, potwierdź, że masz co najmniej 18 lat, i zaakceptuj warunki. Potem wpisz własne pytanie w miejsce przykładowego.",
  models: "Wybierz model do rozmowy",
  order:
    "Na początku listy są modele o najniższym szacowanym koszcie. Wyliczenie obejmuje {{input}} tokenów wejściowych i {{output}} wyjściowych według najniższej dostępnej stawki. Dłuższa rozmowa może kosztować więcej.",
  empty:
    "W tej instancji nie ma obecnie dostępnych modeli do czatu bez cenzury.",
  context: "Okno kontekstowe: {{tokens}} tokenów",
  price: "Szacowany koszt wymiany w kredytach: {{credits}}",
  chat: "Rozpocznij czat z {{model}}",
  questions: "Przed pierwszą rozmową",
  faq: {
    access: {
      q: "Czy mogę wypróbować czat AI bez cenzury za darmo?",
      a: "Miesięczna pula darmowych kredytów dla gości wynosi {{credits}}. Liczba wiadomości zależy od modelu i długości rozmowy.",
    },
    filters: {
      q: "Co tutaj znaczy czat AI bez filtrów?",
      a: "Wybierasz model z kategorii bez cenzury. Popularne modele, takie jak GPT, zachowują własne filtry. Model bez cenzury nadal może odmówić odpowiedzi albo się pomylić.",
    },
    local: {
      q: "Czy potrzebuję karty graficznej?",
      a: "Wystarczą przeglądarka i połączenie z internetem. Zapytanie przetwarza dostawca modelu. Jeśli chcesz uruchomić model w całości na swoim komputerze, zainstaluj go lokalnie.",
    },
  },
  guides: "Porównaj modele i platformy",
  abliteratedChat: "Wypróbuj model po abliteracji na czacie",
  abliteration: "Jak abliteracja zmienia model językowy",
  compare: "Porównaj platformy do czatu AI bez cenzury",
  benchmark: "Zobacz odpowiedzi modeli na te same pytania testowe",
};
