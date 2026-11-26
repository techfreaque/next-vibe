import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  enums: {
    country: {
      AT: "Austria (ÖKR)",
      DE: "Alemania (SKR03)",
      XX: "Plantilla NIIF genérica",
      SK: "Eslovaquia (Rámcová účtová osnova)",
    },
  },
  post: {
    title: "Configura el plan contable",
    titleShort: "Configura el plan contable",
    description:
      "Completa las cuentas de tu empresa a partir de una plantilla estándar.",
    companyId: {
      label: "Empresa",
      description: "Elige la empresa que quieras configurar.",
      placeholder: "Elige una empresa",
    },
    country: {
      label: "Plantilla contable",
      description: "Elige la estructura de cuentas que quieras añadir.",
      placeholder: "Elige una plantilla",
    },
    response: {
      created: "Cuentas creadas",
      skipped: "Cuentas conservadas",
    },
    errors: {
      unauthorized: {
        title: "Se requiere autenticación",
        description:
          "Debes estar conectado para configurar un gráfico de cuentas",
      },
      validation: {
        title: "Error de validación",
        description: "Comprueba la empresa y la plantilla contable.",
      },
      forbidden: {
        title: "Acceso denegado",
        description:
          "Sólo los propietarios y administradores de la empresa pueden establecer cuentas",
      },
      server: {
        title: "Error del servidor",
        description: "Intenta aplicar de nuevo la plantilla.",
      },
      unknown: {
        title: "Error desconocido",
        description: "Ocurrió un error inesperado",
      },
      conflict: {
        title: "Revisa la configuración",
        description:
          "Actualiza las cuentas de la empresa antes de aplicar la plantilla.",
      },
      network: {
        title: "Error de red",
        description: "No podía llegar al servidor",
      },
      notFound: {
        title: "Plantilla no encontrada",
        description:
          "No se ha encontrado ninguna plantilla de cuentas para este país",
      },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Tienes cambios sin guardar",
      },
    },
    success: {
      title: "Plan contable listo",
      description:
        "Se ha aplicado la plantilla. Revisa las cuentas añadidas y las que se conservan.",
    },
    widget: {
      review: "Revisa la configuración",
      previewLoading: "Buscando cuentas existentes…",
      previewFailed: "El número de cuentas existentes no está disponible.",
      existing: "Cuentas existentes: {{count}}.",
      empty: "Esta empresa todavía no tiene cuentas contables.",
      consequences:
        "La configuración añade los códigos de la plantilla que falten en la empresa y conserva los datos existentes.",
      submit: "Añadir cuentas de la plantilla",
      back: "Volver",
      viewAccounts: "Abrir el plan contable",
      viewPeriods: "Ver periodos contables",
    },
  },
  title: "Cargo de configuración de cuentas",
  description: "Iniciar las cuentas de la empresa desde la plantilla",
  category: "Gráfico de Cuentas",
  tag: "Configuración inicial",
};
