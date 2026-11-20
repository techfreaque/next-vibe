import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Cuenta",
  tags: {
    remoteConnection: "Conexión remota",
  },
  patch: {
    title: "Rename This Instance",
    titleShort: "Instance de renombre",
    description: "Actualice el nombre amistoso de su propia instancia",
    newInstanceId: {
      label: "Nueva instancia ID",
      description: "El nuevo identificador para este caso",
      placeholder: "hermes",
    },
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
        title: "No está atrapado.",
        description:
          "Debes estar conectado para cambiar el nombre de esta instancia.",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "No tienes permiso para renombrar esta instancia.",
      },
      notFound: {
        title: "No encontrado",
        description: "Identidad de la instalación no encontrada",
      },
      server: {
        title: "Error del servidor",
        description: "Se produjo un error al renombrar",
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
        description: "Se produjo un conflicto",
      },
    },
    success: {
      title: "Renombrado",
      description: "Instance renombrado con éxito",
    },
  },
};
