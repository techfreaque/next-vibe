import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Nowe modele, nowi dostawcy bez cenzury - {{appName}}",
    description:
      "Claude 5.5, GPT-6, Gemini 4 Argon, Grok 4.7 i świeże modele otwarte. Do tego NanoGPT, większa oferta Venice i pierwsze modele graficzne bez cenzury.",
    category: "Nowe modele",
    imageAlt: "{{appName}} - odświeżenie modeli, listopad 2026",
    keywords:
      "{{appName}}, Claude Opus 5.5, GPT-6, Gemini 4 Argon, Grok 4.7, AI bez cenzury, Venice, NanoGPT, Lustify, Chroma",
  },
  hero: {
    backToBlog: "Wróć do bloga",
    category: "Nowe modele",
    readTime: "5 min czytania",
    title: "Najnowsze modele już są. Bez cenzury - na poważnie.",
    subtitle:
      "Każda duża rodzina modeli przeskoczyła o generację. Doszedł drugi dostawca modeli bez cenzury. I pierwszy raz możesz generować obrazy bez cenzury.",
  },
  intro: {
    lead: "W skrócie: katalog znowu jest aktualny. Działa teraz {{modelCount}} modeli - {{uncensoredCount}} z nich bez cenzury.",
    p2: "Nic nie musisz robić. Miałeś przypięty starszy model? Twoje czaty same przejdą na jego następcę.",
  },
  filter: {
    title: "Co tu znaczy „bez cenzury”",
    intro: "Trzy poziomy. Ty wybierasz.",
    p1: "Każdy model ma poziom treści. Modele mainstreamowe zostawiają filtry dostawcy. Otwarte są luźniejsze. Modele bez cenzury odpowiadają bez umoralniania.",
    p2: "Nikt nie wybiera poziomu za Ciebie. Mainstream do pracy, bez cenzury do pytania, na które nikt inny nie odpowie - ten sam czat, to samo konto.",
    mainstream: "Mainstream",
    open: "Otwarte",
    uncensored: "Bez cenzury",
    mainstreamBody: "Filtry dostawcy zostają. Bezpieczny wybór do pracy.",
    openBody: "Mniej odmów, trochę barierek zostaje.",
    uncensoredBody: "Bez kazań i teatru odmów. Twoja decyzja.",
    countLabel: "{{count}} aktywnych",
  },
  lineup: {
    title: "Nowy skład",
    intro:
      "Pogrupowane według rodzin. Starsze wybory z tych rodzin trafiają teraz do nowych wersji.",
    claude: "Claude",
    claudeNote:
      "Nowa generacja od Anthropic - od głębokiego rozumowania po szybkie odpowiedzi.",
    gpt: "GPT",
    gptNote: "Rodzina GPT-6 od OpenAI. Każdy poziom ma też wersję Pro.",
    gemini: "Gemini",
    geminiNote: "Flagowiec Google'a plus szybki, tani wół roboczy.",
    grok: "Grok",
    grokNote:
      "Najnowszy model xAI - sklasyfikowany jako otwarty, nie mainstream.",
    openModels: "Modele otwarte",
    openModelsNote: "Kimi, DeepSeek, GLM i MiniMax - mocne i mniej filtrowane.",
  },
  uncensored: {
    title: "Bez cenzury - porządny upgrade",
    intro: "Więcej modeli, dwóch dostawców i obrazy.",
    veniceTitle: "Venice: kręgosłup, rozbudowany",
    veniceBody:
      "Venice obsługuje większość naszego katalogu bez cenzury. Flagowcem jest teraz {{veniceModel}}, a do tego doszła cała seria:",
    nanoTitle: "NanoGPT: druga droga",
    nanoBody:
      "Nowy dostawca. Wnosi {{glm}} i {{glmFlash}} z kontekstem 1 mln tokenów, a {{deepseek}}, {{abliterated}} i {{deepseekAbliterated}} serwuje obok Venice - plus własny {{mimoAbliterated}}. Jeden dostawca się potknie - drugi przejmuje.",
    imagesTitle: "Pierwsze modele graficzne bez cenzury",
    imagesBody:
      "{{lustify}} i {{chroma}}, przez Venice. Jeden kredyt za obraz. Każdy wcześniejszy model graficzny był mainstreamowy albo otwarty.",
    warning:
      "{{abliterated}} to najmniej ograniczony model, jaki kiedykolwiek mieliśmy. Siedzi za poziomem „bez cenzury” - dostajesz go tylko, gdy świadomie go wybierzesz.",
  },
  underTheHood: {
    title: "Pod maską",
    intro: "Dla tych, którzy chcą wiedzieć, jak ta podmiana naprawdę działa.",
    successorsTitle: "Stary wybór idzie za następcą",
    successorsBody:
      "Starsze identyfikatory modeli są teraz oznaczone jako legacy: ukryte w wyborze, ale wciąż rozwiązywalne. Przypięte modele i zapisane skille przechodzą przez mapę następców do aktualnego modelu - ale tylko wtedy, gdy następca jest dla Ciebie naprawdę dostępny. Jeśli nie, zostaje Twój pierwotny wybór. Żadnej cichej zamiany na obcy model.",
    pricesTitle: "Ceny, które same się aktualizują",
    pricesBody:
      "Nowe pobieranie cen bez klucza API dla Venice i NanoGPT trzyma ceny, okna kontekstu i modalności na bieżąco. Brak danych o cenie to dokładnie powód, dla którego stary model Venice sam się wyłączył - teraz to już nie przejdzie po cichu.",
    toolsTitle: "Wywołania narzędzi, uczciwie",
    toolsBody:
      "Modele z NanoGPT dostają natywne wywołania narzędzi. Venice Uncensored w naszych testach ignorował natywne narzędzia, więc zostaje przy ścieżce opartej na prompcie - która działa.",
  },
  cta: {
    title: "Wybierz model. Ustaw filtr.",
    subtitle:
      "Każdy model powyżej działa w czacie. Porównaj je obok siebie albo po prostu zacznij pisać.",
    chat: "Zacznij czat",
    models: "Zobacz wszystkie modele",
  },
};
