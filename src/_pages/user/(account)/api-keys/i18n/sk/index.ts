import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Kľúče API",
  metaTitle: "Kľúče API | {{appName}}",
  description:
    "Jeden kľúč pre všetky modely ({{modelCount}}). API podporuje formáty OpenAI a Anthropic. Platíš kreditmi.",
  unauthenticated: {
    title: "Prihlás sa a spravuj svoje kľúče API",
    subtitle:
      "Kľúče sú viazané na tvoj účet. Prihlás sa, vyber si predplatné od {{subPrice}} mesačne a prvý kľúč si vytvoríš za pár sekúnd.",
    point1:
      "Počet modelov cez jeden koncový bod kompatibilný s OpenAI: {{modelCount}}",
    point2:
      "Funguje s Claude Code, Codexom, OpenCode, Cline aj s ľubovoľným SDK od OpenAI",
    point3: "Rovnaká cena ako pri čete. Za API nedostaneš samostatnú faktúru.",
    logIn: "Prihlásiť sa",
    signUp: "Vytvoriť účet",
    docs: "Prečítať si najprv dokumentáciu API",
  },
};
