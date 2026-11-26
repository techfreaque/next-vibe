import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  get: {
    errors: {
      validation: {
        title: "Error de validación",
        description: "Parámetros de solicitud no válidos",
      },
      network: {
        title: "Error de red",
        description: "No se pudo conectar con el servidor",
      },
      unauthorized: {
        title: "Se requiere autenticación",
        description:
          "Debes estar conectado para acceder a habilidades personalizadas",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "Usted no tiene permiso para acceder a este recurso",
      },
      notFound: {
        title: "No encontrado",
        description: "No se encontró el recurso solicitado",
      },
      server: {
        title: "Error del servidor",
        description: "Se produjo un error al recuperar las habilidades",
      },
      unknown: {
        title: "Error desconocido",
        description: "Ocurrió un error inesperado",
      },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Tienes cambios sin guardar",
      },
      conflict: {
        title: "Conflicto",
        description: "Un conflicto ocurrió con el estado actual",
      },
    },
  },
  title: "Actividad de IA",
  description:
    "Revise el catálogo de modelos y las conversaciones iniciadas en los últimos siete días.",
  models: "Modelos en el catálogo",
  providers: "Proveedores de modelos",
  skills: "Habilidades de la comunidad publicadas",
  conversations: "Conversaciones nuevas",
  reported: "Habilidades denunciadas",
  attention: "Pendiente de revisión",
  clear: "No hay habilidades denunciadas.",
  unavailable: "Estado de moderación no disponible.",
  recent: "Actividad reciente",
  loading: "Cargando la actividad de IA…",
  failed: "No se ha podido cargar la actividad de IA.",
};
