import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Chat",
  tags: {
    favorites: "Favoritos",
  },
  post: {
    title: "Reorder Favoritos",
    titleShort: "Reordenado",
    description: "Actualice el orden de sus configuraciones favoritas",
    positions: {
      label: "Posiciones",
    },
    errors: {
      validation: {
        title: "Orden inválida",
        description:
          "Por favor, compruebe la configuración de su pedido e inténtelo de nuevo",
      },
      network: {
        title: "Error de conexión",
        description:
          "Incapaz de salvar el nuevo orden. Por favor, inténtelo de nuevo.",
      },
      unauthorized: {
        title: "Inicia sesión para continuar",
        description: "Por favor, regístrese para reordenar sus favoritos",
      },
      forbidden: {
        title: "Permission Denied",
        description: "No tienes permiso para reordenar favoritos",
      },
      notFound: {
        title: "No se encontraron",
        description: "No pudimos encontrar tus favoritos para reordenar",
      },
      server: {
        title: "Algo que estaba mal.",
        description:
          "No podíamos salvar tu nueva orden. Por favor, inténtelo de nuevo.",
      },
      unknown: {
        title: "Error inesperado",
        description: "Algo inesperado sucedió. Por favor, inténtelo de nuevo.",
      },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Tus cambios aún no han sido salvados.",
      },
      conflict: {
        title: "Conflicto de orden",
        description:
          "La orden ha cambiado. Por favor, refresca y prueba de nuevo",
      },
    },
    success: {
      title: "Orden guardada",
      description: "Tus favoritos han sido reordenados con éxito",
    },
  },
};
