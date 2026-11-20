import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Usuarios",

  widget: {
    intro:
      "Todos los dispositivos se firmaron en tu cuenta. Firme cualquier cosa que no reconozca.",
    revokeFailed: "No podía firmar ese dispositivo. Inténtalo de nuevo.",
    back: "Atrás",
    loading: "Cargando sesiones...",
    empty: "No hay sesiones activas",
    emptyHint: "Se crea una sesión cada vez que entras",
    browserSession: "Sesión del navegador",
    revoke: "Sáquense",
    revoking: "Revocando...",
    currentSession: "Corriente",
    created: "Creado",
    expires: "Expires",
    never: "Nunca.",
  },

  list: {
    title: "Dispositivos de registro",
    titleShort: "Mis sesiones",
    description: "Listar todas las sesiones activas para su cuenta",
    tag: "Sesiones",
    response: {
      sessions: "Sesiones",
    },
    success: {
      title: "Sesiones recuperadas",
      description: "Sus sesiones activas han sido recuperadas",
    },
    errors: {
      unauthorized: {
        title: "Se requiere autenticación",
        description: "Inicia sesión para continuar",
      },
      validation: {
        title: "Error de validación",
        description: "Solicitud inválida",
      },
      server: {
        title: "Error del servidor",
        description: "Error del servidor interno",
        detail: "No podía cargar sus sesiones: {{error}}",
      },
      unknown: {
        title: "Error desconocido",
        description: "Ocurrió un error desconocido",
      },
      network: {
        title: "Error de red",
        description: "Ocurrió un error de red",
      },
      forbidden: { title: "Acceso denegado", description: "No tienes acceso" },
      notFound: {
        title: "No encontrado",
        description: "No se encontró el recurso",
      },
      conflict: { title: "Conflicto", description: "Conflicto de datos" },
    },
  },
  create: {
    title: "Crear token de sesión",
    titleShort: "Crear Token",
    description: "Crear una señal de sesión para el acceso programático",
    tag: "Sesiones",
    form: {
      name: "Nombre del token",
      namePlaceholder: "Por ejemplo. Mi agente bot",
    },
    response: {
      token: "Token",
      id: "Período de sesiones ID",
      name: "Nombre",
      message: "Copia el token ahora. No volverá a mostrarse.",
    },
    success: {
      title: "Período de sesiones creado",
      description: "Tu token de sesión ha sido creado",
    },
    errors: {
      unauthorized: {
        title: "Se requiere autenticación",
        description: "Inicia sesión para continuar",
      },
      validation: {
        title: "Error de validación",
        description: "Solicitud inválida",
      },
      server: {
        title: "Error del servidor",
        description: "Error del servidor interno",
        detail: "No se puede crear el token de sesión: {{error}}",
      },
      unknown: {
        title: "Error desconocido",
        description: "Ocurrió un error desconocido",
      },
      network: {
        title: "Error de red",
        description: "Ocurrió un error de red",
      },
      forbidden: { title: "Acceso denegado", description: "No tienes acceso" },
      notFound: {
        title: "No encontrado",
        description: "No se encontró el recurso",
      },
      conflict: { title: "Conflicto", description: "Conflicto de datos" },
    },
  },
  revoke: {
    title: "Sesión de revocación",
    titleShort: "Sesión de revocación",
    description: "Revoque una sesión token por ID",
    tag: "Sesiones",
    response: {
      message: "Período de sesiones revocado",
    },
    success: {
      title: "Período de sesiones revocado",
      description: "El período de sesiones ha sido revocado",
    },
    errors: {
      unauthorized: {
        title: "Se requiere autenticación",
        description: "Inicia sesión para continuar",
      },
      validation: {
        title: "Error de validación",
        description: "Solicitud inválida",
      },
      server: {
        title: "Error del servidor",
        description: "Error del servidor interno",
        detail: "No podía revocar la sesión: {{error}}",
      },
      unknown: {
        title: "Error desconocido",
        description: "Ocurrió un error desconocido",
      },
      network: {
        title: "Error de red",
        description: "Ocurrió un error de red",
      },
      forbidden: { title: "Acceso denegado", description: "No tienes acceso" },
      notFound: {
        title: "No encontrado",
        description: "Período de sesiones no encontrado",
        detail: "Ninguna sesión con ID {{sessionId}} pertenece a su cuenta",
      },
      conflict: { title: "Conflicto", description: "Conflicto de datos" },
    },
  },
};
