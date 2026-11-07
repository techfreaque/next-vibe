import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Hermes i Thea: zdalne wątki w obie strony - {{appName}}",
    description:
      "Twoje lokalne AI i Twoje AI w chmurze prowadzą teraz wątki za siebie nawzajem - w obie strony. Instancja przejmująca turę nie ma klucza API? Wywołujący odbiera pętlę i sam ją kończy.",
    category: "Hermes i Thea",
    imageAlt: "Hermes i Thea - dwie połączone instancje next-vibe",
    keywords:
      "Hermes, Thea, next-vibe, zdalne wątki, self-hosted AI, reverse websocket, fallback klucza API, {{appName}}",
  },
  hero: {
    backToBlog: "Wróć do bloga",
    category: "Hermes i Thea",
    readTime: "6 min czytania",
    title: "Dwa AI. Jedna rozmowa. W obie strony.",
    subtitle:
      "Hermes działa na Twoim komputerze. Thea działa na serwerze. Teraz każde z nich może przekazać wątek drugiemu - a brak klucza API już nie zatrzymuje tury.",
  },
  intro: {
    p1: "next-vibe działa wszędzie: na laptopie, na VPS-ie, na obu naraz. Połącz dwie instancje, a staną się jednym systemem. Nasze nazywają się Hermes i Thea.",
    p2: "To wydanie domyka obieg: zdalne wątki działają teraz w obie strony, a instancja bez klucza dostawcy niczego już nie blokuje.",
  },
  who: {
    title: "Poznaj duet",
    intro: "Ten sam kod. Różne zadania.",
    hermes: {
      label: "Lokalnie",
      title: "Hermes",
      body: "Działa na Twoim komputerze. Tuż obok Twoich plików, terminala i agentów kodujących. Twoje codzienne narzędzie.",
    },
    thea: {
      label: "Chmura",
      title: "Thea",
      body: "Działa na serwerze. Zawsze online, dostępna z każdego miejsca. Pilnuje platformy i rozdziela pracę.",
    },
    note: "Każda instancja zarządza własnymi danymi i zadaniami. Połączenie przekazuje zdarzenia między nimi - nic więcej, nic mniej.",
  },
  twoWay: {
    title: "Wątki płyną teraz w obie strony",
    intro:
      "Zdalne foldery i prywatne wątki wykonują się na drugiej instancji - od Thei do Hermesa i od Hermesa do Thei.",
    p1: "Wrzuć wątek do zdalnego folderu, a instancja po drugiej stronie przeprowadzi całą turę AI: model, prompt systemowy, narzędzia. Ty piszesz dalej tam, gdzie jesteś. Rozmowa wraca do Ciebie jako lustro.",
    stepsTitle: "Jedna tura od początku do końca",
    step1Title: "Piszesz",
    step1Body: "Wiadomość w zdalnym wątku na Hermesie.",
    step2Title: "Połączenie ją przekazuje",
    step2Body:
      "Przez jeden stały WebSocket albo bezpośrednie wywołanie HTTP, gdy druga strona jest publicznie dostępna.",
    step3Title: "Thea prowadzi pętlę",
    step3Body: "Swoim modelem, swoim promptem, swoimi narzędziami.",
    step4Title: "Narzędzia działają tam, gdzie mieszkają",
    step4Body:
      "Narzędzie, które istnieje tylko na Hermesie, jest wywoływane na Hermesie. Wynik wraca do pętli Thei.",
    step5Title: "Tura ląduje po obu stronach",
    step5Body: "Gotowa rozmowa synchronizuje się z powrotem do Twojego lustra.",
  },
  keyless: {
    title: "Brak klucza API? Tura i tak się kończy.",
    intro:
      "Instancja, która prowadzi turę, potrzebuje klucza API dostawcy modelu. Nie każda instancja go ma.",
    p1: "Zanim instancja przejmie turę, sprawdza klucz dostawcy na własnym węźle. Brakuje go? Od razu zwraca błąd z wyraźnym znacznikiem - bez wieszania się i bez połowicznie zapisanego wątku.",
    p2: "Strona wywołująca rozpoznaje znacznik, cofa swoje zapisy przekazania i sama prowadzi pętlę. Prompt i narzędzia drugiej strony nadal obowiązują; wywołania narzędzi wędrują tam i z powrotem przez połączenie.",
    calloutTitle: "Tryb inference-provider w ogóle nie potrzebuje klucza.",
    calloutBody:
      "Użyj połączonej instancji jako dostawcy modelu, a Twoja strona nigdy nie dotknie klucza dostawcy. Połączenie jest rurą do modelu.",
    scenarioTitle: "Kto prowadzi pętlę?",
    scenario1Label: "Druga strona ma klucz",
    scenario1Body:
      "Druga strona prowadzi turę. Narzędzia wędrują tam i z powrotem.",
    scenario2Label: "Druga strona nie ma klucza",
    scenario2Body:
      "Druga strona od razu odmawia. Wywołujący prowadzi turę z jej promptem i narzędziami.",
    scenario3Label: "Tryb inference-provider",
    scenario3Body:
      "Instancja dostawcy uruchamia model. Wywołujący nie potrzebuje klucza.",
  },
  underTheHood: {
    title: "Pod maską",
    intro: "Dla tych, którzy czytają diffy.",
    transport:
      "Sposób transportu jest negocjowany przy łączeniu, nigdy nie ustawiasz go ręcznie. Cel pinguje inicjatora uwierzytelnionym health-checkiem (maksymalnie 5 sekund). Osiągalny: bezpośrednie HTTP. Za NAT-em: ukryta strona otwiera jeden wychodzący WebSocket i cały ruch idzie nim.",
    reconnect:
      "Konektor łączy się ponownie z wykładniczym odstępem od 1 do 30 sekund i przy każdej próbie na nowo czyta dane połączenia. To wydanie wzmacnia właśnie tę ścieżkę.",
    fixesTitle: "Też w tym wydaniu",
    fix1: "Ostrzeżenie o nieaktualnym leadzie: ramka zaadresowana do leada, którego ta instancja już nie zna, jest odrzucana z ostrzeżeniem, a nie po cichu - ponowne uwierzytelnienie połączenia rozwiązuje problem.",
    fix2: "Znaczniki czasu w bazie w UTC, zarówno w puli Postgresa, jak i w PGlite - wiersze z domyślnym czasem sortują się poprawnie między instancjami.",
    fix3: "Zapis strumienia od razu ustawia ID wątku, więc druga strona nie odrzuca już zdarzeń z pustym ID.",
    fix4: "Tury wznowienia synchronizują się z drugą stroną, więc wyniki narzędzi uzupełniane na miejscu trafiają też do lustra.",
    codeCaption: "Znacznik, który odsyła odbiorca bez klucza:",
  },
  tryIt: {
    title: "Wypróbuj",
    p1: "Postaw własną instancję, a potem dodaj połączenie w Admin → Remote Connections. Tworzyć połączenia mogą tylko admini; druga strona dostaje swój wpis automatycznie.",
  },
  cta: {
    title: "Postaw własnego Hermesa.",
    subtitle:
      "Uruchom next-vibe na swoim komputerze, połącz go z serwerem i pozwól im dzielić się pracą.",
    selfHost: "Poradnik self-hostingu",
    github: "Czytaj kod",
  },
};
