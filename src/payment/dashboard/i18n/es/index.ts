import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    payment: "pago",
    dashboard: "dashboard"
  },
  get: {
    title: "Pago Dashboard",
    titleShort: "Dashboard",
    description: "Reseña de facturas, facturas y actividad de pago",
    form: {
      title: "Dashboard",
      description: "Resumen de pagos para su empresa"
    },
    response: {
      openInvoices: "Invocaciones abiertas",
      overdueInvoices: "Atrasados",
      unpaidBills: "Billetes no pagados",
      draftInvoices: "Proyecto de facturas",
      currency: "Moneda",
      recentInvoices: "Facturas recientes",
      openCount: "Cuenta abierta",
      openTotal: "Total abierto",
      overdueCount: "Conteo atrasado",
      overdueTotal: "Total atrasado",
      unpaidCount: "Conteo impagado",
      unpaidTotal: "Total impagado",
      draftCount: "Proyecto de cuenta"
    },
    errors: {
      validation: {
        title: "Error de validación",
        description: "Parámetros de solicitud no válidos"
      },
      network: {
        title: "Error de red",
        description: "Error de conexión de red"
      },
      unauthorized: {
        title: "Se requiere autenticación",
        description: "Inicia sesión para continuar"
      },
      forbidden: {
        title: "Acceso denegado",
        description: "Debe ser miembro de esta empresa"
      },
      notFound: {
        title: "No encontrado",
        description: "Compañía no encontrada"
      },
      server: {
        title: "Error del servidor",
        description: "Ocurrió un error interno del servidor"
      },
      unknown: {
        title: "Error desconocido",
        description: "Ocurrió un error desconocido"
      },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Hay cambios sin salvar"
      },
      conflict: {
        title: "Conflicto",
        description: "Se produjo un conflicto"
      }
    },
    success: {
      title: "Operación completada",
      description: "Datos de panel cargados"
    }
  },
  companyId: {
    label: "Company ID",
    description: "La empresa para mostrar datos de panel de control",
    placeholder: "Entrar en la empresa ID"
  },
  widget: {
    loading: "Carga dashboard...",
    noData: "Ninguna empresa seleccionada.",
    noDataHint: "Seleccione una empresa para ver la vista general del pago.",
    openInvoices: "Invocaciones abiertas",
    overdue: "Atrasados",
    unpaidBills: "Billetes no pagados",
    draftInvoices: "Proyectos",
    quickActions: "Medidas rápidas",
    newInvoice: "Nueva factura",
    allInvoices: "Todas las facturas",
    newEstimate: "Nueva estimación",
    allEstimates: "Estimación",
    allBills: "Bills",
    recentInvoices: "Facturas recientes",
    noRecentInvoices: "No hay facturas recientes.",
    view: "Vista",
    due: "Sumas",
    status: {
      draft: "Proyecto",
      open: "Abierto",
      paid: "Pagado",
      void: "Vacío",
      uncollectible: "Incolectible"
    }
  }
};
