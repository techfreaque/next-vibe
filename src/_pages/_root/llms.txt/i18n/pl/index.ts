import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  summary:
    "{{appName}} to platforma czatu AI z {{modelCount}} modelami czatu od {{providerCount}} laboratoriów: mainstreamowymi, otwartymi i bez cenzury. Ty wybierasz poziom filtrów w każdym czacie. Płacisz za użycie, kredytami. Open source, możesz hostować sam.",
  intro:
    "Modele czatu, obrazu, wideo, muzyki, głosu i transkrypcji na jednym saldzie kredytów. Działają w przeglądarce, w wierszu poleceń, jako serwer MCP i przez API zgodne z OpenAI i Anthropic. Zbudowane na next-vibe, otwartym frameworku TypeScript: jedna definicja endpointu staje się interfejsem webowym, komendą CLI, narzędziem AI i narzędziem MCP.",
  facts: {
    heading: "Najważniejsze fakty",
    models:
      "Modele: {{modelCount}} modeli czatu ({{mainstream}} mainstreamowych, {{open}} otwartych, {{uncensored}} bez cenzury) od {{providerCount}} laboratoriów, plus {{mediaCount}} modeli do obrazu, wideo, muzyki, mowy i transkrypcji.",
    free: "Darmowe kredyty co miesiąc: {{guest}} bez konta, {{signedIn}} z darmowym kontem, {{max}} z darmowym kontem i potwierdzoną subskrypcją newslettera. Karta niepotrzebna.",
    paid: "Płatnie: subskrypcja za {{subPrice}} miesięcznie lub {{subYearPrice}} rocznie z {{subCredits}} kredytami na miesiąc, albo jednorazowy pakiet za {{packPrice}} z {{packCredits}} kredytami. Kredyty z pakietu nigdy nie wygasają.",
    credit:
      "1 kredyt = {{creditValue}}. Każda strona modelu podaje cenę za wiadomość.",
    api: "API: OpenAI Chat Completions, OpenAI Responses i Anthropic Messages pod jednym adresem bazowym ({{apiBaseUrl}}). Wymaga płatnego konta: dowolnej subskrypcji albo jednego zakupu kredytów, na przykład pakietu za {{packPrice}}. Darmowe konta dostają HTTP 402.",
    uncensored:
      "Poziom bez cenzury: dwa rodzaje modeli. Modele abliterowane to modele mainstreamowe zmienione tak, by nie unikały pytań. Modele naprawdę bez cenzury, takie jak UncensoredLM, są trenowane na książkach i dokumentach zakazanych w mainstreamowym internecie, więc mają przeciwne poglądy polityczne. Poziom bez cenzury wymaga jednorazowego potwierdzenia, że masz 18 lat.",
    openSource:
      "Open source: kod aplikacji na licencji MIT, rdzeń frameworka next-vibe na GPL-3.0. Kod źródłowy: {{repoUrl}}",
    referral:
      "Program poleceń: {{direct}}% stałej prowizji od płatności poleconych osób, plus pula {{upline}}% dzielona na {{levels}} poziomów wyżej. Wypłata w kredytach albo w BTC/USDC, minimalna wypłata {{minPayout}}.",
    languages:
      "Każda strona jest po angielsku ({{en}}), niemiecku ({{de}}), polsku ({{pl}}) i francusku ({{fr}}).",
  },
  pages: {
    heading: "Główne strony",
    models: "Modele",
    modelsDesc:
      "każdy model z ceną za wiadomość, oknem kontekstu, poziomem treści i porównaniami",
    pricing: "Cennik",
    pricingDesc: "darmowe kredyty, subskrypcja i pakiet kredytów",
    api: "Dokumentacja API",
    apiDesc: "adres bazowy, uwierzytelnianie, formaty zapytań i przykłady kodu",
    blog: "Blog",
    blogDesc: "poradniki, porównania modeli i notatki z budowy",
    partners: "Partnerzy",
    partnersDesc: "program dla twórców, newsletterów i katalogów",
    earn: "Program poleceń",
    earnDesc: "jak działa prowizja i wypłaty",
    selfHost: "Własny hosting",
    selfHostDesc: "własna instancja na własnym sprzęcie",
    framework: "Framework next-vibe",
    frameworkDesc: "otwarty stack, na którym działa {{appName}}",
    refusalIndex: "Indeks odmów",
    refusalIndexDesc:
      "co tydzień te same pytania do każdego modelu: kto odpowiada, kto się wykręca, kto odmawia",
    skills: "Skille",
    skillsDesc:
      "gotowi specjaliści i postacie, każdy z własnym promptem, modelem i narzędziami",
    help: "Pomoc",
    helpDesc: "FAQ i kontakt",
  },
  blog: {
    heading: "Wpisy na blogu",
  },
  optional: {
    heading: "Opcjonalnie",
    full: "Pełna wersja",
    fullDesc: "ten plik plus pełna lista modeli",
    sitemap: "Mapa strony",
    sitemapDesc: "każda publiczna strona w każdym języku",
    about: "O nas",
    privacy: "Polityka prywatności",
    terms: "Regulamin",
    imprint: "Nota prawna",
  },
  full: {
    chatHeading: "Modele czatu",
    chatIntro:
      "Aktualne modele czatu. Cena za wiadomość dotyczy zwykłej tury czatu ({{inputTokens}} tokenów wejścia, {{outputTokens}} tokenów wyjścia) u najtańszego dostawcy.",
    chatLine:
      "{{lab}}, {{tier}}, kontekst {{context}} tokenów, około {{credits}} kredytów za wiadomość",
    legacyHeading: "Starsze modele czatu, nadal dostępne",
    legacySuccessor: "następca: {{successor}}",
    mediaHeading: "Modele mediów",
    mediaLine: "{{lab}}, {{type}}",
    mediaTypes: {
      image: "generowanie obrazów",
      video: "generowanie wideo",
      audio: "generowanie muzyki",
      tts: "zamiana tekstu na mowę",
      stt: "zamiana mowy na tekst",
    },
  },
};
