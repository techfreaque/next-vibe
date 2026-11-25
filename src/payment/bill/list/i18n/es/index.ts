import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    payment: "pago",
    bill: "factura",
    ap: "cuentas pagaderas",
  },
  get: {
    title: "Proveedor de cuentas",
    titleShort: "Proveedor de cuentas",
    description:
      "Cuentas de búsqueda pagadas por número de factura, nombre del proveedor o factura ID, y filtro por compañía o estado.",
    errors: {
      validation: {
        title: "Error de validación",
        description: "Parámetros de filtro",
      },
      unauthorized: {
        title: "No se registró",
        description: "Inicie sesión para ver las facturas",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "Usted no es miembro de esta empresa",
      },
      conflict: { title: "Conflicto", description: "Conflicto de datos" },
      server: {
        title: "Error del servidor",
        description: "No podía cargar las facturas",
      },
      unknown: {
        title: "Error desconocido",
        description: "Ocurrió un error inesperado",
      },
      network: { title: "Error de red", description: "Comprueba tu conexión" },
      notFound: {
        title: "No encontrado",
        description: "Compañía no encontrada",
      },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Tienes cambios sin guardar",
      },
    },
    success: {
      title: "Bills cargados",
      description: "Facturas de proveedores recuperadas",
    },
    response: {
      totalCount: "Total",
      id: "ID",
      supplierName: "Proveedor",
      billNumber: "Bill.",
      billDate: "Fecha del proyecto",
      dueDate: "Fecha prevista",
      currency: "Moneda",
      billTotal: "Monto",
      status: "Situación",
      createdAt: "Creado",
    },
  },
  companyId: {
    label: "Company",
    description: "Filtro por empresa",
    placeholder: "Company UUID",
  },
  search: {
    label: "Documentos de búsqueda",
    description:
      "Cuentas de búsqueda pagadas por número de factura, nombre del proveedor o factura ID, y filtro por compañía o estado.",
    placeholder: "Número de factura o proveedor",
  },
  status: {
    label: "Situación",
    description: "Filtro por estado de factura",
    placeholder: "Cualquier condición",
  },
  page: { label: "Página", description: "Número de página" },
  pageSize: { label: "Por página", description: "Resultados por página" },
  enums: {
    billStatus: {
      DRAFT: "Proyecto",
      RECEIVED: "Recibidos",
      APPROVED: "Aprobados",
      PAID: "Pagado",
      DISPUTED: "Controversias",
    },
  },
  widget: {
    filters: "Filtros",
    pageCount: "Páginas totales",
    back: "Atrás",
    title: "Proveedor de cuentas",
    newBill: "Bill.",
    loading: "Carga de billetes...",
    empty: {
      title: "No hay facturas de proveedores",
      hint: "Registre una factura cuando reciba una factura de un proveedor.",
      cta: "Bill.",
    },
    company: {
      select: "Select Company",
      selected: "Compañía seleccionada",
    },
    due: "Sumas",
    overdue: "Atrasados",
    view: "Vista",
  },
};
