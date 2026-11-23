import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    category: "Generowanie AI",
    imageAlt: "{{appName}} {{title}}",
  },
  studio: "Studio multimediów",
  navName: "Studio",
  hub: {
    metaTitle: "Studio mediów AI: obrazy, wideo, muzyka i głos",
    metaDescription:
      "Generuj obrazy, klipy wideo, muzykę i mowę albo transkrybuj nagrania. Popularne i nieocenzurowane modele obok siebie. Płacisz za wynik.",
    keywords:
      "studio mediów AI, nieocenzurowany generator obrazów AI, generator wideo AI, generator muzyki AI, tekst na mowę, mowa na tekst",
    title: "Studio mediów",
    subtitle:
      "Pięć narzędzi. Wszystkie ważne modele, także nieocenzurowane. Płacisz za wynik, a wszystko, co stworzysz, zostaje u Ciebie.",
    from: "Od {{price}}",
    free: "Za darmo",
    models: "Modele: {{count}}",
    voices: "Głosy: {{count}}",
    open: "Otwórz",
  },
  asyncProgress:
    "Trwa generowanie. Wideo i muzyka zwykle zajmują od jednej do trzech minut. Postęp widać też w Twojej historii.",
  ooc: {
    title: "Za mało darmowych kredytów",
    need: "To uruchomienie kosztuje {{amount}} kredytów.",
    description:
      "Darmowe konto dostaje {{signedIn}} kredytów miesięcznie, {{max}} z newsletterem. Po rejestracji wrócisz tutaj z tymi samymi ustawieniami.",
    signUp: "Załóż darmowe konto",
    defaults: "Tańsze ustawienia",
    haveAccount: "Masz już konto?",
    logIn: "Zaloguj się",
  },
  moreOptions: "Więcej opcji",
  modelDefault: "Auto",
  model: "Model",
  voice: "Głos",
  estimate: "Szacowany koszt",
  credits: "{{amount}} kred.",
  failed: "Nie udało się ukończyć pracy",
  historyError: "Nie można otworzyć historii studia. Spróbuj ponownie.",
  unavailable: "Żaden model dla tego formatu nie jest teraz dostępny.",
  file: "Plik audio",
  language: "Język nagrania",
  referenceAudio: "Adres nagrania wzorcowego",
  durationSeconds: "Długość nagrania w sekundach",
  duration: "Długość",
  ratio: "Proporcje",
  size: "Rozmiar",
  quality: "Jakość",
  reference: "Adres obrazu referencyjnego",
  lastFrame: "Adres ostatniej klatki",
  creating: "Tworzenie · {{seconds}} s",
  submitImage: "Utwórz obraz",
  submitVideo: "Utwórz wideo",
  submitMusic: "Utwórz muzykę",
  submitSpeech: "Utwórz nagranie",
  submitTranscribe: "Transkrybuj nagranie",
  meteredCost: "Ostateczny koszt zależy od zużycia podanego przez dostawcę.",
  estimatePending: "Dodaj nagranie, aby oszacować koszt.",
  needsCredits: "Wymaga {{amount}} kredytów",
  units: {
    image: "{{amount}} kred. / obraz",
    video: "{{amount}} kred. / s",
    music: "{{amount}} kred. / utwór",
    speech: "{{amount}} kred. / 1000 znaków",
    transcribe: "{{amount}} kred. / min",
    tokenImage: "≈ {{amount}} kred. / obraz",
  },
  kinds: {
    image: {
      label: "Obraz",
      tab: "Obraz",
      pitch:
        "Tekst na obraz albo edycja zdjęcia. Fotorealizm, anime, sztuka, cokolwiek opiszesz.",
      title: "Stwórz obraz",
      metaTitle: "Generator obrazów AI bez cenzury: {{appName}}",
      metaDescription:
        "Twórz obrazy z tekstu albo edytuj zdjęcie referencyjne. Modele mainstreamowe i bez cenzury obok siebie, od fotorealizmu po anime. Płacisz za wynik.",
      description: "Opisz scenę i wybierz kadr.",
      keywords: "generator obrazów AI bez cenzury, grafika AI, tekst na obraz",
    },
    video: {
      label: "Wideo",
      tab: "Wideo",
      pitch:
        "Z tekstu lub pierwszej klatki powstaje klip. Ty wybierasz długość, proporcje i rozdzielczość.",
      title: "Stwórz wideo",
      metaTitle: "Generator wideo AI: {{appName}}",
      metaDescription:
        "Zamień prompt albo pierwszą klatkę w klip wideo. Sam wybierasz długość, proporcje i rozdzielczość w czołowych modelach wideo. Płacisz za wynik.",
      description: "Wpraw scenę w ruch, od pierwszej do ostatniej klatki.",
      keywords: "generator wideo AI, tekst na wideo, obraz na wideo",
    },
    music: {
      label: "Muzyka",
      tab: "Muzyka",
      pitch:
        "Cały utwór z jednego promptu: nastrój, gatunek, instrumenty, długość.",
      title: "Skomponuj muzykę",
      metaTitle: "Generator muzyki AI: {{appName}}",
      metaDescription:
        "Cały utwór z jednego promptu: nastrój, gatunek, instrumenty i długość. Kilka modeli muzycznych w jednym studiu. Płacisz za wynik.",
      description: "Dobierz nastrój, instrumenty i długość utworu.",
      keywords: "generator muzyki AI, tekst na muzykę, piosenka AI",
    },
    speech: {
      label: "Głos",
      tab: "Głos",
      pitch: "Twój tekst czytany naturalnymi głosami w wielu językach.",
      title: "Nadaj tekstowi głos",
      metaTitle: "Zamiana tekstu na mowę AI: {{appName}}",
      metaDescription:
        "Wklej tekst, wybierz głos, pobierz nagranie. Naturalne głosy AI w wielu językach od kilku dostawców. Płacisz za wynik.",
      description: "Wybierz głos, który przeczyta Twój tekst.",
      keywords: "tekst na mowę, głos AI, TTS",
    },
    transcribe: {
      label: "Transkrypcja",
      tab: "Tekst",
      pitch: "Wgraj nagranie, odbierz czysty tekst. Pobierz go jako plik.",
      title: "Przepisz nagranie",
      metaTitle: "Transkrypcja AI: {{appName}}",
      metaDescription:
        "Wgraj nagranie i odbierz czysty tekst gotowy do pobrania. Dokładne modele zamiany mowy na tekst w wielu językach. Płacisz za wynik.",
      description: "Zamień nagranie w tekst gotowy do pobrania.",
      keywords: "mowa na tekst, transkrypcja AI, audio na tekst",
    },
  },
};
