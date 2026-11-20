import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Cuenta",
  tags: {
    remoteConnection: "Conexión remota",
  },
  widget: {
    title: "Sincronización inversa",
    description:
      "Punto final del sistema. Llamado por la instancia de iniciación para reflejar los cambios syncScope en el lado remoto.",
    note: "No de cara al usuario. invocado automáticamente en la actualización de la configuración de conexión.",
  },
  patch: {
    title: "Actualización de conexión inversa",
    titleShort: "Actualización",
    description:
      "Llamado por la instancia de iniciación para sincronizar los ajustes de conexión con el otro lado",
    syncScope: {
      label: "Sincronización",
      description: "Qué dominios de datos para sincronizar sobre esta conexión",
    },
    newInstanceId: {
      label: "Nombre de nueva instancia",
      description:
        "El nuevo nombre de la instancia del llamador. actualiza nuestra etiqueta para él",
    },
    errors: {
      validation: {
        title: "Error de validación",
        description: "Por favor, compruebe sus datos e inténtelo de nuevo",
      },
      network: {
        title: "Error de red",
        description: "No se pudo conectar con el servidor",
      },
      unauthorized: {
        title: "No está atrapado.",
        description: "Debe registrarse para actualizar la conexión",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "No tiene permiso para actualizar esta conexión",
      },
      notFound: {
        title: "No encontrado",
        description: "No hay conexión inversa encontrada para este caso",
      },
      server: {
        title: "Error del servidor",
        description: "Se produjo un error al actualizar la conexión",
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
        description: "Se produjo un conflicto al actualizar la conexión",
      },
    },
    success: {
      title: "Actualización de conexión",
      description: "Los ajustes de conexión inversa se han actualizado",
    },
  },
};
