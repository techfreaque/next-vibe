import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Polityka prywatności - {{appName}}",
    category: "Prawne",
    description:
      "Dowiedz się, jak {{appName}} chroni Twoją prywatność i przetwarza Twoje dane",
    imageAlt: "Polityka prywatności",
    keywords:
      "polityka prywatności, ochrona danych, prywatność użytkownika, {{appName}} prywatność",
    ogTitle: "Polityka prywatności - {{appName}}",
    ogDescription:
      "Dowiedz się, jak {{appName}} chroni Twoją prywatność i przetwarza Twoje dane",
    twitterTitle: "Polityka prywatności - {{appName}}",
    twitterDescription:
      "Dowiedz się, jak {{appName}} chroni Twoją prywatność i przetwarza Twoje dane",
  },
  printAriaLabel: "Drukuj politykę prywatności",
  printButton: "Drukuj",
  title: "Polityka prywatności",
  lastUpdated: "Ostatnia aktualizacja: styczeń 2025",
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
      title: "Transfery biznesowe",
      description:
        "W przypadku fuzji, przejęcia lub sprzedaży aktywów, Twoje dane mogą zostać przekazane nowej jednostce.",
    },
    thirdParty: {
      title: "Usługi stron trzecich",
      description: "Korzystamy z następujących usług stron trzecich:",
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
          "Prawo do żądania usunięcia danych (prawo do bycia zapomnianym)",
        objection: "Prawo sprzeciwu wobec przetwarzania Twoich danych",
        portability: "Prawo do przenoszenia danych",
      },
    },
    cookies: {
      title: "Pliki cookie i śledzenie",
      description:
        "Używamy plików cookie i podobnych technologii śledzenia w celu poprawy Twojego doświadczenia.",
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
    gdpr: {
      title: "Zgodność z RODO",
      description:
        "Dla użytkowników z Unii Europejskiej przestrzegamy wszystkich wymogów RODO.",
    },
    ccpa: {
      title: "Zgodność z CCPA",
      description:
        "Dla mieszkańców Kalifornii przestrzegamy California Consumer Privacy Act.",
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
