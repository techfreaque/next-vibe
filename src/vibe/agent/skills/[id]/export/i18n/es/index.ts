import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Herramientas AI",
  tags: {
    skills: "habilidades",
  },
  get: {
    title: "Exportar tarjeta de personaje",
    titleShort: "Exportar tarjeta",
    description:
      "Exporta una habilidad como tarjeta de personaje V2 en formato JSON. Impórtala en SillyTavern, RisuAI, Chub o cualquier app con formato Tavern, o guárdala como copia de seguridad. Funciona con tus propias habilidades, las habilidades públicas de la comunidad y las habilidades integradas públicas. La tarjeta da crédito al creador y enlaza a la página de la habilidad.",
    dynamicTitle: "Exportar: {{name}}",
    id: {
      label: "Habilidad",
      description: "La habilidad que se exporta",
    },
    widget: {
      intro:
        "Tu personaje, en un archivo que es tuyo. Tarjeta de personaje V2, el formato que importan SillyTavern, RisuAI y Chub.",
      included:
        "Incluye: nombre, prompt completo del personaje, eslogan, descripción, creador y un enlace a esta página.",
      download: "Descargar tarjeta",
      copy: "Copiar JSON",
      copied: "Copiado",
    },
    card: {
      skillPage: "Página de la habilidad: {{url}}",
    },
    response: {
      name: { content: "Nombre" },
      fileName: { content: "Nombre del archivo" },
      card: { content: "JSON de la tarjeta" },
    },
    errors: {
      validation: {
        title: "Solicitud no válida",
        description: "Revisa el ID de la habilidad.",
      },
      network: {
        title: "Error de red",
        description: "No se pudo conectar con el servidor.",
      },
      unauthorized: {
        title: "Inicia sesión",
        description: "Inicia sesión para exportar esta habilidad.",
      },
      forbidden: {
        title: "No permitido",
        description: "No puedes exportar esta habilidad.",
      },
      notFound: {
        title: "Habilidad no encontrada",
        description: "Esta habilidad no existe o no es visible para ti.",
      },
      server: {
        title: "Error al exportar",
        description: "Algo falló al crear la tarjeta. Inténtalo de nuevo.",
      },
      unknown: {
        title: "Error desconocido",
        description: "Ocurrió un error inesperado.",
      },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Tienes cambios sin guardar.",
      },
      conflict: {
        title: "Conflicto",
        description:
          "La habilidad cambió durante la exportación. Inténtalo de nuevo.",
      },
    },
    success: {
      title: "Tarjeta lista",
      description: "Descárgala o copia el JSON.",
    },
  },
};
