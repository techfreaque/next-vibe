import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  dashboard: {
    title: "Contabilidad Dashboard",
    titleShort: "Dashboard",
    description:
      "Resúmenes de su estado contable: período abierto, cuenta de entrada y navegación rápida a todas las herramientas contables.",
    companyId: {
      label: "Company ID",
      description: "Compañía para cargar el tablero de mando",
      placeholder: "Company UUID",
    },
    response: {
      currentPeriod: "Período actual",
      accountCount: "Cuentas",
      draftEntryCount: "Draft Entries",
      postedThisMonthCount: "Posted This Month",
      hasSetup: "Configuración inicial",
      currency: "Moneda",
    },
    success: {
      title: "Cargadora de pizarra",
      description: "Resumen de la contabilidad recuperado",
    },
    errors: {
      unauthorized: {
        title: "Se requiere autenticación",
        description: "Acceso requerido",
      },
      validation: {
        title: "Error de validación",
        description: "Comprueba tus entradas",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "No hay acceso a esta empresa",
      },
      server: {
        title: "Error del servidor",
        description: "No se puede cargar el panel de mando",
      },
      unknown: {
        title: "Error desconocido",
        description: "Ocurrió un error inesperado",
      },
      conflict: { title: "Conflicto", description: "Conflicto de datos" },
      network: {
        title: "Error de red",
        description: "No podía llegar al servidor",
      },
      notFound: {
        title: "No encontrado",
        description: "Compañía no encontrada",
      },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Tienes cambios sin guardar",
      },
    },
    widget: {
      currentPeriod: "Período actual",
      noPeriod: "No hay período abierto",
      createPeriod: "Crear período",
      totalAccounts: "Cuentas",
      viewAccounts: "Vista",
      draftEntries: "Draft Entries",
      viewDrafts: "Vista",
      postedThisMonth: "Posted This Month",
      configured: "Configurado",
      notSetUp: "No se establece",
      runSetup: "Configuración de ejecución",
      setupStatus: "Configuración inicial",
      loading: "Carga dashboard...",
      noData: "No se dispone de datos contables.",
      navTitle: "Contabilidad",
      chartOfAccounts: "Gráfico de Cuentas",
      journalEntries: "Journal Entries",
      periods: "Períodos",
      balanceSheet: "Hoja de equilibrio",
      profitLoss: "Profit &quot; Loss &quot;",
      trialBalance: "Saldo de juicio",
      taxReport: "Informe fiscal",
      companies: "Empresas",
      invoices: "Facturas",
      bills: "Bills",
      selectCompany: "Selecciona una empresa para ver sus registros contables.",
    },
  },
  category: "Contabilidad",
  tag: "dashboard",
};
