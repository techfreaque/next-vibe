import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    products: "Productos",
    catalog: "Catálogo",
    deactivate: "Desactivar",
  },
  post: {
    title: "Desactivar producto",
    titleShort: "Desactivar",
    description:
      "Soft-delete un producto de catálogo por marcarlo inactivo. Los datos del producto se conservan.",
    productId: {
      label: "Producto ID",
      description: "El ID del producto para desactivar",
    },
    errors: {
      validation: {
        title: "Error de validación",
        description: "Compruebe el producto ID e inténtelo de nuevo",
      },
      unauthorized: {
        title: "No se registró",
        description: "Inicia sesión para desactivar un producto",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "Usted no tiene permiso para desactivar este producto",
      },
      conflict: {
        title: "Conflicto",
        description: "Se produjo un conflicto",
      },
      server: {
        title: "Error del servidor",
        description: "Algo salió mal en nuestro extremo. inténtalo de nuevo",
      },
      unknown: {
        title: "Error desconocido",
        description: "Ocurrió un error inesperado",
      },
      network: {
        title: "Error de red",
        description: "Revise su conexión e inténtelo de nuevo",
      },
      notFound: {
        title: "No encontrado",
        description: "Producto no encontrado",
      },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Tienes cambios sin guardar",
      },
    },
    success: {
      title: "Producto desactivado",
      description: "El producto ha sido eliminado del catálogo activo.",
    },
    response: {
      id: "Producto ID",
      isActive: "Situación activa",
    },
    widget: {
      backToList: "Volver a Productos",
      back: "Atrás",
      warning:
        "Esto desactivará el producto y lo eliminará del catálogo activo. Los datos se conservan.",
    },
  },
};
