import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Zbudowałeś/aś coś z AI. Teraz zarabiaj na tym, że to udostępniasz.",
    description:
      "Dla deweloperów: Twoje README na GitHubie, posty na blogu i tutoriale mają już potencjał polecający. Oto matematyka - w tym bonus za skill, który podwaja zarobki na użytkownika.",
    category: "Program polecający",
    imageAlt: "Terminal dewelopera ze statystykami zarobków obok kodu",
    keywords:
      "program polecający dla deweloperów, afiliacja AI, pasywny dochód deweloper, monetyzacja open source",
  },
  hero: {
    backToBlog: "Wróć do bloga",
    brand: "{{appName}} - ",
    category: "Dla deweloperów",
    readTime: "5 min czytania",
    title: "Zbudowałeś/aś coś z AI. Teraz zarabiaj na tym, że to udostępniasz.",
    subtitle:
      "Już shippujesz z AI. Twój link polecający to strumień przychodów, który jeszcze nie jest włączony.",
  },
  useCase: {
    title: "Gdzie deweloperzy naturalnie polecają",
    p1: "Już tworzysz treści, które prowadzą ludzi do narzędzi. Post na blogu o Twoim workflow. README, które wspomina AI. Tutorial na YouTube. Odpowiedź na Discordzie z rekomendacją platformy. To wszystko ma potencjał polecający, który większość deweloperów pozostawia niewykorzystanym.",
    p2: "Wszędzie tam, gdzie naturalnie wspominasz {{appName}}, dodaj swój link polecający. Osoby, które klikną i zapiszą się, przynoszą Ci 10% każdej płatności - co miesiąc, wiecznie. Nie musisz zmieniać tego, co mówisz. Po prostu dodaj link.",
    examples: [
      'GitHub README: "Zbudowałem/am to z API {{appName}}. Spróbuj: [Twój link]"',
      'Stopka posta na blogu: "Narzędzia, których używam: ...{{appName}} do AI [link ref]"',
      'Discord/Slack: "Używam {{appName}} - tu moje polecenie, jeśli chcesz dołączyć"',
      'Opis YouTube: "Narzędzia AI użyte w tym filmie: {{appName}} [link polecający]"',
    ],
  },
  skillAngle: {
    title: "Opublikuj skill - dodaj 5% na górę",
    p1: "Każdy skill, który publikujesz, ma link do udostępnienia. Gdy ktoś rejestruje się przez link do Twojego skilla, zarabiasz dodatkowe 5% od wszystkich płatności - na dodatek do 10% prowizji bezpośredniej. To 15% od jednego użytkownika, wiecznie.",
    p2: "Wbuduj link do skilla w README na GitHubie. Opublikuj go na dewelopero wym Discordzie. Każda osoba, która się przez to zarejestruje, przynosi Ci obie prowizje jednocześnie. Nie musisz wybierać - link do skilla niesie obie.",
    p3: "Skille są darmowe do stworzenia. Nie potrzeba płatnej subskrypcji. Jeśli masz użyteczne ustawienie AI - code reviewer znający Twój stack lub pisarz dokumentacji dostrojony do Twojego stylu - udostępnij go. Link zajmie się resztą.",
  },
  math: {
    title: "Matematyka (prawdziwe liczby)",
    subtitle: "Bezpośrednie polecenie vs. polecenie przez skill vs. power user",
    tableHeaderProfile: "Profil użytkownika",
    tableHeaderSpend: "Miesięczne wydatki",
    tableHeaderDirect: "Tylko bezpośrednio (10%)",
    tableHeaderSkill: "Przez link do skilla (15%)",
    rows: [
      {
        profile: "Okazjonalny użytkownik",
        spend: "8$/mies.",
        direct: "0,80$/mies.",
        skill: "1,20$/mies.",
      },
      {
        profile: "Regularny subskrybent",
        spend: "20$/mies.",
        direct: "2,00$/mies.",
        skill: "3,00$/mies.",
      },
      {
        profile: "Heavy AI user",
        spend: "100$/mies.",
        direct: "10,00$/mies.",
        skill: "15,00$/mies.",
      },
      {
        profile: "Deweloper / power user",
        spend: "200$+/mies.",
        direct: "20,00$+/mies.",
        skill: "30,00$+/mies.",
      },
    ],
    note: "Jedno polecenie dewelopera przez link do skilla przynosi Ci 30$/mies. To więcej niż 37 okazjonalnych użytkowników razem. Deweloperzy już wydają 100–200$/mies. na narzędzia AI - konwertują szybko i rzadko rezygnują.",
    growthNote:
      "Gdy {{appName}} dodaje modele i funkcje, ARPU rośnie. Polecenia, które robisz dziś, przynoszą Ci więcej w przyszłym roku - bez dodatkowej pracy.",
  },
  chain: {
    title: "Łańcuch - co się dzieje, gdy Twoje polecenia polecają innych",
    p1: "Gdy osoby, które poleciłeś/aś, polecają innych, Ty też zarabiasz z tych płatności - do 5 poziomów głębokości:",
    level0: "Ty → bezpośrednie polecenie: 10% każdej płatności, wiecznie",
    level1:
      "Ich polecenia (poziom 2): ~5% każdej płatności (połowa puli upline wynoszącą 10%)",
    level2: "Poziom 3: ~2,5% każdej płatności",
    level3: "Poziom 4: ~1,25% każdej płatności",
    level4: "Poziom 5: ~0,625% każdej płatności",
    total: "Maksymalna łączna wypłata dla wszystkich: ~20% jednej płatności",
    p2: "Uczciwa uwaga: bonusy łańcucha szybko maleją. Prawdziwy dochód to 10% bezpośrednio + 5% skill. Jeśli budujesz publicznie i Twoje polecenia sami są deweloperami, łańcuch sumuje się - ale nie optymalizuj dla głębokości. Optymalizuj dla jakościowych bezpośrednich poleceń.",
  },
  crypto: {
    title: "Wypłata w krypto - nie potrzeba konta bankowego",
    p1: "Wypłata w BTC lub USDC. Przetwarzanie w ciągu 48 godzin po zatwierdzeniu. Minimalna wypłata: 40$ - to mniej więcej 2 miesiące od jednego subskrybenta-dewelopera przez link do skilla.",
    p2: "Albo natychmiast zamień zarobki na kredyty platformy. Jeśli sam/a używasz {{appName}}, zarobki z poleceń kompensują Twoje własne koszty.",
  },
  close: {
    title: "Włącz strumień",
    p1: "Już budujesz, piszesz i mówisz o narzędziach AI. Dodanie linku polecającego nic Cię nie kosztuje i zajmuje pięć minut. Umieszczenie linku do skilla w tym samym miejscu podwaja zarobki na użytkownika.",
    p2: "Matematyka procentu składanego - cykliczne prowizje, rosnący ARPU, łańcuch deweloper-do-dewelopera - działa tym bardziej na Twoją korzyść, im więcej budujesz publicznie.",
    createCode: "Utwórz kod polecający",
    joinDiscord: "Dołącz do Discorda",
    backToBlog: "Wróć do bloga",
  },
};
