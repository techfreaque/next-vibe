import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Sistema",
  get: {
    title: "Export Production Env",
    titleShort: "Exportar Env",
    description:
      "Generar un archivo.env listo para la producción con valores descifrados, instrucciones de implementación y una lista de verificación",
    tags: {
      exportEnv: "Exportar Env",
    },
    response: {
      content: {
        title: "Contenido de archivo Env",
      },
      filename: {
        title: "Nombre de archivo",
      },
    },
    success: {
      title: "Env Exported",
      description: "Producción env archivo generado con éxito",
    },
    widget: {
      copy: "Copiado para el portapapeles",
      copied: "¡Copiado!",
      download: "Descargar.env.prod",
      instructions:
        "Copia este archivo en su servidor y reinicia la aplicación.",
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
        description: "Ajustes no encontrados",
      },
      network: {
        title: "Error de red",
        description: "Ocurrió un error de red",
      },
      server: {
        title: "Error del servidor",
        description: "Failed to generate env file",
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
