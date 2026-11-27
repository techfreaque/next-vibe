import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Polityka prywatności: {{appName}}",
    category: "Prawne",
    description:
      "Dowiedz się, jak {{appName}} chroni Twoją prywatność i przetwarza Twoje dane",
    imageAlt: "Polityka prywatności",
    keywords:
      "polityka prywatności, ochrona danych, prywatność użytkownika, {{appName}} prywatność",
    ogTitle: "Polityka prywatności: {{appName}}",
    ogDescription:
      "Dowiedz się, jak {{appName}} chroni Twoją prywatność i przetwarza Twoje dane",
    twitterTitle: "Polityka prywatności: {{appName}}",
    twitterDescription:
      "Dowiedz się, jak {{appName}} chroni Twoją prywatność i przetwarza Twoje dane",
  },
  printAriaLabel: "Drukuj politykę prywatności",
  onThisPage: "Na tej stronie",
  printButton: "Drukuj",
  title: "Polityka prywatności",
  lastUpdated: "Ostatnia aktualizacja: listopad 2026",
  bindingVersionNotice:
    "Tłumaczenie ma charakter wyłącznie informacyjny. Wiążąca prawnie jest niemiecka wersja tego dokumentu.",
  introduction:
    "W {{appName}} poważnie traktujemy Twoją prywatność. Ta polityka prywatności wyjaśnia, jak zbieramy, używamy i chronimy Twoje dane osobowe.",
  sections: {
    informationCollect: {
      title: "Zbierane przez nas informacje",
      description:
        "Zbieramy informacje, które nam bezpośrednio przekazujesz, oraz informacje zbierane automatycznie podczas korzystania z naszych usług.",
    },
    personalData: {
      title: "Dane osobowe",
      description: "Możemy zbierać następujące dane osobowe:",
      items: {
        name: "Imię i dane kontaktowe",
        email: "Adres e-mail",
        phone: "Numer telefonu (opcjonalnie)",
        company: "Nazwa firmy (opcjonalnie)",
        billing: "Informacje rozliczeniowe i płatnicze",
        payment: "Metoda płatności i szczegóły transakcji",
      },
    },
    socialMediaData: {
      title: "Dane z mediów społecznościowych",
      description:
        "Jeśli połączysz konta w mediach społecznościowych, możemy zbierać informacje o profilu i powiązane dane.",
    },
    derivativeData: {
      title: "Dane pochodne",
      description:
        "Możemy tworzyć zanonimizowane, zagregowane dane z Twojego użytkowania w celu ulepszenia naszych usług.",
    },
    useOfInformation: {
      title: "Wykorzystanie Twoich informacji",
      description: "Używamy zebranych informacji do różnych celów, w tym:",
      items: {
        provide: "Aby świadczyć i utrzymywać nasze usługi czatu AI",
        process: "Aby przetwarzać Twoje transakcje i zarządzać kontem",
        send: "Aby wysyłać Ci aktualizacje, newslettery i komunikaty marketingowe",
        respond:
          "Aby odpowiadać na Twoje zapytania i zapewniać obsługę klienta",
        monitor: "Aby monitorować i analizować wzorce użytkowania",
        personalize: "Aby personalizować Twoje doświadczenie",
      },
    },
    disclosure: {
      title: "Ujawnianie informacji",
      description:
        "Możemy ujawnić Twoje informacje, gdy wymagają tego przepisy prawa.",
    },
    businessTransfers: {
      title: "Zmiana właściciela serwisu",
      description:
        "Jeśli serwis przejmie nowy właściciel, Twoje dane mogą zostać mu przekazane.",
    },
    thirdParty: {
      title: "Usługi stron trzecich",
      description:
        "Dane osobowe przekazujemy tylko wymienionym niżej usługodawcom i tylko w takim zakresie, jakiego każdy z nich potrzebuje do swojej pracy. Twoje konto, czaty i pliki przechowujemy na własnych serwerach w Niemczech.",
      aiNotice:
        "Gdy czatujesz albo generujesz media, zapytanie trafia do dostawcy wybranego modelu. Zawiera to, czego model potrzebuje do odpowiedzi: Twoją wiadomość, wcześniejsze wiadomości z rozmowy, załączniki, instrukcje i wspomnienia, z których korzysta AI, oraz nazwę wyświetlaną z Twojego profilu. Twojego adresu e-mail nie wysyłamy. Pośrednicy tacy jak OpenRouter, NanoGPT i Venice przekazują zapytanie firmie, która uruchamia model, na przykład OpenAI, Anthropic, Google, xAI, DeepSeek albo Mistral. Jak długo dostawca przechowuje zapytanie i co może z nim zrobić, określa jego regulamin. Nie trenujemy modeli AI na Twoich czatach.",
      transfers:
        "Kilku dostawców ma siedzibę poza UE. Jeśli dostawca oferuje standardowe klauzule umowne Komisji Europejskiej, jak Stripe i OpenRouter, to one są podstawą przekazania danych. W pozostałych przypadkach dane są przekazywane na warunkach dostawcy.",
      labels: {
        purpose: "Cel",
        data: "Przekazywane dane",
        privacyPolicy: "Polityka prywatności",
      },
      groups: {
        hosting: "Hosting i przechowywanie",
        email: "E-mail",
        payments: "Płatności",
        ai: "Modele AI",
        web: "Wyszukiwanie w sieci i pobieranie stron",
      },
      providers: {
        hostinger: {
          purpose:
            "Wynajmuje nam dwa serwery wirtualne, na których działa platforma. Bazę danych, magazyn plików (MinIO) i cache (Redis) obsługujemy sami na tych serwerach. Żadna osobna usługa chmurowa nie bierze w tym udziału.",
          data: "Wszystko, co jest zapisane na platformie: dane konta, czaty, wspomnienia, przesłane i wygenerowane pliki, dane płatności.",
          location: "Serwery w Niemczech, firma na Litwie (UE)",
        },
        hosttech: {
          purpose:
            "Serwer poczty dla naszych adresów e-mail. Wysyła kody rejestracji, potwierdzenia i newslettery oraz odbiera Twoje wiadomości do nas.",
          data: "Adres e-mail, imię i nazwisko, treść wiadomości.",
          location:
            "Szwajcaria (decyzja UE stwierdzająca odpowiedni stopień ochrony)",
        },
        stripe: {
          purpose: "Płatności kartą, subskrypcje i faktury.",
          data: "Imię i nazwisko, adres e-mail, adres rozliczeniowy, dane płatności, kwoty, ID Twojego konta. Pełnego numeru karty nigdy nie widzimy.",
          location:
            "Stripe Payments Europe, Ltd., Irlandia (UE); spółka matka w USA",
        },
        paypal: {
          purpose: "Tylko jeśli wybierzesz PayPal w płatności Stripe.",
          data: "Imię i nazwisko, adres e-mail, dane płatności, kwoty.",
          location: "PayPal (Europe) S.à r.l. et Cie, S.C.A., Luksemburg (UE)",
        },
        nowpayments: {
          purpose: "Płatności kryptowalutami.",
          data: "ID Twojego konta w numerze zamówienia, produkt i kwota, dane portfela i transakcji. Przy cyklicznych płatnościach krypto także Twój adres e-mail.",
          location: "Saint Vincent i Grenadyny",
        },
        openrouter: {
          purpose:
            "Przekazuje większość modeli czatu (na przykład od OpenAI, Anthropic, Google, xAI, DeepSeek, Mistral i Qwen) oraz część modeli obrazu i wideo firmie, która je uruchamia.",
          data: "Treść zapytania do AI opisana wyżej. Firma uruchamiająca model otrzymuje tę samą treść.",
          location: "USA",
        },
        nanogpt: {
          purpose: "Modele czatu, obrazu i wideo, zamiana tekstu na mowę.",
          data: "Treść zapytania do AI, tekst, który chcesz odsłuchać.",
          location: "USA",
        },
        venice: {
          purpose: "Modele czatu, obrazu i wideo bez cenzury.",
          data: "Treść zapytania do AI.",
          location: "USA",
        },
        uncensoredAi: {
          purpose: "Model czatu UncensoredLM.",
          data: "Treść zapytania do AI.",
          location: "USA",
        },
        freedomgpt: {
          purpose: "Modele czatu FreedomGPT.",
          data: "Treść zapytania do AI.",
          location: "USA",
        },
        gabAi: {
          purpose: "Modele czatu Gab AI.",
          data: "Treść zapytania do AI.",
          location: "USA",
        },
        modelslab: {
          purpose: "Modele obrazu, wideo i muzyki.",
          data: "Twój prompt i dołączone obrazy.",
          location: "Indie",
        },
        edenAi: {
          purpose:
            "Zamiana mowy na tekst i tekstu na mowę. Przekazuje dźwięk lub tekst do używanego silnika mowy.",
          data: "Nagrania głosowe do transkrypcji, tekst, który chcesz odsłuchać.",
          location: "Francja (UE)",
        },
        braveSearch: {
          purpose: "Wyszukiwanie w sieci, gdy AI szuka w internecie.",
          data: "Zapytanie, które formułuje AI. Bez danych konta.",
          location: "USA",
        },
        kagi: {
          purpose:
            "Wyszukiwanie w sieci i krótkie odpowiedzi z sieci, gdy AI szuka w internecie.",
          data: "Zapytanie, które formułuje AI. Bez danych konta.",
          location: "USA",
        },
        scrappey: {
          purpose: "Pobiera stronę internetową, gdy AI czyta link.",
          data: "Adres strony. Bez danych konta.",
          location: "UE",
        },
      },
    },
    legal: {
      title: "Podstawa prawna przetwarzania",
      description:
        "Przetwarzamy Twoje dane osobowe na podstawie Twojej zgody, konieczności umownej, zobowiązań prawnych i naszych uzasadnionych interesów.",
    },
    security: {
      title: "Środki bezpieczeństwa",
      description:
        "Wdrażamy odpowiednie techniczne i organizacyjne środki bezpieczeństwa w celu ochrony Twoich danych osobowych.",
    },
    rights: {
      title: "Twoje prawa dotyczące ochrony danych",
      description:
        "Zgodnie z przepisami o ochronie danych masz określone prawa dotyczące Twoich danych osobowych:",
      items: {
        access: "Prawo dostępu do Twoich danych osobowych",
        correction:
          "Prawo do poprawienia nieprawidłowych lub niekompletnych danych",
        deletion:
          "Prawo do usunięcia: usuń konto w ustawieniach, a Twoje dane osobowe zostaną skasowane",
        objection: "Prawo sprzeciwu wobec przetwarzania Twoich danych",
        portability:
          "Prawo do przenoszenia danych: wyeksportuj wszystkie dane jako JSON w ustawieniach",
      },
    },
    cookies: {
      title: "Pliki cookie i śledzenie",
      description:
        "Żadnych trackerów firm trzecich, żadnych pikseli reklamowych, żadnego fingerprintingu. Jeden własny plik cookie pozwala nam rozpoznać Twoją przeglądarkę. Żeby wiedzieć, które kanały przyprowadzają ludzi, którzy zostają, zapisujemy, jak trafiłeś do nas pierwszy raz i ostatnio przez oznaczony link: tagi kampanii z linku (utm_source, utm_medium, utm_campaign, utm_content, utm_term), domenę strony odsyłającej (nigdy pełny adres), stronę wejścia (bez parametrów zapytania) i ewentualny kod polecający. Notujemy też, kiedy pierwszy raz napisałeś na czacie, założyłeś konto, potwierdziłeś newsletter, zapłaciłeś i odnowiłeś. Po rejestracji wiążemy to z Twoim kontem. Używamy tego wyłącznie zbiorczo do oceny kanałów marketingowych, nigdy nie sprzedajemy ani nie udostępniamy i usuwamy razem z kontem.",
    },
    guestMedia: {
      title: "Media tworzone bez konta",
      description:
        "Obrazy, dźwięk i wideo wygenerowane bez konta, także w trybie incognito, przechowujemy na naszych serwerach, żeby można je było wyświetlić i pobrać. Jeśli nigdy nie założysz konta, automatycznie usuwamy te pliki po 4 miesiącach.",
    },
    thirdPartySites: {
      title: "Strony trzecie",
      description:
        "Nasza usługa może zawierać linki do stron trzecich. Nie jesteśmy odpowiedzialni za ich praktyki dotyczące prywatności.",
    },
    children: {
      title: "Prywatność dzieci",
      description:
        "Nasza usługa nie jest przeznaczona dla dzieci poniżej 13 roku życia. Świadomie nie zbieramy danych od dzieci.",
    },
    changes: {
      title: "Zmiany w polityce",
      description:
        "Możemy od czasu do czasu aktualizować tę politykę prywatności. Powiadomimy Cię o istotnych zmianach.",
    },
    controller: {
      description:
        "Administratorem Twoich danych w rozumieniu RODO jest {{operator}}, {{address}}.",
    },
    gdpr: {
      title: "Zgodność z RODO",
      description:
        "Dla użytkowników z Unii Europejskiej szanujemy Twoje prawa wynikające z RODO. Eksportuj dane w dowolnej chwili w ustawieniach. Po usunięciu konta kasujemy profil, czaty, wspomnienia, adresy, zapis do newslettera i dane kontaktowe, a dane osobowe w powiązanych rekordach odwiedzających są usuwane. Zachowujemy anonimowe statystyki zbiorcze oraz rejestr kredytów (niepowiązany już z Tobą). W sprawach, których ustawienia nie obejmują, skontaktuj się z nami.",
    },
  },
  post: {
    title: "Tytuł",
    description: "Opis endpointu",
    form: {
      title: "Konfiguracja",
      description: "Skonfiguruj parametry",
    },
    response: {
      title: "Odpowiedź",
      description: "Dane odpowiedzi",
    },
    errors: {
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Wymagana autoryzacja",
      },
      validation: {
        title: "Błąd walidacji",
        description: "Nieprawidłowe parametry żądania",
      },
      server: {
        title: "Błąd serwera",
        description: "Wystąpił wewnętrzny błąd serwera",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieznany błąd",
      },
      network: {
        title: "Błąd sieci",
        description: "Wystąpił błąd sieci",
      },
      forbidden: {
        title: "Zabronione",
        description: "Dostęp zabroniony",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Zasób nie został znaleziony",
      },
      conflict: {
        title: "Konflikt",
        description: "Wystąpił konflikt danych",
      },
    },
    success: {
      title: "Sukces",
      description: "Operacja zakończona pomyślnie",
    },
  },
};
