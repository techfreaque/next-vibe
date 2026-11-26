import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Facturación",
  tags: {
    payment: "pago",
    invoice: "factura",
  },
  get: {
    title: "Facturas de clientes",
    titleShort: "Facturas de clientes",
    description:
      "Buscar facturas por número de documento, factura ID o cliente ID, y filtrar por empresa o estado.",
    form: {
      title: "Filtros de facturación",
      description: "Filtrar la lista de facturas",
    },
    response: {
      customerName: "Cliente",
      total: "Total",
      invoices: "Facturas",
      id: "Factura ID",
      invoiceSequenceNumber: "Número de facturación",
      customerId: "Cliente ID",
      currency: "Moneda",
      status: "Situación",
      amount: "Monto",
      dueDate: "Fecha prevista",
      notes: "Notas",
      lineCount: "Cuenta de línea",
      amountPaid: "Cuantía pagada",
      amountDue: "Suma",
      isOverdue: "Atrasados",
      createdAt: "Creado en",
      updatedAt: "Actualizado en",
    },
    errors: {
      unauthorized: {
        title: "Se requiere autenticación",
        description: "Inicia sesión para continuar",
      },
      validation: {
        title: "Error de validación",
        description: "Parámetros de filtro inválidos",
      },
      server: {
        title: "Error del servidor",
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
        description: "Debe ser miembro de esta empresa",
      },
      notFound: {
        title: "No encontrado",
        description: "Compañía no encontrada",
      },
      conflict: {
        title: "Conflicto",
        description: "Se produjo un conflicto",
      },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Hay cambios sin salvar",
      },
    },
    success: {
      title: "Operación completada",
      description: "Lista de facturas recuperadas",
    },
  },
  enums: {
    invoiceStatus: {
      draft: "Proyecto",
      open: "Abierto",
      paid: "Pagado",
      void: "Vacío",
      uncollectible: "Incolectible",
    },
  },
  companyId: {
    label: "Company ID",
    description: "Filtro de facturas para esta empresa",
    placeholder: "Entrar en la empresa ID",
  },
  search: {
    label: "Documentos de búsqueda",
    description: "Busca por número de factura, nombre del cliente o ID.",
    placeholder: "Número de factura o cliente",
  },
  status: {
    label: "Situación",
    description:
      "Filtra por estado o muestra las facturas vencidas con saldo pendiente.",
    placeholder: "Todos los estados",
  },
  customerId: {
    label: "Cliente ID",
    description: "Filtro por cliente",
    placeholder: "Ingrese al cliente ID",
  },
  page: {
    label: "Página",
    description: "Número de página",
  },
  pageSize: {
    label: "Tamaño de página",
    description: "Resultados por página",
  },
  widget: {
    creditNote: "Nota de crédito",
    creditable: "Seleccione la factura que desea rectificar",
    noCreditable: "No hay facturas con importes pendientes de abonar.",
    filters: "Filtros",
    partlyPaid: "Pagada en parte",
    pageCount: "Páginas totales",
    title: "Facturas de clientes",
    newInvoice: "Nueva factura",
    loading: "Cargando facturas...",
    noInvoices: "Todavía no hay facturas.",
    noInvoicesHint: "Crea tu primera factura para empezar.",
    overdue: "Atrasados",
    due: "Sumas",
    lines: "líneas",
    line: "línea",
    view: "Vista",
    back: "Atrás",
    empty: {
      title: "Todavía no hay facturas.",
      hint: "Crea tu primera factura para empezar.",
      cta: "Nueva factura",
    },
    status: {
      draft: "Proyecto",
      open: "Abierto",
      paid: "Pagado",
      void: "Vacío",
      uncollectible: "Incolectible",
    },
  },
};
