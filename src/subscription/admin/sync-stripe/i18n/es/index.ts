import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  post: {
    title: "Suscripciones sincronizadas de Stripe",
    titleShort: "Stripe Sync",
    description:
      "Tire de estado, periodo de facturación y campos de cancelación de Stripe a nuestras filas de suscripción. Explora filas heredadas sin Stripe id y un período terminado. Nunca concedes o revocas créditos. Correr seca por defecto.",
    fields: {
      subscriptionId: {
        label: "Suscripción",
        description:
          "Nuestra suscripción id (uuid) o la suscripción Stripe id (sub_...). Deja vacío con 'All' on.",
        placeholder: "Sub_... o Uuid de suscripción",
      },
      all: {
        label: "Todos",
        description:
          "Revise cada suscripción que no esté ya cancelada o caducada.",
      },
      dryRun: {
        label: "Simulación",
        description: "Avance los cambios sin escribir nada.",
      },
    },
    response: {
      dryRun: "Simulación",
      scanned: "Comprobado",
      changed: "Cambios",
      failed: "Failed",
      items: "Suscripciones",
      item: {
        subscriptionId: "Suscripción",
        userEmail: "Usuario",
        providerSubscriptionId: "Stripe id",
        action: "Medida",
        statusBefore: "Situación anterior",
        statusAfter: "Estado después",
        periodEndBefore: "Punto final antes",
        periodEndAfter: "Fin del período después",
        note: "Nota",
      },
    },
    errors: {
      unauthorized: {
        title: "Se requiere autenticación",
        description: "Acceso requerido",
      },
      validation: {
        title: "Objetivo perdido",
        description: "Pase un id de suscripción, un id Stripe o all=true.",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "Acceso de los administradores necesario",
      },
      server: {
        title: "Sincronización fallida",
        description: "No se pueden sincronizar las suscripciones de Stripe",
        detail: "Sincronización de suscripción falló: {{error}}",
      },
      unknown: {
        title: "Error desconocido",
        description: "Error inesperado durante la sincronización",
      },
      conflict: {
        title: "Conflicto",
        description: "La suscripción cambió durante la sincronización",
      },
      network: {
        title: "Error de red",
        description: "No podía llegar a Stripe",
      },
      notFound: {
        title: "Cuenta o sesión no encontradas",
        description: "No hay partidos de suscripción que id",
        detail: "No hay partidos de suscripción {{id}}",
      },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Ejecute o descarte la sincronización pendiente primero",
      },
      notConfigured: "Stripe no está configurado en este caso.",
    },
    success: {
      title: "Sincronización completa",
      description: "Suscripciones comprobadas contra Stripe",
    },
    notes: {
      keptCanceled:
        "Stripe dice {{stripeStatus}} ; se mantuvo cancelado (nunca de bajada cancelada).",
      missingInStripe:
        "No se encuentra en Stripe ; marcado cancelado y Stripe id despejado.",
      expiredLegacy:
        "No Stripe id y el período terminado {{date}}; marcado cancelado.",
      noStripeIdActivePeriod:
        "No Stripe id, el período sigue funcionando; izquierda como está.",
      notStripe: "El proveedor no es Stripe ; saltado.",
      stripeError: "Error Stripe: {{error}}",
    },
    widget: {
      submit: "Corre sincronización",
      submitting: "Sincronización...",
      preview: "Vista previa: nada escrito",
      applied: "Aplicadas",
      empty: "Nada que sincronizar.",
      none: "ninguno",
    },
  },
  enums: {
    action: {
      updated: "Actualizado",
      unchanged: "En sincronización",
      expired: "Gastos",
      missingInStripe: "Desaparecido en Stripe",
      skipped: "Saltó.",
      error: "Error",
    },
  },
};
