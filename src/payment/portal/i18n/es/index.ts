import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  success: {
    created: "Sesión del portal de atención al cliente creada con éxito",
  },
  post: {
    title: "Portal del cliente",
    titleShort: "Portal del cliente",
    description:
      "Crear sesión de portal de clientes para la gestión de facturación",
    form: {
      title: "Configuración del Portal",
      description: "Configurar los parámetros del portal del cliente",
    },
    returnUrl: {
      label: "Volver URL",
      description: "URL para redirigir a la sesión del portal",
      placeholder: "https://example.com/dashboard",
    },
    response: {
      success: "Sesión de portales creada con éxito",
      message: "Mensaje de Estado",
      customerPortalUrl: "Portal de atención al cliente URL",
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
        detail: "No pudimos abrir el portal de facturación: {{error}}",
        portalNotConfigured:
          "El Portal de Cliente Stripe no está establecido todavía. Configure it at https://dashboard.stripe.com/test/settings/billing/portal",
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
  },
};
