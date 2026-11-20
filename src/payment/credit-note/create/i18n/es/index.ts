import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Facturación",
  tags: {
    payment: "pago",
    invoice: "factura",
    ar: "ar",
    creditNote: "acreedor por concepto de saldo acreedor",
  },
  post: {
    title: "Crear nota de crédito",
    titleShort: "Nota de crédito",
    description:
      "Cree una nota de crédito vinculada a una factura original. El crédito completo niega todas las líneas. El crédito parcial aplica los artículos de línea especificados. Publica una entrada de revistas reversales: Dr Revenue, Cr AR.",
    form: {
      title: "Crear nota de crédito",
      description: "Emitir un crédito contra una factura existente",
    },
    response: {
      success: "Nota de crédito creada",
      message: "Mensaje de Estado",
      creditNote: {
        title: "Nota de crédito",
        subtitle: "Detalles de la nota de crédito",
        id: "Nota de crédito ID",
        invoiceId: "Factura original ID",
        companyId: "Company ID",
        currency: "Moneda",
        status: "Situación",
        amount: "Monto",
        reason: "Razón",
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
        title: "No puede acreditarse",
        description:
          "Sólo las facturas OPEN o PAID pueden tener notas de crédito",
      },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Hay cambios sin salvar",
      },
    },
    success: {
      title: "Operación completada",
      description: "Nota de crédito creada y entrada de revistas publicada",
    },
    widget: {
      back: "Atrás",
      submit: "Crear nota de crédito",
    },
  },
  invoiceId: {
    label: "Factura ID",
    description: "La factura que se acredita",
    placeholder: "Introduzca la factura ID",
  },
  companyId: {
    label: "Company ID",
    description: "Empresa que emite la nota de crédito",
    placeholder: "Entrar en la empresa ID",
  },
  reason: {
    label: "Razón",
    description: "¿Por qué se está emitiendo este crédito?",
    placeholder: "Describir la razón del crédito",
  },
  lineItems: {
    label: "Temas de línea",
    description:
      "Líneas de crédito parciales opcionales. Si se omite, se aplica el crédito completo.",
    placeholder: "",
  },
};
