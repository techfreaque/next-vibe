import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Estimación",
  tags: {
    payment: "pago",
    estimate: "Estimaciones",
    list: "lista"
  },
  get: {
    title: "Estimaciones de ventas",
    titleShort: "Estimaciones de ventas",
    description: "Estimaciones de búsqueda por referencia, cliente, correo electrónico, título o estimación ID y filtro por empresa o estado.",
    form: {
      title: "Filtros estimados",
      description: "Estimaciones de filtros y paginas"
    },
    response: {
      totalCount: "Total de cuentas",
      id: "Estimación ID",
      estimateNumber: "Número de estimaciones",
      status: "Situación",
      customerId: "Cliente ID",
      customerName: "Nombre del cliente",
      currency: "Moneda",
      total: "Total",
      validUntil: "Válido hasta",
      lineCount: "Cuenta de línea",
      createdAt: "Creado en",
      updatedAt: "Actualizado en"
    },
    errors: {
      unauthorized: {
        title: "Se requiere autenticación",
        description: "Inicia sesión para continuar"
      },
      validation: {
        title: "Error de validación",
        description: "Parámetros inválidos"
      },
      server: {
        title: "Error del servidor",
        description: "Error del servidor interno"
      },
      unknown: {
        title: "Error desconocido",
        description: "Ocurrió un error desconocido"
      },
      network: {
        title: "Error de red",
        description: "Ocurrió un error de red"
      },
      forbidden: {
        title: "Acceso denegado",
        description: "Acceso denegado"
      },
      notFound: {
        title: "No encontrado",
        description: "Compañía no encontrada"
      },
      conflict: {
        title: "Conflicto",
        description: "Se produjo un conflicto"
      },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Hay cambios sin salvar"
      }
    },
    success: {
      title: "Operación completada",
      description: "Estimaciones recuperadas"
    }
  },
  enums: {
    estimateStatus: {
      DRAFT: "Proyecto",
      SENT: "Sent",
      ACCEPTED: "Aceptado",
      DECLINED: "Declind",
      EXPIRED: "Gastos",
      CONVERTED: "Conversión"
    }
  },
  companyId: {
    label: "Company ID",
    description: "Filtro por empresa",
    placeholder: "Entrar en la empresa ID"
  },
  status: {
    label: "Situación",
    description: "Filtro por estado",
    placeholder: "Todos los estados"
  },
  customerId: {
    label: "Cliente ID",
    description: "Filtro por cliente",
    placeholder: "Ingrese al cliente ID"
  },
  page: {
    label: "Página",
    description: "Número de página"
  },
  pageSize: {
    label: "Tamaño de página",
    description: "Elementos por página"
  },
  widget: {
    back: "Atrás",
    title: "Estimaciones de ventas",
    newEstimate: "Nueva estimación",
    loading: "Estimaciones de carga...",
    noEstimates: "Todavía no hay estimaciones.",
    noEstimatesHint: "Crea tu primera estimación para empezar.",
    empty: {
      title: "Todavía no hay estimaciones.",
      hint: "Crea tu primera estimación para empezar.",
      cta: "Nueva estimación"
    },
    valid: "Valide",
    lines: "líneas",
    line: "línea",
    view: "Vista",
    status: {
      draft: "Proyecto",
      sent: "Sent",
      accepted: "Aceptado",
      declined: "Declind",
      expired: "Gastos",
      converted: "Conversión"
    }
  }
};
