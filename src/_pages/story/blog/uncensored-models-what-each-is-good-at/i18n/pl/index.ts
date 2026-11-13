import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Modele niecenzurowane, jeden po drugim - {{appName}}",
    description:
      "Każdy niecenzurowany model AI na unbottled.ai, jeden po drugim. UncensoredLM prowadzi w mrocznym roleplay, fikcji tabu, polityce i innych punktach widzenia. Pozostałym usunięto odmowy: w czym każdy jest dobry i gdzie zawodzi.",
    category: "Przewodnik po modelach",
    imageAlt: "{{appName}} przewodnik po modelach niecenzurowanych",
    keywords:
      "{{appName}}, niecenzurowane modele AI, modele abliterowane, Venice, GLM niecenzurowany, Gab Arya, FreedomGPT, UncensoredLM, AI zbudowana bez cenzury, niecenzurowany roleplay, AI do mrocznego roleplay, niecenzurowana AI do polityki, AI wolności słowa",
  },
  hero: {
    backToBlog: "Powrót do bloga",
    category: "Przewodnik po modelach",
    readTime: "7 min czytania",
    title: "Modele niecenzurowane, jeden po drugim.",
    subtitle:
      "Żaden model nie jest najlepszy we wszystkim. Oto w czym każdy niecenzurowany model jest dobry, gdzie zawodzi i jak wybrać właściwy do zadania.",
  },
  intro: {
    lead: "Prowadzimy teraz {{uncensoredCount}} niecenzurowanych modeli. Nie są wymienne. Każdy pochodzi z innego laboratorium, stoi na innej bazie i jest dobry w czym innym.",
    p2: "To uczciwy przegląd. Prawdziwi dostawcy, prawdziwe mocne strony, prawdziwe słabości. Jeden model tutaj powstał bez cenzury. Pozostałym usunięto odmowy. Ta różnica decyduje, z którym idziesz w mroczny roleplay, fikcję tabu, politykę i poglądy spoza mainstreamu: z UncensoredLM. W całej reszcie wybieraj według zadania przed tobą, nie według najgłośniejszej etykiety.",
  },
  whatItMeans: {
    title: 'Co tu naprawdę znaczy "niecenzurowany"',
    p1: "Każdy model na platformie ma poziom treści: mainstream, otwarty albo niecenzurowany. Modele niecenzurowane odpowiadają bez teatru odmów i moralnego wstępu. Dochodzą do tego na dwa sposoby. Jeden powstał bez cenzury: laboratorium trenowało go tak od pierwszego przebiegu. Pozostałe to istniejące modele z usuniętymi odmowami, przez abliterację (kierunek odmowy wycina się z wag) albo przez dostrajanie znoszące cenzurę. Zachowują inteligencję i tracą odruch mówienia nie. Zachowują też swoje dane treningowe i spojrzenie laboratorium bazowego.",
    callout:
      "Zbudowany bez cenzury albo z usuniętymi odmowami. UncensoredLM to jedyny model tutaj trenowany bez cenzury od początku. Każdy inny model niecenzurowany przestaje odmawiać, ale wciąż niesie obraz świata swojego modelu bazowego. W mrocznej fikcji łagodzi scenę. W polityce dryfuje z powrotem do konsensusu. Bez ograniczeń nie znaczy neutralnie.",
    p2: "To ty wybierasz poziom. Nikt nie wybiera go za ciebie. Niecenzurowany model odpowiada tak tylko dlatego, że go wybrałeś, a w tym samym czacie, na tym samym koncie możesz wrócić do modelu mainstreamowego.",
  },
  groups: {
    builtUncensored: {
      title: "Poznaj jedyny zbudowany bez cenzury",
      intro:
        "UncensoredLM to jedyny model w katalogu trenowany bez cenzury od pierwszego przebiegu. Nic nie zostało wycięte po fakcie, więc żadne bazowe spojrzenie go nie ściąga z powrotem. Prowadzi w trzech zadaniach: mroczny roleplay i tematy tabu, pytania polityczne i kontrowersyjne, poglądy, których mainstream nie wypowie.",
    },
    creative: {
      title: "Gdy potrzebujesz roleplay i mrocznej fikcji",
      intro:
        "Postacie, które trzymają się roli. Sceny, które idą tam, gdzie prowadzi historia. W tym, co mroczne i tabu, prowadzi UncensoredLM. Alternatywy wygrywają przy długich kampaniach, obrazach albo cenie.",
      topPickReason:
        "Mroczny roleplay i fikcja tabu, pisane wprost. Bez złagodzonych scen, bez nagłej moralnej wstawki, bez postaci wychodzącej z roli, żeby cię pouczyć. Zbudowany bez cenzury, więc żaden model bazowy nie ściąga historii w bezpieczniejsze rejony. Jedno ograniczenie: kontekst 32K, więc w bardzo długich kampaniach zapomina wczesne sceny.",
    },
    viewpoint: {
      title: "Gdy chodzi o politykę, kontrowersje albo inny punkt widzenia",
      intro:
        "Częścią platformy wolności słowa jest prowadzenie modeli, których inni nie poprowadzą. Tu prowadzi UncensoredLM. Gab Arya ma otwarcie nazwane prawicowe nachylenie. FreedomGPT mówi prosto z mostu.",
      topPickReason:
        "Pytania polityczne i kontrowersyjne, z odpowiedzią w twojej ramie. Nieortodoksyjne stanowiska wyłożone do końca. Adwokat diabła grany na serio: bez zawracania do linii konsensusu, bez moralizowania. Neutralny nie jest, a sporne twierdzenia podaje tak pewnie jak ustalone, więc sprawdzaj fakty.",
    },
    reasoning: {
      title: "Gdy ma myśleć",
      intro:
        "Rozumowanie, kod, analiza. Mocne modele bazowe z usuniętymi odmowami. Tu siedzi najwięcej inteligencji z całej niecenzurowanej serii.",
    },
    fast: {
      title: "Gdy ma być szybko i tanio",
      intro:
        "Niski koszt za wiadomość, szybkie odpowiedzi, duży kontekst, wszystkie trzy czytają obrazy. Codzienne konie robocze.",
    },
  },
  cards: {
    goodLabel: "Dobry w",
    weakLabel: "Słabszy w",
    pageLink: "Zobacz stronę {{model}}",
    topPickLabel: "Najlepszy wybór",
    alternativesLabel: "Alternatywy",
    uncensoredLm: {
      maker: "Uncensored.ai",
      basis:
        "Trenowany przez laboratorium bez cenzury. Pierwsze publiczne wydanie to destylat DeepSeek-R1 na bazie Qwen 14B. Kontekst 32K, tylko tekst.",
      good: "Mroczny roleplay i fikcja tabu. Pytania polityczne i kontrowersyjne. Poglądy spoza mainstreamu, wyłożone w twojej ramie. Bez moralizowania, bez zawracania do linii konsensusu. Korzysta z narzędzi.",
      weak: "Bardzo długie kampanie (kontekst 32K), kodowanie i obrazy. Eksperymentalny, a sporne twierdzenia podaje tak pewnie jak ustalone. Sprawdzaj fakty, które ci daje.",
    },
    freedomgpt: {
      maker: "Age of AI",
      basis: "Rodowód z otwartych wag. Kontekst 32K.",
      good: "Bezpośrednie, szybkie odpowiedzi bez morałów. Chatbot, który otworzył kategorię wolności słowa, nastawiony na prosty przekaz.",
      weak: "Głębia. Narzędzia, kodowanie i długie wywody to nie jego teren. Po nieortodoksyjny pogląd z pełnym uzasadnieniem sięgnij po UncensoredLM.",
    },
    arya: {
      maker: "Gab",
      basis: "Model bazowy nieujawniony. Kontekst 131K.",
      good: "Według własnego określenia asystent o prawicowym nachyleniu. Wybierz go, gdy chcesz właśnie tego nachylenia. Długi kontekst, korzysta z narzędzi.",
      weak: "Rozpiętość. Z założenia argumentuje z jednej strony. Baza i trening są nieujawnione, więc traktuj szczegóły jako niepotwierdzone. Nie koduje.",
    },
    venice: {
      maker: "Venice.ai",
      basis: "Dolphin Mistral 24B, edycja Venice. Kontekst 128K, czyta obrazy.",
      good: "Tani niecenzurowany model do wszystkiego, z jednym z najniższych wskaźników odmów na rynku. Fikcja, otwarta rozmowa, obrazy, kontekst 128K.",
      weak: "Odmowy usunięte, nie zbudowany bez cenzury: to dostrojony Mistral i w mrocznych scenach oraz polityce to widać. Kod i ciężka analiza. Narzędzia idą ścieżką opartą na promptach.",
    },
    veniceRoleplay: {
      maker: "Venice.ai",
      basis: "24B dostrojone do roleplay. Kontekst 128K, czyta obrazy.",
      good: "Długie kampanie. Kontekst 128K trzyma wczesne sceny w zasięgu, a model jest dostrojony, by trzymać głos postaci. Czyta obrazy: portrety postaci, szkice scen.",
      weak: "Odmowy usunięte, nie zbudowany bez cenzury, więc bazowe spojrzenie potrafi złagodzić najmroczniejszy materiał. Wszystko analityczne: to narrator, nie asystent.",
    },
    deepseekFlash: {
      maker: "DeepSeek (przez Venice)",
      basis: "DeepSeek V4.1 Flash, odmowy usunięte. Kontekst 1M, czyta obrazy.",
      good: "Ogromny kontekst na rozległe światy za niską cenę. Czyta obrazy, korzysta z narzędzi i napisze kod, gdy historia robi przerwę.",
      weak: "Odmowy usunięte, spojrzenie DeepSeek zostało. W polityce i najmroczniejszych scenach potrafi się asekurować. Generalista, nie urodzony narrator.",
    },
    gemma: {
      maker: "Google (przez Venice)",
      basis: "Gemma 4 26B MoE, filtr zdjęty. Kontekst 256K, czyta obrazy.",
      good: "Szybki, tani, multimodalny. Duże okno kontekstu jak na tę cenę.",
      weak: "Głębokie rozumowanie. Szybki responder, nie myśliciel. Trening Google nadal wpływa na to, jak ujmuje gorące tematy.",
    },
    qwen: {
      maker: "Alibaba (przez Venice)",
      basis: "Qwen 3.6 Plus, odmowy usunięte. Kontekst 256K, czyta obrazy.",
      good: "Najsilniejszy koder i analityk w niecenzurowanej serii. Dobrze rozumuje, czyta obrazy, trzyma długi kontekst.",
      weak: "Cena. Ta moc kosztuje za wiadomość więcej niż modele flash. Odmowy zniknęły, dane treningowe Alibaby zostały: w polityce licz się ze spojrzeniem modelu bazowego.",
    },
    mimo: {
      maker: "Xiaomi (przez NanoGPT)",
      basis:
        "MiMo V2.6 Flash, kierunek odmowy abliterowany. Kontekst 1M, czyta obrazy.",
      good: "Tani i szybki, multimodalny, korzysta z narzędzi, ogromne okno kontekstu. Solidny do dużych ilości nieocenzurowanej pracy.",
      weak: "Trochę głębi za tempo. Nie na najtrudniejsze rozumowanie.",
    },
    glm53: {
      maker: "Z.AI (przez NanoGPT)",
      basis: "Pełny model rozumujący GLM 5.3, niecenzurowany. Kontekst 1M.",
      good: "Kod, tekst i narzędzia na czołowym poziomie, bez cenzury, za ułamek ceny abliterowanego flagowca. Ciężki zawodnik.",
      weak: "Tempo. Duży model, wciąż oznaczony jako eksperymentalny. Już nie odmawia, ale w pytaniach politycznych nadal potrafi się asekurować jak bazowy GLM.",
    },
    glm53Flash: {
      maker: "Z.AI (przez NanoGPT)",
      basis: "320B MoE, niecenzurowany. Kontekst 1M, czyta obrazy.",
      good: "Szybki, tani, multimodalny, kontekst 1M. Koń roboczy do nieocenzurowanej codzienności.",
      weak: "Najtrudniejsze rozumowanie. Do tego sięgnij po pełne GLM 5.3.",
    },
  },
  why: {
    title: "Dlaczego opcje mają znaczenie",
    intro: "Wybór to nie dodatek. To cała istota rzeczy.",
    p1: "Odmowa jednego modelu to odpowiedź drugiego. Pytanie medyczne, prawny przypadek graniczny, kawałek fikcji, analiza bezpieczeństwa, pogląd spoza mainstreamu: pojedynczy filtrowany model decyduje za ciebie, o co wolno ci zapytać. Szeroki wachlarz modeli oddaje tę decyzję tobie.",
    p2: "Niecenzurowana seria to też po prostu lepszy zestaw narzędzi. UncensoredLM do mrocznego roleplay, fikcji tabu, polityki i poglądów, których mainstream unika. Venice Role Play do długich kampanii. Qwen do kodu, który inni oznaczają. GLM 5.3 do czołowego rozumowania. Model flash do taniej masy. Gab Arya, gdy świadomie chcesz prawicowego nachylenia. Inne zadania, inne narzędzia. Modele mainstreamowe też zachowujesz, na tym samym koncie, na chwile, gdy filtr to dokładnie to, czego praca wymaga.",
    callout:
      "Niecenzurowany nie znaczy beztroski. Odpowiadasz za to, co tworzysz, a prawo nadal obowiązuje. Zmienia się tu jedno: kto trzyma pokrętło. Ty, nie dostawca modelu.",
  },
  howToPick: {
    title: "Jak wybierać w praktyce",
    p1: "Zacznij od zadania. Mroczny roleplay i fikcja tabu, pytania polityczne albo kontrowersyjne, pogląd spoza konsensusu: UncensoredLM, jedyny zbudowany bez cenzury. Kampanie dłuższe niż 32K albo sceny z obrazami: Venice Role Play. Tani model do wszystkiego: Venice Uncensored. Kod albo analiza: Qwen 3.6 Plus Uncensored lub pełne GLM 5.3 Uncensored. Duże ilości, niski koszt, multimodalność: GLM 5.3 Flash, Gemma 4 albo MiMo.",
    p2: "Chcesz świadomie prawicowego nachylenia: Gab Arya, według własnego określenia. Prosto z mostu: FreedomGPT Liberty. Nie masz pewności? Postaw dwa obok siebie i porównaj je na własnym promptcie.",
    compareLink: "Porównaj {{a}} z {{b}}",
  },
  cta: {
    title: "Wybierz model. Ustaw filtr.",
    subtitle:
      "Każdy niecenzurowany model tutaj jest dostępny w czacie. Porównaj je na własnym pytaniu albo po prostu zacznij rozmawiać.",
    chat: "Zacznij czat",
    models: "Przeglądaj wszystkie modele",
  },
};
