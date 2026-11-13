import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Modele niecenzurowane, jeden po drugim - {{appName}}",
    description:
      "Prosty przewodnik po każdym niecenzurowanym modelu AI na unbottled.ai. Który powstał bez cenzury, którym tylko usunięto odmowy, w czym każdy jest dobry i gdzie zawodzi.",
    category: "Przewodnik po modelach",
    imageAlt: "{{appName}} przewodnik po modelach niecenzurowanych",
    keywords:
      "{{appName}}, niecenzurowane modele AI, modele abliterowane, Venice, GLM niecenzurowany, Gab Arya, FreedomGPT, UncensoredLM, AI zbudowana bez cenzury, niecenzurowana AI do polityki, AI wolności słowa",
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
    p2: "To uczciwy przegląd. Prawdziwi dostawcy, prawdziwe mocne strony, prawdziwe słabości. Jeden model tutaj powstał bez cenzury. Pozostałym usunięto odmowy. Ta różnica decyduje, którego pytasz o politykę. W całej reszcie wybieraj według zadania przed tobą, nie według najgłośniejszej etykiety.",
  },
  whatItMeans: {
    title: 'Co tu naprawdę znaczy "niecenzurowany"',
    p1: "Każdy model na platformie ma poziom treści: mainstream, otwarty albo niecenzurowany. Modele niecenzurowane odpowiadają bez teatru odmów i moralnego wstępu. Dochodzą do tego na dwa sposoby. Jeden powstał bez cenzury: laboratorium trenowało go tak od pierwszego przebiegu. Pozostałe to istniejące modele z usuniętymi odmowami, przez abliterację (kierunek odmowy wycina się z wag) albo przez dostrajanie znoszące cenzurę. Zachowują inteligencję i tracą odruch mówienia nie. Zachowują też swoje dane treningowe i spojrzenie laboratorium bazowego.",
    callout:
      "Zbudowany bez cenzury albo z usuniętymi odmowami. UncensoredLM to jedyny model tutaj trenowany bez cenzury od początku. Każdy inny model niecenzurowany przestaje odmawiać, ale wciąż niesie obraz świata swojego modelu bazowego. W polityce to widać. Bez ograniczeń nie znaczy neutralnie.",
    p2: "To ty wybierasz poziom. Nikt nie wybiera go za ciebie. Niecenzurowany model odpowiada tak tylko dlatego, że go wybrałeś, a w tym samym czacie, na tym samym koncie możesz wrócić do modelu mainstreamowego.",
  },
  groups: {
    builtUncensored: {
      title: "Gdy pytanie jest polityczne albo kontrowersyjne",
      intro:
        "Jedyny model w katalogu zbudowany od początku bez cenzury. Odpowiada w ramie, którą wybierasz, bez moralizowania i bez zawracania cię do linii konsensusu.",
    },
    reasoning: {
      title: "Gdy ma myśleć",
      intro:
        "Rozumowanie, kod, analiza. Mocne modele bazowe z usuniętymi odmowami. Tu siedzi najwięcej inteligencji z całej niecenzurowanej serii.",
    },
    creative: {
      title: "Gdy potrzebujesz fikcji i roleplay",
      intro:
        "Postacie, które trzymają się roli, długie historie, nieocenzurowany dialog. Zbudowane do pisania, nie do arkuszy.",
    },
    fast: {
      title: "Gdy ma być szybko i tanio",
      intro:
        "Grosze za wiadomość, szybkie odpowiedzi, większość czyta obrazy. Codzienne konie robocze.",
    },
    viewpoint: {
      title: "Gdy chcesz innego punktu widzenia",
      intro:
        "Częścią platformy wolności słowa jest prowadzenie modeli, których inni nie poprowadzą. Ten ma wyraźnie nazwane nachylenie polityczne.",
    },
  },
  cards: {
    goodLabel: "Dobry w",
    weakLabel: "Słabszy w",
    pageLink: "Zobacz stronę {{model}}",
    uncensoredLm: {
      maker: "Uncensored.ai",
      basis:
        "Trenowany przez laboratorium bez cenzury. Pierwsze publiczne wydanie to destylat DeepSeek-R1 na bazie Qwen 14B. Kontekst 32K, tylko tekst.",
      good: "Pytania polityczne, kontrowersyjne i tabu, z odpowiedzią wprost, w twojej ramie. Bez moralizowania, bez zawracania do linii konsensusu. Korzysta z narzędzi.",
      weak: "Kodowanie, długie dokumenty i obrazy. Eksperymentalny, a sporne twierdzenia podaje tak pewnie jak ustalone. Sprawdzaj fakty, które ci daje.",
    },
    freedomgpt: {
      maker: "Age of AI",
      basis: "Rodowód z otwartych wag. Kontekst 32K.",
      good: "Bezpośrednie, szybkie odpowiedzi bez morałów. Chatbot, który otworzył kategorię wolności słowa, nastawiony na prosty przekaz.",
      weak: "Narzędzia, kodowanie i głęboka analiza. Bystry, ale nie od ciężkiego rozumowania.",
    },
    arya: {
      maker: "Gab",
      basis: "Model bazowy nieujawniony. Kontekst 131K.",
      good: "Według własnego określenia asystent o prawicowym nachyleniu, odpowiadający na tematy, których inne modele odmawiają. Bystry, długi kontekst, korzysta z narzędzi.",
      weak: "Kodowanie. Baza i trening nie są publicznie udokumentowane, więc traktuj szczegóły jako niepotwierdzone.",
    },
    venice: {
      maker: "Venice.ai",
      basis: "Dolphin Mistral 24B, edycja Venice. Kontekst 128K, czyta obrazy.",
      good: "Jeden z najniższych wskaźników odmów na rynku. Roleplay, fikcja, otwarta rozmowa. Pewny niecenzurowany domyślny wybór.",
      weak: "Kod i ciężka analiza. Natywne wywołania narzędzi bywają zawodne, więc używa ścieżki opartej na promptach. W środku to dostrojony Mistral, i w polityce to widać.",
    },
    veniceRoleplay: {
      maker: "Venice.ai",
      basis: "24B dostrojone do roleplay. Kontekst 128K, czyta obrazy.",
      good: "Postacie, które trzymają głos przez długie kampanie. Mroczne sceny i fikcja dla dorosłych, bez zrywania w środku historii.",
      weak: "Wszystko analityczne. To narrator, nie asystent.",
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
    glmHeretic: {
      maker: "Z.AI (przez Venice)",
      basis: "Abliterowane GLM 4.7 Flash. Kontekst 200K.",
      good: "Grosze za wiadomość, szybkie odpowiedzi, bez morałów. Tani niecenzurowany wariant awaryjny.",
      weak: "Analiza. Model flash poprzedniej generacji, trzymany za cenę i tempo.",
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
    p2: "Niecenzurowana seria to też po prostu lepszy zestaw narzędzi. UncensoredLM do pytań politycznych i kontrowersyjnych, Qwen do kodu, który inni oznaczają, GLM 5.3 do czołowego rozumowania, Venice do fikcji, model flash do taniej masy, model o prawicowym nachyleniu dla perspektywy, której reszta stawki unika. Inne zadania, inne narzędzia. Modele mainstreamowe też zachowujesz, na tym samym koncie, na chwile, gdy filtr to dokładnie to, czego praca wymaga.",
    callout:
      "Niecenzurowany nie znaczy beztroski. Odpowiadasz za to, co tworzysz, a prawo nadal obowiązuje. Zmienia się tu jedno: kto trzyma pokrętło. Ty, nie dostawca modelu.",
  },
  howToPick: {
    title: "Jak wybierać w praktyce",
    p1: "Zacznij od zadania. Polityka, kontrowersje albo tematy tabu: UncensoredLM, jedyny zbudowany bez cenzury. Kod albo analiza: Qwen 3.6 Plus Uncensored lub pełne GLM 5.3 Uncensored. Fikcja i roleplay: Venice Uncensored lub Venice Role Play. Duże ilości, niski koszt, multimodalność: GLM 5.3 Flash, Gemma 4 albo MiMo.",
    p2: "Chcesz świadomie obranego punktu widzenia: Gab Arya, według własnego określenia prawicowy. Prosto z mostu: FreedomGPT Liberty. Nie masz pewności? Postaw dwa obok siebie i porównaj je na własnym promptcie.",
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
