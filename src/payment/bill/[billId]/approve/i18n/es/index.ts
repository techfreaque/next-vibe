import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: { payment: "pago", bill: "factura", ap: "cuentas pagaderas" },
  enums: {
    billStatus: {
      DRAFT: "Proyecto",
      RECEIVED: "Recibidos",
      APPROVED: "Aprobados",
      PAID: "Pagado",
      DISPUTED: "Controversias",
    },
  },
  post: {
    title: "Revisar el estado de la factura",
    titleShort: "Revisar el estado de la factura",
    description:
      "Actualiza el estado de una factura de proveedor en borrador o recibida.",
    billId: {
      label: "Bill ID",
      description: "El proyecto de ley para aprobar",
    },
    errors: {
      existingPosting:
        "Concilia el asiento existente de esta factura antes de aprobarla.",
      billLines:
        "Añade líneas con un total positivo y usa cuentas de gastos activas de esta empresa.",
      posting:
        "Revisa los importes, la moneda de la empresa, el periodo contable y las cuentas de registro.",
      validation: {
        title: "Error de validación",
        description: "factura inválida ID",
      },
      unauthorized: {
        title: "No se registró",
        description: "Inicie sesión para aprobar las facturas",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "Función contable o de personal",
      },
      conflict: {
        title: "Ya aprobado",
        description: "Bill ya está aprobado o pagado",
      },
      server: {
        title: "Error del servidor",
        description: "No podría aprobar la ley",
      },
      unknown: {
        title: "Error desconocido",
        description: "Ocurrió un error inesperado",
      },
      network: { title: "Error de red", description: "Comprueba tu conexión" },
      notFound: {
        title: "Bill no se encontró",
        description: "Esta medida no existe",
      },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Tienes cambios sin guardar",
      },
    },
    success: {
      title: "Proyecto de ley aprobado",
      description: "Estado de la ley avanzado con éxito",
    },
    response: {
      status: "Estado nuevo",
      journalEntryId: "Journal Entry ID",
    },
    widget: {
      back: "Atrás",
      submit: "Confirmación del cambio de estado",
      confirmTitle: "¿Aprobar este proyecto de ley?",
      confirmDescription:
        "Un borrador pasa a Recibida. Al aprobar una factura recibida se genera un asiento contable.",
      confirmButton: "Sí, aprobar",
      cancelButton: "Cancelar",
      approved: "Actualización de la situación de los proyectos",
    },
  },
};
