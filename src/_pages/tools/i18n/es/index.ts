import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Herramientas AI",
  backToChat: "Volver a Chat",
  description:
    "Administrar qué herramientas están disponibles para el AI para usar. Pin herramientas para incluirlas siempre en contexto.",
  openFullPage: "Abrir página completa",
  modal: {
    title: "Herramientas AI",
    description:
      "Administrar qué herramientas están disponibles para el AI para usar. Pin herramientas para incluirlas siempre en contexto.",
  },
  widget: {
    tools: "Herramientas",
    overrideForSlot:
      "Resuelve la configuración de la herramienta para esta ranura",
    inheritedDefaults:
      "Actualmente utilizando predeterminados heredados. Permite personalizar.",
    customToolsConfigured:
      "Herramientas personalizadas configuradas para esta ranura.",
    deselectAll: "Deseleccionar todos",
    selectAll: "Seleccione todo",
    reset: "Reset",
    pinnedToContext: "afinado al contexto",
    requiresConfirmation: "requiere confirmación",
    loadingTools: "Carga de herramientas...",
  },
};
