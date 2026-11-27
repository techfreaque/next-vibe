import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Alternatywy dla SillyTavern: roleplay bez konfiguracji (2026)",
    description:
      "SillyTavern jest darmowy, ale wymaga Node.js i backendu, a na iPhone'a go nie zainstalujesz. Porównaj {{appName}}, RisuAI, Agnaistic, KoboldCpp, Janitor AI.",
    category: "Porównanie",
    imageAlt: "Alternatywy dla SillyTavern, hostowane i lokalne, w porównaniu",
    keywords:
      "alternatywy dla SillyTavern, alternatywa dla SillyTavern, aplikacje jak SillyTavern, SillyTavern na iPhone, SillyTavern online, SillyTavern bez instalacji, RisuAI vs SillyTavern, KoboldCpp, Agnaistic, frontend do roleplayu AI, SillyTavern alternatives, {{appName}}",
  },
  hero: {
    backToBlog: "Wróć do bloga",
    category: "Porównanie",
    readTime: "9 min czytania",
    title: "Alternatywy dla SillyTavern bez konfiguracji",
    subtitle:
      "{{count}} alternatyw i {{appName}}, od innych frontendów open source po hostowany czat. Sprawdzone {{date}} na ich własnych stronach.",
  },
  intro: {
    lead: "SillyTavern to elektronarzędzie roleplayu z AI. Darmowy, open source, konfigurowalny bez końca. Wymaga też Node.js, backendu z modelem, pliku konfiguracyjnego, a na telefonie Termuxa.",
    p2: "Jedni to uwielbiają. Inni chcą po prostu pisać. Oto alternatywy, od klonów open source z tymi samymi kartami po hostowane aplikacje, których nie trzeba instalować. Sprawdzone {{date}}.",
  },
  subject: {
    title: "SillyTavern dziś",
    intro:
      "Wersja 1.19.1 wyszła 19 listopada 2026. Co mówi dokumentacja samego projektu.",
    plans:
      "Cena: darmowy i open source (AGPL-3.0). Twórcy nie prowadzą żadnej usługi hostowanej, więc płacisz za API modelu, które podłączysz, albo nic z modelem lokalnym.",
    filter:
      "Filtr: brak własnego. Na co wolno, decyduje podłączony model lub dostawca.",
    privacy:
      "Prywatność: czaty leżą w folderze danych twojej instalacji. Wszystko, co wysyłasz do API w chmurze, podlega polityce tego dostawcy.",
    extra:
      "Instalacja: Node.js 20 lub nowszy, Git, potem backend. Na Androidzie działa przez Termux, na iPhone'a nie zainstalujesz go wcale. Zdalny dostęp wymaga białej listy albo hasła, a dokumentacja ostrzega przed wystawianiem go do internetu.",
  },
  why: {
    title: "Dlaczego ludzie szukają gdzie indziej",
    intro: "Te same cztery skargi, słowami samego projektu.",
    setup:
      "Konfiguracja backendu. Lokalne backendy bywają skomplikowane, a zespół ich nie wspiera.",
    mobile:
      "Telefon. Android wymaga Termuxa i potrafi ubić serwer w tle. Na iPhone'a nie ma jak go zainstalować.",
    security:
      "Bezpieczeństwo to twoja robota. Wersja 1.19.1 naprawiła skrypty uruchamiane z kart postaci i importowanych czatów.",
    cost: "Podwójne płacenie. Zarządzany hosting kasuje za sam hosting, a API modelu dochodzi do tego osobno.",
  },
  criteria: {
    title: "Co sprawdzić przed zmianą",
    intro: "Pięć pytań porządkuje opcje.",
    one: "Instalacja: przeglądarka, aplikacja desktopowa albo serwer, który sam uruchamiasz i łatasz.",
    two: "Karty: czy importuje karty PNG lub JSON i lorebooki z SillyTavern i Chub?",
    three: "Modele: własny klucz API, model lokalny czy modele w zestawie.",
    four: "Funkcje: czaty grupowe, lorebooki, generowanie obrazów i głos.",
    five: "Koszt: darmowe oprogramowanie plus opłaty za API, stały plan albo płatność za wiadomość.",
  },
  table: {
    title: "Wszystkie obok siebie",
  },
  us: {
    title: "{{appName}}: bez instalacji, modele w zestawie",
    intro:
      "Otwórz przeglądarkę na dowolnym urządzeniu, także na iPhonie. {{modelCount}} modeli jest już podłączonych, więc nie wklejasz żadnego klucza API.",
    models:
      "Modele: {{uncensored}} nieocenzurowanych obok {{mainstream}} z głównego nurtu i {{open}} otwartych. {{ownModel}} jest trenowany na książkach i dokumentach zakazanych w mainstreamowym internecie. Efekt to model z przeciwnymi poglądami politycznymi.",
    fit: "Postacie: skill do roleplayu albo własna postać jako skill. Pamięć trzyma fakty między czatami, a {{imageModels}} modeli obrazowych zilustruje scenę w tym samym wątku.",
    privacy:
      "Prywatność: czaty incognito zostają w pamięci lokalnej twojej przeglądarki, bez konta.",
    price:
      "Cena: {{guestCredits}} darmowych kredytów miesięcznie bez konta, {{freeCredits}} z kontem, {{maxCredits}} z newsletterem. Plany: {{planList}}. Jedno saldo na każdy model.",
    api: "API: endpointy zgodne z OpenAI i Anthropic, więc nadal możesz podpiąć SillyTavern do naszych modeli. Odblokowuje je każdy zakup.",
    weak: "Gdzie SillyTavern wygrywa: pełna kontrola nad promptami, presetami i rozszerzeniami, czaty grupowe, lorebooki i import kart. Nasz kod też jest otwarty, ale to platforma, nie zestaw narzędzi do roleplayu.",
    ownLink: "Zobacz {{ownModel}}",
    skillLink: "Uruchom skill do roleplayu",
  },
  list: {
    title: "Opisane alternatywy, jedna po drugiej",
    intro:
      "Platformy z pełnym profilem w naszych danych porównawczych, sprawdzone na ich własnych stronach. Frontendy open source są w tabeli powyżej.",
    heading: "{{number}}. {{name}}: {{kind}}",
    models: "Modele:",
    filter: "Filtr:",
    price: "Cena:",
    priceValue: "Darmowy plan: {{free}}. Płatne: {{plans}}.",
    pro: "Największy plus:",
    con: "Haczyk:",
    forWho: "Wybierz, jeśli:",
    versusLink: "{{appName}} vs {{name}}: pełne porównanie",
    visit: "Odwiedź {{name}}",
  },
  stay: {
    title: "Kiedy SillyTavern to nadal dobry wybór",
    intro: "Dla wielu zaawansowanych użytkowników tak jest.",
    one: "Uruchamiasz modele lokalnie i chcesz, żeby nic nie opuszczało twojego komputera.",
    two: "Żyjesz w rozszerzeniach, presetach, regułach regex i czatach grupowych.",
    three:
      "Masz już klucze API i chcesz jednego frontendu do wszystkich. Nasz może być jednym z tych kluczy.",
  },
  faq: {
    title: "FAQ",
    best: {
      q: "Jaka jest najlepsza alternatywa dla SillyTavern?",
      a: "Najbliższy klon: RisuAI, open source z lorebookami, czatami grupowymi i wersją webową. Lokalnie i prosto: KoboldCpp albo LM Studio. Hostowana biblioteka postaci: Janitor AI albo Chub. Bez instalacji, z modelami w zestawie: {{appName}}.",
    },
    free: {
      q: "Czy jest darmowa alternatywa dla SillyTavern?",
      a: "RisuAI, Agnaistic, KoboldCpp i Talemate to darmowe oprogramowanie. Za model nadal płacisz, chyba że uruchamiasz go na własnym sprzęcie. {{appName}} daje {{guestCredits}} darmowych kredytów miesięcznie bez konta i {{freeCredits}} z kontem, {{maxCredits}} z newsletterem, modele w zestawie.",
    },
    filter: {
      q: "Które alternatywy pozwalają na roleplay bez cenzury?",
      a: "Frontendy dziedziczą zasady modelu, więc wybierz model nieocenzurowany. Lokalnie KoboldCpp albo LM Studio uruchomią modele abliterowane. Z hostowanych {{appName}} daje {{uncensored}} nieocenzurowanych modeli po jednorazowym potwierdzeniu 18+. Janitor AI i Chub pozwalają na roleplay dla dorosłych na własnych zasadach.",
    },
    privacy: {
      q: "Czy hostowana alternatywa jest tak prywatna jak SillyTavern?",
      a: "Nie do końca. Model lokalny trzyma wszystko na twoim komputerze. Model hostowany zawsze widzi prompt, na który odpowiada. Incognito w {{appName}} trzyma historię w twojej przeglądarce zamiast na serwerze.",
    },
    move: {
      q: "Czy mogę używać SillyTavern na iPhonie?",
      a: "Nie bezpośrednio. Hostujesz go na komputerze lub serwerze i otwierasz w Safari, co oznacza konfigurację zdalnego dostępu. Aplikacja webowa, taka jak {{appName}} albo Janitor AI, działa na iPhonie bez tego kroku.",
    },
  },
  cta: {
    title: "Pomiń konfigurację. Zostań przy historii.",
    subtitle:
      "{{guestCredits}} darmowych kredytów miesięcznie, bez konta i bez klucza API.",
    start: "Zacznij roleplay",
    chat: "Otwórz czat incognito",
  },
};
