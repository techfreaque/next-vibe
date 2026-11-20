import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  post: {
    title: "Ver imagen",
    titleShort: "Ver imagen",
    description:
      "Busque y muestre una imagen previamente capturada por su almacenamiento URL. Utilice esto para reexaminar una captura de pantalla o imagen desde un giro anterior.",
    dynamicTitle: "Vista: {{url}}",
    url: {
      label: "Imagen URL",
      description: "Almacenamiento URL de la imagen para ver",
      placeholder: "https://...",
    },
    response: {
      url: "Imagen URL",
    },
    errors: {
      validation_failed: {
        title: "Error de validación",
        description: "El URL proporcionado es nulo",
      },
      network_error: {
        title: "Error de red",
        description: "Failed para buscar la imagen",
      },
      unauthorized: {
        title: "Se requiere autenticación",
        description: "No está autorizado para ver esta imagen",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "El acceso a esta imagen está prohibido",
      },
      not_found: {
        title: "Imagen no encontrada",
        description: "No se encontró ninguna imagen en el URL proporcionado",
      },
      server_error: {
        title: "Error del servidor",
        description: "Se produjo un error de servidor interno",
      },
      unknown_error: {
        title: "Error desconocido",
        description: "Ocurrió un error inesperado",
      },
      unsaved_changes: {
        title: "Cambios sin guardar",
        description: "Tienes cambios sin guardar",
      },
      conflict: {
        title: "Conflicto",
        description: "Se produjo un conflicto",
      },
    },
    success: {
      title: "Imagen cargada",
      description: "La imagen fue recuperada con éxito",
    },
  },
  tags: {
    vision: "Visión",
    ai: "IA",
  },
};
