import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title:
      "Čet s AI bez cenzúry. {{modelCount}} modelov na vyskúšanie zdarma | {{appName}}",
    category: "Platforma na četovanie s AI",
    description:
      "V jednom čete máš na výber {{modelCount}} modelov AI. Z nich {{uncensoredCount}} je bez cenzúry alebo s úpravou proti odmietaniu otázok. Vyskúšaj ich v prehliadači. Aj bez účtu získaš až {{credits}} kreditov zdarma. Filter si vyberáš ty.",
    imageAlt: "{{appName}}: platforma na necenzurovaný čet s AI",
    keywords:
      "necenzurovaná AI, necenzurovaný AI čet, AI čet bez filtrov, modely s odstráneným odmietaním odpovedí, AI bez filtrov, necenzurovaný chatbot, modely AI",
  },
  common: {
    error: {
      title: "Chyba",
      message: "Niečo sa pokazilo",
    },
  },
};
