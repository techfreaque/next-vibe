import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Chat",
  tags: {
    favorites: "Favoritos",
  },
  post: {
    title: "Quitar los favoritos",
    titleShort: "Retirar",
    description: "Quitar varios favoritos en una sola vez",
    ids: {
      label: "IDs favoritas",
    },
    errors: {
      validation: {
        title: "Solicitud inválida",
        description:
          "Por favor, compruebe lo que está eliminando e intente de nuevo.",
      },
      network: {
        title: "Error de conexión",
        description:
          "Incapaz de quitar los favoritos. Por favor, inténtelo de nuevo.",
      },
      unauthorized: {
        title: "Inicia sesión para continuar",
        description: "Por favor, regístrese para eliminar sus favoritos",
      },
      forbidden: {
        title: "Permission Denied",
        description: "No tienes permiso para quitar estos favoritos",
      },
      notFound: {
        title: "No se encontraron",
        description: "No pudimos encontrar los favoritos para eliminar",
      },
      server: {
        title: "Algo que estaba mal.",
        description:
          "No podíamos quitar tus favoritos. Por favor, inténtelo de nuevo.",
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
        title: "Conflicto de eliminación",
        description:
          "Estos favoritos cambiaron. Por favor, refresca y prueba de nuevo",
      },
    },
    success: {
      title: "Favoritos Quitados",
      description: "Los favoritos seleccionados han sido eliminados",
    },
  },
};
