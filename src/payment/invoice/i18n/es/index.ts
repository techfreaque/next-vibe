import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Facturación",
  tags: {
    payment: "pago",
    invoice: "factura",
    transactions: "transacciones",
  },
  defaultItem: "Tema de facturación",
  success: {
    created: "Factura creada con éxito",
  },
  post: {
    title: "Factura",
    titleShort: "Factura",
    description: "Punto final de facturación",
    form: {
      title: "Configuración de facturación",
      description: "Configurar los parámetros de factura",
    },
    response: {
      success: "Factura creada con éxito",
      message: "Mensaje de Estado",
      invoice: {
        title: "Detalles de facturación",
        description: "Información de facturas generadas",
        id: "Factura ID",
        userId: "Usuario ID",
        stripeInvoiceId: "Stripe Invoice ID",
        invoiceNumber: "Número de facturación",
        amount: "Monto",
        currency: "Moneda",
        status: "Situación",
        invoiceUrl: "Factura URL",
        invoicePdf: "Factura PDF",
        dueDate: "Fecha prevista",
        paidAt: "Pagado en",
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
        description: "Parámetros de solicitud no válidos",
      },
      server: {
        detail: "No podía crear la factura: {{error}}",
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
        noStripeCustomer: "No existe registro de cliente Stripe para su cuenta",
        title: "No encontrado",
        description: "No se encontró el recurso",
      },
      conflict: {
        title: "Conflicto",
        description: "Hay un conflicto entre los datos",
      },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Hay cambios sin salvar",
      },
    },
    success: {
      title: "Operación completada",
      description: "La operación se completó correctamente",
    },
    widget: {
      back: "Atrás",
    },
  },
  customerId: {
    label: "Cliente ID",
    description: "Identificador del cliente de Stripe",
    placeholder: "Ingrese al cliente ID",
  },
  amount: {
    label: "Monto",
    description: "Cantidad de factura",
    placeholder: "Ingrese la cantidad",
  },
  currency: {
    label: "Moneda",
    description: "Código de divisas",
    placeholder: "Seleccione la moneda",
    usd: "Dólar US (USD)",
    eur: "Euro (EUR)",
    pln: "Polaco Zloty (PLN)",
  },
  description: {
    label: "Descripción",
    description: "Descripción de facturas",
    placeholder: "Escriba descripción",
  },
  dueDate: {
    label: "Fecha prevista",
    description: "Fecha de pago",
    placeholder: "Fecha de vencimiento",
  },
  metadata: {
    label: "Metadatos",
    description: "Metadatos adicionales",
    placeholder: "Ingrese metadatos como JSON",
  },
};
