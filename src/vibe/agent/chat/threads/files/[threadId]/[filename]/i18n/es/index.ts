import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Chat",
  tags: {
    files: "Archivos",
  },
  get: {
    title: "Obtener archivo",
    titleShort: "Thread File",
    description: "Recuperar un archivo cargado",
    success: {
      title: "Retrieved",
      description: "Archivo recuperado con éxito",
    },
    errors: {
      validation: {
        title: "Error de validación",
        description: "Parámetros de solicitud de archivos inválidos",
      },
      network: {
        title: "Error de red",
        description: "Fallado para recuperar el archivo debido al error de red",
      },
      unauthorized: {
        title: "Se requiere autenticación",
        description: "Autenticación necesaria para acceder a este archivo",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "Usted no tiene permiso para acceder a este archivo",
      },
      notFound: {
        title: "El archivo no se encontró",
        description:
          "No se encontró el archivo solicitado ni se denegó el acceso.",
      },
      server: {
        title: "Error del servidor",
        description:
          "Fallado para recuperar el archivo debido al error del servidor",
      },
      unknown: {
        title: "Error desconocido",
        description: "Ocurrió un error desconocido",
      },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Hay cambios sin salvar",
      },
      conflict: {
        title: "Conflicto",
        description: "Se produjo un conflicto",
      },
    },
  },
  errors: {
    fileNotFound: "El archivo no encontrado o el acceso negado",
  },
};
