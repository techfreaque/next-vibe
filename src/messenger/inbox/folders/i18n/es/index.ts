import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Carpetas de lista",
  titleShort: "Carpetas",
  description: "Lista de carpetas disponibles para una cuenta de mensajero",
  tag: "Bandeja de entrada",

  container: {
    title: "Carpetas",
    description: "Carpetas disponibles para la cuenta seleccionada",
  },

  accountId: {
    label: "Cuenta",
    description: "Cuenta de Messenger para listar carpetas para",
    placeholder: "Cuenta UUID",
  },

  folders: {
    label: "Carpetas",
    path: { label: "Camino" },
    name: { label: "Nombre" },
    displayName: { label: "Nombre de pantalla" },
    specialUseType: { label: "Tipo" },
    messageCount: { label: "Mensajes" },
    unseenCount: { label: "Unseen" },
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
      detail: "No se podían cargar carpetas: {{error}}",
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
    title: "Carpetas cargadas",
    description: "Carpetas recuperadas con éxito",
  },
};
