import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Mensaje",
  titleShort: "Mensaje",
  description: "Mover un mensaje a una carpeta diferente",
  tag: "Bandeja de entrada",

  container: {
    title: "Mensaje",
    description: "Mover un mensaje de una carpeta a otra",
  },

  accountId: {
    label: "Cuenta",
    description: "Cuenta Mensajera",
    placeholder: "Cuenta UUID",
  },
  uid: {
    label: "Mensaje UID",
    description: "El UID del mensaje para mover",
    placeholder: "12345",
  },
  fromFolder: {
    label: "De la carpeta",
    description: "Carril de carpeta actual",
    placeholder: "INBOX",
  },
  toFolder: {
    label: "Para Carpeta",
    description: "Carpeta de destino",
    placeholder: "Archivar",
  },

  moved: { label: "Muévete" },

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
      detail: "Fallo de movimiento: {{error}}",
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
    title: "Mensaje Movedo",
    description: "El mensaje se ha movido con éxito",
  },
};
