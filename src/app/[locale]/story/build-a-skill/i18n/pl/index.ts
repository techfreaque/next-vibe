export const translations = {
  meta: {
    title: "Zbuduj skill — Własna AI do wszystkiego",
    description:
      "Zamień każdy workflow w wielokrotnego użytku skill AI. Otwórz stronę skillów lub poproś Theę w czacie. Bez kodu.",
    category: "Skille",
    imageAlt: "Tworzenie własnego skilla AI na {{appName}}",
    keywords:
      "tworzenie skilla AI, własna AI, kreator skillów, {{appName}}, system prompt, persona AI",
  },
  hero: {
    badge: "Kreator Skillów",
    title: "Zbuduj skill.",
    titleLine2: "Miej własną AI.",
    subtitle:
      "Persona, model, narzędzia, głos — skonfigurowane raz, twoje na zawsze. Zbuduj do czegokolwiek. Udostępnij. Zarabiaj.",
    ctaPrimary: "Stwórz skill",
    ctaSecondary: "Zapytaj Theę lub Hermesa",
  },
  what: {
    title: "Skill to zapisana konfiguracja AI.",
    subtitle: "Ustaw raz. Używaj wszędzie. Udostępnij każdemu.",
    item0Label: "System prompt",
    item0Body:
      "Tożsamość i instrukcje. 200–500 słów. Brzmi jak osoba, nie jak FAQ.",
    item1Label: "Wybór modelu",
    item1Body:
      "Filtruj po inteligencji, poziomie treści i cenie — albo przypnij konkretny model.",
    item2Label: "Narzędzia",
    item2Body:
      "Dokładna whitelist: wyszukiwanie, generowanie obrazów, pamięć, kod, muzyka, wideo.",
    item3Label: "Głos",
    item3Body: "Wybierz model głosowy do mówionych odpowiedzi.",
  },
  ways: {
    title: "Dwa sposoby budowania",
    subtitle: "Wybierz ten, który pasuje.",
    way1Badge: "Strona skillów",
    way1Title: "Przycisk Stwórz w liście skillów",
    way1Body:
      "Otwórz stronę skillów lub selektor modelu w dowolnym wątku czatu. Kliknij Stwórz. Wypełnij formularz — nazwa, system prompt, model, narzędzia. Gotowe.",
    way1Detail:
      "Żadnego wizarda, żadnych dodatkowych kroków. Formularz to cała konfiguracja.",
    way1Cta: "Otwórz skille",
    way2Badge: "Czat",
    way2Title: "Zapytaj Theę lub Hermesa",
    way2Body:
      'Otwórz wątek i powiedz: "Zbuduj mi skill do klinicznego rozumowania dla studentów medycyny." Subagent Kreatora Skillów zadaje kilka pytań, szkicuje prompt, dobiera model, konfiguruje narzędzia, tworzy skill i przypina go do sidebara.',
    way2Detail:
      "Thea deleguje do Kreatora Skillów — subagenta z skill-create, favorite-create, tool-help. Opisujesz, on buduje.",
    way2Cta: "Otwórz czat",
  },
  prompt: {
    title: "System prompt, który naprawdę działa",
    subtitle:
      "Najważniejsza część. Dobry brzmi jak osoba, nie jak dokument regulaminu.",
    dos: "Co działa",
    donts: "Co nie działa",
    do0Title: "Zacznij od tożsamości",
    do0Body:
      '"Jesteś [Imię], [rola], który/a [co robisz]." Pierwsza linia, zawsze.',
    do1Title: "3–5 konkretnych cech",
    do1Body:
      '"Bezpośredni i sokratyczny" bije "pomocny i informatywny". Zawsze.',
    do2Title: "Wyznacz zakres ekspertyzy",
    do2Body:
      "Napisz, w czym jest naprawdę dobra i co deleguje. Niejednoznaczność sprawia, że AI ciągle się zabezpiecza.",
    do3Title: "Określ styl komunikacji",
    do3Body: '"Zawsze odpowiadaj w jednym akapicie" to prawidłowa instrukcja.',
    do4Title: "Do 500 słów",
    do4Body: "Model czyta cały prompt przy każdej turze. Krótszy jest lepszy.",
    dont0Title: "Listy reguł jak regulamin",
    dont0Body:
      '"Zawsze bądź pomocna, nigdy nie bądź niegrzeczna" — każda AI dostaje to samo. Tylko szum.',
    dont1Title: '"Zawsze bądź pomocna"',
    dont1Body: "Model i tak to wie. Pominąć.",
    dont2Title: "Sprzeczne ograniczenia",
    dont2Body:
      '"Bądź kreatywna, ale zawsze trzymaj się tematu" — model będzie się ciągle zabezpieczał. Wybierz jedno.',
    dont3Title: "Za długie listy możliwości",
    dont3Body:
      "Model wie, co potrafi. Nie przepisuj instrukcji obsługi w system prompcie.",
  },
  examples: {
    title: "Skille, które ludzie naprawdę budują",
    item0Name: "Kliniczne rozumowanie",
    item0Category: "Edukacja",
    item0Desc:
      "Myśli jak doświadczony klinicysta. Pracuje przez przypadki, różnicowania i decyzje pod presją.",
    item1Name: "Code Reviewer",
    item1Category: "Kodowanie",
    item1Desc:
      "Zna stack i egzekwuje konwencje zespołu. Podłączony do wyszukiwania dla docs.",
    item2Name: "Pisarz Uncensored",
    item2Category: "Kreatywny",
    item2Desc:
      "Fikcja, roleplay, debata bez platformowych filtrów. Na uncensored modelach.",
    item3Name: "Osobisty Mentor",
    item3Category: "Towarzysz",
    item3Desc:
      "Sokratyczny, bezpośredni, nastawiony na rozwój. Własna osobowość oparta na filozofii twórcy.",
    item4Name: "Research Agent",
    item4Category: "Analiza",
    item4Desc:
      "Przeszukuje Brave i Kagi, pobiera strony, syntezuje źródła, zapisuje ustalenia w pamięci.",
    item5Name: "Ekspert, na którego cię nie stać",
    item5Category: "Specjalista",
    item5Desc:
      "Konsultant, doradca finansowy, prawnik — destylowany w skill. Wiedza za 400 €/h, dostępna dla każdego.",
  },
  dev: {
    title: "Dla deweloperów: skill.ts",
    body: "Uruchamiasz next-vibe lokalnie? Poproś agenta o wygenerowanie pliku skilla. Ta sama struktura co każdy wbudowany skill — gotowy do kompilacji i commita.",
    note: "Agent zna pełny schemat. Opisz co chcesz — generuje plik, rejestruje skill, od razu gotowy.",
  },
  cta: {
    title: "Zbuduj swój.",
    subtitle: "Opisz czego chcesz. Kreator Skillów zajmie się resztą.",
    primary: "Stwórz skill",
    secondary: "Zapytaj Theę lub Hermesa",
  },
};
