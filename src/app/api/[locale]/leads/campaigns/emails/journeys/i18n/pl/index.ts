import { translations as componentsTranslations } from "../../components/i18n/pl";
import { translations as resultsTranslations } from "../../results/i18n/pl";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  components: componentsTranslations,
  results: resultsTranslations,
  emailJourneys: {
    components: {
      defaults: {
        signatureName: "Twój Partner w Rozwoju",
      },
      journeyInfo: {
        personalApproach: {
          name: "Podejście Osobiste",
          description:
            "Buduj prawdziwe połączenia poprzez spersonalizowane wiadomości",
        },
        resultsFocused: {
          name: "Skupione na Wynikach",
          description: "Podkreśl konkretne wyniki i mierzalne rezultaty",
        },
        personalResults: {
          name: "Osobiste + Wyniki",
          description:
            "Połącz osobisty akcent z wiadomościami ukierunkowanymi na wyniki",
        },
      },
    },
    leads: {
      journeys: {
        personalPractical: {
          initial: {
            subject: "Zbudujmy razem coś niesamowitego",
            previewText: "Osobista wiadomość o współpracy",
            greeting: "Cześć {{businessName}},",
            personalIntro:
              "Chciałem się do Ciebie zwrócić osobiście, ponieważ wierzę, że możemy wspólnie stworzyć coś naprawdę wartościowego.",
            connectionValue:
              "To, co przyciągnęło moją uwagę do Twojej firmy, to potencjał wzrostu i wpływu, który widzę.",
            practicalTransition:
              "Ale pozwól, że będę praktyczny - prawdopodobnie zastanawiasz się, co to właściwie dla Ciebie oznacza.",
            plansBridge:
              "Oto, co myślę w zakresie konkretnych następnych kroków:",
            ctaText: "Porozmawiajmy o Twoich Celach",
            signature: "Z niecierpliwością czekam na kontakt,",
            signatureClosing: "Z poważaniem",
            postScript:
              "P.S. Bez presji - jeśli termin nie jest odpowiedni, całkowicie rozumiem.",
          },
          followup1: {
            subject: "Twoja mapa drogowa na następne 90 dni",
            previewText: "Rozbicie podróży na praktyczne kroki",
            defaultBusinessName: "tam",
            greeting: "Cześć {{businessName}},",
            personalReflection:
              "Myślałem o naszej potencjalnej współpracy i chciałem podzielić się z Tobą czymś bardziej konkretnym.",
            thoughtProcess:
              "Zamiast ogólnych obietnic, pozwól, że przejdę z Tobą przez to, jak mogłoby wyglądać pierwsze 90 dni:",
            timelineTitle: "Twoja mapa drogowa na 90 dni:",
            week1Title: "Tydzień 1: Fundament",
            week1Content:
              "Usiądziemy i naprawdę zrozumiemy cele i wyzwania Twojej firmy.",
            month2Title: "Miesiąc 2: Implementacja",
            month2Content:
              "To tutaj zaczynamy widzieć prawdziwe tempo budowania.",
            week3Title: "Tydzień 3-4: Szybkie Zwycięstwa",
            week3Content:
              "Zobaczysz pierwsze namacalne rezultaty - zazwyczaj szybciej niż oczekiwano.",
            roadmapIntro:
              "To, co lubię w tym podejściu, to że nie czekasz 6 miesięcy, aby zobaczyć, czy rzeczy działają.",
            personalCommitment:
              "Oto coś, co chcę, żebyś wiedział: jestem osobiście zaangażowany w Twój sukces. To nie jest dla mnie tylko kolejna relacja z klientem.",
            nextSteps:
              "Jeśli to do Ciebie przemawia, porozmawiajmy o tym naprawdę.",
            ctaText: "Zaplanuj Rozmowę Strategiczną",
            signature: "Podekscytowany możliwościami,",
            signatureClosing: "Serdeczne pozdrowienia",
            postScript:
              "P.S. Pomogłem podobnym firmom osiągnąć [konkretny wynik] - chętnie podzielę się tymi historiami, kiedy porozmawiamy.",
          },
          followup2: {
            subject: "Jak faktycznie będziemy współpracować",
            previewText: "Prawdziwe przykłady i elastyczne podejścia",
            defaultBusinessName: "tam",
            greeting: "Cześć {{businessName}},",
            personalContext:
              "Wiem, że jesteś zajęty, więc chciałem podzielić się czymś, co może pomóc Ci zobaczyć, czy dobrze do siebie pasujemy:",
            caseStudyIntro:
              "Niedawno pracowałem z firmą podobną do Twojej. Oto, co się właściwie wydarzyło:",
            methodExplanation:
              "Powodem, dla którego to zadziałało, nie była magia - było to systematyczne podejście do [konkretny obszar].",
            applicationTo:
              "Dla Twojej firmy widzę podobne możliwości, szczególnie w zakresie [konkretna okazja].",
            realResults:
              "Ale oto, co naprawdę się liczy - nie chodzi o to, co zrobiłem dla innych, ale o to, co ma sens dla Ciebie.",
            flexibleOptions:
              "Niektórzy klienci potrzebują intensywnego wsparcia od razu. Inni wolą zacząć od małego i budować od tego. Oba podejścia działają - chodzi o to, co pasuje do Twojej sytuacji.",
            practicalNext:
              "Jeśli jesteś ciekawy, które podejście może być dla Ciebie najlepsze, porozmawiajmy o tym.",
            ctaText: "Omówmy Twoją Sytuację",
            signature: "Tutaj, aby pomóc,",
            postScript:
              "P.S. Jeśli chcesz zobaczyć bardziej konkretne przykłady lub porozmawiać z byłym klientem, po prostu daj mi znać.",
          },
          followup3: {
            subject: "Ostatnia myśl, zanim pójdę",
            previewText: "Ostatnie przemyślenia i otwarte drzwi",
            defaultBusinessName: "tam",
            greeting: "Cześć {{businessName}},",
            finalReflection:
              "Skontaktowałem się kilka razy, ponieważ naprawdę widzę potencjał we wspólnej pracy. Ale wiem też, że timing jest wszystkim.",
            marketTiming:
              "Czasami najlepsze relacje biznesowe zaczynają się, gdy nie jesteś całkiem gotowy - bo wtedy jesteś najbardziej przemyślany przy wyborze właściwej decyzji.",
            personalCommitment:
              "Jeśli w końcu będziemy współpracować, chcę, aby było to dlatego, że to naprawdę ma sens dla Twojej firmy, a nie dlatego, że czułeś się pod presją.",
            practicalOffer:
              "Więc oto moja praktyczna oferta: Jeśli kiedykolwiek chcesz przeprowadzić rozmowę bez presji o celach Twojej firmy, jestem tutaj.",
            noHighPressure:
              "Żadnej prezentacji sprzedażowej. Żadnej twardej sprzedaży. Tylko szczera rozmowa o tym, gdzie chcesz poprowadzić swoją firmę i czy możemy pomóc.",
            finalCTA:
              "Drzwi są otwarte, kiedy tylko będziesz gotowy, aby przez nie przejść.",
            ctaText: "Przeprowadźmy tę rozmowę",
            signature: "Życzę Ci wszystkiego najlepszego,",
            postScript:
              "P.S. Nawet jeśli nigdy nie będziemy współpracować, chciałbym usłyszeć, jak rozwija się Twoja firma. Śmiało pozostań w kontakcie.",
          },
          reactivation: {
            subject: "Coś nowego, czym chciałem się z Tobą podzielić",
            previewText: "Aktualizacje i nowe możliwości",
            defaultBusinessName: "tam",
            greeting: "Cześć {{businessName}},",
            reconnection:
              "Minęło trochę czasu od naszego ostatniego kontaktu i chciałem się z Tobą skontaktować, ponieważ pewne rzeczy się rozwinęły, które uważam, że będą Cię interesować.",
            newDevelopments:
              "Od czasu naszej ostatniej rozmowy opracowaliśmy nowe podejścia, które są szczególnie istotne dla firm takich jak Twoja.",
            specificOffer:
              "To, co jest teraz inne, to to, że udoskonaliliśmy nasz proces na podstawie tego, czego nauczyliśmy się pracując z firmami w Twojej przestrzeni.",
            practicalEvolution:
              "Praktycznym rezultatem jest to, że możemy teraz oferować bardziej ukierunkowane rozwiązania z szybszymi harmonogramami wdrożenia.",
            updatedResults:
              "Ostatni klienci widzą [konkretne nowe wyniki] - co jest znacznie lepsze niż to, co osiągaliśmy wcześniej.",
            investmentUpdate:
              "Powinienem również wspomnieć, że nasza struktura cenowa ewoluowała, aby być bardziej elastyczna i dostępna.",
            personalInvitation:
              "Jeśli jesteś ciekawy tych wydarzeń, naprawdę cieszyłbym się, gdybyśmy mogli się ponownie skontaktować i podzielić się tym, co nowego.",
            ctaText: "Nawiążmy ponownie kontakt",
            signature: "Mam nadzieję, że się odezwiesz,",
            postScript:
              "P.S. Nawet jeśli nie jesteś teraz zainteresowany, chciałbym pozostać w kontakcie i usłyszeć, jak idzie Twoja firma.",
          },
          nurture: {
            subject: "Szybka myśl dla Twojej firmy",
            previewText: "Pomocny wgląd, którym chciałem się podzielić",
            defaultBusinessName: "tam",
            greeting: "Cześć {{businessName}},",
            friendlyCheckIn:
              "Wiem, że jesteś zajęty, więc będę zwięzły. Natknąłem się ostatnio na coś, co sprawiło, że pomyślałem o Twojej firmie.",
            practicalInsight:
              "Zauważyłem, że firmy w Twojej przestrzeni często zmagają się z [konkretnym wyzwaniem]. Te, które odnoszą sukces, zwykle podchodzą do tego [konkretną strategią].",
            specificSuggestion:
              "Dla Twojej konkretnej sytuacji możesz rozważyć [praktyczną sugestię]. To stosunkowo prosta zmiana, która może zrobić prawdziwą różnicę.",
            genuineCare:
              "Dzielę się tym nie jako prezentacją sprzedażową, ale ponieważ naprawdę chcę, aby Twoja firma odniosła sukces - niezależnie od tego, czy współpracujemy, czy nie.",
            helpfulResource:
              "Jeśli chcesz zbadać to dalej, przygotowałem szybki zasób, który może pomóc. Bez zobowiązań.",
            ctaText: "Pobierz zasób",
            signature: "Kibicuję Twojemu sukcesowi,",
            postScript:
              "P.S. Jeśli to nie jest teraz dla Ciebie istotne, śmiało to zignoruj. Sprawdzę znowu kiedyś z czymś innym, co może być przydatne.",
          },
        },
        personal: {
          initial: {
            subject: "Witamy w naszej usłudze",
            previewText: "Rozpoczynanie podróży",
            greeting: "Cześć {{businessName}},",
            intro: "Witamy! Cieszymy się, że jesteś z nami.",
            serviceDescription:
              "Nasza usługa została zaprojektowana, aby pomóc Ci efektywnie osiągnąć swoje cele.",
            convenience: "Wszystko, czego potrzebujesz, na wyciągnięcie ręki.",
            ctaText: "Zacznij",
            signature: "Witamy na pokładzie,",
            postScript:
              "P.S. Jeśli masz jakieś pytania, jesteśmy tutaj, aby pomóc.",
          },
          followup1: {
            subject: "Jak się sprawy mają?",
            previewText: "Sprawdzanie Twoich doświadczeń",
            greeting: "Cześć {{businessName}},",
            intro: "Chciałem sprawdzić, jak się sprawy mają.",
            empathy: "Wiem, że rozpoczęcie czegoś nowego może być wyzwaniem.",
            question: "Jak do tej pory układa się Twoje doświadczenie?",
            socialProof: {
              quote:
                "Ta usługa przekształciła sposób, w jaki pracujemy - nie moglibyśmy być szczęśliwsi!",
              author: "Zadowolony Klient",
            },
            ctaText: "Podziel się opinią",
            signature: "Czekam na wiadomość od Ciebie,",
          },
          followup2: {
            subject: "Nasza historia i misja",
            previewText: "Dlaczego robimy to, co robimy",
            greeting: "Cześć {{businessName}},",
            intro:
              "Chciałem podzielić się trochę o tym, dlaczego robimy to, co robimy.",
            mission:
              "Naszą misją jest uczynienie profesjonalnych usług dostępnymi dla wszystkich.",
            story1:
              "Zaczęliśmy, ponieważ widzieliśmy firmy zmagające się z przestarzałymi rozwiązaniami.",
            story2:
              "Dzisiaj jesteśmy dumni, że pomagamy setkom firm odnieść sukces.",
            ctaText: "Dowiedz się więcej o nas",
            signature: "Z celem,",
            closing: "Dziękujemy, że jesteś częścią naszej podróży.",
          },
          followup3: {
            subject: "Ostatnie sprawdzenie",
            previewText: "Ostatnia wiadomość od nas",
            greeting: "Cześć {{businessName}},",
            intro:
              "To moja ostatnia wiadomość, chyba że chciałbyś nadal otrzymywać wiadomości od nas.",
            reflection:
              "Skontaktowałem się, ponieważ naprawdę wierzę, że moglibyśmy pomóc Twojej firmie.",
            noPressure: "Ale szanuję Twój czas i nie chcę być uciążliwy.",
            ctaText: "Pozostań w kontakcie",
            signature: "Życzę wszystkiego najlepszego,",
            closing: "Drzwi są zawsze otwarte, jeśli później zmienisz zdanie.",
          },
          nurture: {
            subject: "Szybka wskazówka dla Ciebie",
            previewText: "Pomocny wgląd",
            greeting: "Cześć {{businessName}},",
            intro: "Natknąłem się na coś, co uważam, że uznasz za wartościowe.",
            tip: "Oto szybka wskazówka, która może zrobić prawdziwą różnicę:",
            value:
              "Małe zmiany mogą prowadzić do znaczących ulepszeń w czasie.",
            ctaText: "Dowiedz się więcej",
            signature: "Do Twojego sukcesu,",
          },
          reactivation: {
            subject: "Nawiążmy ponownie kontakt",
            previewText: "Chcielibyśmy się ponownie skontaktować",
            greeting: "Cześć {{businessName}},",
            intro: "Minęło trochę czasu - chciałem się skontaktować.",
            checkIn: "Jak sprawy się mają z Twoją firmą?",
            offer: "Mamy kilka nowych ofert, które mogą Cię zainteresować.",
            ctaText: "Odkryj, co nowego",
            signature: "Mam nadzieję, że wkrótce się połączymy,",
            closing: "Czekam na wiadomość od Ciebie.",
          },
        },
      },
    },
  },
};
