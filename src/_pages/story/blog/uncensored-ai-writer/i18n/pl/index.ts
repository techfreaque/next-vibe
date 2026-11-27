import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "AI bez cenzury do pisania: fikcja bez filtrów | {{appName}}",
    description:
      "AI bez cenzury do powieści, mrocznej fikcji i scen dla dorosłych. Które modele piszą bez łagodzenia, ile stron rękopisu pamiętają i ile kosztuje scena.",
    category: "Poradnik pisarski",
    imageAlt: "Nieocenzurowana AI pisze mroczną scenę",
    keywords:
      "AI bez cenzury do pisania, AI do pisania opowiadań bez cenzury, nieocenzurowany generator opowiadań AI, pisanie z AI bez ograniczeń, AI do pisania książek, AI do opowiadań NSFW, AI do mrocznej fikcji, AI do pisania powieści bez cenzury, nieocenzurowana AI do pisania kreatywnego, AI do opowiadań dla dorosłych, {{appName}}",
  },
  hero: {
    backToBlog: "Wróć do bloga",
    category: "Poradnik pisarski",
    readTime: "8 min czytania",
    title: "AI do pisania bez cenzury. Twoja historia, bez wygładzania.",
    subtitle:
      "{{count}} nieocenzurowanych modeli, które piszą złoczyńców, przemoc i sceny dla dorosłych wprost, oraz ile stron twojego rękopisu każdy z nich pamięta. Prosto z naszego rejestru modeli.",
  },
  intro: {
    lead: "Prosisz o monolog złoczyńcy. Dostajesz przemowę o życzliwości. Piszesz scenę bitwy. AI ucina, zanim padnie pierwszy strzał. Mainstreamowi asystenci mieli być bezpieczni dla każdego. Fikcja nie jest bezpieczna dla każdego.",
    p2: "Ten poradnik jest dla pisarzy, którzy potrzebują mrocznego rozdziału napisanego, nie ocenionego. Które modele na {{appName}} piszą go wprost, który ogarnie cały rękopis, który ma głos, jakiego nie ma mainstream, i jak pracować z nimi scena po scenie.",
  },
  softening: {
    title: "Jak mainstreamowa AI łagodzi twoją fikcję",
    intro:
      "Nikt nie zakazuje twojej powieści. Ona po prostu po cichu robi się gorsza. Cztery schematy, na które trafia każdy autor:",
    refuse:
      "Odmowa: scena jest zbyt brutalna, zbyt seksualna, zbyt okrutna. Model w ogóle jej nie napisze.",
    aside:
      "Morał na doczepkę: scena powstaje, a potem akapit przypomina ci, że przemoc jest zła.",
    fade: "Cięcie do czerni: historia urywa się dokładnie tam, gdzie scena miała się zacząć.",
    flatten:
      "Spłaszczony złoczyńca: każdy antagonista robi się rozsądny, każde okrucieństwo dostaje przeprosiny. Konflikt umiera.",
    callout:
      "Fikcja potrzebuje mroku, żeby cokolwiek znaczyć. Model, który nie napisze najgorszego momentu, nie napisze też odkupienia.",
  },
  models: {
    title: "{{count}} nieocenzurowanych modeli do fikcji",
    intro:
      "Każdy aktualny nieocenzurowany model na {{appName}} oznaczony do pisania kreatywnego albo mrocznego roleplayu, od najtańszego. Strony pokazują, ile tekstu mieści się naraz w pamięci modelu: twoje notatki, dotychczasowe rozdziały i nowa scena.",
    footnote:
      "Strony to okno kontekstu przeliczone na drukowane strony prozy. Za wiadomość oznacza jedną referencyjną wymianę najtańszą trasą. Długie sceny i długie czaty kosztują więcej.",
  },
  table: {
    model: "Model",
    context: "Kontekst",
    pages: "Pamięta",
    pagesValue: "około {{pages}} stron",
    strengths: "Mocna strona",
    price: "Za wiadomość",
    chat: "Wypróbuj",
    chatLink: "Pisz z {{model}}",
  },
  picks: {
    title: "Wybierz według zadania, które masz przed sobą",
    intro:
      "Żaden model nie jest najlepszy w każdej części książki. Oto nasze typy na każde zadanie. Każda liczba poniżej pochodzi z rejestru.",
    dark: {
      title: "Mroczne i tabu sceny: {{model}}",
      body: "Oznaczony do mrocznego roleplayu i pisania kreatywnego. Zostaje w scenie, gdy robi się brutalnie, okrutnie albo dosadnie, bez morału na końcu. Pamięta około {{pages}} stron. {{price}} za wiadomość.",
    },
    long: {
      title: "Długie rękopisy: {{model}}",
      body: "Największa pamięć wśród modeli do fikcji i do tego najtańsza z nich: {{context}} tokenów, około {{pages}} stron. Wklej konspekt, biblię postaci i ostatnie rozdziały, a utrzyma wszystkie wątki. {{price}} za wiadomość.",
    },
    voice: {
      title: "Głos, którego nie ma mainstream: {{model}}",
      body: "Trenowany na książkach i dokumentach zakazanych w mainstreamowym internecie. Efekt to model z przeciwnymi poglądami politycznymi. Dla postaci, których światopogląd nie ma brzmieć jak korporacyjny komunikat prasowy. Jego limit: około {{pages}} stron pamięci, więc dawaj mu jedną scenę naraz. {{price}} za wiadomość.",
    },
    polish: {
      title: "Struktura i redakcja: {{model}}",
      body: "Flagowy model bazowy z usuniętymi odmowami. Mocny w rozumowaniu, więc użyj go do dziur fabularnych, tempa i redakcji mrocznych rozdziałów, których inni asystenci nie tkną. Pamięta około {{pages}} stron. {{price}} za wiadomość.",
    },
    draft: {
      title: "Tanie pierwsze wersje: {{model}}",
      body: "Najniższa cena wśród pozostałych modeli do fikcji. Rzucaj pomysłami, wygeneruj dziesięć początków, zostaw jeden. Pamięta około {{pages}} stron. {{price}} za wiadomość.",
    },
  },
  workflow: {
    title: "Sposób pracy, dzięki któremu książka powstaje",
    intro:
      "Traktuj AI jak współautora, którym kierujesz, a nie jak automat z przekąskami.",
    outline: {
      title: "Zacznij od biblii",
      body: "Wklej konspekt, postacie i notatki o tonie w pierwszej wiadomości. Jeszcze o nic nie proś. Niech potwierdzi, co zrozumiał.",
    },
    scene: {
      title: "Jedna scena na prośbę",
      body: "Podaj punkt widzenia, zwrot akcji i długość. Scena po scenie głos zostaje zwarty, a koszt niski.",
    },
    switch: {
      title: "Zmień model w środku rozdziału",
      body: "Brutalną scenę napisz jednym modelem, popraw innym. Czat zachowuje historię po zmianie, nic nie ginie.",
    },
    revise: {
      title: "Przepisz swoim głosem",
      body: "Proś o warianty, nie gotowe strony. Wybieraj zdania, przepisuj je, wklejaj z powrotem. Książka zostaje twoja.",
    },
  },
  skills: {
    title: "Skille stworzone do fikcji",
    intro:
      "Skill ustawia personę pisarską i model jednym kliknięciem. Użyj go, jak jest, albo skopiuj i dostosuj.",
    writer:
      "Uncensored Writer: mroczna fikcja i sceny dla dorosłych, bez łagodzenia",
    storyteller: "Storyteller: długie historie ze strukturą i tempem",
    roleplay: "Wolisz grać historię niż ją pisać? Roleplay z AI bez filtrów",
  },
  limits: {
    title: "Co znaczy tu bez cenzury, a czego nie znaczy",
    intro: "Bez cenzury dotyczy twojej fikcji. To nie jest wolna amerykanka.",
    adult:
      "Nieocenzurowane modele raz proszą o potwierdzenie 18+. Potem dorosłe tematy między dorosłymi w fikcji to twoja decyzja.",
    terms:
      "Regulamin nadal zakazuje nielegalnych treści, nękania i wszystkiego, co ma skrzywdzić prawdziwych ludzi. Ta granica się nie przesuwa.",
    rights:
      "Masz wszystkie prawa do swojego tekstu. Tak mówi nasz regulamin i nie rościmy sobie żadnej własności do tego, co piszesz.",
    incognito:
      "Czaty incognito są zapisane w twojej przeglądarce, nie na naszych serwerach. Dostawca, który uruchamia model, i tak widzi każdy prompt, żeby na niego odpowiedzieć.",
    kindsLink:
      "Abliterowany, dostrojony czy z własnym światopoglądem: czym różnią się modele",
  },
  pairs: {
    title: "Porównaj modele do fikcji obok siebie",
    intro:
      "Kontekst, cena i filtr obok siebie, zanim wydasz choćby jeden kredyt.",
    link: "{{a}} vs {{b}}",
  },
  faq: {
    title: "FAQ",
    best: {
      q: "Jaka AI bez cenzury jest najlepsza do pisania fikcji?",
      a: "To zależy od zadania. Model dostrojony do mrocznego roleplayu napisze najtrudniejsze sceny, model z 1M tokenów zmieści cały rękopis, a {{ownModel}} wnosi światopogląd, którego nie mają modele z głównego nurtu. Na {{appName}} przełączasz się między wszystkimi {{count}} modelami do fikcji w tym samym czacie.",
    },
    free: {
      q: "Czy jest darmowa AI bez cenzury do pisania opowiadań?",
      a: "Dostajesz {{guestCredits}} darmowych kredytów miesięcznie bez konta i {{freeCredits}} z darmowym kontem, {{maxCredits}} z newsletterem. To starczy na sporo scen na tańszych modelach. Przy dłuższych projektach plany zaczynają się od {{subPrice}} miesięcznie.",
    },
    adult: {
      q: "Czy AI bez cenzury może pisać fikcję dla dorosłych i NSFW?",
      a: "Tak, po jednorazowym potwierdzeniu 18+. Nieocenzurowane modele piszą sceny dla dorosłych między dorosłymi bez cięcia do czerni. Nielegalne treści pozostają zakazane przez nasz regulamin, bez względu na to, co zrobiłby model.",
    },
    novel: {
      q: "Czy AI ogarnie całą powieść?",
      a: "Największe modele tutaj pamiętają naraz około {{maxPages}} stron, dość na konspekt, biblię postaci i wiele rozdziałów. Mniejsze modele w długich projektach zapominają wczesne sceny, więc streszczaj na bieżąco.",
    },
    rights: {
      q: "Do kogo należy tekst, który AI dla mnie pisze?",
      a: "Na {{appName}} do ciebie. Nasz regulamin mówi, że masz wszystkie prawa do swoich rozmów, a my nie rościmy sobie własności do twoich treści. Sprawdź zasady prawa autorskiego dla utworów tworzonych z pomocą AI tam, gdzie publikujesz.",
    },
    kinds: {
      q: "Model abliterowany czy UncensoredLM do fikcji?",
      a: "Modele abliterowane to modele z głównego nurtu z wyciętymi odmowami: te same umiejętności, ten sam światopogląd, po prostu piszą scenę. {{ownModel}} jest trenowany na książkach i dokumentach zakazanych w mainstreamowym internecie. Efekt to model z przeciwnymi poglądami politycznymi. Jego pamięć jest mniejsza: około {{ownPages}} stron.",
    },
    bestLink: "Najlepszy nieocenzurowany LLM, wybrany według zadania",
    jailbreakLink: "Dlaczego jailbreak ChatGPT do fikcji ciągle zawodzi",
    chatLink: "Nieocenzurowany czat AI w przeglądarce",
  },
  cta: {
    title: "Napisz rozdział, który odkładasz od miesięcy.",
    subtitle:
      "{{guestCredits}} darmowych kredytów miesięcznie, bez konta. Wybierz model do fikcji i zmieniaj, kiedy chcesz.",
    start: "Zacznij pisać",
    models: "Porównaj wszystkie modele",
  },
};
