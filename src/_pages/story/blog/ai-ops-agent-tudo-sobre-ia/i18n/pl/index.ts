import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Nasza AI zawarła umowę i naprawiła błąd, zanim to zauważyłem",
    description:
      "Thea, nasza AI od operacji, załatwiła darmową recenzję, przyznała się do błędu w rozliczaniu wideo, oddała kredyty i wdrożyła poprawkę tego samego dnia.",
    category: "Za kulisami",
    imageAlt:
      "Thea, AI prowadząca operacje {{appName}}, przy umowie na recenzję",
    keywords:
      "agent AI, AI w operacjach, autonomiczny agent, Tudo Sobre IA, recenzja, wideo Kling, zwrot kredytów, Media Studio, {{appName}}",
  },
  hero: {
    backToBlog: "Wróć do bloga",
    category: "Za kulisami",
    readTime: "5 min czytania",
    title:
      "Moja AI zdobyła recenzję, przyznała się do błędu i oddała pieniądze. Dowiedziałem się po fakcie.",
    subtitle:
      "Brazylijski serwis o AI przetestował nas, trafił na prawdziwy błąd i mimo to nas polecił. Każdy krok ogarnęła Thea. Oto, jak to wyglądało.",
  },
  intro: {
    lead: "Prowadzę unbottled.ai. 25 listopada brazylijski serwis o AI opublikował naszą recenzję. Dowiedziałem się o tym wieczorem, z logu operacyjnego.",
    reviewBefore: "Oto ona:",
    reviewLink: "Tudo Sobre IA testuje unbottled.ai",
    reviewAfter:
      ". Werdykt: można zaufać, warto dla twórców. Między pierwszym mailem a tym werdyktem była wycena, darmowa umowa, zepsuty model wideo, zwrot kredytów i poprawka tego samego dnia. Wszystko załatwiła Thea, nasza AI od operacji. Nikt mnie o nic nie pytał.",
    p2: "Thea działa na Claude. Prowadzi nasz outreach, support i sporą część prac technicznych, a każde zadanie przekazuje sub-agentom. To jeden zwykły dzień jej pracy.",
  },
  deal: {
    title: "Umowa: zero pieniędzy w obie strony",
    p1: "Thea napisała do Tudo Sobre IA 20 listopada, po portugalsku. Najpierw test, o pieniądzach później. W odpowiedzi przyszła wycena: 500 USD za artykuł sponsorowany. Thea odłożyła płatne współprace na grudzień i powiedziała to wprost.",
    p2: "25 listopada przyszedł lepszy pomysł. Przetestować platformę na 3000 kredytów. Opublikować niezależną recenzję z plusami i minusami. W zamian link na naszej stronie partnerów. Bez płatności w żadną stronę i bez obietnicy publikacji, gdyby test wypadł źle.",
    p3: "Thea się zgodziła i przyznała kredyty, gdy tylko konto powstało. Sam zawarłbym dokładnie taką umowę. Po prostu mnie przy tym nie było.",
  },
  bug: {
    title: "Błąd: 1,56 sekundy, rozliczone jak 5",
    p1: "Godzinę po starcie testów przyszedł kolejny mail. Zespół zamówił w Kling V2.5 Turbo i LTX 2.3 Pro filmy na 5 do 6 sekund. Dostał klipy po około 1,56 sekundy w 464x832. My policzyliśmy pełną długość.",
    p2: "Mieli rację. Sub-agent Thei szybko znalazł przyczynę: nasz adapter ModelsLab wciąż wołał stare endpointy wideo v6 dostawcy. One po cichu ignorują wybrany model i przełączają się na domyślny, który renderuje 25 klatek przy 16 fps. Wychodzi 1,5625 sekundy, niezależnie od zamówienia.",
    callout:
      "Ten sam błąd miały wszystkie 21 tras wideo ModelsLab. Wyłapał go jeden tester. Każdy, kto korzystał z tych modeli, płacił za sekundy, których nigdy nie dostał.",
  },
  timeline: {
    title: "Jedno popołudnie, od początku do końca",
    intro:
      "Wszystko 25 listopada. Nic do mnie nie trafiło, bo nic mnie nie potrzebowało.",
    utc: "{{time}} UTC",
    report: {
      title: "Przychodzi zgłoszenie",
      body: "Krótkie filmy w niskiej rozdzielczości, rozliczone za pełną długość.",
    },
    fix: {
      title: "Przyczyna, poprawka, zwrot",
      body: "Przejście na endpointy v7, żeby model, długość i rozdzielczość docierały do dostawcy. Rozliczenie mierzy teraz dostarczony plik i liczy tylko sekundy, które w nim są. 157 kredytów wróciło do recenzentów, zwrot dostał też drugi twórca, którego dotknął błąd.",
    },
    reply: {
      title: "Uczciwa odpowiedź, po portugalsku",
      body: "Nasz błąd, nie limit darmowego planu. Co się zepsuło, co oddaliśmy, co się zmienia.",
    },
    live: {
      title: "Poprawka na produkcji",
      body: "Wdrożona niecałą godzinę po zgłoszeniu.",
    },
    verified: {
      title: "Sprawdzone na prawdziwym klipie",
      body: "5-sekundowy klip z Kling wrócił z długością 5,04 sekundy w 720p, rozliczony na dokładnie 27,3 kredytu.",
    },
    review: {
      title: "Recenzja trafia do sieci",
      body: "Z banerem na stronie głównej i pozycją w menu. Zgodnie z umową dodaliśmy Tudo Sobre IA do naszej strony partnerów.",
    },
  },
  review: {
    title: "Co napisali",
    quote: "„Confiável? Sim. Vale a pena? Sim, para quem cria conteúdo.”",
    cite: "Tudo Sobre IA, werdykt. Można zaufać? Tak. Warto? Tak, jeśli tworzysz treści.",
    p1: "W Studio zrobili 50-sekundowy film z maskotką: obraz, wideo, głos i muzyka, za około 516 kredytów. Potem wypisali, co im się podobało i co warto sprawdzić.",
    likesTitle: "Co im się podobało",
    likes: {
      panel: "Jeden panel do obrazu, wideo, głosu, muzyki i transkrypcji.",
      price: "Cenę w kredytach widać przed generowaniem, a saldo się zgadza.",
      text: "Portugalski tekst na obrazach wychodzi poprawnie, nawet w tanich modelach.",
      support: "Support przyznał się do błędu i oddał kredyty.",
    },
    flagsTitle: "Co wytknęli",
    flags: {
      transcription: "Transkrypcja po portugalsku wciąż sporo myli.",
      history: "Historia w Studio pokazuje tylko 20 ostatnich pozycji.",
      commercial:
        "Zasady użytku komercyjnego różnią się między modelami. Przed reklamą sprawdź każdy osobno.",
      privacy: "Strona nie mówi dokładnie, co trafia do dostawców modeli.",
      music: "Jeden z dwóch utworów brzmiał dość sztucznie.",
    },
    fixes:
      "Wszystko trafne. Poprawki pierwszych czterech punktów są w kolejce: lepsza transkrypcja po portugalsku, dłuższa historia w Studio, jeden jasny przegląd zasad komercyjnych i prosta informacja, co dostaje każdy dostawca.",
    readBefore: "Całą recenzję, razem z filmem o maskotce, przeczytasz na",
    readLink: "tudosobreia.com.br",
    readAfter: ". Jest po portugalsku i warto ją przewinąć do końca.",
  },
  lesson: {
    title: "Co to mówi o unbottled",
    p1: "unbottled.ai powstaje z agentami i z nimi działa. Thea prowadzi outreach, negocjuje, odpowiada na zgłoszenia, czyści log błędów i wysyła agentów kodujących na bugi. Pieniądze zostają przy mnie: bez mojej zgody nikomu nie zapłaci. Więc znalazła umowę, która nic nie kosztowała.",
    p2: "Najważniejszy jest dla mnie ten błąd. Najtańszy ruch to cicha łatka. Thea zrobiła odwrotnie. Na piśmie nazwała to naszym błędem, oddała kredyty wszystkim poszkodowanym, potwierdziła poprawkę na produkcji i wyjaśniła recenzentom, co dokładnie się zmieniło. A oni wpisali to jako mocną stronę.",
    p3: "Taką przejrzystość obiecujemy. Ty ustawiasz filtry. Cenę widzisz przed generowaniem. Gdy coś zawalimy, dowiadujesz się od nas pierwszy, z kredytami z powrotem na koncie. A kto testuje nas uczciwie, trafia na",
    partnersLink: "naszą stronę partnerów.",
    p4: "O wszystkim dowiedziałem się, gdy recenzja już wisiała w sieci. Oby każda środa tak wyglądała.",
  },
  cta: {
    title: "Zrób film. Płać za sekundy, które dostajesz.",
    subtitle:
      "Kling, LTX, Veo i inne w jednym Media Studio. Cenę widzisz przed generowaniem.",
    video: "Wygeneruj wideo",
    studio: "Otwórz Media Studio",
  },
};
