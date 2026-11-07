import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Robot kliknął każdy przycisk. Znalazł osiem luk bezpieczeństwa.",
    description:
      "Zbudowaliśmy framework testów end-to-end, który obsługuje prawdziwe strony w prawdziwej przeglądarce - i pokryliśmy każdy endpoint, z którego korzystają klienci. Oto co wyłapał.",
    category: "Inżynieria",
    imageAlt:
      "Testy end-to-end sterujące {{appName}} w prawdziwej przeglądarce",
    keywords:
      "testy E2E, Playwright, bezpieczeństwo, SSRF, open redirect, next-vibe, {{appName}}",
  },
  hero: {
    backToBlog: "Powrót do bloga",
    category: "Inżynieria",
    readTime: "7 min czytania",
    title: "Robot kliknął każdy przycisk. Znalazł osiem luk bezpieczeństwa.",
    subtitle:
      "Przestaliśmy testować kawałki, zaczęliśmy testować strony. Prawdziwa przeglądarka, prawdziwy serwer, prawdziwe kliknięcia - na każdym endpoincie, którego dotyka klient.",
  },
  intro: {
    lead: "Nasz kod przechodził sprawdzanie typów, lintera i testy jednostkowe. A mimo to wypuszczał bugi. Nie egzotyczne - formularz resetu, który ignorował potwierdzenie hasła, linki do faktur prowadzące donikąd, feed pokazujący usunięte wątki.",
    p1: "Każdy z nich siedział w szczelinie między kawałkami. Funkcja była dobra. Strona wokół niej - nie. Dlatego zbudowaliśmy framework testowy, który obchodzi tylko jedno: co klient naprawdę widzi i wysyła.",
  },
  why: {
    title: "Po co testować prawdziwą stronę?",
    intro:
      "Każda warstwa testów łapie inny rodzaj błędów. Tylko ostatnia widzi to, co widzą Twoi użytkownicy.",
    unit: {
      label: "Test jednostkowy",
      title: "Sprawdza jedną funkcję",
      body: "Szybki i tani. Ślepy na połączenia: zły URL, zła nazwa pola, przycisk, który nigdy nic nie wysyła.",
    },
    api: {
      label: "Test API",
      title: "Sprawdza jedno żądanie",
      body: "Dowodzi, że serwer odpowiada. Nigdy - że strona to żądanie wysyła albo pokazuje odpowiedź.",
    },
    e2e: {
      label: "End-to-end",
      title: "Sprawdza całą drogę",
      body: "Otwiera stronę w Chromium, pisze jak człowiek, klika wyślij, czyta odpowiedź prosto z sieci. Jeśli działa tutaj, działa dla klientów.",
    },
  },
  how: {
    title: "Jak działa harness",
    intro:
      "Playwright sterowany z bun test, zbudowany na definicjach endpointów next-vibe. Definicja zna każde pole - test nie musi.",
    step1: {
      title: "Otwórz prawdziwą stronę",
      body: "Test otwiera stronę klienta - /user/login, /story/framework - a nie atrapę. Pisze dopiero wtedy, gdy React przejmie formularz.",
    },
    step2: {
      title: "Wypełnij typowanymi wartościami",
      body: "Podajesz wartości, nie selektory. Sterowniki pól czytają definicję i obsługują widoczne UI - piszą, wybierają opcję po etykiecie, dołączają plik.",
    },
    step3: {
      title: "Złap żądanie z sieci",
      body: "Submit zwraca prawdę: treść żądania, status i odpowiedź. Harness sprawdza, że żądanie niesie dokładnie to, co wpisano.",
    },
    step4: {
      title: "Nagraj raz, odtwarzaj zawsze",
      body: "Płatni dostawcy - modele AI, obraz, muzyka, wideo - są nagrywani per test przy pierwszym uruchomieniu i potem odtwarzani. Zero niespodzianek na rachunku, powtarzalne wyniki.",
    },
    step5: {
      title: "Raport pokrycia",
      body: "Raport liczy każdy publiczny endpoint: jeden sukces i jedno odrzucenie. Luki widać, a nie się ich domyśla.",
    },
    codeCaption: "Cała specyfikacja. Bez selektorów, bez mocków.",
  },
  numbers: {
    title: "Wynik",
    suites: "zestawów testów",
    covered: "publicznych endpointów w pełni pokrytych",
    security: "zamkniętych luk bezpieczeństwa",
    note: "Pozostałe endpointy potrzebują płatnych kluczy dostawców wyszukiwania, scrapingu i mowy, zanim da się je nagrać.",
  },
  security: {
    title: "Luki, które znalazł",
    intro:
      "Żadna nie wyszła w sprawdzaniu typów ani testach jednostkowych. Każda wyszła, gdy prawdziwa przeglądarka przeszła prawdziwą ścieżkę.",
    openRedirect: {
      title: "Open redirect na /track",
      body: "Każdy mógł zbudować link, który przez naszą domenę przekierowywał na dowolną stronę. Zewnętrzne cele wymagają teraz podpisu HMAC.",
    },
    ssrf: {
      title: "SSRF przez adresy od użytkownika",
      body: "Adresy, które dajesz AI, mogły wskazywać na wewnętrzne serwery. Strażnik rozwiązuje teraz DNS i sprawdza każdy krok przekierowania.",
    },
    ssrCache: {
      title: "Cache serwera dzielony między żądaniami",
      body: "Cache zapytań przy renderowaniu na serwerze mógł przenieść dane jednego użytkownika na stronę innego. Teraz jest izolowany per żądanie.",
    },
    systemPrompt: {
      title: "Debug system promptu czytał każdy wątek",
      body: "Endpoint debugowania nie sprawdzał, do kogo należy wątek. Teraz sprawdza.",
    },
    publicFeed: {
      title: "Publiczny feed pokazywał ukryte wątki",
      body: "Ukryte i usunięte wątki pojawiały się w publicznym feedzie. Teraz są odfiltrowane.",
    },
    loginOptions: {
      title: "Opcje logowania zdradzały konta",
      body: "Odpowiedź opcji logowania zdradzała, czy dany e-mail ma konto. Już nie zdradza.",
    },
    resetPassword: {
      title: "Reset ignorował potwierdzenie",
      body: "Krok potwierdzenia resetu hasła ignorował pole potwierdzenia. Niezgodności są teraz odrzucane.",
    },
    privateFiles: {
      title: "Prywatne pliki w publicznym cache",
      body: "Prywatne pliki szły z nagłówkiem Cache-Control: public, więc współdzielone cache mogły je przechować. Teraz są prywatne.",
    },
  },
  broken: {
    title: "I to, co było po prostu zepsute",
    intro: "Nic groźnego - ale po cichu psuło życie prawdziwym ludziom:",
    items: {
      attachments:
        "Adresy załączników w czacie i raporty błędów klienta zwracały 404.",
      permissions:
        "Uprawnienia root nigdy się nie wczytywały - klienci nie mogli pisać w Shared.",
      embed: "Widget do osadzania nie startował.",
      invoices: "Linki w mailach z fakturami zwracały 404.",
      models: "Strona modeli była bezużyteczna.",
      music: "Generowanie muzyki przez OpenRouter nie działało.",
      fixtures:
        "Zakres fixture'ów w testach przepuszczał płatne wywołania na żywo.",
      pglite: "Lokalne bazy PGlite zwracały złe wiersze z INSERT…RETURNING.",
      pagination: "Paginacja dla odwiedzających na /tools była zepsuta.",
    },
    footer:
      "Do tego długa lista nieprzetłumaczonych tekstów i poprawek widgetów.",
  },
  closing: {
    title: "Co to znaczy dla Ciebie",
    p1: "Każda strona, przez którą się rejestrujesz, logujesz, płacisz, czatujesz, generujesz czy zapisujesz, ma teraz test, który otwiera ją w prawdziwej przeglądarce i robi to, co Ty. Gdy coś zmieniamy, robot przechodzi tę drogę, zanim Ty to zrobisz.",
    p2: "Framework jest częścią next-vibe. Budujesz na nim - Twoje endpointy dostają ten sam harness za darmo.",
  },
  cta: {
    title: "Przeczytaj harness. Użyj go we własnym kodzie.",
    subtitle:
      "Framework E2E jest open source i należy do next-vibe. Jeden plik specyfikacji na funkcję, tuż obok definicji.",
    github: "Zobacz na GitHubie",
    framework: "Poznaj next-vibe",
  },
};
