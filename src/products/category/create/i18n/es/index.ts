import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    products: "Productos",
    category: "Categoría",
    create: "Crear",
  },
  post: {
    title: "Crear categoría de producto",
    titleShort: "Crear categoría",
    description:
      "Añadir una categoría para organizar sus productos de catálogo.",
    name: {
      label: "Categoría Nombre",
      description: "Nombre de la categoría del producto",
      placeholder: "Servicios de diseño",
    },
    companyId: {
      label: "Company",
      description: "Asocia esta categoría con una empresa",
    },
    parentId: {
      label: "Categoría de padres",
      description: "Categoría padre opcional para la organización jerárquica",
    },
    sortOrder: {
      label: "Ordenar orden",
      description:
        "Orden de visualización: los números inferiores aparecen primero",
      placeholder: "0",
    },
    errors: {
      validation: {
        title: "Error de validación",
        description: "Revise los campos del formulario e inténtelo de nuevo",
      },
      unauthorized: {
        title: "No se registró",
        description: "Iniciar sesión para crear una categoría",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "Usted no tiene permiso para crear esta categoría",
      },
      conflict: {
        title: "Ya existe.",
        description: "Una categoría con este nombre ya existe",
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
        description: "No se encontró el recurso",
      },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Tienes cambios sin guardar",
      },
    },
    success: {
      title: "Categoría Creado",
      description: "Su categoría de producto está lista.",
    },
    response: {
      id: "Categoría ID",
      name: "Categoría Nombre",
    },
    widget: {
      backToList: "Volver a Categorías",
      back: "Atrás",
    },
  },
};
