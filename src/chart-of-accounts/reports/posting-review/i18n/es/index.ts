import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Revisión de asientos",
  description:
    "Revisa los asientos contabilizados activos y los vínculos de las facturas de venta emitidas y de proveedor aprobadas o pagadas.",
  tag: "Revisar contabilidad",
  company: {
    label: "Empresa",
    description: "Elige la empresa cuyas anotaciones quieres revisar.",
    choose: "Elige una empresa",
    empty:
      "Selecciona una empresa para revisar su diario y los vínculos a los documentos.",
  },
  filters: {
    issue: "Incidencia",
    all: "Todas las incidencias",
    matches: "Incidencias coincidentes",
  },
  issues: {
    missingLines: "Líneas de asiento ausentes",
    invalidLegs: "Líneas de asiento incorrectas",
    invoiceLink: "Vínculos de facturas de venta",
    billLink: "Vínculos de facturas de proveedor",
  },
  reasons: {
    fewLines:
      "El asiento tiene menos de dos líneas. Ábrelo y comprueba el documento de origen.",
    invalidLegs:
      "Una moneda está descuadrada o una línea contiene un importe, cuenta o signo incorrectos. Abre el asiento para revisar sus líneas.",
    noBacklink:
      "El documento no tiene un asiento vinculado. Comprueba el origen antes de contabilizar o registrar un pago.",
    wrongPosting:
      "El asiento vinculado falta, pertenece a otro origen o ya no está activo. Revisa el historial contable del documento.",
    controlLeg:
      "El asiento vinculado tiene un saldo, moneda o importe de cuenta de control incorrecto. Revisa el origen antes de registrar un pago.",
  },
  columns: {
    record: "Registro",
    date: "Fecha",
    reason: "Incidencia detectada",
    counterparty: "Contraparte",
    open: "Abrir registro",
  },
  records: {
    journal: "Asiento contable",
    invoice: "Factura de venta",
    bill: "Factura de proveedor",
    journalDate: "Fecha del asiento",
    invoiceDate: "Factura creada el",
    billDate: "Fecha de factura",
    dateInfo: "{{label}} {{date}}",
    openJournal: "Abrir asiento",
    openInvoice: "Abrir factura de venta",
    openBill: "Abrir factura de proveedor",
  },
  pagination: {
    pageLabel: "Página",
    pageSize: "Registros por página",
    totalPages: "Total de páginas",
    previous: "Anterior",
    next: "Siguiente",
    pageInfo: "Página {{page}} de {{total}}",
    firstPage: "Primera página",
    emptyPage: "Esta página no contiene registros",
  },
  widget: {
    loading: "Cargando revisión de asientos",
    empty: "No hay incidencias contables coincidentes",
    coverage:
      "La revisión abarca los asientos originales activos y las facturas positivas emitidas, aprobadas o pagadas según su tipo.",
    back: "Volver",
  },
  success: {
    title: "Revisión completada",
    description:
      "Se han comprobado los asientos y los vínculos de los documentos.",
  },
  errors: {
    validation: {
      title: "Revisa los filtros del informe",
      description:
        "Elige un filtro de incidencias, una página y un tamaño de página válidos.",
    },
    unauthorized: {
      title: "Inicia sesión",
      description: "Inicia sesión para revisar los asientos contables.",
    },
    forbidden: {
      title: "Empresa no disponible",
      description: "No tienes acceso a la contabilidad de esta empresa.",
    },
    notFound: {
      title: "Elemento no encontrado",
      description: "No encontramos el elemento solicitado.",
    },
    server: {
      title: "No se pudo cargar la revisión de asientos",
      description: "Intenta cargar el informe de nuevo.",
    },
    network: {
      title: "Sin conexión",
      description: "Comprueba tu conexión y vuelve a intentarlo.",
    },
    conflict: {
      title: "Conflicto en el informe",
      description: "Actualiza la página y vuelve a abrir el informe.",
    },
    unknown: {
      title: "Error inesperado",
      description: "Vuelve a intentarlo o contacta con soporte.",
    },
    unsavedChanges: {
      title: "Cambios sin guardar",
      description: "Guarda o descarta los cambios antes de salir.",
    },
  },
};
