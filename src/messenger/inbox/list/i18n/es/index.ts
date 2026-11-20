import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Lista de cajas",
  titleShort: "Bandeja de entrada",
  description:
    "Lista de mensajes desde la bandeja de entrada o una carpeta específica",
  tag: "Bandeja de entrada",

  container: {
    title: "Mensajes de la caja",
    description: "Mensajes de la cuenta y carpeta seleccionadas",
  },

  accountId: {
    label: "Cuenta",
    description: "Cuenta de Messenger para leer la bandeja de entrada",
    placeholder: "Cuenta UUID",
  },
  folderPath: {
    label: "Folder",
    description: "Carpeta de carpeta a la lista (predeterminados a INBOX)",
    placeholder: "INBOX",
  },

  messages: {
    label: "Mensajes",
    uid: { label: "UID" },
    messageId: { label: "Mensaje ID" },
    subject: { label: "Asunto" },
    from: { label: "Desde" },
    to: { label: "A" },
    date: { label: "Fecha" },
    isRead: { label: "Leer" },
    isFlagged: { label: "Flagged" },
    folderPath: { label: "Folder" },
    bodyText: { label: "Cuerpo" },
  },

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
      detail: "No podía cargar la bandeja de entrada: {{error}}",
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
    title: "Caja de entrada cargada",
    description: "Mensajes recuperados con éxito",
  },
};
