// oxlint-disable boilerplate/i18n-pattern -- imports model translations shared across scoped files
import { translations as modelTranslations } from "../../../../models/i18n/it";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  widget: {
    selectEndpoint: "Seleziona l'endpoint...",
    searchEndpoints: "Ricerca di punti...",
    value: "{{value}}",
    selectEndpointHint:
      "Selezionare un endpoint per configurare i suoi parametri.",
    resolvingEndpoint: "Risolvere il punto finale...",
    preCallsDescription:
      "Le chiamate degli strumenti eseguite prima del prompt. Risultati iniettati come contesto.",
    addPreCall: "Aggiungi Pre-Call",
    preCalls: "Pre-calls",
    instructions: "Istruzioni",
    instructionsTooltip: "Istruzioni di sistema override",
    preCallsTooltip: "Esecuzioni degli strumenti pre-call",
    more: "Altro",
    moreTooltip: "Opzioni avanzate",
    emptyState: {
      title: "Scegli un'abilità o un favorito per iniziare",
      description:
        "Utilizzare il selettore qui sotto per scegliere un'abilità o caricare un favorito salvato. Il modello si risolve automaticamente.",
    },
    noResponse: "Nessuna risposta",
    cli: {
      submitting: "…",
      promptPrefix: "› ",
      skillPrefix: "abilità ",
      promptHint:
        "entrare: presentare · esc: uscita · scheda: campo di commutazione",
      promptPlaceholder: "Inserisci il tuo prompt...",
      skillLabel: "abilità: {{skill}}",
    },
  },
  models: { names: modelTranslations.names },
};
