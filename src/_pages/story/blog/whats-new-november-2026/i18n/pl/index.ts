import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Co nowego: pół roku na jednej stronie - {{appName}}",
    description:
      "Stop znaczy stop. Dyktowanie działa na iPhonie. Twoje AI pracuje na wszystkich Twoich komputerach. Self-hosting bez Dockera. A robot testowy zamknął osiem luk bezpieczeństwa. Wszystko od maja.",
    category: "Aktualizacja produktu",
    imageAlt: "{{appName}} - aktualizacja produktu, listopad 2026",
    keywords:
      "{{appName}}, aktualizacja, Hermes, Thea, PGlite, self-hosting, rozpoznawanie mowy, testy E2E, bezpieczeństwo",
  },
  hero: {
    backToBlog: "Powrót do bloga",
    category: "Aktualizacja produktu",
    readTime: "6 min czytania",
    title:
      "Pół roku na jednej stronie: szybciej, bezpieczniej, działa wszędzie.",
    subtitle:
      "Stop znaczy stop. Dyktowanie działa na iPhonie. Twoje AI idzie za Tobą między komputerami. Self-hosting bez Dockera. A robot testowy zamknął osiem luk bezpieczeństwa.",
  },
  intro: {
    lead: "Ostatnia aktualizacja była w maju. Od tamtej pory rozebraliśmy kod do fundamentów, zbudowaliśmy go płaściej i miesiącami poprawialiśmy to, na co trafiali prawdziwi ludzie na produkcji.",
    p1: "Bez listy na 200 punktów. Oto co naprawdę poczujesz - pogrupowane według miejsca, w którym to poczujesz.",
  },
  chat: {
    title: "Czat, który słucha",
    intro: "Drobiazgi, przez które czat wydawał się wolny albo uparty.",
    stop: {
      title: "Stop znaczy stop",
      body: "Klikasz stop i tokeny przestają się pojawiać w tej samej chwili - bez czekania, aż serwer posprząta. Stop działa teraz też w czatach incognito i bez logowania, gdzie wcześniej nie robił nic.",
    },
    input: {
      title: "Pole dopasowane do modelu",
      body: "Pole wiadomości wie, ile miejsca zostało wybranemu modelowi w tym wątku - zamiast jednego sztywnego limitu dla wszystkich.",
    },
    reasoning: {
      title: "Modele nie gubią wątku",
      body: "Bloki rozumowania wracają do modelu w kolejnej turze, zamiast znikać - modele myślące budują na tym, co już wypracowały.",
    },
    queue: {
      title: "Pisz, gdy ono pracuje",
      body: "Wysyłaj wiadomości, gdy AI jeszcze odpowiada - ustawiają się w kolejce. Długie serie narzędzi kompaktują kontekst w locie, zamiast uderzać w ścianę.",
    },
  },
  voice: {
    title: "Głos, który działa wszędzie",
    intro: "Zamiana mowy na tekst dostała uwagę, na którą zasługiwała.",
    ios: {
      title: "Naprawione na iPhonie i iPadzie",
      body: "Safari na iOS usypiało silnik audio, więc dyktowanie po cichu umierało. Teraz poprawnie się wznawia.",
    },
    long: {
      title: "Nagrywaj, ile chcesz",
      body: "Nagrania dzielimy na kawałki, więc dyktowania nie ogranicza już jeden upload.",
    },
    windows: {
      title: "Naprawione na Windowsie",
      body: "Seria poprawek sprawiła, że zamiana mowy na tekst działa na komputerach z Windowsem.",
    },
  },
  agents: {
    title: "Twoje AI na wszystkich Twoich komputerach",
    intro:
      "Thea działa w chmurze. Hermes działa na Twoim komputerze. Teraz naprawdę pracują razem.",
    twoWay: {
      title: "Zdalne wątki w obie strony",
      body: "Przekaż wątek z chmury na swój komputer albo z powrotem - w obie strony. Jeśli druga strona nie ma klucza API, Twoja przejmuje zadanie i uruchamia je lokalnie.",
      link: "Jak rozmawiają Hermes i Thea",
    },
    coding: {
      title: "Agent kodujący na Twoich oczach",
      body: "Thea może uruchomić na Twoim komputerze interaktywnego agenta kodującego - w prawdziwym oknie konsoli, które widzisz - śledzonego jako zadanie, z raportem wyniku.",
      link: "Poznaj agenta kodującego",
    },
    tools: {
      title: "Ostrzejsze narzędzia",
      body: "Lepsza automatyzacja przeglądarki z emulacją urządzeń, narzędzia desktopowe na Windowsie i narzędzia SSH dla każdego klienta - nie tylko adminów.",
    },
  },
  selfHost: {
    title: "Self-hosting stał się prosty",
    intro:
      "Własna instancja oznaczała kiedyś Dockera i toolchain C++. Już nie.",
    pglite: {
      title: "Bez Dockera",
      body: "Ustaw DATABASE_URL na plik, a serwer ruszy na wbudowanym Postgresie (PGlite). Migracje i seedy po prostu działają.",
    },
    windows: {
      title: "Windows pełnoprawnie",
      body: "Miesiące poprawek pod Windowsa: ścieżki, blokady plików, zakładanie użytkowników, funkcje bazy. Sklonuj, zainstaluj, uruchom.",
    },
    native: {
      title: "Bez kompilatora",
      body: "Hashowanie haseł działa teraz na gotowych binarkach - bez node-gyp, bez narzędzi do budowania. Ten sam algorytm, stare hashe dalej ważne.",
    },
    revive: {
      title: "Sam wstaje",
      body: "Serwer produkcyjny restartuje się po awarii, a restart bazy danych nie pociąga już aplikacji za sobą.",
    },
  },
  security: {
    title: "Bezpiecznie od startu",
    intro:
      "Praca nad bezpieczeństwem, której nigdy nie zobaczysz - i o to chodzi.",
    e2e: {
      title: "Robot testuje każdą stronę",
      body: "60 zestawów testów end-to-end obsługuje prawdziwe strony w prawdziwej przeglądarce. Znalazły osiem luk, które zamknęliśmy - od open redirect po prywatne pliki w publicznym cache.",
      link: "Zobacz, co znalazł",
    },
    patches: {
      title: "Załatany obraz bazowy",
      body: "Nasz kontener pobiera najnowsze łatki bezpieczeństwa Alpine, w tym poprawkę CVE-2026-111497.",
    },
    toolCalls: {
      title: "Mniej zepsutych wywołań narzędzi",
      body: "Gdy model wyśle błędny JSON wywołania narzędzia, naprawiamy go, zamiast wywracać całą turę.",
    },
  },
  cta: {
    title: "Sprawdź sam.",
    subtitle:
      "Wszystko powyżej działa już dziś na {{appName}} - i w kodzie open source, jeśli hostujesz u siebie.",
    chat: "Zacznij rozmowę",
    selfHost: "Postaw u siebie",
  },
};
