import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Facturación",
  tags: {
    payment: "pago",
    invoice: "factura",
    ar: "ar",
  },
  post: {
    title: "Invocación duplicada",
    titleShort: "Invocación duplicada",
    description:
      "Cerrar una factura existente en un nuevo DRAFT. Copia todos los artículos de línea, cliente, empresa y moneda. Consigue un nuevo número de factura y la fecha de hoy.",
    form: {
      title: "Invocación duplicada",
      description: "Crea un nuevo proyecto de factura de este",
    },
    response: {
      success: "Factura duplicada",
      message: "Mensaje de Estado",
      invoice: {
        title: "Nueva factura",
        subtitle: "Proyecto de factura duplicado",
        id: "Factura ID",
        companyId: "Company ID",
        customerId: "Cliente ID",
        invoiceSequenceNumber: "Número de facturación",
        currency: "Moneda",
        status: "Situación",
        dueDate: "Fecha prevista",
        notes: "Notas",
        amount: "Monto",
        createdAt: "Creado en",
        updatedAt: "Actualizado en",
      },
    },
    errors: {
      unauthorized: {
        title: "Se requiere autenticación",
        description: "Inicia sesión para continuar",
      },
      validation: {
        title: "Error de validación",
        description: "Parámetros inválidos",
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
        description: "No tienes acceso",
      },
      notFound: {
        title: "No encontrado",
        description: "Factura no encontrada",
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
      description: "Factura duplicada como nuevo proyecto",
    },
  },
  invoiceId: {
    label: "Factura ID",
    description: "ID de la factura para duplicar",
    placeholder: "Introduzca la factura ID",
  },
  widget: {
    back: "Atrás",
    submit: "Invocación duplicada",
    duplicated: "Factura duplicada",
    invoiceNumber: "Invocación",
    viewDuplicate: "Ver Duplicar",
  },
};
