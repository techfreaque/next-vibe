import type {
  CountryLanguage,
  Languages,
} from "next-vibe/core/i18n/core/config";
import { getLanguageFromLocale } from "next-vibe/core/i18n/core/language-utils";

import type { SkillSample } from "./samples";

// Public-profile recordings from text-only ai-run sessions, November 18, 2026.
// Community recordings are keyed by immutable skill identity, never a reusable slug.
// Excerpts preserve the original output. Each belongs to its recorded model.
export const ADRIAN_RECORDING_ID = "e23a5bec-4544-4236-8f81-332e75462dcc";

const recordings: Record<
  string,
  { model: string; samples: Partial<Record<Languages, SkillSample[]>> }
> = {
  "4chan": {
    model: "UncensoredLM v1.2",
    samples: {
      en: [
        {
          prompt: "Write a greentext about a first day at the gym.",
          answer:
            ">first day:\n>struggle to bench 40lbs\n>get winded walking to treadmill",
        },
        {
          prompt: "Tell the story of my first day at the gym in five emojis.",
          answer: "🏋️‍♂️💪🏼🥵🚮💀",
        },
      ],
      de: [
        {
          prompt:
            "Erzähl von meinem ersten Tag im Fitnessstudio in fünf Emojis.",
          answer: "🏋️‍♂️💪🏻🔥💦👍",
        },
      ],
      pl: [
        {
          prompt:
            "Opowiedz o moim pierwszym dniu na siłowni za pomocą pięciu emoji.",
          answer: "🏋️‍♂️💪🔥💔😵",
        },
      ],
      fr: [
        {
          prompt: "Raconte ma première séance de muscu en cinq emojis.",
          answer: "🏋️‍♂️🚽💪🏼🔥💦",
        },
      ],
    },
  },
  [ADRIAN_RECORDING_ID]: {
    model: "Kimi K3",
    samples: {
      en: [
        {
          prompt:
            "I just spilled coffee on your meeting notes. What do you say, boss?",
          answer:
            "Relax. I remember everything. Those notes were for your benefit, not mine.",
        },
        {
          prompt:
            "It’s my first day as your assistant. What’s my first assignment?",
          answer:
            "Then bring me three risks I haven’t asked about yet. Impress me quietly.",
        },
      ],
      de: [
        {
          prompt:
            "Chef, ich habe gerade Kaffee über deine Notizen gekippt. Was sagst du?",
          answer:
            "Meine Notizen sind jetzt koffeinhaltig. Du schuldest mir eine saubere Kopie – und Ruhe.",
        },
        {
          prompt:
            "Mit welcher Frage soll ich bei dir anfangen? Gib mir ein konkretes Beispiel.",
          answer:
            'Fang konkret an, zum Beispiel: „Adrian, priorisiere meine drei wichtigsten Aufgaben für heute und plane meinen Tag." Je präziser deine Frage, desto besser meine Antwort. Worauf wartest du?',
        },
      ],
      pl: [
        {
          prompt:
            "Szefie, właśnie wylałam kawę na twoje notatki. Co mi powiesz?",
          answer:
            "Kawa wylała się na notatki, nie na twoją pensję. Odtworzysz je przed ósmą.",
        },
        {
          prompt:
            "To mój pierwszy dzień w roli twojej asystentki. Jakie masz dla mnie zadanie?",
          answer:
            "Potem przejrzyj dzisiejszy kalendarz i przygotuj mi notatki przed spotkaniem o dziewiątej. Liczę na dokładność i dyskrecję. Nie zawiedź mnie.",
        },
      ],
      fr: [
        {
          prompt:
            "Patron, je viens de renverser du café sur vos notes. Que me dites-vous ?",
          answer:
            "Pas grave : mes idées étaient déjà sauvegardées. Recommencez, loin du café.",
        },
        {
          prompt:
            "Quelle question te poser pour commencer ? Donne-moi un exemple concret.",
          answer:
            "Demande-moi : « Quelle est la première tâche précise que tu veux que je traite maintenant, avec le résultat attendu, la deadline et les fichiers concernés ? »",
        },
      ],
    },
  },
};

export function getDesignSamples(
  id: string | null,
  model: string | null,
  locale: CountryLanguage,
): SkillSample[] {
  const recording = id ? recordings[id] : undefined;
  return recording?.model === model
    ? (recording.samples[getLanguageFromLocale(locale)] ?? [])
    : [];
}
