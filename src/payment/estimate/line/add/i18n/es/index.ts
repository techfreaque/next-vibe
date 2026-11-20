import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Estimación",
  tags: { payment: "pago", estimate: "Estimaciones", lines: "líneas" },
  post: {
    title: "Add Estimación de la línea",
    titleShort: "Añadir línea",
    description: "Añádase un punto de partida a una estimación",
    form: {
      title: "Add Estimación de la línea",
      description: "Añadir un producto o servicio a esta estimación",
    },
    response: {
      success: "Operación completada",
      message: "Mensaje de Estado",
      line: {
        title: "Tema de la línea",
        subtitle: "Detalles de la línea",
        id: "Línea ID",
        estimateId: "Estimación ID",
        lineDescription: "Descripción",
        productId: "Producto ID",
        quantity: "Cantidad",
        unitPrice: "Precio unitario",
        taxRate: "Tasa de impuestos",
        taxAmount: "Cuantía fiscal",
        lineTotal: "Total",
        sortOrder: "Ordenar orden",
        createdAt: "Creado en",
        updatedAt: "Actualizado en",
      },
    },
    errors: {
      unauthorized: {
        title: "Se requiere autenticación",
        description: "Inicia sesión para continuar",
      },
      validation: {
        title: "Error de validación",
        description: "Compruebe los detalles del artículo de la línea",
      },
      server: {
        title: "Error del servidor",
        description: "Error del servidor interno",
      },
      unknown: {
        title: "Error desconocido",
        description: "Ocurrió un error desconocido",
      },
      network: {
        title: "Error de red",
        description: "Ocurrió un error de red",
      },
      forbidden: { title: "Acceso denegado", description: "Acceso denegado" },
      notFound: {
        title: "No encontrado",
        description: "Estimación no encontrada",
      },
      conflict: {
        title: "Conflicto",
        description:
          "La estimación debe estar en estado DRAFT para añadir líneas",
      },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Hay cambios sin salvar",
      },
    },
    success: {
      title: "Línea añadida",
      description: "Tema de línea añadido a la estimación",
    },
  },
  estimateId: {
    label: "Estimación ID",
    description: "La estimación para añadir una línea a",
    placeholder: "Estimación UUID",
  },
  description: {
    label: "Descripción",
    description: "Descripción del producto o servicio",
    placeholder: "Por ejemplo. Desarrollo web - 10 horas",
  },
  productId: {
    label: "Producto ID",
    description: "Referencia del producto opcional",
    placeholder: "Producto UUID",
  },
  quantity: {
    label: "Cantidad",
    description: "Número de unidades",
    placeholder: "1",
  },
  unitPrice: {
    label: "Precio unitario",
    description: "Precio por unidad (sin IVA)",
    placeholder: "0.00",
  },
  taxRate: {
    label: "Tasa de impuestos",
    description:
      "Tasa de impuestos como decimal (por ejemplo, 0,23 para el 23%)",
    placeholder: "0.23",
  },
  widget: {
    searchProduct: "Búsqueda de Producto",
    searchPlaceholder: "Nombre del producto o SKU...",
    searchButton: "Buscar",
    clearProduct: "Limpiar",
    noProductResults: "No hay productos encontrados.",
    orManual: "o introducir manualmente",
    multiplier: "×",
    taxLabel: "impuesto fiscal",
    linePreview: "Total de la línea",
    addAnotherLine: "Añadir otra línea",
    viewEstimate: "Volver a la estimación",
    submit: "Añadir línea",
  },
};
