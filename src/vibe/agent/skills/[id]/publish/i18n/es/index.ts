import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Herramientas AI",
  tags: {
    skills: "habilidades",
  },
  enums: {
    skillStatus: {
      draft: "Proyecto",
      published: "Publicado",
      unlisted: "No incluidos en la lista",
    },
  },
  patch: {
    title: "Publish Skill",
    titleShort: "Publish Skill",
    description:
      "Publica o retira una habilidad personalizada. El estado PUBLISHED la hace visible en el catálogo de la comunidad.",
    dynamicTitle: "Publicar: {{name}}",
    status: {
      label: "Situación",
      description:
        "Usa PUBLISHED para mostrar la habilidad en el catálogo, DRAFT para ocultarla o UNLISTED para dar acceso solo por enlace.",
    },
    changeNote: {
      label: "Nota de cambio",
      description: "Nota opcional que describe lo que cambió en esta versión.",
      placeholder: "Por ejemplo. Mejora de la claridad del sistema",
    },
    errors: {
      validation: {
        title: "Error de validación",
        description: "Solicitud inválida",
      },
      network: {
        title: "Error de red",
        description: "No se pudo conectar con el servidor",
      },
      unauthorized: {
        title: "Se requiere autenticación",
        description: "Debes estar conectado para publicar",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "Sólo puedes publicar tus propias habilidades.",
      },
      notFound: {
        title: "No encontrado",
        description: "Habilidad no encontrada",
      },
      server: {
        title: "Error del servidor",
        description: "Se produjo un error al publicar",
      },
      unknown: {
        title: "Error desconocido",
        description: "Ocurrió un error inesperado",
      },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Tienes cambios sin guardar",
      },
      conflict: { title: "Conflicto", description: "Se produjo un conflicto" },
    },
    success: {
      title: "Habilidad publicada",
      description: "Su habilidad ahora es visible en la tienda comunitaria",
    },
    response: {
      status: { content: "Situación" },
      publishedAt: { content: "Publicado en" },
    },
    backButton: {
      label: "Atrás",
    },
    button: {
      submit: "Guardar el estado",
      loading: "Salvando...",
    },
  },
};
