import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    payment: "pago",
    bill: "factura",
    ap: "cuentas pagaderas"
  },
  get: {
    title: "Detalles de la factura",
    titleShort: "Detalles de la factura",
    description: "Obtenga una factura de proveedor con todos los artículos de línea",
    billId: {
      label: "Bill ID",
      description: "La cuenta para recuperar"
    },
    errors: {
      validation: {
        title: "Error de validación",
        description: "factura inválida ID"
      },
      unauthorized: {
        title: "No se registró",
        description: "Inicie sesión para ver las facturas"
      },
      forbidden: {
        title: "Acceso denegado",
        description: "No es miembro de esta empresa"
      },
      conflict: {
        title: "Conflicto",
        description: "Conflicto de datos"
      },
      server: {
        title: "Error del servidor",
        description: "No podía cargar la cuenta"
      },
      unknown: {
        title: "Error desconocido",
        description: "Ocurrió un error inesperado"
      },
      network: {
        title: "Error de red",
        description: "Comprueba tu conexión"
      },
      notFound: {
        title: "Bill no se encontró",
        description: "Esta medida no existe"
      },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Tienes cambios sin guardar"
      }
    },
    success: {
      title: "Bill Cargado",
      description: "Detalles de la factura recuperados"
    },
    response: {
      id: "ID",
      companyId: "Company ID",
      supplierName: "Proveedor",
      supplierVatNumber: "Proveedor VAT",
      billNumber: "Número de facturas",
      billDate: "Fecha del proyecto",
      dueDate: "Fecha prevista",
      currency: "Moneda",
      subtotal: "Subtotal",
      taxAmount: "Impuestos",
      total: "Total",
      status: "Situación",
      notes: "Notas",
      journalEntryId: "Journal Entry",
      paidAt: "Pagado en",
      createdAt: "Creado",
      updatedAt: "Actualizado",
      lines: "Temas de línea",
      lineId: "Línea ID",
      lineDescription: "Descripción",
      quantity: "Qty",
      unitPrice: "Precio unitario",
      taxRate: "Tasa de impuestos",
      lineTaxAmount: "Impuestos",
      lineTotal: "Total"
    }
  },
  enums: {
    billStatus: {
      DRAFT: "Proyecto",
      RECEIVED: "Recibidos",
      APPROVED: "Aprobados",
      PAID: "Pagado",
      DISPUTED: "Controversias"
    }
  },
  widget: {
    back: "Atrás",
    submit: "Mira a Bill.",
    billNumber: "Bill",
    supplier: "Proveedor",
    overdue: "Atrasados",
    billDate: "Fecha del proyecto",
    dueDate: "Sumas",
    paidAt: "Pagado",
    journalEntry: "Journal Entry",
    lineItems: "Temas de línea",
    description: "Descripción",
    qty: "Qty",
    unitPrice: "Precio unitario",
    tax: "Impuestos",
    total: "Total",
    subtotal: "Subtotal",
    approveBill: "Proyecto de ley",
    payBill: "Pago",
    addLine: "Añadir línea",
    viewJournalEntry: "View Journal Entry",
    approveConfirmTitle: "¿Aprobar este proyecto de ley?",
    approveConfirmDescription: "Esto promoverá el estado de la factura. Una vez aprobado, se publicará una entrada de la revista. Esto no puede ser deshecho.",
    approveConfirmProceed: "Sí, aprobar",
    approveConfirmCancel: "Cancelar",
    status: {
      draft: "Proyecto",
      received: "Recibidos",
      approved: "Aprobados",
      paid: "Pagado",
      disputed: "Controversias"
    }
  }
};
