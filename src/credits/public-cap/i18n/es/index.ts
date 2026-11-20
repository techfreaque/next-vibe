import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    publicCap: "public-cap",
    admin: "admin",
  },
  get: {
    perDayUnit: "acreditaciones/día",
    title: "Consigue el Cap Público de Libre Tier",
    titleShort: "Cap de Tier libre",
    description: "Ver el gasto de crédito global de hoy en día y la tapa",
    container: {
      title: "Público Free-Tier Daily Cap",
      description:
        "Límite de gasto diario mundial para usuarios no remunerados",
    },
    spendToday: {
      content: "Pasado hoy",
    },
    capAmount: {
      content: "Capitán diario",
    },
    remainingToday: {
      content: "Permanecer hoy",
    },
    percentUsed: {
      content: "Usado",
    },
    lastResetAt: {
      content: "Última reiniciación en",
    },
    capExceeded: {
      content: "Cap Exceed",
    },
    perLeadCap: { content: "Capa Per-Lead" },
    perIpCap: { content: "Per- IP Cap" },
    topSpenders: { content: "Top Free Spenders Today" },
    recentEvents: { content: "Eventos recientes de Cap" },
    noData: "Nada todavía hoy.",
    success: {
      title: "Estado de la capa",
      description:
        "Estado público de gorro de nivel libre recuperado con éxito",
    },
    errors: {
      validation: {
        title: "Error de validación",
        description: "Parámetros de solicitud no válidos",
      },
      network: {
        title: "Error de red",
        description: "La conexión de red falló",
      },
      unauthorized: {
        title: "Se requiere autenticación",
        description: "Inicia sesión para continuar",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "Acceso de los administradores necesario",
      },
      notFound: {
        title: "No encontrado",
        description: "Configuración de capas no encontrada",
      },
      server: {
        title: "Error del servidor",
        description: "Fallado para recuperar el estado de la tapa",
      },
      unknown: {
        title: "Error desconocido",
        description: "Ocurrió un error inesperado",
      },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Tienes cambios sin guardar",
      },
      conflict: {
        title: "Conflicto",
        description: "Conflicto de recursos",
      },
    },
  },
  post: {
    title: "Actualización Público Cap de acceso libre",
    titleShort: "Actualizar Cap",
    description:
      "Actualizar la tapa global de gasto de crédito diario para usuarios no pagados",
    capAmount: {
      label: "Cap diario (créditos)",
      description:
        "Créditos máximos Los usuarios que no pagan pueden gastar colectivamente por día",
      placeholder: "por ejemplo 500",
    },
    perLeadCap: {
      label: "Per-Lead Daily Cap (créditos)",
      description:
        "Créditos máximo gratis que un huésped/palabra puede quemar por día",
      placeholder: "por ejemplo 20",
    },
    perIpCap: {
      label: "Per- IP Daily Cap (créditos)",
      description: "Máximas créditos gratis un IP puede quemar por día",
      placeholder: "por ejemplo 40",
    },
    message: {
      content: "Resultado",
    },
    success: {
      title: "Actualizado Cap",
      description: "Gorra diaria actualizada con éxito",
    },
    errors: {
      validation: {
        title: "Error de validación",
        description: "La cantidad de la tapa debe ser un número positivo",
      },
      network: {
        title: "Error de red",
        description: "La conexión de red falló",
      },
      unauthorized: {
        title: "Se requiere autenticación",
        description: "Inicia sesión para continuar",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "Acceso de los administradores necesario",
      },
      notFound: {
        title: "No encontrado",
        description: "Configuración de capas no encontrada",
      },
      server: {
        title: "Error del servidor",
        description: "Failed to update cap",
      },
      unknown: {
        title: "Error desconocido",
        description: "Ocurrió un error inesperado",
      },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Tienes cambios sin guardar",
      },
      conflict: {
        title: "Conflicto",
        description: "Conflicto de recursos",
      },
    },
  },
  repository: {
    capUpdated: "Juego de tapas diarias a créditos {{capAmount}}",
    capExceeded:
      "Límite diario de nivel libre alcanzado. Por favor, ingrese o vuelva a intentarlo mañana.",
    leadCapExceeded:
      "Usted golpeó el límite libre de hoy. Regístrese o agregue su correo electrónico para más créditos.",
    capUnavailable:
      "El tier libre es temporalmente indisponible. Por favor, inscríbete para continuar.",
    getCapFailed: "Failed to retrieve free-tier cap settings",
    updateCapFailed: "Failed to update free-tier cap",
    incrementFailed: "Failed to record free-tier spend",
  },
};
