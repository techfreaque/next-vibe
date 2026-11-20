import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  enums: {
    country: {
      AT: "AT. ÖKR",
      DE: "DE. SKR03",
      XX: "XX. IFRS Genérico",
    },
  },
  post: {
    title: "Inicializar el Gráfico de Cuentas",
    titleShort: "Configuración inicial",
    description:
      "Configurar el diagrama de cuentas de una empresa de una plantilla específica para cada país. Idempotent. seguro para ejecutar múltiples veces.",
    companyId: {
      label: "Company ID",
      description: "La empresa para inicializar el gráfico de cuentas para",
      placeholder: "Entrar en la empresa UUID",
    },
    country: {
      label: "País",
      description:
        "Estándar de uso para el país (AT = ÖKR, DE = SKR03, XX = IFRS Genérico)",
      placeholder: "Seleccionar país",
    },
    response: {
      created: "Contabilidad creada",
      skipped: "Cuentas desaparecidas (ya existían)",
    },
    errors: {
      unauthorized: {
        title: "Se requiere autenticación",
        description:
          "Debes estar conectado para configurar un gráfico de cuentas",
      },
      validation: {
        title: "Error de validación",
        description: "Entrada inválida. compañía de verificación ID y país",
      },
      forbidden: {
        title: "Acceso denegado",
        description:
          "Sólo los propietarios y administradores de la empresa pueden establecer cuentas",
      },
      server: {
        title: "Error del servidor",
        description: "La configuración falló, por favor inténtelo de nuevo",
      },
      unknown: {
        title: "Error desconocido",
        description: "Ocurrió un error inesperado",
      },
      conflict: {
        title: "Ya se inicia",
        description: "Esta compañía ya tiene un gráfico de cuentas",
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
      title: "Cargo de Cuentas Listos",
      description: "Todas las cuentas han sido creadas para la empresa",
    },
    widget: {
      viewAccounts: "Ver Lista de Cuentas",
    },
  },
  title: "Cargo de configuración de cuentas",
  description: "Iniciar las cuentas de la empresa desde la plantilla",
  category: "Gráfico de Cuentas",
  tag: "Configuración inicial",
};
