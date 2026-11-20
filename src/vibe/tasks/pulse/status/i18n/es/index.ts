import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Estado del pulso",
  tags: {
    status: "Situación",
  },
  get: {
    title: "Estado del pulso",
    titleShort: "Estado del pulso",
    description: "Obtener estado de monitoreo de salud del pulso",
    container: {
      title: "Estado de salud del pulso",
      description:
        "Control de la salud y las estadísticas de ejecución del pulso",
    },
    fields: {
      status: {
        title: "Situación",
        label: "Estado del pulso",
        description: "Estado de salud del pulso actual",
      },
      lastPulseAt: {
        title: "Último pulso",
        label: "Último pulso",
        description: "Timetamp of last pulso execution",
      },
      successRate: {
        title: "Tasa de éxito",
        label: "Tasa de éxito",
        description: "Porcentaje de ejecuciones de pulsos exitosas",
      },
      totalExecutions: {
        title: "Total Execuciones",
        label: "Total Execuciones",
        description: "Número total de ejecuciones de pulsos",
      },
    },
    examples: {
      basic: {
        title: "Solicitud de Estado básico",
      },
      success: {
        title: "Respuesta del Estado con éxito",
      },
    },
    errors: {
      unauthorized: {
        title: "Se requiere autenticación",
        description: "Inicia sesión para continuar",
      },
      internal: {
        title: "Error interno",
        description: "Ocurrió un error interno del servidor",
      },
      unknown: {
        title: "Error desconocido",
        description: "Ocurrió un error desconocido",
      },
      network: {
        title: "Error de red",
        description: "Ocurrió un error de red",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "No tienes acceso",
      },
      notFound: {
        title: "No encontrado",
        description: "No se encontró el recurso",
      },
      conflict: {
        title: "Conflicto",
        description: "Hay un conflicto entre los datos",
      },
      unsaved: {
        title: "Cambios sin guardar",
        description: "Hay cambios sin salvar",
      },
      validation: {
        title: "Error de validación",
        description: "Parámetros de solicitud no válidos",
      },
    },
    success: {
      title: "Operación completada",
      description: "La operación se completó correctamente",
    },
  },
};
