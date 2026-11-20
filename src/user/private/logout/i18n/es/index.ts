import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "User Logout",
  titleShort: "Cerrar sesión",
  description: "Lograr que el usuario actual e invalide su sesión",
  category: "Gestión de usuarios",
  tag: "logout",
  logoutButton: "Cerrar sesión",
  loggingOut: "Saliendo de aquí...",
  response: {
    title: "Respuesta de la sesión",
    description: "Response indicating successful logout",
    success: "Operación completada",
    message: "Mensaje",
    sessionsCleaned: "Sesiones limpiadas",
    nextSteps: "Próximos pasos recomendados después del logout",
  },
  errors: {
    validation: {
      title: "Error de validación",
      description: "La solicitud del logotipo contiene datos inválidos",
    },
    unauthorized: {
      title: "Se requiere autenticación",
      description: "Debe estar conectado a la página web",
    },
    internal: {
      title: "Error de servidor interno",
      description: "Se produjo un error interno mientras se registra",
      detail: "Falló la sesión: {{error}} (user {{userId}})",
    },
    unknown: {
      title: "Error desconocido",
      description: "Un error inesperado ocurrió durante el logout",
    },
    session_deletion_failed: {
      title: "Eliminación de la sesión fracasada",
      description: "No se ha eliminado la sesión de usuario",
    },
    conflict: {
      title: "Conflicto de fugas",
      description: "Un conflicto ocurrió durante el logout",
    },
    forbidden: {
      title: "Acceso denegado",
      description: "La acción de registro está prohibida",
    },
    network_error: {
      title: "Error de red",
      description: "Error de red durante el logout",
    },
    not_found: {
      title: "No encontrado",
      description: "Período de sesiones no encontrado",
    },
    server_error: {
      title: "Error del servidor",
      description: "Error del servidor interno durante el logout",
    },
    unsaved_changes: {
      title: "Cambios sin guardar",
      description: "Hay cambios sin salvar",
    },
    invalid_user: {
      title: "Usuario inválido",
      description: "El usuario no es válido o no existe",
    },
  },
  success: {
    title: "Logout Successfulful",
    description: "Usted ha sido identificado con éxito",
    message: "Usuario conectado con éxito",
  },
};
