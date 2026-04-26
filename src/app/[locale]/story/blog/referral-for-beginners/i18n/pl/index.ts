import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Dwa sposoby na zarabianie. Nie musisz wybierać jednego.",
    description:
      "Przystępny przewodnik po programie polecającym {{appName}}. Udostępnij link i zarabiaj 10%. Zbuduj skill i zarabiaj 5% pasywnie — nawet gdy inni go udostępniają. Bez doświadczenia.",
    category: "Program polecający",
    imageAlt: "Osoba udostępniająca link i pasywnie zarabiająca pieniądze",
    keywords:
      "program polecający, marketing afiliacyjny dla początkujących, pasywny dochód AI, dochód ze skilla",
  },
  hero: {
    backToBlog: "Wróć do bloga",
    brand: "{{appName}} - ",
    icon: "🌱",
    category: "Dla początkujących",
    readTime: "5 min czytania",
    title: "Dwa sposoby na zarabianie. Nie musisz wybierać jednego.",
    subtitle:
      "Udostępnij link. Albo zbuduj skill. Albo oba. Oto jak to dokładnie działa.",
    quote:
      '"Też nie wiedziałem/am, czym jest program polecający. Oto jak wytłumaczyłbym/łabym to mojej mamie."',
  },
  intro: {
    title: "Zacznijmy od zera",
    p1: "Na {{appName}} są dwa sposoby zarabiania. Możesz używać jednego lub obu. Żaden nie wymaga doświadczenia.",
    p2: "Pierwszy sposób: udostępnij link. Gdy ktoś się przez niego zarejestruje, zarabiasz 10% każdej płatności, jaką kiedykolwiek wykona — nie tylko w pierwszym miesiącu, ale co miesiąc, tak długo jak pozostaje subskrybentem. Drugi sposób: zbuduj skill. Skill to indywidualne ustawienie AI, które konfigurujesz i publikujesz. Gdy ktoś zarejestruje się przez link do Twojego skilla, zarabiasz trwale dodatkowe 5% jego płatności. Co ważne: te 5% należą do Ciebie jako autora skilla, nawet gdy ktoś inny go udostępnia. Budujesz raz — zarabiasz na stałe.",
  },
  different: {
    title: "Jednorazowe vs. cykliczne — dlaczego to ma znaczenie",
    p1: "Większość programów polecających płaci raz. {{appName}} płaci wiecznie. Tak wygląda to w praktyce:",
    tableTitle: "Porównanie typów poleceń",
    tableHeaderType: "Typ",
    tableHeaderYouEarn: "Zarabiasz",
    tableHeaderWhen: "Kiedy",
    row1Type: "Jednorazowy bonus (np. kupon restauracyjny)",
    row1Earn: "Stała nagroda",
    row1When: "Raz",
    row2Type: "Affiliate od sprzedaży (np. Amazon)",
    row2Earn: "~3–10% sprzedaży",
    row2When: "Raz na zakup",
    row3Type: "Polecenie {{appName}}",
    row3Earn: "10% subskrypcji",
    row3When: "Co miesiąc, wiecznie",
    p2: "Poleć kogoś w styczniu. Jeśli nadal jest subskrybentem w grudniu, zarobiłeś/aś od niego 12 razy. Pracę wykonałeś/aś raz.",
  },
  skillAngle: {
    title: "Ścieżka skilla — pasywny dochód budowany raz",
    p1: "Skill to indywidualna persona AI: nazwa, osobowość, system prompt. Publikujesz. Gotowe. Każdy może go znaleźć i używać — a gdy ktoś zarejestruje się przez link do skilla, zarabiasz 5% jego płatności na zawsze, na dodatek do 10% prowizji za polecenie.",
    p2: "To, czego większość początkujących nie zauważa: te 5% są powiązane z Tobą jako autorem, nie z tym, kto udostępnił link. Jeśli ktoś odkryje Twój skill w katalogu i wyśle go znajomemu — znajomy się zarejestruje — i tak zostaniesz zaliczony. Platforma śledzi kto stworzył skill, nie kto go dystrybuował. Twój skill zarabia za Ciebie, nawet gdy aktywnie go nie promujesz.",
    p3: "Skille są darmowe do stworzenia. Nie potrzeba płatnego planu. Zacznij od czegoś prostego: skill dla swojego hobby, pracy, języka ojczystego. Opublikuj, udostępnij link — gotowe. Każda rejestracja przez niego przynosi obie prowizje jednocześnie — 10% bezpośrednio + 5% skill = 15% od tego użytkownika, wiecznie.",
  },
  multilevel: {
    title: "Jest też łańcuch — oto jak działa",
    p1: "Ta część brzmi skomplikowanie, ale nie jest. Gdy osoby, które poleciłeś/aś, idą i polecają innych, Ty też zarabiasz mały procent od tych płatności:",
    explanation:
      "Polecasz Alicję. Alicja subskrybuje — zarabiasz 10% jej płatności wiecznie. Alicja poleca Boba. Bob subskrybuje — zarabiasz ~5% płatności Boba (połowa z 10%, bo jest o poziom głębiej). Bob poleca Carol — zarabiasz ~2,5% płatności Carol. I tak dalej, do 5 poziomów głębokości. Każdy poziom zarabia połowę poziomu powyżej.",
    p2: "W praktyce: bezpośrednie 10% od osób, które polecasz osobiście, to niemal cały Twój dochód. Bonusy łańcucha są realne, ale małe. Nie licz na nie — traktuj je jako bonus.",
    p3: "Nie musisz w ogóle rozumieć łańcucha, żeby zacząć. Utwórz link, udostępnij go, zarabiaj 10% od każdego, kto się zarejestruje.",
  },
  expectations: {
    title: "Realistyczne oczekiwania — bez hype'u",
    p1: "Oto uczciwa matematyka:",
    scenario1Label: "Zwykły użytkownik",
    scenario1Spend: "~8$/mies. średnich wydatków",
    scenario1Earn:
      "= 0,80$/mies. za polecenie (lub 1,20$/mies. przez link do skilla)",
    scenario2Label: "Deweloper / heavy AI user",
    scenario2Spend: "200$+/mies.",
    scenario2Earn:
      "= 20$+/mies. za polecenie (lub 30$+/mies. przez link do skilla)",
    note: "Jedno polecenie dewelopera przez link do skilla przynosi 30$/mies. To więcej niż 37 zwykłych użytkowników. Deweloperzy to cel wysokiej wartości — już wydają 100–200$/mies. na narzędzia AI i rzadko rezygnują.",
    example:
      "Poleć 10 zwykłych użytkowników przez link polecający: 8$/mies. dla Ciebie. Te same 10 przez link do skilla: 12$/mies. Nie zmienia życia — ale to pieniądze, które zarobiłeś/aś mówiąc to, co i tak byś powiedział/a.",
  },
  firststeps: {
    title: "Pierwsze kroki (5 minut)",
    step1Title: "Utwórz bezpłatne konto",
    step1Body:
      "Nie potrzeba płatnego planu. Program jest otwarty dla wszystkich.",
    step2Title: "Przejdź do panelu poleceń",
    step2Body: "Otwórz stronę poleceń. ",
    step2Link: "Otwórz stronę poleceń.",
    step2Suffix: " Utwórz kod — może być cokolwiek, co łatwo zapamiętasz.",
    step3Title: "Udostępnij link — lub opublikuj skill",
    step3Body:
      "Link polecający: opublikuj tam, gdzie naturalnie mówisz o narzędziach AI. Link do skilla: najpierw zbuduj prosty skill, potem udostępnij jego link. Oba działają. Oba zarabiają.",
    step4Title: "Sprawdź swój panel",
    step4Body:
      "Odwiedzający, rejestracje i zarobki aktualizują się w czasie rzeczywistym. Brak minimalnego wydatku, żeby zacząć śledzić.",
  },
  close: {
    title: "To naprawdę wszystko",
    p1: "Nie potrzebujesz bloga. Nie potrzebujesz obserwujących. Nie musisz rozumieć struktury wielopoziomowej. Wystarczy mówić ludziom o czymś, czego naprawdę używasz — i opcjonalnie zbudować prosty skill, który zarabia sam z siebie.",
    p2: "Jeśli chcesz zgłębić temat — zrozumieć strukturę prowizji, znaleźć najlepsze sposoby promocji lub zapytać innych, jak to robią — dołącz do naszego Discorda.",
    createCode: "Uzyskaj kod polecający",
    joinDiscord: "Dołącz do Discorda",
    backToBlog: "Wróć do bloga",
  },
};
