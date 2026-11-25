import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "AI bez cenzury za darmo: co naprawdę dostajesz (2026)",
    description:
      "AI bez cenzury za darmo, sprawdzone: Venice, uncensored.ai, FreedomGPT, Gab AI, NanoGPT, OpenRouter, LM Studio, Ollama i {{appName}}. Limity, filtry, haczyki.",
    category: "Poradnik",
    imageAlt: "Darmowe AI bez cenzury w porównaniu",
    keywords:
      "AI bez cenzury za darmo, darmowe AI bez cenzury, czat AI bez cenzury za darmo, nieocenzurowana AI za darmo, AI bez ograniczeń za darmo, AI bez filtrów za darmo, AI bez cenzury bez rejestracji, AI bez cenzury po polsku, {{appName}}",
  },
  hero: {
    backToBlog: "Wróć do bloga",
    category: "Poradnik",
    readTime: "8 min czytania",
    title: "AI bez cenzury za darmo. Co naprawdę znaczy darmowe.",
    subtitle:
      "{{count}} darmowych opcji i {{appName}}, sprawdzonych na ich własnych stronach z cenami, filtrami i prywatnością. Ze wszystkimi limitami, o których strona główna milczy.",
  },
  intro: {
    lead: "Za darmo i bez cenzury: obiecuje to wielu. Potem przychodzi dzienny limit po trzech odpowiedziach, model podstawowy zamiast dobrego, potwierdzenie maila przed jakimkolwiek kredytem albo pobieranie 40 GB.",
    p2: "Oto co każda opcja naprawdę daje za darmo, według jej własnych stron (ostatnio sprawdzone {{date}}). Mówimy wprost: kupujemy modele od części tych dostawców i udostępniamy je w naszym czacie. Jeśli dają za darmo więcej, piszemy to.",
  },
  short: {
    title: "Krótka odpowiedź",
    intro: "Trzy zdania, zanim przeczytasz resztę.",
    local:
      "Naprawdę darmowe i bez limitu jest tylko lokalne AI: Ollama albo LM Studio na twoim komputerze. Płacisz sprzętem, a nie pieniędzmi.",
    hosted:
      "AI bez cenzury w chmurze jest za darmo zawsze z limitem: odpowiedzi dziennie, kredyty miesięcznie albo jeden podstawowy model.",
    us: "Na {{appName}} dostajesz {{guestCredits}} darmowych kredytów miesięcznie bez konta, na wszystkie {{modelCount}} modele, w tym {{uncensored}} bez cenzury.",
  },
  catch: {
    title: "Gdzie jest haczyk w darmowym AI",
    intro: "Pięć miejsc, w których darmowe jednak kosztuje.",
    limit:
      "Limit: dzienna pula często kończy się po kilku wiadomościach. W długiej rozmowie liczy się każda odpowiedź.",
    models:
      "Modele: wiele darmowych planów daje tylko model podstawowy albo własny. Mocne modele są za abonamentem.",
    account:
      "Konto: niektóre serwisy chcą potwierdzonego maila, zanim dadzą darmowe kredyty. Inne startują od razu.",
    data: "Dane: darmowe nie znaczy prywatne. Sprawdź, co jest zapisywane i czy twoje rozmowy trenują model.",
    hardware:
      "Sprzęt: lokalnie wiadomość nic nie kosztuje, ale dobry model potrzebuje dużo pamięci i mocnej karty graficznej.",
    callout:
      "Każdy model w chmurze widzi twój prompt, za darmo czy płatnie. Tylko lokalna aplikacja trzyma go na twoim urządzeniu.",
  },
  table: {
    title: "Wszystkie darmowe opcje obok siebie",
    intro:
      "Na telefonie przewiń w bok. Fakty o dostawcach sprawdzone na ich własnych stronach, data jest przy każdym wpisie. Dane o {{appName}} pochodzą na żywo z naszej konfiguracji.",
  },
  us: {
    title: "Co dostajesz za darmo na {{appName}}",
    intro:
      "Jeden czat, {{modelCount}} modeli, jedno saldo. Za darmo znaczy tu stała pula na każdy model, nie tylko na najsłabszy.",
    guest:
      "Bez konta: {{guestCredits}} darmowych kredytów miesięcznie. Otwierasz czat i piszesz. Bez maila, bez numeru telefonu.",
    account:
      "Z darmowym kontem: {{freeCredits}} kredytów miesięcznie, z newsletterem {{maxCredits}}. Rozmowy zapisują się na wszystkich twoich urządzeniach.",
    models:
      "Wszystkie modele w cenie: {{uncensored}} bez cenzury obok Claude, GPT, Gemini i modeli otwartych. {{ownModel}} jest trenowany na książkach i dokumentach zakazanych w mainstreamowym internecie. Efekt to model z przeciwnymi poglądami politycznymi.",
    consent:
      "Przy modelach bez cenzury raz potwierdzasz, że masz co najmniej 18 lat. Nikt więcej nie pyta.",
    after:
      "Kiedy kredyty się skończą: poczekaj do następnego miesiąca albo wybierz plan od {{subPrice}} miesięcznie.",
    weak: "Gdzie za darmo wypadamy słabiej: kredyty zamiast abonamentu bez limitu. Ile wiadomości daje twoja pula, zależy od modelu. Każda strona modelu liczy to za ciebie.",
    hubLink: "Wszystkie modele bez cenzury z kontekstem i ceną",
    ownLink: "Zobacz {{ownModel}}",
  },
  list: {
    title: "{{count}} darmowych opcji po kolei",
    intro:
      "Czym jest każda, co daje za darmo, na co pozwala jej filtr i co dzieje się z twoimi rozmowami.",
    heading: "{{number}}. {{name}}: {{kind}}",
    free: "Za darmo:",
    filter: "Filtr:",
    privacy: "Prywatność:",
    con: "Haczyk:",
    forWho: "Wybierz, jeśli:",
    checked: "Sprawdzone {{date}}.",
    versusLink: "{{appName}} vs {{name}}: pełne porównanie",
    visit: "Odwiedź {{name}}",
  },
  local: {
    title: "Lokalnie: jedyne AI bez limitu",
    intro: "Ollama i LM Studio działają na twoim własnym komputerze.",
    cost: "Koszt: zero za wiadomość, bez dziennego limitu. Płacisz raz za sprzęt, potem za prąd.",
    quality:
      "Jakość: granicę wyznacza twój komputer. Małe modele ruszą na prawie każdym laptopie, duże potrzebują dużo pamięci graficznej.",
    privacy:
      "Prywatność: prompty nigdy nie opuszczają twojego urządzenia. Lepiej się nie da.",
    link: "Nie masz mocnego komputera? Modele bez cenzury online, bez GPU",
  },
  faq: {
    title: "FAQ",
    best: {
      q: "Jakie AI bez cenzury za darmo jest najlepsze?",
      a: "Zależy od twojego sprzętu. Z mocnym komputerem: Ollama albo LM Studio, za darmo i bez limitu. W przeglądarce: {{appName}} daje {{guestCredits}} kredytów miesięcznie na wszystkie modele, Venice 10 promptów tekstowych dziennie na modelach podstawowych, uncensored.ai 3 odpowiedzi dziennie.",
    },
    noAccount: {
      q: "Czy jest AI bez cenzury za darmo i bez rejestracji?",
      a: "Tak. Na {{appName}} otwierasz czat incognito i piszesz, bez konta i bez maila. FreedomGPT też podaje, że startujesz bez karty i bez konta. Gab AI daje darmowe kredyty dopiero po potwierdzeniu maila.",
    },
    unlimited: {
      q: "Czy jest AI bez cenzury za darmo i bez limitu?",
      a: "Tylko lokalnie. Ollama i LM Studio na twoim sprzęcie nic nie kosztują za wiadomość. Każdy darmowy plan w chmurze ma limit, bo ktoś płaci za karty graficzne, na których działa model.",
    },
    language: {
      q: "Czy AI bez cenzury odpowiada po polsku?",
      a: "Duże modele odpowiadają w języku, w którym piszesz. Piszesz po polsku, dostajesz odpowiedź po polsku. Przy małych modelach lokalnych warto zrobić krótki test, bo niektóre przy długich odpowiedziach przechodzą na angielski.",
    },
    api: {
      q: "Czy jest darmowe API bez cenzury?",
      a: "Lokalnie tak: Ollama i LM Studio mają serwer zgodny z OpenAI na twoim komputerze. OpenRouter daje 50 darmowych zapytań dziennie na darmowych modelach, ale modeli bez cenzury jest tam mało. Na {{appName}} API odblokowuje każdy zakup, plany od {{apiSubPrice}} miesięcznie. Darmowe kredyty działają tylko w czacie.",
    },
    legal: {
      q: "Czy AI bez cenzury jest legalne?",
      a: "Model, który rzadziej odmawia, nie zmienia prawa. Co jest zakazane poza siecią, jest zakazane także w czacie, a do tego obowiązuje nasz regulamin. To nie jest porada prawna. Jeśli przetwarzasz wrażliwe dane, przeczytaj politykę prywatności dostawcy albo pracuj lokalnie.",
    },
    noSignUpLink: "Czat AI za darmo bez rejestracji: jak to działa",
    kindsLink:
      "Abliterowane, dostrojone czy z własnym światopoglądem: trzy rodzaje",
  },
  cta: {
    title: "Wypróbuj za darmo. Bez konta.",
    subtitle:
      "{{guestCredits}} darmowych kredytów miesięcznie na każdy model. Otwórz czat incognito i zadaj pierwsze pytanie.",
    start: "Czatuj za darmo",
    models: "Zobacz modele bez cenzury",
  },
};
