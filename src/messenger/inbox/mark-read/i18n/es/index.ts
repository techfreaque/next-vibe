import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Mark Read",
  titleShort: "Mark Read",
  description: "Marcar un mensaje como leído o no leído",
  tag: "Bandeja de entrada",

  container: {
    title: "Mensaje de marca",
    description: "Actualizar el estado de lectura de un mensaje",
  },

  accountId: {
    label: "Cuenta",
    description: "Cuenta Mensajera",
    placeholder: "Cuenta UUID",
  },
  uid: {
    label: "Mensaje UID",
    description: "El UID del mensaje",
    placeholder: "12345",
  },
  folderPath: {
    label: "Folder",
    description: "Carril de carpeta que contiene el mensaje",
    placeholder: "INBOX",
  },
  isRead: {
    label: "Marcar como Leer",
    description:
      "Establecido para marcar como leído, falso para marcar como no leído",
  },

  updated: { label: "Actualizado" },

  errors: {
    validation: {
      title: "Error de validación",
      description: "Comprueba tu entrada",
    },
    unauthorized: {
      title: "Se requiere autenticación",
      description: "Acceso requerido",
    },
    server: {
      title: "Error del servidor",
      description: "Error del servidor interno",
      detail: "No se pudo actualizar el estado de lectura: {{error}}",
    },
    unknown: { title: "Error desconocido", description: "Error inesperado" },
    forbidden: { title: "Acceso denegado", description: "Acceso denegado" },
    network: { title: "Error de red", description: "Error de red" },
    notFound: {
      title: "Cuenta no encontrada",
      description: "Cuenta Mensajera no encontrada",
    },
    conflict: {
      title: "Conflicto",
      description: "Solicite conflictos con los datos existentes",
    },
    unsavedChanges: {
      title: "Cambios sin guardar",
      description: "Tienes cambios sin guardar",
    },
  },

  success: {
    title: "Mensaje actualizado",
    description: "Leer el estado actualizado con éxito",
  },
};
