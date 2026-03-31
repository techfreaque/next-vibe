import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Zbudowałeś/aś coś z AI. Teraz zarabiaj na tym, że to udostępniasz.",
    description:
      "Dla deweloperów: jak przekształcić swoją istniejącą pracę z AI – posty na blogu, README-y, tutoriale, narzędzia open source – w pasywny strumień dochodów z poleceń.",
    category: "Program polecający",
    imageAlt: "Terminal dewelopera ze statystykami zarobków obok kodu",
    keywords:
      "program polecający dla deweloperów, afiliacja AI, pasywny dochód deweloper, monetyzacja open source",
  },
  hero: {
    backToBlog: "Wróć do bloga",
    brand: "unbottled.ai - ",
    category: "Dla deweloperów",
    readTime: "5 min czytania",
    title: "Zbudowałeś/aś coś z AI. Teraz zarabiaj na tym, że to udostępniasz.",
    subtitle:
      "Już shippujesz z AI. Twój link polecający to strumień przychodów, który jeszcze nie jest włączony.",
  },
  useCase: {
    title: "Gdzie deweloperzy naturalnie polecają",
    p1: "Już tworzysz treści, które prowadzą ludzi do narzędzi. Post na blogu o Twoim workflow. README, które wspomina AI, której użyłeś/aś. Tutorial na YouTube. Odpowiedź na Discordzie, w której polecasz platformę. To wszystko ma potencjał polecający, który większość deweloperów pozostawia niewykorzystanym.",
    p2: "Wzorzec jest prosty: wszędzie tam, gdzie naturalnie wspominasz unbottled.ai, dodaj swój kod polecający. Osoby, które klikną i zapiszą się, przynoszą Ci 10% prowizji – cyklicznie. Nie musisz zmieniać tego, co mówisz – po prostu dodaj link.",
    examples: [
      'GitHub README: "Zbudowałem/am to z API unbottled.ai. Jeśli chcesz spróbować: [link polecający]"',
      'Stopka posta na blogu: "Narzędzia, których używam: ...unbottled.ai do dostępu do AI [link ref]"',
      'Discord/Slack: "Używam unbottled.ai – tu moje polecenie, jeśli chcesz spróbować"',
      'Opis YouTube: "Narzędzia AI użyte w tym filmie: unbottled.ai [link polecający]"',
    ],
  },
  apiAngle: {
    title: "Kąt API / next-vibe",
    p1: "Jeśli budujesz na API unbottled.ai lub przyczyniasz się do next-vibe, Twoi użytkownicy są naturalnymi poleceniami. Ktoś, kto używa narzędzia, które zbudowałeś/aś na platformie, jest już o krok od bezpośredniej subskrypcji.",
    p2: "next-vibe samo w sobie jest open source. Jeśli o nim piszesz, wnosisz do niego wkład lub budujesz z nim coś, tworzysz już dokładnie taki content, który konwertuje – Twój link polecający należy tam.",
  },
  math: {
    title: "Matematyka (w stylu kodu)",
    subtitle: "Dwa scenariusze: okazjonalny użytkownik vs. heavy user",
    tableHeaderReferrals: "Poleceni użytkownicy",
    tableHeaderCasual: "Okazjonalny (śr. 8$/mies.)",
    tableHeaderHeavy: "Dev (200$+/mies.)",
    rows: [
      { referrals: "10", casual: "8$/mies.", heavy: "100$/mies." },
      { referrals: "50", casual: "40$/mies.", heavy: "500$/mies." },
      { referrals: "100", casual: "80$/mies.", heavy: "1 000$/mies." },
    ],
    note: "Jedno polecenie power usera = 12+ zwykłych poleceń w zarobkach. Deweloperzy znają już te liczby – przeciętny deweloper płaci dziś spokojnie 200$/mies. za Claude Code lub Codex. Publiczność deweloperów, dla której piszesz, to dokładnie ten end high-ARPU tej tabeli.",
    growthNote:
      "Gdy unbottled.ai dodaje modele i funkcje, ARPU rośnie. Polecenia, które robisz dziś, przynoszą Ci więcej w przyszłym roku bez dodatkowej pracy.",
  },
  multilevel: {
    title: "Wielopoziomowo dla twórców open source",
    p1: "Jeśli publikujesz narzędzia lub biblioteki open source, z których korzystają deweloperzy, Twoi użytkownicy sami są deweloperami. Niektórzy z nich będą dalej polecać unbottled.ai. Gdy to robią, Ty też dostajesz udział w tych poleceniach – do 5 poziomów głębokości.",
    p2: "Popularny projekt open source może stworzyć drzewo poleceń, które zarabia pasywnie długo po tym, jak przejdziesz do kolejnej rzeczy. Nie musisz nim zarządzać. Wystarczy, że masz link we właściwym miejscu.",
  },
  crypto: {
    title: "Wypłata w krypto – nie potrzeba konta bankowego",
    p1: "Zarobki można wypłacić w BTC lub USDC. Przetwarzanie w ciągu 48 godzin po zatwierdzeniu. Minimalna wypłata: 40$.",
    p2: "Alternatywnie możesz natychmiast zamienić zarobki na kredyty platformy. Jeśli sam/a używasz unbottled.ai (do asystowania przy kodowaniu, prototypowania, testowania), Twoje zarobki z poleceń kompensują Twoje własne koszty użytkowania.",
  },
  close: {
    title: "Włącz strumień",
    p1: "Już budujesz, piszesz i mówisz o narzędziach AI. Dodanie linku polecającego nic Cię nie kosztuje i zajmuje pięć minut.",
    p2: "Matematyka procentu składanego – cykliczne prowizje, rosnący ARPU, wielopoziomowy łańcuch – działa tym bardziej na Twoją korzyść, im więcej budujesz publicznie.",
    createCode: "Utwórz kod polecający",
    joinDiscord: "Dołącz do Discorda",
    backToBlog: "Wróć do bloga",
  },
};
