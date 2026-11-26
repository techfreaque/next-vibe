import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  lineRounding: "Redondeo por línea",
  category: "Estimación",
  tags: { payment: "pago", estimate: "Estimaciones" },
  post: {
    title: "Estimación",
    titleShort: "Estimación",
    description: "Consigue una sola estimación con todas sus líneas",
    form: {
      title: "Estimación",
      description: "Consigue una sola estimación con todas sus líneas",
    },
    response: { success: "Operación completada", message: "Mensaje de Estado" },
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
        description: "Error del servidor interno",
      },
      unknown: {
        title: "Error desconocido",
        description: "Ocurrió un error desconocido",
      },
      network: {
        title: "Error de red",
        description: "Ocurrió un error de red",
      },
      forbidden: { title: "Acceso denegado", description: "Acceso denegado" },
      notFound: {
        title: "No encontrado",
        description: "Estimación no encontrada",
      },
      conflict: {
        title: "Conflicto",
        description: "No puede actuar en el estado actual",
      },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Hay cambios sin salvar",
      },
    },
    success: {
      title: "Operación completada",
      description: "Consigue una sola estimación con todas sus líneas",
    },
  },
  estimateId: {
    label: "Estimación ID",
    description: "La estimación para actuar en",
  },
  widget: {
    itemColumn: "Concepto",
    lineActions: "Acciones",
    removeLine: "Quitar",
    removeLineNamed: "Quitar la línea {{description}}",
    send: "Marcar como enviado",
    terms: "Condiciones",
    noItems: "Este presupuesto no contiene partidas.",
    addLine: "Línea de adición",
    accept: "Aceptación récord",
    decline: "Declinación récord",
    openInvoice: "Factura abierta",
    back: "Atrás",
    submit: "Look Up Estimación",
    estimateNumber: "Estimación",
    valid: "Válido hasta",
    customer: "Cliente",
    lineItems: "Temas de línea",
    description: "Descripción",
    qty: "Qty",
    unitPrice: "Precio unitario",
    tax: "Impuestos",
    total: "Total",
    subtotal: "Subtotal",
    sendEstimate: "Enviar",
    acceptEstimate: "Aceptar",
    declineEstimate: "Declin",
    convertToInvoice: "Convertir en Invoice",
    duplicate: "Duplicar",
    status: {
      draft: "Proyecto",
      sent: "Sent",
      accepted: "Aceptado",
      declined: "Declind",
      expired: "Gastos",
      converted: "Conversión",
    },
  },
};
