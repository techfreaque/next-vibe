import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Generator muzyki AI, głosy i transkrypcja | {{appName}}",
    description:
      "{{musicCount}} modeli muzyki AI, {{voiceCount}} głosów AI, {{sttCount}} modeli transkrypcji. Alternatywy dla Suno z prawdziwą ceną za klip i minutę. Darmowe kredyty na start.",
    category: "Porównanie modeli",
    imageAlt:
      "{{appName}}: modele muzyki, głosu i transkrypcji AI w porównaniu",
    keywords:
      "generator muzyki AI, muzyka AI, generator piosenek AI, alternatywa dla Suno, Suno alternative, AI music generator, generator bitów AI, Lyria 3, ElevenLabs Music, Sonauto, MusicGen, głosy AI, generator głosu AI, zamiana tekstu na mowę, text to speech, lektor AI, głos AI za darmo, alternatywa dla ElevenLabs, Kokoro TTS, Gemini TTS, transkrypcja, transkrypcja AI, zamiana mowy na tekst, speech to text, Whisper, Whisper Large V3, Deepgram Nova-2, GPT-4o Mini Transcribe, {{appName}}",
  },
  hero: {
    backToBlog: "Wróć do bloga",
    category: "Porównanie modeli",
    readTime: "11 min czytania",
    title: "Piosenki, bity, głosy, transkrypcje. Jedno konto.",
    subtitle:
      "{{musicCount}} modeli muzycznych, {{sttCount}} modeli transkrypcji i głosy do wyboru (łącznie {{voiceCount}}) na jednym saldzie {{appName}}. Prawdziwa cena za klip, za minutę, za godzinę. I który model pasuje do jakiej roboty.",
  },
  intro: {
    lead: "Aplikacja do muzyki. Aplikacja do głosu. Aplikacja do transkrypcji. Trzy subskrypcje, trzy logowania, trzy pule kredytów, które przepadają. A chciałeś tylko dżingla, nagrania lektorskiego i transkrypcji.",
    p2: "{{appName}} obsługuje {{modelCount}} modeli audio od {{labCount}} laboratoriów na jednym saldzie kredytów. Każda liczba poniżej pochodzi na żywo z naszego rejestru modeli: długości, głosy, poziomy, prawdziwe ceny. Cztery zadania, cztery odpowiedzi:",
    songs:
      "Piosenki z wokalem: Sonauto, ElevenLabs Music, Lyria 3 Pro. Klipy do {{longestMusic}} sekund.",
    beats:
      "Bity i podkłady instrumentalne: MusicGen Stereo, ModelsLab Music Gen, Lyria 3.",
    voiceovers:
      "Lektor i czytanie na głos: gotowe głosy (łącznie {{voiceCount}}), od {{cheapVoiceMinute}} do {{priceyVoiceMinute}} za minutę mowy.",
    transcription:
      "Transkrypcja: {{sttCount}} modeli, od {{cheapSttHour}} do {{priceySttHour}} za godzinę nagrania.",
  },
  tiers: {
    mainstream: "Mainstream",
    open: "Otwarty",
    uncensored: "Bez cenzury",
  },
  music: {
    title: "Generator muzyki AI: {{musicCount}} modeli obok siebie",
    intro:
      "Najtańszy klip na początku. Ceny zawierają naszą marżę {{markup}}%. 1 kredyt = {{creditValue}}.",
    colModel: "Model",
    colLength: "Długość klipu",
    colTier: "Poziom",
    colCredits: "Kredyty / klip",
    colPrice: "Cena / klip",
    lengthChoice: "{{lengths}} s",
    lengthFixed: "{{seconds}} s",
    footnote:
      "Jedna cena za klip, niezależnie od wybranej długości. Poprosisz o długość, której model nie oferuje, a zapytanie przeskoczy do najbliższej dostępnej.",
    factLine: "{{credits}} kredytów ({{price}}) za klip · {{length}}",
    picks: {
      songs: {
        title: "Piosenki z wokalem",
        body: "Wokal i refren, który wpada w ucho. Opisz gatunek, nastrój, głos i o czym jest piosenka. Te modele są zbudowane do piosenek, które śpiewają.",
      },
      beats: {
        title: "Bity i podkłady instrumentalne",
        body: 'Muzyka w tle, pętle do filmu, bit do rapowania. Bez wokalu. Podaj gatunek, tempo i instrumenty: "lo-fi hip hop, 85 bpm, przybrudzone pianino, trzaski winylu".',
      },
      short: {
        title: "Krótkie klipy, przerywniki, dżingle",
        body: "Intra, dźwięki powiadomień, przerywnik do podcastu. Krótko i tanio. Zrób dziesięć, zostaw jeden.",
      },
    },
    suno: "Szukasz alternatywy dla Suno? Suno i Udio nie ma na {{appName}}. W zamian dostajesz {{musicCount}} modeli muzycznych na jednym saldzie, od {{cheapMusicPrice}} za klip, bez dodatkowej subskrypcji. Uczciwie o haczyku: klipy kończą się na {{longestMusic}} sekundach. Pełne trzyminutowe utwory to wciąż domena wyspecjalizowanych aplikacji do piosenek.",
    toolLink: "Otwórz generator muzyki",
  },
  voices: {
    title:
      "Zamiana tekstu na mowę: wszystkie głosy AI w porównaniu ({{voiceCount}})",
    intro:
      "Najtańsze na początku. Rozliczenie za każdy znak tekstu. Ostatnia kolumna szacuje minutę mowy na około {{charsPerMinute}} znaków.",
    colVoice: "Głos",
    colCharacter: "Brzmienie",
    colTier: "Poziom",
    colCredits: "Kredyty / 1000 znaków",
    colMinute: "Ok. 1 min mowy",
    gender: {
      male: "Męski",
      female: "Kobiecy",
      neutral: "Neutralny",
    },
    style: {
      conversational: "swobodny",
      warm: "ciepły",
      deep: "głęboki",
      expressive: "ekspresyjny",
      calm: "spokojny",
      friendly: "przyjazny",
      authoritative: "stanowczy",
      clear: "wyraźny",
      soft: "miękki",
      steady: "równy",
      confident: "pewny siebie",
      british: "brytyjski",
      lively: "żywy",
      bright: "jasny",
      upbeat: "energiczny",
    },
    footnote:
      "Stawki zawierają naszą marżę {{markup}}%. Minuta to szacunek: szybkie tempo i długie słowa ją przesuwają. Płacisz za znaki, które wysyłasz, nie za sekundy, które dostajesz z powrotem.",
    factLine:
      "{{credits}} kredytów / 1000 znaków · ok. {{minute}} za minutę · {{character}}",
    picks: {
      everyday: {
        title: "Czytanie na głos na co dzień",
        body: "Czysto, wyraźnie i na tyle tanio, że możesz go nie wyłączać. {{defaultVoice}} to domyślny głos do czytania odpowiedzi.",
      },
      natural: {
        title: "Najbardziej naturalne: lektor do publikacji",
        body: "Szeroka skala emocji, ludzkie tempo. Do narracji na YouTube, reklam, próbek audiobooków. To najdroższe głosy tutaj, więc najpierw dopracuj scenariusz, potem renderuj raz.",
      },
      multilingual: {
        title: "Wiele języków, jeden głos",
        body: "Głosy Gemini mówią w ponad 100 językach i słuchają wskazówek: wolniej, szeptem, z ekscytacją.",
      },
      expressive: {
        title: "Postacie i opowieści",
        body: "Więcej dramatu, większa skala. Stworzone do fikcji, postaci z gier, scen roleplay.",
      },
      budget: {
        title: "Najtańsze, bez filtra treści",
        body: "Kokoro to otwarty model z 82M parametrów. {{uncensoredVoiceCount}} głosów Kokoro jest w naszym poziomie bez cenzury: żadnego filtra na to, co czytają. To też najtańsze głosy na platformie.",
      },
    },
    languages:
      "Każdy głos tutaj jest dostrojony do angielskiego. Głosy Gemini radzą sobie z ponad 100 językami. Pozostałe czytają też w innych językach, często z akcentem. Przetestuj jedno zdanie, zanim wyrenderujesz cały scenariusz.",
    toolLink: "Otwórz zamianę tekstu na mowę",
  },
  stt: {
    title: "Transkrypcja AI: {{sttCount}} modeli zamiany mowy na tekst",
    intro:
      "Najtańsze za minutę na początku. Rozliczenie za każdą sekundę nagrania. Ceny zawierają naszą marżę {{markup}}%.",
    colModel: "Model",
    colTier: "Poziom",
    colCredits: "Kredyty / minuta",
    colHour: "Cena / godzina",
    footnote:
      "Gdy dostawca podaje rzeczywisty koszt zadania, rozliczamy właśnie ten koszt plus marżę. Końcowa opłata może więc nieco odbiegać od tabeli.",
    factLine: "{{credits}} kredytów / minuta · {{hour}} za godzinę",
    picks: {
      cheapest: {
        title: "Najtaniej: godziny nagrań za grosze",
        body: "Otwarty Whisper, 99 języków. Jedna subskrypcja pokrywa przy tej stawce około {{subSttHours}} godzin nagrań.",
      },
      accuracy: {
        title: "Najpierw dokładność",
        body: "Mniej błędnych słów, lepsze rozpoznawanie języka. Do wywiadów, cytatów, wszystkiego, co publikujesz. {{defaultStt}} to domyślny model dla wprowadzania głosowego.",
      },
      languages: {
        title: "Wiele języków",
        body: "Whisper obsługuje 99 języków, Nemotron 40 wariantów językowych. Voxtral to model transkrypcji od Mistrala, zbudowany do nagrań do 10 minut.",
      },
      fast: {
        title: "Szybko i odpornie na hałas",
        body: "Niskie opóźnienie, daje radę w głośnych pomieszczeniach. Stworzony do szybkich notatek głosowych i dyktowania.",
      },
    },
    toolLink: "Otwórz zamianę mowy na tekst",
  },
  chat: {
    title: "Jak to działa w czacie",
    intro:
      "Bez osobnej aplikacji. Muzyka, głos i transkrypcja są w każdym czacie na {{appName}}.",
    steps: {
      song: {
        title: "Poproś o piosenkę",
        body: 'Napisz "zrób 30-sekundowe intro w stylu synthwave do mojego podcastu". AI wywoła generator muzyki z modelem muzycznym twojego skilla, czyli {{defaultMusic}}, dopóki tego nie zmienisz. Wpisz w prompcie inny model, a AI użyje właśnie jego.',
      },
      voice: {
        title: "Posłuchaj każdej odpowiedzi",
        body: "Kliknij ikonę głośnika przy odpowiedzi, a zostanie przeczytana głosem twojego skilla, domyślnie {{defaultVoice}}. Głos ustawiasz osobno dla każdego skilla.",
      },
      dictate: {
        title: "Mów zamiast pisać",
        body: "Kliknij mikrofon i mów. {{defaultStt}} zapisze twoje słowa w polu wpisywania, albo nagranie trafi prosto do modeli, które rozumieją dźwięk.",
      },
      transcribe: {
        title: "Transkrybuj całe pliki",
        body: "Spotkania, wywiady, notatki głosowe: wrzuć do {{sttMaxFiles}} plików na stronę zamiany mowy na tekst i wybierz model.",
      },
      call: {
        title: "Tryb rozmowy",
        body: "Bez użycia rąk. Ty mówisz, AI odpowiada na głos, ty odpowiadasz dalej. Głos na wejściu, głos na wyjściu, to samo saldo.",
      },
    },
    toolPages:
      "Chcesz pełnej kontroli? Każde zadanie ma własną stronę: wybierz model albo głos, ustaw długość klipu, wklej długi scenariusz.",
  },
  pricing: {
    title: "Ile kosztuje tu muzyka i głos AI",
    intro:
      "Trzy wzory, jedno saldo. Cena dostawcy plus nasza marża {{markup}}%. 1 kredyt = {{creditValue}}.",
    music:
      "Muzyka: stała cena za klip. Od {{cheapMusicCredits}} kredytów ({{cheapMusicPrice}}) w {{cheapMusicName}} do {{priceyMusicCredits}} kredytów ({{priceyMusicPrice}}) w {{priceyMusicName}}.",
    voice:
      "Głos: za znak. Od {{cheapVoiceCredits}} kredytów za 1000 znaków w {{cheapVoiceName}} do {{priceyVoiceCredits}} w {{priceyVoiceName}}.",
    stt: "Transkrypcja: za sekundę nagrania. Od {{cheapSttCredits}} kredytów za minutę w {{cheapSttName}} do {{priceySttCredits}} w {{priceySttName}}.",
    failed:
      "Kredyty schodzą dopiero wtedy, gdy masz wynik. Nieudane zadanie, przekroczony czas, odrzucony prompt: nie płacisz nic.",
    free: "Za darmo: {{guestCredits}} kredytów miesięcznie bez konta, {{freeCredits}} z darmowym kontem, {{maxCredits}} z newsletterem. {{freeCredits}} kredytów to {{freeClips}} klipów w {{cheapMusicName}} albo około {{freeVoiceMinutes}} minut głosu {{cheapVoiceName}}.",
    sub: "Plany miesięczne: cztery rozmiary, od {{subCredits}} kredytów za {{subPrice}}.",
    pack: "Pakiety kredytów: doładowanie dla subskrybentów, {{packCredits}} kredytów za {{packPrice}}. Nigdy nie wygasają. Karta, PayPal albo krypto.",
    link: "Zobacz plany i pakiety kredytów",
  },
  limits: {
    title: "Ograniczenia, bez owijania",
    intro: "Poznaj granice, zanim wydasz choćby kredyt.",
    musicLength:
      "Klipy muzyczne trwają maksymalnie {{longestMusic}} sekund. Bez trzyminutowych utworów, bez przedłużania klipu.",
    musicFlat:
      "Klip kosztuje tyle samo przy każdej długości. Krótkie klipy to tani sposób na test promptu, nie rabat.",
    noSuno: "Nie ma Suno ani Udio. Ich API nie są dostępne na {{appName}}.",
    ttsLength:
      "Zamiana tekstu na mowę przyjmuje do {{ttsMaxChars}} znaków na zapytanie. Dłuższe scenariusze: podziel je.",
    sttFiles:
      "Transkrypcja przyjmuje do {{sttMaxFiles}} plików na zapytanie, po {{sttMaxMb}} MB każdy.",
    noCloning:
      "Bez klonowania głosu. Wybierasz spośród głosów z tabeli. Własnego nie wgrasz.",
    filters:
      "Większość modeli muzyki i głosu działa za moderacją swojego dostawcy. Prompt może zostać odrzucony już u dostawcy. Takie odrzucenie nic nie kosztuje.",
    callout:
      "Zanim opublikujesz: sprawdź warunki dostawcy dotyczące komercyjnego użycia wygenerowanej muzyki i głosów. Zasady różnią się między laboratoriami i się zmieniają.",
  },
  faq: {
    title: "FAQ",
    bestMusic: {
      q: "Jaki jest najlepszy generator muzyki AI?",
      a: "Zależy od utworu. Piosenki z wokalem: Sonauto albo ElevenLabs Music. Dopracowane krótkie utwory: Lyria 3 Pro. Bity i pętle: MusicGen Stereo. Najtaniej: {{cheapMusicName}} za {{cheapMusicPrice}} za klip. Wszystkie {{musicCount}} działają na jednym saldzie {{appName}}, więc zmieniasz model przy każdym klipie.",
    },
    suno: {
      q: "Czy jest dobra alternatywa dla Suno?",
      a: "Do krótkich piosenek i bitów tak: Sonauto, ElevenLabs Music i Lyria 3 od Google działają tu na jednym saldzie, od {{cheapMusicPrice}} za klip, bez dodatkowej subskrypcji. Do pełnych trzyminutowych piosenek jeszcze nie: klipy kończą się tu na {{longestMusic}} sekundach.",
    },
    vocals: {
      q: "Czy AI potrafi tworzyć piosenki z wokalem?",
      a: "Tak. Poproś Sonauto, ElevenLabs Music albo Lyria 3 Pro o piosenkę i opisz temat, nastrój i głos. Modele instrumentalne, takie jak MusicGen Stereo, tworzą muzykę bez wokalu.",
    },
    bestVoice: {
      q: "Który generator głosu AI brzmi najbardziej naturalnie?",
      a: "Do codziennego czytania na głos głosy OpenAI, takie jak {{defaultVoice}}, brzmią czysto i kosztują niewiele. Najbardziej ekspresyjne: xAI Eve i Inworld. Do wielu języków: Gemini. Najtaniej i bez filtra: Kokoro.",
    },
    free: {
      q: "Czy jest generator głosu AI z darmowymi kredytami?",
      a: "Tak. {{guestCredits}} darmowych kredytów miesięcznie bez konta, {{freeCredits}} z darmowym kontem, {{maxCredits}} z newsletterem. Z {{cheapVoiceName}} to około {{freeVoiceMinutes}} minut mowy. Te same kredyty płacą też za muzykę i transkrypcję.",
    },
    transcribeCost: {
      q: "Ile kosztuje transkrypcja AI?",
      a: "Od {{cheapSttHour}} za godzinę nagrania w {{cheapSttName}} do {{priceySttHour}} w {{priceySttName}}. Rozliczenie co do sekundy. Nieudane zadania nic nie kosztują.",
    },
    cloning: {
      q: "Czy mogę sklonować własny głos?",
      a: "Nie. {{appName}} oferuje gotowe głosy (łącznie {{voiceCount}}). Bez klonowania, bez wgrywania własnego głosu.",
    },
    uncensored: {
      q: "Czy jest zamiana tekstu na mowę bez cenzury?",
      a: "Tak. {{uncensoredVoiceCount}} głosów Kokoro jest w naszym poziomie bez cenzury: otwarty model bez filtra treści na to, co czyta. Większość modeli muzycznych i pozostałe głosy działają za filtrami swoich dostawców.",
    },
    modelsLink: "Przeglądaj wszystkie modele z danymi i cenami",
    videoLink: "Potrzebujesz też wideo? Generatory wideo AI w porównaniu",
    pricingLink: "Zobacz plany i ceny",
  },
  partners: {
    body: "Tworzysz muzykę, podcasty albo treści z lektorem? Program partnerski {{appName}} płaci ci stały udział w każdej płatności, którą polecisz.",
    link: "Dołącz do programu partnerskiego",
  },
  cta: {
    title: "Wybierz model. Wciśnij play.",
    subtitle:
      "Piosenki, bity, głosy i transkrypcje z jednego salda. Zacznij od {{guestCredits}} darmowych kredytów, bez zakładania konta.",
    music: "Twórz muzykę",
    voice: "Wygeneruj głos",
    transcribe: "Transkrybuj nagranie",
    models: "Przeglądaj wszystkie modele",
  },
};
