// oxlint-disable boilerplate/i18n-pattern -- imports model translations shared across scoped files
import { translations as modelTranslations } from "../../../../models/i18n/sk";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  widget: {
    selectEndpoint: "Vybrať koncový bod…",
    searchEndpoints: "Hľadať koncové body…",
    value: "{{value}}",
    selectEndpointHint: "Vyber koncový bod a nastav jeho parametre.",
    resolvingEndpoint: "Vyhľadáva sa koncový bod…",
    preCallsDescription:
      "Volania nástrojov pred odoslaním zadania. Výsledky sa pridajú do kontextu.",
    addPreCall: "Pridať predbežné volanie",
    preCalls: "Predbežné volania",
    instructions: "Pokyny",
    instructionsTooltip: "Vlastné systémové pokyny",
    preCallsTooltip: "Predbežné volania nástrojov",
    more: "Viac",
    moreTooltip: "Pokročilé možnosti",
    emptyState: {
      title: "Vyber zručnosť alebo obľúbenú položku",
      description:
        "Vyber zručnosť alebo načítaj uloženú obľúbenú položku. Model sa určí automaticky.",
    },
    noResponse: "Žiadna odpoveď",
    cli: {
      submitting: "…",
      promptPrefix: "› ",
      skillPrefix: "zručnosť ",
      promptHint: "Enter: odoslať · Esc: ukončiť · Tab: prejsť na ďalšie pole",
      promptPlaceholder: "Zadaj pokyn…",
      skillLabel: "zručnosť: {{skill}}",
    },
  },
  models: { names: modelTranslations.names },
};
