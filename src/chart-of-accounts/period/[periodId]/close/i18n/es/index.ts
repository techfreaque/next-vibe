import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  post: {
    title: "Período cercano",
    titleShort: "Período cercano",
    description:
      "Cierra un período de contabilidad. Requiere no entradas de la revista DRAFT en el período.",
    periodId: {
      label: "Período ID",
      description: "El período a cerrar",
      placeholder: "Período UUID",
    },
    errors: {
      unauthorized: {
        title: "Se requiere autenticación",
        description: "Acceso requerido",
      },
      validation: {
        title: "Error de validación",
        description: "Período inválido ID",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "Función contable necesaria para cerrar períodos",
      },
      server: {
        title: "Error del servidor",
        description: "No podía cerrar el período",
      },
      unknown: {
        title: "Error desconocido",
        description: "Ocurrió un error inesperado",
      },
      conflict: {
        title: "Draft Entries Exist",
        description:
          "Todas las entradas de diario deben ser publicadas antes de cerrar",
      },
      network: {
        title: "Error de red",
        description: "No podía llegar al servidor",
      },
      notFound: {
        title: "No encontrado",
        description: "Período no encontrado",
      },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Tienes cambios sin guardar",
      },
    },
    success: {
      title: "Período cerrado",
      description: "El período contable se ha cerrado",
    },
    widget: {
      closeNamed: "Cerrar {{name}}",
      draftCount: "Asientos en borrador",
      closedLabel: "Cerrado",
      failedLabel: "Failed",
      confirmTitle: "¿Cerrar el Período de Contabilidad?",
      confirmDescription:
        "Cerrar este período es permanente. No se pueden publicar nuevas entradas de revistas en un periodo cerrado.",
      confirmButton: "Sí, Período cercano",
      cancelButton: "Cancelar",
    },
  },
  title: "Período cercano",
  description: "Cierre un período contable",
  category: "Gráfico de Cuentas",
  tag: "Período",
};
