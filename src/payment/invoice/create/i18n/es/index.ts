import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Facturación",
  tags: {
    payment: "pago",
    invoice: "factura",
    ar: "contabilidad-receptible",
  },
  post: {
    title: "Crear factura AR",
    titleShort: "Crear factura",
    description:
      "Crear una nueva factura de cuentas por cobrar para un cliente",
    form: {
      title: "Nueva factura",
      description: "Rellene los detalles de la factura",
    },
    response: {
      success: "Factura creada",
      message: "Mensaje de Estado",
      invoice: {
        title: "Factura",
        subtitle: "Factura creada",
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
        description: "Parámetros de factura inválidos",
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
        description: "Debe ser un administrador o contador de esta empresa",
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
      title: "Factura Creada",
      description: "Factura creada en el proyecto de estatuto",
    },
    widget: {
      back: "Atrás",
      submit: "Crear factura",
      viewButton: "Ver factura",
    },
  },
  companyId: {
    label: "Company ID",
    description: "La empresa que emite esta factura",
    placeholder: "Entrar en la empresa ID",
  },
  customerId: {
    label: "Cliente ID",
    description: "Opcional: UUID del cliente (referencia suave al usuario)",
    placeholder: "Ingrese al cliente ID",
  },
  dueDate: {
    label: "Fecha prevista",
    description: "Cuando esta factura se adeuda",
    placeholder: "Fecha de vencimiento",
  },
  currency: {
    label: "Moneda",
    description: "Moneda de facturación",
    placeholder: "EUR",
  },
  notes: {
    label: "Notas",
    description: "Notas opcionales visibles en la factura",
    placeholder: "Por ejemplo. Condiciones de pago: 30 días",
  },
};
