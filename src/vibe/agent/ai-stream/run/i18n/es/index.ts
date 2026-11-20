// oxlint-disable boilerplate/i18n-pattern -- imports model translations shared across scoped files
import { translations as modelTranslations } from "../../../../models/i18n/es";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  widget: {
    selectEndpoint: "Seleccione el punto final...",
    searchEndpoints: "Buscar puntos finales...",
    value: "{{value}}",
    selectEndpointHint:
      "Seleccione un punto final para configurar sus parámetros.",
    resolvingEndpoint: "Resolver el punto final...",
    preCallsDescription:
      "La herramienta llama ejecutada antes del aviso. Resultados inyectados como contexto.",
    addPreCall: "Añadir Pre-Call",
    preCalls: "Pre-calls",
    instructions: "Instrucciones",
    instructionsTooltip: "Instrucciones del sistema override",
    preCallsTooltip: "Ejecuciones de herramientas pre-llamadas",
    more: "Más",
    moreTooltip: "Opciones avanzadas",
    emptyState: {
      title: "Escoge una habilidad o favorito para empezar",
      description:
        "Utilice el selector de abajo para elegir una habilidad o cargar un favorito guardado. El modelo se resuelve automáticamente.",
    },
    noResponse: "No hay respuesta",
    cli: {
      submitting: "…",
      promptPrefix: "› ",
      skillPrefix: "habilidad ",
      promptHint:
        "entrar: enviar · esc: salida · pestaña: campo de conmutación",
      promptPlaceholder: "Ingrese su mensaje...",
      skillLabel: "habilidad: {{skill}}",
    },
  },
  models: { names: modelTranslations.names },
};
