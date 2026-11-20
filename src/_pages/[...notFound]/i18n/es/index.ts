import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  pages: {
    error: {
      title: "¡Algo salió mal!",
      message: "Lo sentimos, pero pasó algo inesperado.",
      errorId: "Error ID : {{id}}",
      error_message: "Error: {{message}}",
      stackTrace: "Stack Trace: {{stack}}",
      tryAgain: "Inténtalo de nuevo",
      backToHome: "Volver a casa",
    },
    frame: {
      endpointNotFound: 'Punto final " {{endpointId}}" no encontrado',
      endpointLoadFailed: "No se puede cargar el punto final",
    },
    notFound: {
      title: "Page Not Found",
      description: "La página que buscas no existe o ha sido movida.",
      goBack: "Regresa.",
      goHome: "Vete a casa.",
    },
  },
  meta: {
    title: "404 - Page Not Found",
    category: "Error",
    description: "La página que buscas no existe",
    imageAlt: "404 No encontrado",
    keywords: "404, no encontrado, error",
  },
  post: {
    title: "[...notFound]",
    description: "[... notFound] endpoint",
    form: {
      title: "[...notFoundConfiguración",
      description: "Configurar [...no encontrado] parámetros",
    },
    response: {
      title: "Respuesta",
      description: "[... datos de respuesta notFound ]",
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
        description: "No se encontró el recurso",
      },
      conflict: {
        title: "Conflicto",
        description: "Hay un conflicto entre los datos",
      },
    },
    success: {
      title: "Operación completada",
      description: "La operación se completó correctamente",
    },
  },
};
