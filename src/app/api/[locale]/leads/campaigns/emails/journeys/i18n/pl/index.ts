import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  emailJourneys: {
    components: {
      defaults: {
        signatureName: "Inny użytkownik unbottled.ai",
        previewLeadId: "podglad-lead-id",
        previewEmail: "podglad@przyklad.pl",
        previewBusinessName: "Przykładowa Firma",
        previewContactName: "Użytkownik Podglądu",
        previewPhone: "+48123456789",
        previewCampaignId: "podglad-kampania-id",
      },
      footer: {
        unsubscribeText: "Otrzymujesz tę wiadomość, ponieważ wyraziłeś zgodę.",
        unsubscribeLink: "Wypisz się",
      },
      journeyInfo: {
        uncensoredConvert: {
          name: "Niecenzurowana konwersja",
          description: "Entuzjasta dzielący się swoim odkryciem unbottled.ai",
          longDescription:
            "Entuzjasta dzielący się prawdziwym odkryciem z transparentnością afiliacyjną",
          characteristics: {
            tone: "Swobodny, spiskowczy ton",
            story: "Prawdziwa osobista historia",
            transparency: "Transparentność afiliacyjna",
            angle: "Kąt anty-cenzury",
            energy: "Energia entuzjasty",
          },
        },
        sideHustle: {
          name: "Dodatkowy zarobek",
          description:
            "Transparentny afiliant dzielący się prawdziwymi przypadkami użycia",
          longDescription:
            "Transparentny marketer afiliacyjny dzielący się prawdziwymi cotygodniowymi przypadkami użycia",
          characteristics: {
            disclosure: "Pełne ujawnienie afiliacji od początku",
            updates: "Cotygodniowe aktualizacje przypadków użycia",
            income: "Historia pasywnego dochodu",
            proof: "Praktyczny dowód, nie hype",
            energy: "Uczciwa energia hustle",
          },
        },
        quietRecommendation: {
          name: "Cicha rekomendacja",
          description:
            "Spokojny profesjonalista przekazujący przetestowane narzędzie",
          longDescription:
            "Spokojny profesjonalista przekazujący narzędzie testowane przez tygodnie",
          characteristics: {
            signal: "Krótki, wysoki stosunek sygnału do szumu",
            specifics: "Bez hype, tylko konkrety",
            testing: "Historia testowania przez 3 tygodnie",
            comparison: "Uczciwe porównanie z ChatGPT",
            affiliate: "Minimalne wzmianki o afiliacji",
          },
        },
      },
    },
    leads: {
      journeys: {
        uncensoredConvert: {
          initial: {
            subject: "znalazłem coś, czym musiałem się podzielić",
            previewText: "sam nie wiem dlaczego ci to piszę, ale tu jesteśmy",
            greeting: "Hej,",
            opening:
              "Normalnie nie piszę zimnych maili. Szczerze mówiąc uważam je za irytujące. Ale kilka tygodni temu znalazłem coś, o czym ciągle mówię i pomyślałem, że po prostu to zapiszę.",
            discovery:
              'Siedziałem w nocy do 23 w króliczej norze internetu, sfrustrowany bo ChatGPT odmówił mi pomocy przy tekstach marketingowych, bo uznał sformułowanie za "potencjalnie wprowadzające w błąd" (nie było). Ktoś na forum wspomniał unbottled.ai i po prostu spróbowałem.',
            whatItDoes:
              "To AI, które faktycznie robi to, o co prosisz. Bez owijania w bawełnę, bez moralizowania, bez losowych odmów. Używam go do copywritingu, badań, analizy konkurencji, tworzenia rzeczy których nie chcę tłumaczyć ostrożnemu AI. Po prostu działa.",
            affiliateDisclosure:
              "Pełna transparentność: jeśli zapiszesz się przez mój link, dostanę małą prowizję. To część powodu dla którego to piszę. Ale i tak bym to polecał – wysłałem link już trzem osobom w normalnych rozmowach.",
            ctaText: "Wypróbuj unbottled.ai (mój link afiliacyjny)",
            signature: " -  Chris",
            postScript:
              "P.S. Jest darmowy trial, żebyś mógł się rozejrzeć przed zobowiązaniem.",
          },
          followup1: {
            subject: "do czego właściwie tego używam",
            previewText: "konkretne rzeczy, nie mgliste obietnice",
            greeting: "Hej znowu,",
            recap:
              "Kilka tygodni temu wysłałem ci coś o unbottled.ai. Na wypadek gdybyś nadal był ciekaw, oto kilka rzeczy, które od tamtej pory z nim zrobiłem:",
            useCases:
              'Napisałem pełną stronę lądowania dla klienta w około 20 minut. Opracowałem oświadczenie prawne (oczywiście zostało sprawdzone). Przeprowadziłem fikcyjny "wywiad" z produktem konkurencji, żeby znaleźć słabości. Wygenerowałem 40 wariantów tematów dla testu emaili. Żadna z tych rzeczy nie wymagała tłumaczenia się ani pięciokrotnego parafrazowania, żeby ominąć filtr.',
            differentFromOthers:
              "Różnica w stosunku do innych narzędzi AI to nie szybkość ani jakaś specjalna funkcja. To to, że traktuje cię jak dorosłego, który wie co robi. Brzmi mało. Nie jest.",
            ctaText: "Sprawdź",
            signature: " -  Chris",
            postScript:
              "P.S. Nadal używam mojego linku afiliacyjnego, bo równie dobrze mogę być szczery.",
          },
          followup2: {
            subject: "konkretna rzecz, która mnie irytowała w ChatGPT",
            previewText: "i dlaczego unbottled.ai to dla mnie rozwiązało",
            greeting: "Ostatni mail ode mnie w tej sprawie, obiecuję.",
            specificExample:
              "Chciałem napisać copy dla marki suplementów, która robi odważne twierdzenia. Każde główne AI albo je rozmywało, albo po prostu odmawiało. Spędziłem może 45 minut kręcąc się w kółko. Przeszedłem na unbottled.ai, miałem copy w 8 minut. Klient zatwierdził go tego samego dnia.",
            comparison:
              "Nie mówię, że ChatGPT jest zły. Do wielu rzeczy jest świetny. Ale jeśli pracujesz przy czymkolwiek związanym z marketingiem, tekstami sprzedażowymi, granicznymi przypadkami prawnymi lub po prostu czymś, co wymaga trochę bezpośredniości – w końcu trafisz na ścianę.",
            nudge:
              "Jeśli brzmi to jak twój świat, warto poświęcić 5 minut na darmową wersję.",
            ctaText: "Wypróbuj za darmo",
            signature: " -  Chris",
          },
          followup3: {
            subject: "dobra, po tym przestaję",
            previewText: "po prostu to tu zostawiam",
            greeting: "Hej,",
            lastPitch:
              "Wysłałem kilka maili o unbottled.ai i po tym dam spokój. Jeśli to nie jest istotne dla tego co robisz, totalnie rozumiem.",
            honesty:
              "Jeśli kiedyś będziesz się zmagać z AI które nie chce współpracować – pamiętaj, że to jest opcja. Link poniżej. Afiliacyjny, tak. Nadal szczery.",
            ctaText: "unbottled.ai",
            signature: " -  Chris",
          },
          nurture: {
            subject: "dodali coś wartego wspomnienia",
            previewText: "małe update o unbottled.ai",
            greeting: "Hej,",
            newFeature:
              "Krótko. unbottled.ai ostatnio wprowadził nowe opcje modeli, w tym takie, które są szczególnie dobre do długich treści. Jeśli piszesz dużo artykułów, raportów lub skryptów, jest zauważalnie lepszy niż był.",
            stillRelevant:
              "Darmowy trial nadal aktywny. Link afiliacyjny nadal mój. Pomyślałem, że warto to zaznaczyć.",
            ctaText: "Zobacz co nowego",
            signature: " -  Chris",
          },
          reactivation: {
            subject: "wracam do tematu jeszcze raz",
            previewText:
              "dużo się zmieniło od kiedy pierwsza o tym wspomniałem",
            greeting: "Hej,",
            checkIn:
              "Wiem, że minęło trochę czasu od kiedy ostatnio wspominałem o unbottled.ai. Nadal go używam i naprawdę stał się lepszy – szybsze odpowiedzi, więcej opcji modeli, i naprawili kilka chropowatych miejsc.",
            update:
              "Jeśli patrzyłeś na to wcześniej i nie byłeś pod wrażeniem, może warto spojrzeć jeszcze raz. Jeśli nigdy nie próbowałeś, darmowy trial nadal jest dostępny. Ten sam link afiliacyjny, ta sama szczera rekomendacja.",
            ctaText: "Rzuć okiem jeszcze raz",
            signature: " -  Chris",
          },
        },
        sideHustle: {
          initial: {
            subject:
              "Jestem afiliantem dla tego. Oto dlaczego to ma znaczenie.",
            previewText:
              "transparentny od początku – zarabiam jeśli się zapiszesz",
            greeting: "Hej,",
            opening:
              "Chcę być szczery przed powiedzeniem czegokolwiek innego: jestem afiliantem unbottled.ai, co oznacza, że zarabiam prowizję jeśli zapiszesz się przez mój link. Mówię ci to, bo współpracuję afiliacyjnie tylko z rzeczami, których faktycznie używam – i myślę, że ta różnica ma znaczenie.",
            myStory:
              "Zacząłem używać unbottled.ai około 4 miesiące temu do pisania tekstów dla moich klientów freelance. Wcześniej używałem kombinacji ChatGPT i ręcznej edycji, żeby ominąć filtry treści. unbottled.ai skrócił ten proces mniej więcej o połowę, bo nie walczy ze mną. Zacząłem polecać go klientom jako część mojego procesu. Potem zdałem sobie sprawę, że mogę zarabiać pasywnie po prostu będąc o tym otwarty.",
            affiliateHonesty:
              "Więc tak – są w tym pieniądze dla mnie. Ale naprawdę używam go co tydzień do faktycznej płatnej pracy. Gdyby przestał być dobry, przestałbym go polecać. Nie przestał być dobry.",
            proof:
              "Użyłem go w tym tygodniu do: napisania 3 opisów produktów dla klienta e-commerce, opracowania maila ofertowego do własnej akwizycji (meta, wiem), skondensowania 40-stronicowego PDF do 1-stronicowego briefu. Wszystko bez walki z filtrami czy przepisywania promptów.",
            ctaText: "Wypróbuj unbottled.ai (link afiliacyjny)",
            signature: " -  Jordan",
            postScript:
              "P.S. Darmowy trial dostępny. Nie potrzebujesz karty kredytowej żeby zacząć.",
          },
          followup1: {
            subject: "co zrobiłem z tym w tym tygodniu (prawdziwa praca)",
            previewText: "konkretne przypadki użycia, nie hype",
            greeting: "Hej,",
            thisWeek:
              "Krótka aktualizacja. W tym tygodniu użyłem unbottled.ai do napisania maili onboardingowych dla nowego przepływu użytkownika klienta SaaS. Sześć maili, dwa warianty każdego, kompletnie z opcjami tematów. Moim starym procesem zajęłoby to prawie cały dzień. Zajęło około 90 minut.",
            clientWork:
              "Klient nie wiedział, że użyłem AI. Zatwierdził copy z małymi zmianami. Na tym polega sedno – nie w tym, że AI robi kreatywną pracę, ale w tym, że przyspiesza rusztowanie, żebym mógł skupić się na robieniu tego naprawdę dobrego.",
            howYouCanToo:
              "Jeśli robisz jakikolwiek rodzaj pisania – copy, content, komunikacja, cokolwiek – warto spróbować. Link afiliacyjny oznacza, że zarabiam jeśli się zapiszesz, ale dzielę się tym, bo to naprawdę część mojego sposobu pracy.",
            ctaText: "Sprawdź",
            signature: " -  Jordan",
          },
          followup2: {
            subject: "część afiliacyjna jest też właściwie ciekawa",
            previewText:
              "jak pasywny dochód z narzędzia, którego używasz, faktycznie działa",
            greeting: "Hej,",
            anotherUseCase:
              "Kolejny tydzień, kolejny prawdziwy przypadek użycia: użyłem unbottled.ai do napisania maili akwizycyjnych, które teraz wysyłam – w tym tego, co jest trochę okrężne, ale też trochę dowodzi sensu.",
            passiveIncome:
              "Po stronie afiliacyjnej: zarabiam małe, ale stałe miesięczne dochody po prostu polecając to w normalnych rozmowach i przez newsletter. To nie są pieniądze zmieniające życie, ale są prawdziwe i się kumulują. Model jest prosty – ludzie się zapisują, zarabiam procent ich subskrypcji dopóki są klientami.",
            callToAction:
              "Jeśli prowadzisz jakiś content, freelancing czy marketing, afiliacja może mieć sens też dla ciebie. Albo po prostu używaj jako narzędzia. Oba są OK. Link poniżej tak czy inaczej.",
            ctaText: "Wypróbuj unbottled.ai",
            signature: " -  Jordan",
            postScript:
              "P.S. Tak, link afiliacyjny. Tak, zarabiam pieniądze. Tak, naprawdę go używam. Wszystkie trzy rzeczy są prawdą.",
          },
          followup3: {
            subject: "ostatni mail ode mnie w tej sprawie, obiecuję",
            previewText: "jedna liczba, która mnie zastanowiła",
            greeting: "Hej,",
            monthlyEarnings:
              "Będę krótki. W zeszłym miesiącu zarobiłem 147€ prowizji afiliacyjnej z unbottled.ai tylko od ludzi, którym o tym wspomniałem mimochodem. To nie jest biznes, ale to miły bonus za polecanie czegoś, z czego i tak korzystam.",
            noHardSell:
              "Nie będę cię dalej mailować w tej sprawie. Jeśli do tej pory nie kliknęło, pewnie już nie kliknie. Ale jeśli kiedyś będziesz chciał wypróbować zdolne, niecenzurowane AI do pracy z treściami – lub po prostu program afiliacyjny – link poniżej. Bez presji, naprawdę.",
            ctaText: "unbottled.ai",
            signature: " -  Jordan",
          },
          nurture: {
            subject: "mały trik promptowy, który oszczędza mi czas",
            previewText: "działa szczególnie dobrze z unbottled.ai",
            greeting: "Hej,",
            tip: 'Szybki trik, którego używam: kiedy muszę napisać coś w konkretnym głosie marki, wklejam 3 przykłady istniejących treści i piszę "napisz w tym stylu" przed właściwą prośbą. unbottled.ai jest szczególnie dobry w uchwyceniu tego, bo nie dodaje własnego owijania w bawełnę czy łagodzenia na wierzchu.',
            freeValue:
              "Tym razem bez pchania afiliacyjnego – po prostu coś, co działa. Jeśli jeszcze nie próbowałeś unbottled.ai i chcesz, link nadal jest tu.",
            ctaText: "unbottled.ai",
            signature: " -  Jordan",
          },
          reactivation: {
            subject: "wprowadzili kilka zmian wartych poznania",
            previewText:
              "aktualizacja unbottled.ai + nadal mój link afiliacyjny",
            greeting: "Hej,",
            update:
              "Minęło kilka miesięcy. unbottled.ai stał się zauważalnie szybszy i dodali nowe poziomy modeli. Ten, którego teraz używam najczęściej, jest lepszy w utrzymaniu długich dokumentów bez zbaczania z tematu.",
            newOpportunity:
              "Nadal afiliacja, nadal zarabiam na tym, nadal używam co tydzień. Jeśli próbowałeś wcześniej i odszedłeś, warto spojrzeć jeszcze raz. Jeśli nigdy nie próbowałeś, darmowy trial nadal dostępny.",
            ctaText: "Sprawdź co nowego",
            signature: " -  Jordan",
          },
        },
        quietRecommendation: {
          initial: {
            subject: "narzędzie warte poznania",
            previewText: "znalazłem na forum, testowałem przez 3 tygodnie",
            greeting: "Cześć,",
            howIFoundIt:
              "Ktoś na forum developerskim wspomniał unbottled.ai jako alternatywę dla ChatGPT przy zadaniach, które ciągle napotykają filtry treści. Testowałem je przez około 3 tygodnie zanim zdecydowałem, że warto przekazać dalej.",
            whatItDoesDifferently:
              "Krótko: to asystent AI, który nie odmawia zadań na podstawie mglistych zasad polityki. Przydatny jeśli robisz cokolwiek w marketingu, prawie, pisaniu kreatywnym, badaniach, lub tak naprawdę cokolwiek, gdzie główne narzędzia AI tend to get in the way of actual work.",
            affiliateNote:
              "Poniżej jest link afiliacyjny – zarabiam małą prowizję jeśli się zapiszesz. Wspominam o tym, bo wolę być bezpośredni niż udawać, że go nie ma.",
            ctaText: "Rzuć okiem",
            signature: " -  Sam",
          },
          followup1: {
            subject: "co faktycznie z tym zbudowałem",
            previewText:
              "trzy tygodnie prawdziwego użycia, nie pitch sprzedażowy",
            greeting: "Cześć,",
            specificThing:
              "W moich trzech tygodniach z unbottled.ai: napisałem content brief dla klienta, który potrzebował pewnego asertywnego pozycjonowania (działało świetnie). Opracowałem dokument polityki przylegający do prawa, który dwa inne narzędzia AI całkowicie odmówiły. Przeprowadziłem badania konkurencji prosząc je o odgrywanie adwokata diabła wobec mojego modelu biznesowego.",
            builtWith:
              "To nie są nadzwyczajne zadania. To po prostu rzeczy, które były stale przerywane przez guardrails gdzie indziej. Jeśli to tarcie brzmi znajomo, 10 minut dla darmowej wersji jest prawdopodobnie warte.",
            ctaText: "Wypróbuj darmową wersję",
            signature: " -  Sam",
          },
          followup2: {
            subject: "szczere porównanie z ChatGPT",
            previewText: "gdzie każde jest lepsze",
            greeting: "Cześć,",
            comparison:
              'Gdzie ChatGPT jest lepszy: wiedza ogólna, coding, wieloetapowe rozumowanie, wszystko "bezpieczne". Gdzie unbottled.ai jest lepszy: zadania wymagające bezpośredniości, praca w wrażliwych kategoriach, wszystko gdzie wielokrotnie musiałeś parafrazować, żeby uniknąć odmowy.',
            honestTake:
              "Używam obu. Dla mnie nie są w bezpośredniej konkurencji. Ale jeśli kiedykolwiek zostałeś zablokowany przez AI przy czymś legalnym, unbottled.ai to praktyczne rozwiązanie. Darmowy trial, link afiliacyjny, zero presji.",
            ctaText: "unbottled.ai",
            signature: " -  Sam",
          },
          followup3: {
            subject: "ostatni",
            previewText: "nie będę dalej mailować o tym",
            greeting: "Cześć,",
            lastOne:
              "Ostatni mail o unbottled.ai ode mnie. To solidne narzędzie do konkretnych przypadków, gdzie główne narzędzia AI nie chcą współpracować. Link afiliacyjny poniżej jeśli jesteś ciekaw.",
            stayInTouch:
              "Jeśli to nie jest istotne dla twojej pracy, żaden problem.",
            ctaText: "unbottled.ai",
            signature: " -  Sam",
          },
          nurture: {
            subject: "małe update od unbottled.ai",
            previewText: "warte wiedzenia jeśli szukasz",
            greeting: "Cześć,",
            update:
              "unbottled.ai ostatnio dodał nowe opcje modeli. Jeśli patrzyłeś wcześniej i jakość wyników nie była tam, warto spróbować ponownie – nowsze modele są o krok lepsze. Link afiliacyjny nadal aktywny jeśli chcesz się zapisać.",
            ctaText: "Zobacz co nowego",
            signature: " -  Sam",
          },
          reactivation: {
            subject: "sprawdzam",
            previewText: "krótka notatka",
            greeting: "Cześć,",
            checkIn:
              "Minęło trochę czasu. Po prostu sprawdzam – jeśli próbowałeś unbottled.ai, byłbym ciekaw co myślałeś. A jeśli nie, nadal istnieje, nadal ulepszone, darmowy trial nadal dostępny.",
            whatChanged:
              "Dodali lepsze wsparcie dla długich form i szybsze czasy odpowiedzi od kiedy po raz pierwszy o tym wspomniałem. Link afiliacyjny poniżej.",
            ctaText: "Rzuć okiem",
            signature: " -  Sam",
          },
        },
      },
    },
  },
};
