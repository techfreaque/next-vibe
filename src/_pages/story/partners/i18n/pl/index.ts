import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title:
      "Program partnerski {{appName}} - {{directPct}} co miesiąc, bez limitu",
    category: "Partnerzy",
    description:
      "Twórcy, newslettery i katalogi: {{directPct}} od każdego zakupu osób, które przyprowadzisz do {{appName}}. Cyklicznie, bez limitu, z pomiarem dla każdego linku. Wypłata w kredytach albo BTC/USDC.",
    imageAlt: "Program partnerski {{appName}}",
    keywords:
      "{{appName}}, program afiliacyjny, program partnerski, afiliacja AI bez cenzury, prowizja cykliczna, program dla twórców, sponsoring newslettera",
  },
  hero: {
    eyebrow: "Program partnerski",
    title:
      "Twoi widzowie chcą AI bez pouczania. Zarabiaj na tym, że ich tu przyprowadzisz.",
    subtitle:
      "{{directPct}} od każdego ich zakupu, tak długo, jak płacą. Bez limitu. Osobny link śledzący do każdego filmu, wydania czy wpisu, więc widzisz, co naprawdę działa.",
    ctaPrimary: "Odbierz link partnerski",
    ctaSecondary: "Zobacz warunki",
  },
  facts: {
    commission: "od każdego zakupu, cyklicznie",
    capValue: "Bez limitu",
    cap: "ani na osoby, ani na zarobek",
    holdValue: "{{holdDays}} dni",
    hold: "okres zwrotu, potem to twoje",
    minPayout: "minimalna wypłata",
  },
  audience: {
    label: "Dla kogo",
    title: "Dla tych, którzy i tak mówią o AI",
    intro:
      "Jeśli twoi odbiorcy odbijają się od odmów, filtrów albo cen, masz już gotowy argument. My dajemy link i liczby.",
    creators: {
      title: "Twórcy",
      body: "YouTube, TikTok, streamy. Jeden link w opisie każdego filmu. Widzisz, który film przyprowadza płacących, a nie tylko kliknięcia.",
    },
    newsletters: {
      title: "Newslettery i blogi",
      body: "Jeden link na wydanie albo wpis. Kto się zarejestruje, zostaje przypisany do ciebie, więc jedna wzmianka zarabia długo.",
    },
    directories: {
      title: "Katalogi i serwisy z recenzjami",
      body: "Dodaj nas z własnym linkiem. Każdy, kto zarejestruje się z twojego wpisu, zostaje przypisany do ciebie na stałe.",
    },
  },
  steps: {
    label: "Jak to działa",
    title: "Gotowe w pięć minut",
    intro: "Bez zgłoszeń, bez akceptacji, bez minimalnych zasięgów.",
    step1: {
      title: "Załóż darmowe konto",
      body: "Zarejestruj się. Strona poleceń otworzy się od razu potem.",
    },
    step2: {
      title: "Wybierz kod, potem link na każde miejsce",
      body: "Raz ustaw kod polecający. Potem twórz osobny link śledzący do każdego filmu, wydania czy wpisu. Każdy liczy własne wizyty, rejestracje i zarobek.",
    },
    step3: {
      title: "Udostępnij",
      body: "Opis, przypięty komentarz, stopka newslettera, wpis w katalogu. Kto zarejestruje się przez ten link, jest twój.",
    },
    step4: {
      title: "Zarabiaj na każdym zakupie",
      body: "{{directPct}} od każdej płatności za subskrypcję i każdego pakietu kredytów. Po {{holdDays}}-dniowym okresie zwrotu zamienia się to w kredyty do wydania albo wypłaty.",
    },
  },
  terms: {
    label: "Warunki",
    title: "Wszystko, co decyduje o twoim zarobku",
    intro: "Bez poziomów do odblokowania, bez drobnego druku poza tą tabelą.",
    rows: {
      commission: {
        term: "Prowizja",
        value:
          "{{directPct}} od każdego zakupu poleconych osób: subskrypcje i pakiety kredytów.",
      },
      duration: {
        term: "Czas trwania",
        value:
          "Cyklicznie, dopóki płacą. Kto zarejestruje się przez twój link, zostaje twój.",
      },
      cap: {
        term: "Limit",
        value: "Brak. Ani na liczbę osób, ani na zarobek.",
      },
      hold: {
        term: "Okres zwrotu",
        value:
          "Nowe prowizje czekają {{holdDays}} dni. Zwrot albo chargeback w tym czasie je anuluje. Potem są potwierdzone.",
      },
      payout: {
        term: "Wypłata",
        value:
          "Potwierdzone prowizje wydajesz jako kredyty 1:1 albo wypłacasz w BTC lub USDC.",
      },
      minimum: {
        term: "Minimalna wypłata",
        value:
          "{{minPayout}}. Wypłaty w krypto realizujemy w ciągu {{cryptoPayoutHours}} godzin od akceptacji.",
      },
      second: {
        term: "Drugi poziom",
        value:
          "Gdy osoba, którą poleciłeś, przyprowadzi własnych użytkowników, dostajesz też {{level2Pct}} z ich płatności.",
      },
      tracking: {
        term: "Śledzenie",
        value:
          "Kod polecający i tagi UTM na każdym linku. Wizyty, rejestracje, płacący i zarobek dla każdego linku, na żywo na twojej stronie poleceń.",
      },
    },
  },
  product: {
    label: "Dokąd ich wysyłasz",
    title: "Platforma AI, którą twoi odbiorcy naprawdę mogą polecić",
    intro: "Łatwo ją polecać, bo rozwiązuje to, na co ludzie narzekają.",
    choice: {
      title: "Modele popularne, otwarte i bez cenzury",
      body: "Najgłośniejsze modele obok otwartych i niecenzurowanych, w jednym czacie. Model zmieniasz, kiedy chcesz.",
    },
    control: {
      title: "Poziom filtrów ustawiają sami",
      body: "Żadnych cichych odmów, o których decyduje ktoś inny. Każdy wybiera, ile filtrowania chce.",
    },
    free: {
      title: "Start za darmo",
      body: "Nowi użytkownicy testują bez karty. Łatwe tak dla twoich odbiorców, łatwa konwersja dla ciebie.",
    },
  },
  faq: {
    label: "FAQ",
    title: "Pytania partnerów",
    items: {
      audience: {
        q: "Czy potrzebuję minimalnych zasięgów?",
        a: "Nie. Bez zgłoszeń, bez liczby obserwujących. Jeden czytelnik z subskrypcją płaci ci co miesiąc, dopóki zostaje.",
      },
      counts: {
        q: "Co liczy się jako zakup?",
        a: "Każda płatność za subskrypcję i każdy pakiet kredytów poleconej osoby. Odnowienia też, za każdym razem.",
      },
      attribution: {
        q: "Jak długo trwa przypisanie?",
        a: "Na stałe. Kto zarejestruje się przez twój link, zostaje połączony z twoim kontem. Po rejestracji nic nie wygasa.",
      },
      placements: {
        q: "Czy mogę mierzyć każde miejsce osobno?",
        a: "Tak. Na stronie poleceń utwórz osobny link śledzący do każdego filmu, wydania czy wpisu. Każdy pokazuje własne wizyty, rejestracje, płacących i zarobek.",
      },
      refunds: {
        q: "Co się dzieje przy zwrocie?",
        a: "Prowizje czekają {{holdDays}} dni. Jeśli zakup zostanie zwrócony albo cofnięty w tym czasie, prowizja przepada. Potem jest twoja.",
      },
      payout: {
        q: "Jak dostaję pieniądze?",
        a: "Potwierdzone prowizje trafiają na konto jako kredyty. Możesz też zlecić wypłatę w BTC lub USDC od {{minPayout}}, realizowaną w ciągu {{cryptoPayoutHours}} godzin od akceptacji.",
      },
    },
  },
  cta: {
    title: "Twój link jest pięć minut stąd.",
    subtitle:
      "Darmowe konto. Bez akceptacji. {{directPct}} od każdego zakupu, cyklicznie, bez limitu.",
    primary: "Odbierz link partnerski",
    secondary: "Jak działają polecenia",
  },
};
