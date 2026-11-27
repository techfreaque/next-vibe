import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Contactos",
  tags: {
    leads: "Contactos",
    skill: "Habilidad",
  },

  patch: {
    title: "Establecer la habilidad de contacto",
    titleShort: "Liderazgo",
    description:
      "Recordar qué habilidad trajo este contacto (atribución de primer contacto)",
    skillId: {
      label: "Habilidad",
      description: "Elige una habilidad publicada por la comunidad.",
    },
    errors: {
      validation: {
        title: "Elige una habilidad",
        description: "Elige una habilidad publicada por la comunidad.",
      },
      network: {
        title: "Error de red",
        description:
          "No podía llegar al servidor. Por favor, inténtalo de nuevo.",
      },
      unauthorized: {
        title: "Se requiere autenticación",
        description: "Debes estar conectado para actualizar esto.",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "No tienes permiso para actualizar esta pista.",
      },
      notFound: {
        title: "Cuenta o sesión no encontradas",
        description: "No se encontró la pista.",
      },
      server: {
        title: "Error del servidor",
        description:
          "Se produjo un error interno. Por favor, inténtalo de nuevo.",
      },
      unknown: {
        title: "Error desconocido",
        description: "Se produjo un error inesperado.",
      },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Tienes cambios sin salvar.",
      },
      conflict: {
        title: "Conflicto",
        description: "Se produjo un conflicto.",
      },
    },
    success: {
      title: "Habilidad atribuida",
      description: "La habilidad se ha registrado para esta pista.",
    },
    skipped: {
      title: "No se registró",
      description:
        "La primera habilidad del visitante sigue registrada. Prueba otra habilidad en una sesión nueva.",
    },
    submit: "Attribute habilidad",
  },
};
