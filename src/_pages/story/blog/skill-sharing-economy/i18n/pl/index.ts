import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Stwórz skill. Udostępnij link. Zarabiaj co miesiąc.",
    description:
      "Skille na {{appName}} to wstępnie skonfigurowane ustawienia AI, które tworzysz raz i udostępniasz wszędzie. Link do udostępnienia pozycjonuje Cię w łańcuchu poleceń - 10% + 5% bonus od każdej płatności, jaką ten użytkownik kiedykolwiek wykona.",
    category: "Ekonomia Skilli",
    imageAlt: "Osoba tworząca skille AI i zarabiająca cyklicznie co miesiąc",
    keywords:
      "skille AI, dochód pasywny, program polecający, {{appName}}, własne AI, udostępnianie skilli, ekonomia skilli",
  },
  hero: {
    backToBlog: "Wróć do bloga",
    brand: "{{appName}} - ",
    icon: "✦",
    category: "Ekonomia Skilli",
    readTime: "7 min czytania",
    title: "Stwórz skill. Udostępnij link. Zarabiaj co miesiąc.",
    subtitle:
      "Skonfiguruj ustawienie AI raz. Udostępnij wszędzie. Zarabiaj 10% + 5% cyklicznie od każdej płatności osób, które się przez to zarejestrują, wiecznie.",
    quote:
      '"Zbudowałem/am skill klinicznego rozumowania dla studentów medycyny. Trzy miesiące później opłaca mój własny abonament - i jeszcze zostaje."',
  },
  whatAreSkills: {
    title: "Czym są skille na {{appName}}?",
    p1: "Skill to kompletne ustawienie AI - prompt systemowy, persona towarzysza, wybór modelu dla każdej modalności, głos, ustawienia generowania obrazów - skonfigurowane raz i wielokrotnego użytku wszędzie. Pomyśl o tym jak o przepisie: raz wymyślasz właściwe składniki, potem każdy może z niego skorzystać.",
    p2: "Platforma ma {{modelCount}} modeli: mainstream, open source, niecenzurowane. Każdy skill konfiguruje, który model używać do rozmów, który do wizji, który do generowania obrazów, jakim głosem mówić. Większość użytkowników nigdy nie musi dotykać tych ustawień - po prostu korzysta ze skilla. Ty jako twórca robisz to raz.",
    p3: "Tworzenie skilli jest bezpłatne. Nie potrzeba płatnej subskrypcji. Bez kodowania. Jeśli możesz opisać, co AI ma robić, możesz zbudować skill.",
    buildTitle: "Trzy sposoby budowania skilla",
    build1Title: "Ręcznie na stronie skilla",
    build1Body:
      "Pełna kontrola. Konfiguruj każde ustawienie bezpośrednio. Dobre, gdy dokładnie wiesz, czego chcesz.",
    build2Title: "Poproś Theę lub Hermesa w rozmowie",
    build2Body:
      "Opisz, co próbujesz zbudować. Burza mózgów z nimi - niech nakreślą prompt systemowy, kwestionują Twoje pomysły, iterują. Najlepszy sposób na coś niuansowego. Znają platformę.",
    build3Title: "Dla deweloperów: wygeneruj skill.ts",
    build3Body:
      "Poproś agenta o stworzenie pliku skill. Generuje skill.ts zgodnie z tą samą strukturą co wbudowane skille towarzyszące - gotowe do zatwierdzenia i natychmiastowego użycia.",
  },
  shareLink: {
    title: "Mechanizm linku do udostępnienia - jak faktycznie zarabiasz",
    p1: "Gdy klikniesz Udostępnij i zarabiaj przy dowolnym skilla, dostajesz URL, który robi dwie rzeczy naraz:",
    bullet1:
      "Pokazuje odwiedzającym skill - co robi, jak jest skonfigurowany, jakim rodzajem AI jest",
    bullet2:
      "Pozycjonuje Cię w łańcuchu poleceń - każdy, kto rejestruje się przez ten link, jest przypisany do Ciebie",
    p2: "Oto co ta atrybucja oznacza w praktyce: gdy ktoś rejestruje się przez Twój link do skilla, stajesz się jednocześnie jego bezpośrednim polecającym I twórcą skilla. Zarabiasz 10% każdej płatności, jaką kiedykolwiek wykonają (prowizja bezpośrednia) plus 5% dodatkowe (bonus za skill) - 15% łącznie od tego jednego użytkownika, wiecznie.",
    p3: "To nie jest jednorazowa nagroda. To nie jest bonus za rejestrację. Każde odnowienie subskrypcji, każde doładowanie, każdy zakup - zarabiasz 15% z tego. Pracę wykonałeś/aś raz.",
    p4: "URL wygląda tak: {{appName}}/track?ref=TWOJ_KOD&url=/pl/skill/SKILL_ID",
  },
  examples: {
    title:
      "Skille, które ludzie faktycznie udostępniają - i na których zarabiają",
    p1: "Najskuteczniejsze skille rozwiązują konkretny, powtarzający się problem, który trudno wyjaśnić bez pokazania. Oto wzorce, które działają:",
    example1Title: "Towarzysz-specjalista",
    example1Body:
      "Student medycyny buduje skill, który mówi jak doświadczony kliniczny kolega - przypadki, diagnozy różnicowe, rozumowanie pod presją. Udostępniany na forach medycznych. Każda rejestracja z tej społeczności płaci miesięcznie.",
    example2Title: "Prawdziwy produkt sprzedawcy wiedzy",
    example2Body:
      "Coachowie, konsultanci, twórcy kursów - sprzedawali PDFy i rozmowy przez Zoom. Dobrze zbudowany skill z ich prawdziwą ekspertyzą zarabia cyklicznie bez nakładów. To lepsze niż kurs.",
    example3Title: "Niecenzurowana opcja",
    example3Body:
      "Skille używające niecenzurowanych modeli do kreatywnego pisania, odgrywania ról lub debat. Udostępniane w społecznościach, gdzie cenzura AI jest codzienną frustracją. Wysoka intencja rejestracji.",
    example4Title: "Code reviewer dla dewelopera",
    example4Body:
      "Zna Twój stack, wymusza konwencje Twojego zespołu. Udostępniany w społecznościach inżynierskich pełnych osób wydających 100–200$/mies. na AI. Wartościowe rejestracje, które zostają.",
  },
  theMath: {
    title: "Matematyka: 15% na użytkownika miesięcznie, wiecznie",
    p1: "Gdy ktoś rejestruje się przez Twój link do skilla i subskrybuje, zarabiasz 15% każdej płatności - 10% bezpośrednio + 5% bonus za skill. Nie tylko w pierwszym miesiącu. Każdy miesiąc, tak długo jak są subskrybentami.",
    tableHeaderProfile: "Profil użytkownika",
    tableHeaderSpend: "Miesięczne wydatki",
    tableHeaderEarn: "Zarabiasz/mies. (przez link do skilla)",
    row1Profile: "Okazjonalny użytkownik",
    row1Spend: "~8$/mies.",
    row1Earn: "1,20$/mies.",
    row2Profile: "Regularny subskrybent",
    row2Spend: "20$/mies.",
    row2Earn: "3,00$/mies.",
    row3Profile: "Intensywny użytkownik AI",
    row3Spend: "100$/mies.",
    row3Earn: "15,00$/mies.",
    row4Profile: "Deweloper / power user",
    row4Spend: "200$+/mies.",
    row4Earn: "30,00$+/mies.",
    p2: "Skill jest przynętą. Link jest przychodem. Zarabiasz niezależnie czy ktoś korzysta z Twojego skilla codziennie czy po rejestracji przejdzie na coś innego - atrybucja polecenia zostaje przy Tobie.",
    p3: "Udostępnij skill w pięciu miejscach. Pewien procent kliknie. Pewien procent się zarejestruje. Te rejestracje płacą Ci 15% co miesiąc. W następnym miesiącu udostępnij kolejny skill. Zarobki rosną bez proporcjonalnie więcej pracy.",
  },
  chain: {
    title: "Zarabiasz też gdy Twoi użytkownicy polecają innych",
    p1: "Gdy użytkownicy, których poleciłeś/aś, sami polecają innych, Ty też zarabiasz z tych płatności - do 5 poziomów głębokości, każdy poziom o połowę mniejszy:",
    level1: "Poziom 2 (polecenia Twoich poleceń): ~5% każdej płatności",
    level2: "Poziom 3: ~2,5% każdej płatności",
    level3: "Poziom 4: ~1,25% każdej płatności",
    level4: "Poziom 5: ~0,625% każdej płatności",
    p2: "Uczciwa uwaga: bonusy łańcucha szybko maleją. 15% od bezpośrednich poleceń przez skill to niemal cały Twój dochód. Traktuj zarobki z łańcucha jako bonus - nie optymalizuj dla głębokości, optymalizuj dla jakościowych udostępnień.",
  },
  howTo: {
    title: "5 minut do pierwszego linku do udostępnienia",
    step1Title: "Stwórz lub znajdź skill",
    step1Body:
      "Zbuduj od zera na stronie skilla, poproś Theę lub Hermesa o pomoc w opracowaniu, lub znajdź wbudowany skill wart udostępnienia.",
    step2Title: "Otwórz skill",
    step2Body:
      "Kliknij na skill, żeby zobaczyć stronę szczegółów. Tutaj znajdziesz przycisk Udostępnij i zarabiaj.",
    step3Title: "Wygeneruj link do udostępnienia",
    step3Body:
      "Kliknij Udostępnij i zarabiaj. Jeśli masz kod polecający, wybierz go. Jeśli nie, utwórz go w trzy sekundy. Twój link niesie automatycznie zarówno Twój kod polecający jak i ID skilla - obie prowizje są śledzone automatycznie.",
    step4Title: "Udostępnij tam gdzie to ma znaczenie",
    step4Body:
      "Opublikuj w społecznościach, gdzie ludzie faktycznie skorzystaliby ze skilla - serwery Discord, subreddity, wątki na forach, posty na blogu, kanały Slack. Konkretnie bije szeroko.",
    step5Title: "Obserwuj panel",
    step5Body:
      "Twój panel poleceń pokazuje odwiedzających, rejestracje i zarobki w czasie rzeczywistym. Każda nowa rejestracja przez Twój link to 15% cyklicznego dochodu.",
  },
  close: {
    title: "Skill jest produktem. Link jest przychodem.",
    p1: 'Większość myśli o programach polecających jako generycznych linkach rejestracyjnych. To działa, ale to trudna sprzedaż. "Oto link do platformy AI" nigdzie nie dociera. "Oto AI, która myśli jak doświadczony klinicysta" to coś, co ludzie faktycznie wysyłają.',
    p2: "Buduj to, czego sam/a chciałbyś/chciałabyś używać. Zrób to konkretnym. Potem udostępnij link. 15% zajmie się sobą.",
    createSkill: "Stwórz swój pierwszy skill",
    referralPage: "Ustaw kod polecający",
  },
};
