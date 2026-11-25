import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Facturación",
  tags: {
    payment: "pago",
    invoice: "factura",
    ar: "contabilidad-receptible",
  },
  post: {
    title: "Nueva factura",
    titleShort: "Nueva factura",
    description: "Prepara una factura para tu cliente.",
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
      details: "Datos de la factura",
      draftHint: "Guarda un borrador para revisarlo antes de emitirlo.",
      items: "Líneas",
      itemsDescription:
        "Líneas opcionales del borrador. Usa un tipo de IVA decimal entre 0 y 1.",
      itemsHint:
        "Añade bienes o servicios para calcular el total de la factura.",
      item: "Descripción",
      quantity: "Cantidad",
      unitPrice: "Precio unitario",
      manualTaxRate: "Otro tipo",
      taxRate: "IVA %",
      addItem: "Añadir línea",
      removeItem: "Eliminar línea",
      itemError:
        "Introduce una descripción, una cantidad positiva, un precio y un tipo de IVA entre el 0 y el 100 %.",
      itemsTotalError: "El total es demasiado alto para una sola factura.",
      summary: "Resumen",
      net: "Base imponible",
      tax: "IVA",
      total: "Total",
      clearCustomer: "Quitar cliente",
      lineTotal: "Total de la línea",
      companyCurrencyValue: "Moneda de la empresa: {{currency}}",
      companyCurrency: "Si no eliges una moneda, se usa la de la empresa.",
      back: "Atrás",
      submit: "Guardar borrador",
      viewButton: "Ver factura",
    },
  },
  companyId: {
    label: "Empresa",
    description: "La empresa que emite esta factura",
    placeholder: "Entrar en la empresa ID",
  },
  customerId: {
    label: "Cliente",
    description: "Busca al cliente por su nombre.",
    placeholder: "Ingrese al cliente ID",
  },
  dueDate: {
    label: "Fecha prevista",
    description: "Cuando esta factura se adeuda",
    placeholder: "Fecha de vencimiento",
  },
  currency: {
    code: "{{code}}",
    label: "Moneda",
    description: "Moneda de facturación",
    placeholder: "Moneda de la empresa",
  },
  notes: {
    label: "Notas",
    description: "Notas opcionales visibles en la factura",
    placeholder: "Por ejemplo. Condiciones de pago: 30 días",
  },
};
