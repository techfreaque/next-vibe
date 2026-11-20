import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    products: "Productos",
    category: "Categoría",
    list: "Lista",
  },
  get: {
    title: "Categorías",
    titleShort: "Categorías",
    description:
      "Recuperar las categorías de productos para una empresa o propietario.",
    companyId: {
      label: "Company ID",
      description: "Categorías de filtros pertenecientes a esta empresa",
    },
    page: {
      label: "Página",
      description: "Número de página (fotos a 1)",
    },
    pageSize: {
      label: "Por página",
      description: "Resultados por página (max 100)",
    },
    errors: {
      validation: {
        title: "Error de validación",
        description: "Revise los parámetros del filtro e inténtelo de nuevo",
      },
      unauthorized: {
        title: "No se registró",
        description: "Inicie sesión para ver categorías",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "Usted no tiene permiso para ver estas categorías",
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
        description: "No hay categorías encontradas",
      },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Tienes cambios sin guardar",
      },
    },
    success: {
      title: "Categorías Conseguido",
      description: "Las categorías de productos figuran a continuación.",
    },
    response: {
      id: "Categoría ID",
      name: "Categoría Nombre",
      parentId: "Categoría de padres",
      sortOrder: "Ordenar orden",
      isActive: "Activa",
      createdAt: "Creado",
      total: "Total",
    },
    widget: {
      addCategory: "Agregar categoría",
      active: "Activa",
      inactive: "Inactivo",
      empty: "No hay categorías encontradas. Añada su primera categoría.",
      viewProducts: "Ver productos →",
      backToCatalog: "← Productos",
      back: "Atrás",
    },
  },
};
