import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Sistema",
  get: {
    title: "Generar clave secreta",
    titleShort: "Generar clave",
    description: "Generar una clave de hex aleatoria segura criptográficamente",
    tags: {
      generateKey: "Generar clave",
    },
    response: {
      key: {
        title: "Clave generada",
      },
    },
    success: {
      title: "Key Generated",
      description: "Clave segura generada con éxito",
    },
    errors: {
      validation: {
        title: "Error de validación",
        description: "Parámetros de solicitud no válidos",
      },
      unauthorized: {
        title: "Se requiere autenticación",
        description: "Inicia sesión para continuar",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "Acceso de los administradores necesario",
      },
      notFound: {
        title: "No encontrado",
        description: "Cuenta o sesión no encontradas",
      },
      network: {
        title: "Error de red",
        description: "Ocurrió un error de red",
      },
      server: {
        title: "Error del servidor",
        description: "Fallado para generar clave",
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
  },
};
