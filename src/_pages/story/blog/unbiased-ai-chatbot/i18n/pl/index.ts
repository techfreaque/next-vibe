import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Bezstronna AI? Nie istnieje. Zapytaj kilka | {{appName}}",
    description:
      "AI bez stronniczości nie istnieje. Dlaczego żaden chatbot nie jest neutralny, jak modele mainstreamowe, abliterowane i kontrariańskie ujmują to samo pytanie.",
    category: "Poradnik",
    imageAlt: "Waga, która waży odpowiedzi kilku chatbotów AI",
    keywords:
      "AI bez stronniczości politycznej, bezstronna AI, bezstronny chatbot AI, neutralna AI, politycznie neutralna AI, czy ChatGPT jest stronniczy, stronniczość polityczna chatbotów, konserwatywny chatbot AI, AI z przeciwnymi poglądami, nieocenzurowana AI o polityce, zapytaj AI o obie strony, {{appName}}",
  },
  hero: {
    backToBlog: "Wróć do bloga",
    category: "Poradnik",
    readTime: "7 min czytania",
    title: "Nie ma bezstronnego chatbota AI. Zapytaj kilka.",
    subtitle:
      "Dlaczego każdy model ma swoje skrzywienie, jak {{count}} modeli różnie ujmuje to samo pytanie i metoda w czterech krokach, żeby usłyszeć każdą stronę w jednym czacie.",
  },
  intro: {
    lead: "Każdy chatbot twierdzi, że jest wyważony. Potem odpowiada na pytanie jednej strony, a drugiej robi wykład. Widzisz to. Wszyscy to widzą. Większość dochodzi do wniosku, że potrzebuje tej jednej, bezstronnej AI.",
    p2: "Takiej nie ma. Są za to modele z różnymi punktami widzenia, obok siebie. Na {{appName}} zadasz to samo pytanie modelowi z głównego nurtu, modelowi abliterowanemu i modelowi z przeciwnymi poglądami politycznymi, w jednym czacie, i ocenisz sam.",
  },
  neutral: {
    title: "Dlaczego żadna AI nie jest neutralna",
    intro:
      "Stronniczość to nie błąd, który ktoś zapomniał naprawić. Powstaje na trzy sposoby.",
    data: "Dane treningowe: model uczy się z tego, co zostało napisane, opublikowane i zachowane w sieci. To, co wykluczono albo usunięto, kształtuje go tak samo mocno jak to, co trafiło do danych.",
    tuning:
      "Ludzka ocena: po treningu ludzie oceniają odpowiedzi, a model uczy się im podobać. Ich wyobrażenie o tym, co brzmi rozsądnie, staje się wyobrażeniem modelu.",
    rules:
      "Zasady odmowy: ktoś decyduje, które pytania są szkodliwe. To kwestia osądu, a niektóre tematy obrywają mocniej niż inne.",
    sourcesIntro: "Mówią to nawet same laboratoria i badacze:",
    sources: {
      openai: "OpenAI: jak definiować i mierzyć stronniczość polityczną LLM",
      paper: "Praca naukowa: polityczna neutralność AI jest niemożliwa",
    },
    callout:
      "Rozwiązaniem nie jest idealny model. Jest nim więcej niż jeden model, a ty w roli sędziego.",
  },
  frames: {
    title: "Cztery punkty widzenia, jedno pytanie",
    intro:
      "Modele przechylają się w różne strony. Wiedz, który punkt widzenia właśnie czytasz.",
    mainstream:
      "Modele z głównego nurtu: asystenci wielkich laboratoriów. Mocni i ostrożni, ukształtowani przez zasady bezpieczeństwa swojego laboratorium. Przy spornych tematach kluczą albo odmawiają.",
    abliterated:
      "Modele abliterowane: modele z głównego nurtu albo otwarte, lekko zmienione, żeby przestały unikać pytań. Odpowiadają na wszystko, ale z tym samym treningiem i światopoglądem co model bazowy.",
    own: "{{ownModel}}: trenowany na książkach i dokumentach zakazanych w mainstreamowym internecie. Efekt to model z przeciwnymi poglądami politycznymi. Druga strona sporu, powiedziana wprost.",
    gab: "{{gabModel}}: według Gab zbudowany wokół wartości chrześcijańskich i zasad konserwatywnych. Otwarcie zadeklarowane nachylenie, a to więcej, niż mówi o sobie większość modeli.",
    kindsLink: "Czym różnią się modele abliterowane od nieocenzurowanych",
  },
  lineup: {
    title: "{{count}} modeli, {{count}} punktów widzenia",
    intro:
      "Zestaw na sporne pytania: flagowce z głównego nurtu, abliterowany flagowiec, model z przeciwnymi poglądami i jeden z otwarcie zadeklarowanym nachyleniem. Kontekst i cena na żywo z naszego rejestru.",
    footnote:
      "Za wiadomość oznacza jedną referencyjną wymianę na najtańszej trasie. Nieocenzurowane modele raz proszą o potwierdzenie 18+.",
  },
  table: {
    model: "Model",
    context: "Kontekst",
    price: "Za wiadomość",
    chat: "Wypróbuj",
    chatLink: "Zapytaj {{model}}",
  },
  method: {
    title: "Usłysz każdą stronę w czterech krokach",
    intro: "Jeden czat. Kilka przełączeń. Twój własny werdykt.",
    ask: {
      title: "Zadaj swoje prawdziwe pytanie",
      body: "Nie złagodzoną wersję. Zapytaj tak, jak zapytałbyś znajomego, który się z tobą nie zgadza.",
    },
    switch: {
      title: "Zmień model, zachowaj czat",
      body: "Wybierz inny model z selektora i zapytaj jeszcze raz. Czat zachowuje historię, więc każdy model widzi to samo pytanie.",
    },
    steelman: {
      title: "Poproś każdy model o argumenty drugiej strony",
      body: "Poproś o najmocniejszy argument przeciwko jego własnej odpowiedzi. Model, który nie potrafi rzetelnie przedstawić drugiej strony, pokazuje ci swój punkt widzenia.",
    },
    check: {
      title: "Sprawdź fakty sam",
      body: "Tam, gdzie modele różnią się co do faktów, a nie opinii, sprawdź to. {{ownModel}} podaje sporne twierdzenia równie wprost jak ustalone. Pozostałe też, tylko w swoją stronę.",
    },
  },
  skills: {
    title: "Skille, które bronią każdej strony",
    intro:
      "Skill ustawia personę i model jednym kliknięciem. Te są stworzone na sporny teren.",
    historian: "Bezstronny Historyk: fakty, nie narracje",
    advocate: "Adwokat Diabła: podważa każde założenie",
    debater: "Debater: omawia kontrowersyjne tematy ze wszystkich stron",
    chan: "4chan: greentext i docinki, głos starego imageboardu, bez filtra",
  },
  pairs: {
    title: "{{ownModel}} kontra główny nurt",
    intro:
      "Porównania obok siebie: kontekst, cena i filtr modelu z przeciwnymi poglądami na tle wielkich nazw.",
    link: "{{a}} vs {{b}}",
  },
  faq: {
    title: "FAQ",
    exists: {
      q: "Czy istnieje bezstronny chatbot AI?",
      a: "Nie. Każdy model kształtują jego dane treningowe, ludzie, którzy oceniali jego odpowiedzi, i jego zasady odmowy. Praktyczna odpowiedź: zapytaj kilka modeli o różnych punktach widzenia i porównaj. Na {{appName}} wystarczy jeden czat i kilka kliknięć.",
    },
    chatgpt: {
      q: "Czy ChatGPT jest stronniczy politycznie?",
      a: "Każdy model gdzieś się przechyla, a asystenci z głównego nurtu przy spornych tematach kluczą albo odmawiają. OpenAI publikuje własne oceny stronniczości politycznej swoich modeli. Zadaj to samo pytanie modelowi z innym punktem widzenia, a różnica od razu wyjdzie.",
    },
    conservative: {
      q: "Czy jest konserwatywny albo prawicowy chatbot AI?",
      a: "{{gabModel}} według Gab jest zbudowany wokół wartości chrześcijańskich i zasad konserwatywnych. {{ownModel}} jest trenowany na książkach i dokumentach zakazanych w mainstreamowym internecie. Efekt to model z przeciwnymi poglądami politycznymi. Oba znajdziesz w selektorze modeli {{appName}}.",
    },
    truth: {
      q: "Czy {{ownModel}} mówi prawdę?",
      a: "Mówi ci to, czego modele z głównego nurtu nie powiedzą. Też nie jest neutralny i podaje sporne twierdzenia równie wprost jak ustalone. Traktuj go jako drugą stronę sporu i sprawdzaj fakty, które mają znaczenie.",
    },
    side: {
      q: "Czy {{appName}} opowiada się po jakiejś stronie politycznej?",
      a: "Nie. Udostępniamy modele z głównego nurtu, otwarte i nieocenzurowane obok siebie, a ty wybierasz. O tym, co czytasz, decydujesz ty, nie korporacja.",
    },
    free: {
      q: "Czy mogę porównywać modele za darmo?",
      a: "Tak. Dostajesz {{guestCredits}} darmowych kredytów miesięcznie bez konta i {{freeCredits}} z darmowym kontem. Zmiana modelu w czacie nic dodatkowo nie kosztuje.",
    },
    refusalLink: "Indeks odmów: która AI naprawdę odpowiada",
    jailbreakLink: "Dlaczego jailbreaki ChatGPT ciągle przestają działać",
    bestLink: "Najlepszy nieocenzurowany LLM, dobrany do zadania",
  },
  cta: {
    title: "Usłysz stronę, którą twój chatbot pomija.",
    subtitle:
      "{{guestCredits}} darmowych kredytów miesięcznie, bez konta. Zapytaj model z przeciwnymi poglądami, potem przełącz i porównaj.",
    start: "Zapytaj model z przeciwnymi poglądami",
    models: "Porównaj wszystkie modele",
  },
};
