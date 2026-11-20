import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Facturación",
  tags: {
    payment: "pago",
    invoice: "factura",
    lines: "líneas",
  },
  post: {
    title: "Agregar línea de facturación",
    titleShort: "Añadir línea",
    description: "Añádase un tema de la línea a un proyecto de factura",
    form: {
      title: "Tema de la línea",
      description: "Definir el artículo facturable para añadir",
    },
    response: {
      success: "Línea añadida",
      message: "Mensaje de Estado",
      line: {
        title: "Detalles de la línea",
        subtitle: "Línea de facturas creada",
        id: "Línea ID",
        invoiceId: "Factura ID",
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
        description: "Parámetros de elementos de línea inválida",
      },
      server: {
        title: "Error del servidor",
        description: "Ocurrió un error interno del servidor",
      },
      unknown: {
        title: "Error desconocido",
        description: "Ocurrió un error desconocido",
      },
      network: {
        title: "Error de red",
        description: "Ocurrió un error de red",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "No tienes acceso",
      },
      notFound: {
        title: "No encontrado",
        description: "Factura no encontrada",
      },
      conflict: {
        title: "Conflicto",
        description: "La facturación no figura en el proyecto de estatuto",
      },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Hay cambios sin salvar",
      },
    },
    success: {
      title: "Operación completada",
      description: "Tema de línea añadido a la factura",
    },
  },
  invoiceId: {
    label: "Factura ID",
    description: "El proyecto de factura para añadir esta línea",
    placeholder: "Introduzca la factura ID",
  },
  description: {
    label: "Descripción",
    description: "Qué representa este artículo de línea",
    placeholder: "Por ejemplo. Desarrollo web - 10 horas",
  },
  productId: {
    label: "Producto ID",
    description: "Referencia del producto opcional",
    placeholder: "Ingrese el producto ID",
  },
  quantity: {
    label: "Cantidad",
    description: "Número de unidades",
    placeholder: "1",
  },
  unitPrice: {
    label: "Precio unitario",
    description: "Precio por unidad",
    placeholder: "0.00",
  },
  taxRate: {
    label: "Tasa de impuestos",
    description:
      "Tasa de impuestos como decimal (por ejemplo, 0,23 para el 23%)",
    placeholder: "0.00",
  },
  widget: {
    searchProduct: "Búsqueda de productos catálogo",
    searchPlaceholder: "Nombre o SKU...",
    searchButton: "Buscar",
    clearProduct: "Limpiar",
    noProductResults:
      "No hay coincidencias. ingrese manualmente a continuación.",
    orManual: "O introduzca manualmente",
    multiplier: "×",
    taxLabel: "impuesto fiscal",
    linePreview: "Total de la línea",
    lineAdded: "Línea añadida",
    addAnotherLine: "Añadir otra línea",
    viewInvoice: "Ver factura",
    submit: "Añadir línea",
  },
};
