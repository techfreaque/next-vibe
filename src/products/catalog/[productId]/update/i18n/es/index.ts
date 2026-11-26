import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  enums: {
    productType: {
      service: "Servicio",
      physical: "Física",
      digital: "Digital",
    },
  },
  tags: {
    products: "Productos",
    catalog: "Catálogo",
    update: "Actualización",
  },
  patch: {
    title: "Actualización del producto",
    titleShort: "Actualización del producto",
    description: "Actualizar campos en un producto de catálogo existente.",
    productId: {
      label: "Producto ID",
      description: "El ID del producto para actualizar",
    },
    name: {
      label: "Nombre del producto",
      description: "Nombre actualizado para el producto",
      placeholder: "Paquete de diseño web",
    },
    productDescription: {
      label: "Descripción",
      description: "Descripción actualizada del producto",
      placeholder: "Diseño completo del sitio web incluyendo hasta 5 páginas",
    },
    sku: {
      label: "SKU",
      description: "Código de unidad de almacenamiento actualizado",
      placeholder: "WD-001",
    },
    type: {
      label: "Tipo de producto",
      description: "Tipo de producto actualizado",
      placeholder: "Seleccione el tipo",
    },
    unit: {
      label: "Dependencia",
      description: "Unidad de facturación actualizada",
      placeholder: "hora",
    },
    basePrice: {
      label: "Precio básico",
      description: "Precio básico actualizado",
      placeholder: "150.00",
    },
    currency: {
      label: "Moneda",
      description: "Actualizado código postal ISO",
      placeholder: "EUR",
    },
    defaultTaxRate: {
      label: "Tasa de impuestos por defecto",
      description: "Tasa de impuestos por defecto actualizada como decimal",
      placeholder: "0.19",
    },
    categoryId: {
      label: "Categoría",
      description: "Categoría de productos actualizados",
    },
    imageUrl: {
      label: "Imagen URL",
      description: "Imagen actualizada del producto URL",
      placeholder: "https://example.com/product.jpg",
    },
    isActive: {
      label: "Activa",
      description: "Si el producto está disponible en el catálogo",
    },
    errors: {
      validation: {
        title: "Error de validación",
        description: "Revise los campos e inténtelo de nuevo",
      },
      unauthorized: {
        title: "No se registró",
        description: "Inicie sesión para actualizar un producto",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "Usted no tiene permiso para actualizar este producto",
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
      title: "Actualización de productos",
      description: "Los detalles del producto han sido guardados.",
    },
    response: {
      id: "Producto ID",
      name: "Nombre del producto",
    },
    widget: {
      catalogCompany: "Empresa del catálogo",
      billingCadence: "Frecuencia de facturación",
      oneTime: "Compra única",
      personalCatalog: "Catálogo personal",
      companyUnavailable: "Nombre de la empresa no disponible",
      couldNotLoad: "No se pudo cargar el producto.",
      retry: "Reintentar",
      backToList: "Volver a Productos",
      back: "Atrás",
    },
  },
};
