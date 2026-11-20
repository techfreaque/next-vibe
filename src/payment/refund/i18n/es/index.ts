import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Reembolso del proceso",
  titleShort: "Reembolso",
  description: "Procesar un reembolso para una transacción de pago",
  category: "Reembolsos de pago",
  tags: {
    refund: "reembolso",
    transaction: "transacción"
  },
  success: {
    created: "Reembolso procesado con éxito"
  },
  reason: {
    requestedByCustomer: "Solicitud de cliente"
  },
  form: {
    title: "Formulario de reembolso",
    description: "Ingrese los detalles de reembolso",
    fields: {
      transactionId: {
        label: "Transacción ID",
        description: "ID de la transacción para reembolsar",
        placeholder: "Introducir transacción ID"
      },
      amount: {
        label: "Monto de reembolso",
        description: "Reembolso parcial opcional en la moneda de la transacción",
        placeholder: "Ingrese la cantidad"
      },
      reason: {
        label: "Reembolso de la razón",
        description: "Razones para el reembolso",
        placeholder: "Introducir razón"
      },
      metadata: {
        label: "Metadatos",
        description: "Metadatos de reembolso adicionales",
        placeholder: "Ingrese metadatos como JSON"
      }
    }
  },
  post: {
    title: "Reembolso del proceso",
    description: "Procesar un reembolso de pago",
    response: {
      success: "Reembolso procesado con éxito",
      message: "Mensaje de Estado",
      refund: {
        title: "Detalles del reembolso",
        description: "Información de reembolso procesada",
        id: "Reembolso ID",
        userId: "Usuario ID",
        transactionId: "Transacción ID",
        stripeRefundId: "Stripe Reembolso ID",
        amount: "Monto de reembolso",
        currency: "Moneda",
        status: "Estado de los reembolsos",
        reason: "Reembolso de la razón",
        createdAt: "Creado en",
        updatedAt: "Actualizado en"
      }
    },
    errors: {
      validation: {
        title: "Error de validación",
        description: "Parámetros de reembolso inválidos"
      },
      unauthorized: {
        title: "Se requiere autenticación",
        description: "Inicia sesión para continuar"
      },
      forbidden: {
        title: "Acceso denegado",
        description: "Permiso denegado"
      },
      notFound: {
        detail: "No se encontró ninguna transacción con id {{transactionId}}",
        title: "No encontrado",
        description: "Transacción no encontrada"
      },
      server: {
        detail: "No podía procesar el reembolso: {{error}}",
        noPaymentIntent: "Esta transacción no tiene pago Stripe vinculado, por lo que no puede ser reembolsado",
        title: "Error del servidor",
        description: "Ocurrió un error interno del servidor"
      },
      network: {
        title: "Error de red",
        description: "Error de conexión de red"
      },
      unknown: {
        title: "Error desconocido",
        description: "Ocurrió un error inesperado"
      },
      conflict: {
        title: "Conflicto",
        description: "Conflicto de reembolso detectado"
      },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Hay cambios sin salvar"
      }
    },
    success: {
      title: "Operación completada",
      description: "Reembolso procesado con éxito"
    }
  }
};
