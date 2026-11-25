import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Estimación",
  tags: {
    payment: "pago",
    estimate: "Estimaciones",
    ar: "contabilidad-receptible",
  },
  post: {
    title: "Estimación",
    titleShort: "Estimación",
    description:
      "Crear una nueva estimación de ventas o cotización en el estado del proyecto",
    form: {
      title: "Nueva estimación",
      description: "Rellene los detalles estimados",
    },
    response: {
      success: "Estimación creada",
      message: "Mensaje de Estado",
      estimate: {
        title: "Estimación",
        subtitle: "Estimaciones establecidas",
        id: "Estimación ID",
        companyId: "Company ID",
        estimateNumber: "Número de estimaciones",
        status: "Situación",
        customerId: "Cliente ID",
        customerEmail: "Email del cliente",
        customerName: "Nombre del cliente",
        currency: "Moneda",
        validUntil: "Válido hasta",
        title_field: "Título",
        notes: "Notas",
        terms: "Términos",
        subtotal: "Subtotal",
        taxAmount: "Cuantía fiscal",
        total: "Total",
        invoiceId: "Factura ID",
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
        description: "Parámetros de estimación inválidos",
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
      title: "Operación completada",
      description: "Estimación creada en el proyecto de estatuto",
    },
    widget: {
      otherRate: "Otro tipo",
      item: "Descripción",
      quantity: "Cantidad",
      price: "Precio unitario",
      vatRate: "IVA %",
      add: "Añadir línea",
      remove: "Quitar línea",
      empty: "Añade los productos o servicios presupuestados.",
      summary: "Resumen",

      back: "Atrás",
      submit: "Estimación",
      viewButton: "Estimación",
    },
  },
  companyId: {
    label: "Company ID",
    description: "La empresa que emite esta estimación",
    placeholder: "Entrar en la empresa ID",
  },
  customerId: {
    label: "Cliente ID",
    description: "Opcional: UUID del cliente",
    placeholder: "Ingrese al cliente ID",
  },
  customerEmail: {
    label: "Email del cliente",
    description: "Dirección de correo electrónico al cliente",
    placeholder: "customer@example.com",
  },
  customerName: {
    label: "Nombre del cliente",
    description: "Nombre del cliente",
    placeholder: "Ingrese el nombre del cliente",
  },
  currency: {
    code: "{{code}}",
    label: "Moneda",
    description: "Moneda estimada",
    placeholder: "Moneda de la empresa",
  },
  validUntil: {
    label: "Válido hasta",
    description: "Fecha hasta que esta estimación sea válida",
    placeholder: "Seleccionar fecha de expiración",
  },
  title: {
    label: "Título",
    description: "Título corto para esta estimación",
    placeholder: "Por ejemplo. Estimación de rediseño del sitio web",
  },
  notes: {
    label: "Notas",
    description: "Notas opcionales visibles en la estimación",
    placeholder: "Por ejemplo. Precios válidos durante 30 días",
  },
  terms: {
    label: "Términos",
    description: "Condiciones de pago o entrega",
    placeholder: "por ejemplo, 50% en la parte delantera, 50% en la entrega",
  },
  lines: {
    label: "Temas de línea",
    description: "Temas incluidos en esta estimación",
  },
};
