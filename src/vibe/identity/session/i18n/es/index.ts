import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  enums: {
    sessionErrorReason: {
      noTokenInCookies: "No hay ningún token en las cookies",
    },
  },
  errors: {
    session_not_found: "No se encontró una sesión para el token {{token}}",
    session_token_missing: "No se encontró un token de sesión ({{reason}})",
    session_lookup_failed:
      "No se pudo consultar la sesión {{token}}: {{error}}",
    current_session_failed: "No se pudo leer la sesión actual: {{error}}",
    expired_sessions_delete_failed:
      "No se pudieron eliminar las sesiones vencidas",
    session_creation_failed:
      "No se pudo crear la sesión del usuario {{userId}}",
    session_creation_database_error:
      "Error de base de datos al crear la sesión del usuario {{userId}}: {{error}}",
    user_sessions_delete_failed:
      "No se pudo eliminar la sesión {{sessionId}}: {{error}}",
    expired: "La sesión venció el {{expiresAt}}",
  },
  post: {
    title: "Sesión",
    description: "Endpoint de sesión",
    form: {
      title: "Configuración de la sesión",
      description: "Configura los parámetros de la sesión",
    },
    response: {
      title: "Respuesta",
      description: "Datos de respuesta de la sesión",
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
