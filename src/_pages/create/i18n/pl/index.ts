import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    category: "Generowanie AI",
    imageAlt: "{{appName}} {{title}}",
  },
  eyebrow: "Twórz",
  back: "Wszystkie modele",
  chat: {
    title: "Wolisz po prostu poprosić?",
    body: "Każdy model czatu zrobi to za Ciebie. Opisz, czego chcesz, ustawienia dobierze sam.",
    cta: "Otwórz czat",
  },
  kinds: {
    image: {
      label: "Obraz",
      title: "Generator obrazów AI",
      metaTitle: "Generator obrazów AI bez cenzury - {{appName}}",
      description:
        "Wybierz model, rozmiar i proporcje. Wpisz prompt. Płacisz kredytami za każdy obraz.",
      keywords: "generator obrazów AI bez cenzury, grafika AI, tekst na obraz",
    },
    video: {
      label: "Wideo",
      title: "Generator wideo AI",
      metaTitle: "Generator wideo AI - {{appName}}",
      description:
        "Pełna kontrola: model, długość, proporcje, rozdzielczość, pierwsza i ostatnia klatka. Płacisz kredytami za każdy klip.",
      keywords: "generator wideo AI, tekst na wideo, obraz na wideo",
    },
    music: {
      label: "Muzyka",
      title: "Generator muzyki AI",
      metaTitle: "Generator muzyki AI - {{appName}}",
      description:
        "Opisz utwór, wybierz model i długość. Płacisz kredytami za każdy utwór.",
      keywords: "generator muzyki AI, tekst na muzykę, piosenka AI",
    },
    speech: {
      label: "Mowa",
      title: "Tekst na mowę",
      metaTitle: "Zamiana tekstu na mowę AI - {{appName}}",
      description:
        "Wklej tekst, wybierz głos, odbierz nagranie. Długie teksty też. Płacisz kredytami za znaki.",
      keywords: "tekst na mowę, głos AI, TTS",
    },
    transcribe: {
      label: "Transkrypcja",
      title: "Mowa na tekst",
      metaTitle: "Transkrypcja AI - {{appName}}",
      description:
        "Wrzuć spotkania, wywiady albo notatki głosowe. Wybierz model, odbierz transkrypcję. Płacisz kredytami za każdą sekundę nagrania.",
      keywords: "mowa na tekst, transkrypcja AI, audio na tekst",
    },
  },
};
