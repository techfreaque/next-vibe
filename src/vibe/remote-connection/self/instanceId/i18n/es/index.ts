import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Cuenta",
  tags: {
    remoteConnection: "Conexión remota",
  },
  get: {
    title: "Esta instalación es ID",
    titleShort: "Instance ID",
    description: "Lea el identificador de su propia instancia en esta máquina",
    instanceId: {
      label: "Instance ID",
      description: "El identificador de esta instancia",
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
          "Usted debe estar conectado para leer el ID de esta instancia",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "No tienes permiso para leer el ID de esta instancia",
      },
      notFound: {
        title: "No encontrado",
        description: "Identidad de la instalación no encontrada",
      },
      server: {
        title: "Error del servidor",
        description: "Se produjo un error al leer la instancia ID",
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
      title: "Instance ID",
      description: "Resolvió el ID de este caso",
    },
  },
};
