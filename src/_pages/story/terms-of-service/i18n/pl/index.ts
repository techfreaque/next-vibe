import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Warunki korzystania z usługi: {{appName}}",
    category: "Prawne",
    description: "Przeczytaj warunki i zasady korzystania z {{appName}}",
    imageAlt: "Warunki korzystania z usługi",
    keywords:
      "warunki korzystania z usługi, regulamin, umowa użytkownika, warunki {{appName}}",
    ogTitle: "Warunki korzystania z usługi: {{appName}}",
    ogDescription: "Przeczytaj warunki i zasady korzystania z {{appName}}",
    twitterTitle: "Warunki korzystania z usługi: {{appName}}",
    twitterDescription: "Przeczytaj warunki i zasady korzystania z {{appName}}",
  },
  printAriaLabel: "Drukuj warunki korzystania z usługi",
  onThisPage: "Na tej stronie",
  printButton: "Drukuj",
  title: "Warunki korzystania z usługi",
  lastUpdated: "Ostatnia aktualizacja: 24 listopada 2026",
  bindingVersionNotice:
    "Tłumaczenie ma charakter wyłącznie informacyjny. Wiążąca prawnie jest niemiecka wersja tego dokumentu.",
  introduction:
    "Witamy w {{appName}}. Korzystając z naszej platformy czatu AI, zgadzasz się na niniejsze Warunki korzystania z usługi. Przeczytaj je uważnie. Serwis {{appName}} prowadzi {{operator}} z Niemiec.",
  sections: {
    agreement: {
      title: "Zgoda na warunki",
      content:
        "Uzyskując dostęp do {{appName}} lub korzystając z niego, zgadzasz się przestrzegać niniejszych Warunków korzystania z usługi.",
    },
    description: {
      title: "Opis usługi",
      content:
        "{{appName}} zapewnia dostęp do modeli czatu AI różnych dostawców. Oferujemy bezpłatne i płatne poziomy z różnymi funkcjami.",
    },
    subscriptions: {
      title: "Subskrypcje i rozliczenia",
      plans: {
        title: "Plany subskrypcji",
        content:
          "Oferujemy plan subskrypcji i pakiety kredytów. Pakiety kredytów nigdy nie wygasają, nawet po zakończeniu subskrypcji.",
      },
      billing: {
        title: "Rozliczenia",
        content:
          "Subskrypcje są rozliczane miesięcznie lub rocznie; plany roczne dostają miesięczne kredyty co miesiąc. Pakiety kredytów to jednorazowe doładowania dla aktywnych subskrybentów i nigdy nie wygasają. Akceptujemy karty, PayPal, Apple Pay i Google Pay przez Stripe oraz kryptowaluty przez NowPayments.",
      },
      cancellation: {
        title: "Anulowanie",
        content:
          "Możesz anulować subskrypcję w dowolnym momencie. Anulowanie wchodzi w życie na koniec bieżącego okresu rozliczeniowego. Pakiety kredytów nie podlegają zwrotowi, chyba że przysługuje ci ustawowe prawo odstąpienia od umowy (zob. sekcja Prawo odstąpienia od umowy dla konsumentów).",
      },
    },
    withdrawal: {
      title: "Prawo odstąpienia od umowy dla konsumentów",
      intro:
        "Jeśli jesteś konsumentem (§ 13 niemieckiego kodeksu cywilnego, BGB), przy umowach dotyczących pakietów kredytów i subskrypcji zawieranych z nami za pośrednictwem {{appName}} przysługuje ci ustawowe prawo odstąpienia od umowy na zasadach opisanych w poniższym pouczeniu.",
      notice: {
        title: "Pouczenie o prawie odstąpienia od umowy",
        right:
          "Masz prawo odstąpić od niniejszej umowy w terminie czternastu dni bez podania jakiejkolwiek przyczyny. Termin do odstąpienia od umowy wynosi czternaście dni od dnia zawarcia umowy.",
        exercise:
          "Aby skorzystać z prawa odstąpienia od umowy, musisz poinformować nas ({{operator}}, {{address}}, e-mail: {{email}}) o swojej decyzji o odstąpieniu od niniejszej umowy w drodze jednoznacznego oświadczenia (na przykład pismo wysłane pocztą lub e-mail). Możesz skorzystać z poniższego wzoru formularza odstąpienia od umowy, jednak nie jest to obowiązkowe. Wystarczy zwykły e-mail.",
        deadline:
          "Aby zachować termin do odstąpienia od umowy, wystarczy, że wyślesz informację dotyczącą wykonania prawa odstąpienia od umowy przed upływem terminu do odstąpienia od umowy.",
      },
      effects: {
        title: "Skutki odstąpienia od umowy",
        refund:
          "W przypadku odstąpienia od niniejszej umowy zwracamy ci wszystkie otrzymane od ciebie płatności niezwłocznie, a w każdym przypadku nie później niż czternaście dni od dnia, w którym otrzymaliśmy informację o twoim odstąpieniu od niniejszej umowy. Zwrotu płatności dokonamy przy użyciu takiego samego sposobu płatności, jakiego użyłeś w pierwotnej transakcji, chyba że wyraźnie uzgodniono z tobą inne rozwiązanie; w żadnym przypadku nie poniesiesz opłat w związku z tym zwrotem.",
        compensation:
          "Jeżeli zażądałeś rozpoczęcia świadczenia usług w trakcie terminu do odstąpienia od umowy, zapłacisz nam odpowiednią kwotę odpowiadającą udziałowi usług spełnionych do chwili, w której poinformowałeś nas o wykonaniu prawa odstąpienia od niniejszej umowy, w stosunku do pełnego zakresu usług przewidzianych w umowie.",
        end: "Koniec pouczenia o prawie odstąpienia od umowy",
      },
      expiry: {
        title: "Uwagi o wcześniejszym wygaśnięciu prawa odstąpienia",
        digitalContent:
          "W przypadku umowy o dostarczanie treści cyfrowych, które nie są zapisane na nośniku materialnym, prawo odstąpienia od umowy wygasa zgodnie z § 356 ust. 5 BGB, jeżeli rozpoczęliśmy wykonywanie umowy po tym, jak wyraźnie zgodziłeś się na rozpoczęcie wykonywania umowy przed upływem terminu do odstąpienia, potwierdziłeś, że wiesz, iż wraz z rozpoczęciem wykonywania umowy tracisz prawo odstąpienia, a my przekazaliśmy ci potwierdzenie zawarcia umowy.",
        services:
          "W przypadku umowy o świadczenie usług prawo odstąpienia od umowy wygasa zgodnie z § 356 ust. 4 BGB, jeżeli w pełni wykonaliśmy usługę, a jej wykonywanie rozpoczęliśmy dopiero po tym, jak wyraziłeś na to wyraźną zgodę i jednocześnie potwierdziłeś, że wiesz, iż twoje prawo odstąpienia wygasa z chwilą pełnego wykonania umowy przez nas.",
        credits:
          "Jeżeli twoje prawo odstąpienia nie wygasło na podstawie tych przepisów, w odniesieniu do kredytów obowiązują następujące zasady: cenę przypadającą na niewykorzystane kredyty z umowy, od której odstąpiono, zwracamy w całości, a kredyty te z chwilą odstąpienia są usuwane z twojego konta. Za kredyty już wykorzystane naliczamy, w zakresie dozwolonym przez prawo, kwotę proporcjonalną według stosunku kredytów wykorzystanych do kredytów nabytych w ramach umowy. Odstąpienie od subskrypcji kończy również subskrypcję.",
      },
      form: {
        title: "Wzór formularza odstąpienia od umowy",
        intro:
          "(Jeśli chcesz odstąpić od umowy, wypełnij ten formularz i odeślij go do nas.)",
        recipient: "Adresat: {{operator}}, {{address}}, e-mail: {{email}}",
        statement:
          "Ja/My (*) niniejszym odstępuję/odstępujemy (*) od zawartej przeze mnie/przez nas (*) umowy o dostarczanie następujących treści cyfrowych (*)/o świadczenie następującej usługi (*):",
        orderedOn: "Data zamówienia (*)/data otrzymania (*)",
        name: "Imię i nazwisko konsumenta(-ów)",
        address: "Adres konsumenta(-ów)",
        signature:
          "Podpis konsumenta(-ów) (tylko jeżeli formularz jest przesyłany w wersji papierowej)",
        date: "Data",
        footnote: "(*) Niepotrzebne skreślić.",
        accountHint:
          "Abyśmy mogli szybko przypisać twój zakup, podaj adres e-mail swojego konta. Nie jest to warunek skutecznego odstąpienia od umowy.",
      },
    },
    userAccounts: {
      title: "Konta użytkowników",
      creation: {
        title: "Tworzenie konta",
        content:
          "Musisz podać dokładne informacje podczas tworzenia konta. Jesteś odpowiedzialny za bezpieczeństwo swoich danych logowania.",
      },
      responsibilities: {
        title: "Obowiązki użytkownika",
        content:
          "Jesteś odpowiedzialny za wszystkie działania na swoim koncie. Nie możesz udostępniać konta innym osobom.",
      },
    },
    userContent: {
      title: "Treści użytkownika",
      ownership: {
        title: "Własność treści",
        content:
          "Zachowujesz wszystkie prawa do swoich rozmów i danych. Twoje prywatne foldery są dostępne tylko dla Ciebie.",
      },
      guidelines: {
        title: "Wytyczne dotyczące treści",
        intro:
          "Chociaż zapewniamy niescenzurowany dostęp do AI, nie możesz korzystać z usługi, aby:",
        items: {
          item1: "Angażować się w nielegalne działania",
          item2: "Nękać, grozić lub krzywdzić innych",
          item3: "Naruszać praw własności intelektualnej",
          item4: "Próbować hakować lub kompromitować platformę",
        },
      },
    },
    aiOutput: {
      title: "Treści generowane przez AI",
      ownership:
        "Nie rościmy sobie praw do tekstów, obrazów, wideo, dźwięku ani innych treści, które generujesz w {{appName}}. Wszelkie prawa, jakie istnieją do tych treści, należą do Ciebie.",
      licenses:
        "Treści tworzą modele podmiotów trzecich. Oprócz niniejszego regulaminu obowiązują licencja danego modelu i warunki jego dostawcy. Niektóre modele dopuszczają tylko użytek niekomercyjny albo ograniczają niektóre zastosowania. Takie modele oznaczamy w aplikacji.",
      copyright:
        "Treści wygenerowane przez AI mogą nie podlegać ochronie prawa autorskiego i mogą przypominać istniejące utwory lub treści wygenerowane dla innych użytkowników. Przed wykorzystaniem treści, zwłaszcza w celach komercyjnych, odpowiadasz za sprawdzenie licencji używanego modelu.",
    },
    intellectualProperty: {
      title: "Własność intelektualna",
      content:
        "Platforma {{appName}}, w tym jej projekt, funkcje i kod, jest chroniona przepisami o własności intelektualnej.",
    },
    limitation: {
      title: "Ograniczenie odpowiedzialności",
      content:
        "{{appName}} nie ponosi odpowiedzialności za jakiekolwiek pośrednie, przypadkowe, specjalne lub wynikowe szkody wynikające z korzystania z usługi.",
    },
    indemnification: {
      title: "Odszkodowanie",
      content:
        "Zgadzasz się zabezpieczyć {{appName}} przed wszelkimi roszczeniami, szkodami lub wydatkami wynikającymi z korzystania z usługi.",
    },
    termination: {
      title: "Rozwiązanie umowy",
      content:
        "Zastrzegamy sobie prawo do rozwiązania lub zawieszenia Twojego konta za naruszenie niniejszych warunków.",
    },
    changes: {
      title: "Zmiany warunków",
      content:
        "Możemy od czasu do czasu aktualizować niniejsze Warunki korzystania z usługi. Dalsze korzystanie z usługi po zmianach stanowi akceptację nowych warunków.",
    },
    governingLaw: {
      title: "Prawo właściwe",
      content:
        "Niniejsze Warunki korzystania z usługi podlegają prawu Republiki Federalnej Niemiec. Jeśli jesteś konsumentem, ten wybór prawa nie pozbawia Cię ochrony, jaką dają bezwzględnie obowiązujące przepisy prawa państwa, w którym masz miejsce zwykłego pobytu. Jeśli jesteś kupcem w rozumieniu niemieckiego prawa handlowego (Kaufmann), osobą prawną prawa publicznego lub publicznoprawnym funduszem specjalnym, sądem właściwym dla wszystkich sporów wynikających z tych warunków jest sąd właściwy dla siedziby usługodawcy w Simbach am Inn w Niemczech. W pozostałych przypadkach obowiązuje właściwość ustawowa.",
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
