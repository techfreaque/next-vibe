import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Cuentas por pagar a proveedores",
  titleShort: "Pagos a proveedores",
  description: "Deudas con proveedores por días de retraso.",
  tag: "Pagos a proveedores",
  company: {
    label: "Empresa",
    description:
      "Elige la empresa cuyas facturas de proveedor quieres revisar.",
    choose: "Elige una empresa",
    empty:
      "Selecciona una empresa para consultar sus pagos pendientes a proveedores.",
  },
  currency: {
    label: "Moneda",
    description:
      "Muestra las facturas en una sola moneda. Los importes no se convierten.",
    default: "Moneda de la empresa",
    codes: {
      EUR: "EUR",
      USD: "USD",
      PLN: "PLN",
    },
  },
  agingDate: {
    label: "Fecha de cálculo",
    description: "Fecha que se usa para calcular los días de retraso.",
  },
  columns: {
    supplier: "Proveedor",
    vat: "Número de IVA",
    current: "Sin vencer",
    days1to30: "1–30 días",
    days31to60: "31–60 días",
    days61to90: "61–90 días",
    over90: "91 días o más",
    undated: "Sin vencimiento",
    total: "Total",
    billNumber: "Número de factura",
    billDate: "Fecha de factura",
    dueDate: "Vencimiento",
    billAmount: "Importe en céntimos",
  },
  approved: {
    title: "Aprobadas y sin pagar",
    empty: "No hay facturas aprobadas pendientes de pago",
    emptyDescription:
      "Aquí aparecerán las facturas aprobadas con saldo pendiente.",
  },
  received: {
    title: "Pendientes de aprobación",
    empty: "No hay facturas pendientes de aprobación",
    emptyDescription:
      "Las facturas recibidas aparecen aquí hasta que se aprueben.",
  },
  disputed: {
    title: "En disputa",
    empty: "No hay facturas en disputa",
    emptyDescription:
      "Las facturas en disputa se excluyen de los totales de facturas aprobadas y pendientes.",
  },
  widget: {
    showBills: "Ver facturas",
    asOf: "Situación al {{date}}",
    back: "Volver",
    loading: "Cargando cuentas por pagar",
    details: "Facturas de {{supplier}}",
    unknownSupplier: "Proveedor desconocido",
    datedBill: "Factura del {{date}}",
    due: "Vence el {{date}}",
  },
  success: {
    title: "Cuentas por pagar cargadas",
    description:
      "Puedes revisar las facturas de proveedor de la empresa seleccionada.",
  },
  errors: {
    validation: {
      title: "Revisa los filtros del informe",
      description: "Elige una fecha y una moneda válidas.",
    },
    unauthorized: {
      title: "Inicia sesión",
      description: "Inicia sesión para ver las cuentas por pagar.",
    },
    forbidden: {
      title: "Empresa no disponible",
      description:
        "No tienes acceso a las facturas de proveedor de esta empresa.",
    },
    notFound: {
      title: "Elemento no encontrado",
      description: "No encontramos el elemento solicitado.",
    },
    server: {
      title: "No se pudieron cargar las cuentas por pagar",
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
