import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Nieocenzurowany LLM online: bez GPU, bez instalacji | {{appName}}",
    description:
      "Nieocenzurowany LLM online, bez karty graficznej. Ile VRAM naprawdę potrzebują lokalne modele, które abliterowane i nieocenzurowane modele działają w przeglądarce i ile kosztuje jedna wiadomość.",
    category: "Przewodnik po modelach",
    imageAlt: "Nieocenzurowany LLM online, bez GPU",
    keywords:
      "nieocenzurowany LLM online, nieocenzurowany LLM bez GPU, alternatywa dla lokalnego LLM online, AI bez cenzury bez karty graficznej, abliterowany model online, nieocenzurowany model w przeglądarce, ile VRAM do lokalnego LLM, alternatywa dla Ollama online, alternatywa dla LM Studio, {{appName}}",
  },
  hero: {
    backToBlog: "Wróć do bloga",
    category: "Przewodnik po modelach",
    readTime: "8 min czytania",
    title: "Nieocenzurowany LLM online. Bez GPU. Bez instalacji.",
    subtitle:
      "Czego lokalny nieocenzurowany model naprawdę wymaga od twojego sprzętu i {{count}} nieocenzurowanych modeli, które zamiast tego działają w karcie przeglądarki. Ceny i kontekst prosto z naszego rejestru modeli.",
  },
  intro: {
    lead: "Każdy poradnik o nieocenzurowanych modelach mówi to samo: pobierz, uruchom lokalnie. Potem sprawdzasz kartę graficzną. Duże modele potrzebują więcej pamięci, niż ma jakikolwiek komputer do gier. Małe, które się mieszczą, to nie te, którymi wszyscy się zachwycają.",
    p2: "Jest druga droga. Ten sam rodzaj modeli, hostowany, w karcie przeglądarki. Bez GPU, bez sterowników, bez pobierania 40 GB. Ten przewodnik pokazuje, czego naprawdę wymaga uruchomienie lokalne, kiedy nadal wygrywa i jakich {{count}} nieocenzurowanych modeli możesz teraz użyć na {{appName}}.",
  },
  table: {
    model: "Model",
    context: "Kontekst",
    price: "Za wiadomość",
  },
  hardware: {
    title: "Czego naprawdę wymaga uruchomienie lokalne",
    intro:
      "Ścianą jest pamięć. Wagi modelu muszą zmieścić się w VRAM karty graficznej (albo w pamięci zunifikowanej Maca), żeby działał w znośnym tempie. Oto nieocenzurowane modele z naszego katalogu z opublikowaną liczbą parametrów.",
    colParams: "Parametry",
    colMemory: "Wagi przy 4 / 8 bitach",
    paramsValue: "{{count}} mld",
    memoryValue: "{{q4}} GB / {{q8}} GB",
    unknown: "Nie podano",
    footnote:
      "Same wagi, wyliczone z liczby parametrów: około 0,5 GB na miliard parametrów przy 4 bitach, 1 GB przy 8 bitach. Kontekst (KV cache) i środowisko uruchomieniowe potrzebują więcej, a długie rozmowy znacznie więcej.",
    small:
      "Do około 12 GB wag: mieści się na karcie 16 GB z zapasem na kontekst.",
    mid: "Od 20 do 40 GB: karta 24 GB przy 4 bitach i krótkim kontekście, dwie karty albo Mac z dużą ilością pamięci zunifikowanej.",
    large:
      "Setki GB: żaden domowy komputer. To modele wielkości frontier i jedyny praktyczny sposób, żeby z nich korzystać, to hosting.",
    callout:
      "Kwantyzacja zmniejsza plik i kosztuje trochę jakości. Wersja 4-bitowa średniego modelu to nie to samo co pełny model w chmurze.",
  },
  local: {
    title: "Kiedy lokalnie to nadal dobry wybór",
    intro:
      "Lokalnie to nie błąd. To wymiana. Narzędzia jak Ollama i LM Studio robią to prostym, jeśli sprzęt daje radę.",
    winsTitle: "Gdzie wygrywa lokalnie",
    offline:
      "Offline: bez internetu, bez konta, bez dostawcy po drodze. Nic nie opuszcza komputera.",
    catchTitle: "Haczyk",
    verdict:
      "W skrócie: masz mocne GPU, chcesz pełnej prywatności i wystarczy ci średni model? Uruchom lokalnie. Chcesz dużych modeli, długiego kontekstu albo po prostu odpowiedzi w ciągu minuty? Korzystaj online.",
  },
  online: {
    title: "{{count}} nieocenzurowanych modeli prosto w przeglądarce",
    intro:
      "Każdy aktualny nieocenzurowany model na {{appName}}, od najtańszego. Kontekst i cena za wiadomość prosto z naszego rejestru modeli. Kliknij model i rozmawiaj.",
    colChat: "Wypróbuj",
    chatLink: "Rozmawiaj z {{model}}",
    footnote:
      "Za wiadomość oznacza jedną referencyjną wymianę na najtańszej trasie. Długie rozmowy i długie odpowiedzi kosztują więcej. Wszystkie działają na serwerach, laptop potrzebuje tylko przeglądarki.",
    directoryLink: "Wszystkie abliterowane modele z kontekstem i ceną",
  },
  steps: {
    title: "Od zera do odpowiedzi w minutę",
    intro: "Bez pobierania, na start bez konta.",
    open: {
      title: "Otwórz czat",
      body: "Kliknij dowolny model powyżej albo zacznij czat incognito. Goście dostają {{guestCredits}} darmowych kredytów miesięcznie.",
    },
    pick: {
      title: "Wybierz model",
      body: "W wyborze modelu wybierz poziom nieocenzurowany. Zmieniasz w trakcie rozmowy kiedy chcesz, historia zostaje.",
    },
    confirm: {
      title: "Potwierdź 18+",
      body: "Nieocenzurowane modele raz pytają o potwierdzenie pełnoletności i regulamin. Potem zostają odblokowane.",
    },
    ask: {
      title: "Zadaj prawdziwe pytanie",
      body: "To, przed którym inni asystenci uciekają. Bez promptu jailbreak, bez przebieranki w roleplay.",
    },
  },
  kinds: {
    title: "Dwa rodzaje braku cenzury, oba online",
    intro:
      "Nie każdy nieocenzurowany model jest nieocenzurowany w ten sam sposób.",
    abliterated:
      "Wersje abliterowane i dostrojone: modele z głównego nurtu albo otwarte, lekko zmienione, żeby przestały unikać pytań. Ten sam trening, ten sam światopogląd. Po prostu odpowiadają.",
    own: "{{ownModel}}: trenowany na książkach i dokumentach zakazanych w mainstreamowym internecie. Efekt to model z przeciwnymi poglądami politycznymi. Działa w hostingu, przez uncensored.ai.",
    link: "Abliterowane, dostrojone czy z własnym światopoglądem: czym się różnią",
  },
  privacy: {
    title: "Co widzi hostowany model",
    intro:
      "Online znaczy, że model działa na cudzym serwerze. Oto dokładnie, kto co widzi.",
    transit:
      "Każda wiadomość przechodzi przez nasz serwer do dostawcy, który uruchamia model. Dostawca widzi prompt, na własnych zasadach. Tak działa każda hostowana AI.",
    incognito:
      "Czaty incognito są zapisane w pamięci lokalnej twojej przeglądarki, nie na naszych serwerach. Wyczyść dane przeglądarki i ich nie ma.",
    selfHost:
      "{{appName}} jest open source. Hostuj go sam i podłącz własne lokalne modele, gdy nic nie może opuścić twojego komputera.",
    selfHostLink: "Hostuj {{appName}} samodzielnie",
    callout:
      "Jeśli prompt nigdy nie może opuścić twojego sprzętu, uruchom model lokalnie. Do wszystkiego innego hosting to szybka droga.",
  },
  cost: {
    title: "Ile to kosztuje: lokalnie kontra online",
    intro: "Lokalnie nie ma ceny za wiadomość. Ceną jest sprzęt.",
    guest:
      "Online u nas: {{guestCredits}} darmowych kredytów miesięcznie bez konta, {{freeCredits}} z darmowym kontem.",
    plan: "Plany od {{subPrice}} miesięcznie. Pakiety kredytów doładowują aktywny plan i nigdy nie wygasają.",
    local:
      "Lokalnie: za darmo za wiadomość, ale GPU do dużych modeli kosztuje więcej niż lata hostowanych rozmów. Do tego prąd.",
  },
  pairs: {
    title: "Model bazowy obok swojej nieocenzurowanej wersji",
    intro:
      "To samo laboratorium, ten sam rozmiar, bez odmów. Porównaj kontekst, cenę i filtr obok siebie.",
    link: "{{a}} vs {{b}}",
  },
  faq: {
    title: "FAQ",
    gpu: {
      q: "Czy mogę używać nieocenzurowanego LLM bez GPU?",
      a: "Tak, w wersji hostowanej. Model działa na serwerach dostawcy, potrzebujesz tylko przeglądarki. Na {{appName}} to {{count}} nieocenzurowanych modeli, także takich wielkości frontier, których żaden domowy komputer nie udźwignie.",
    },
    free: {
      q: "Czy jest darmowy nieocenzurowany LLM online?",
      a: "Na {{appName}} dostajesz {{guestCredits}} darmowych kredytów miesięcznie bez konta i {{freeCredits}} z darmowym kontem. Ile to wiadomości, zależy od modelu i długości rozmowy. Nieocenzurowane modele wymagają jednorazowego potwierdzenia 18+.",
    },
    vram: {
      q: "Ile VRAM potrzebuję, żeby uruchomić nieocenzurowany model lokalnie?",
      a: "Zasada dla wag: około 0,5 GB na miliard parametrów przy 4 bitach, 1 GB przy 8 bitach. Model 24B potrzebuje przy 4 bitach około 12 GB, model 70B około 35 do 40 GB. Kontekst i środowisko dochodzą do tego.",
    },
    private: {
      q: "Czy nieocenzurowany LLM online jest prywatny?",
      a: "Mniej niż lokalny. Dostawca, który uruchamia model, widzi twój prompt. Na {{appName}} czaty incognito zostają w pamięci twojej przeglądarki, nie na naszych serwerach. Prompty, które nigdy nie mogą opuścić komputera, uruchamiaj lokalnie.",
    },
    offline: {
      q: "Czy mogę używać nieocenzurowanego modelu offline?",
      a: "Hostowanego nie. Offline znaczy lokalnie: pobierz model, który zmieści się w pamięci, i uruchom go narzędziem jak Ollama albo LM Studio.",
    },
    truly: {
      q: "Czy abliterowane modele są naprawdę nieocenzurowane?",
      a: "Przestają odmawiać, ale zachowują trening i światopogląd modelu bazowego. {{ownModel}} jest inny: trenowany na książkach i dokumentach zakazanych w mainstreamowym internecie. Efekt to model z przeciwnymi poglądami politycznymi.",
    },
    chatLink: "Nieocenzurowany czat AI w przeglądarce",
    platformsLink:
      "Porównanie platform AI bez cenzury, z narzędziami lokalnymi",
  },
  cta: {
    title: "Bez pobierania. Pytaj teraz.",
    subtitle:
      "{{guestCredits}} darmowych kredytów miesięcznie, bez konta. Wybierz nieocenzurowany model i zmieniaj, kiedy chcesz.",
    start: "Zacznij nieocenzurowany czat",
    models: "Porównaj wszystkie modele",
  },
};
