import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  get: {
    title: "Resumen de la suscripción",
    titleShort: "Dashboard",
    description: "Tu suscripción de un vistazo",
    errors: {
      unauthorized: {
        title: "Inicia sesión para continuar",
        description: "Inicia sesión para ver tu suscripción"
      },
      validation: {
        title: "Error de validación",
        description: "Parámetros inválidos"
      },
      forbidden: {
        title: "Acceso denegado",
        description: "No tienes permiso para ver esto."
      },
      server: {
        title: "Error del servidor",
        description: "Incapaz de cargar datos de suscripción",
        detail: "No se puede cargar su suscripción: {{error}}"
      },
      unknown: {
        title: "Error desconocido",
        description: "Algo inesperado sucedió"
      },
      conflict: {
        title: "Conflicto",
        description: "Conflicto de datos"
      },
      network: {
        title: "Error de conexión",
        description: "Consulte su conexión a Internet"
      },
      notFound: {
        title: "No encontrado",
        description: "No hay suscripción encontrada"
      },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Tienes cambios sin guardar"
      }
    },
    success: {
      title: "Cargado",
      description: "Datos de suscripción cargados"
    },
    response: {
      activeCount: "Activa",
      cancelingCount: "Pendiente de cancelación",
      trialCount: "Prueba",
      totalCount: "Total"
    }
  },
  widget: {
    actions: "Medidas rápidas",
    mySubscription: "Mi suscripción",
    manage: "Gestionar",
    refresh: "Actualizar",
    noData: "No hay datos de suscripción disponibles"
  }
};
