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
    create: "Crear",
  },
  post: {
    title: "Crear producto",
    titleShort: "Crear producto",
    description: "Añadir un producto o servicio a tu catálogo.",
    name: {
      label: "Nombre del producto",
      description: "Nombre del producto o servicio",
      placeholder: "Paquete de diseño web",
    },
    productDescription: {
      label: "Descripción",
      description: "Breve descripción de lo que el producto o servicio incluye",
      placeholder: "Diseño completo del sitio web incluyendo hasta 5 páginas",
    },
    sku: {
      label: "SKU",
      description:
        "Unidad de mantenimiento de stock. su código de producto interno",
      placeholder: "WD-001",
    },
    type: {
      label: "Tipo de producto",
      description: "Ya sea un servicio, bien físico o elemento digital",
      placeholder: "Seleccione el tipo",
    },
    unit: {
      label: "Dependencia",
      description: "Unidad de facturación (por ejemplo, hora, pieza, licencia)",
      placeholder: "hora",
    },
    basePrice: {
      label: "Precio básico",
      description: "Precio predeterminado en la moneda seleccionada",
      placeholder: "150.00",
    },
    currency: {
      label: "Moneda",
      description: "Código de moneda ISO de 3 letras",
      placeholder: "EUR",
    },
    defaultTaxRate: {
      label: "Tasa de impuestos por defecto",
      description:
        "Tasa por defecto VAT /tax como decimal (por ejemplo, 0.19 por 19%)",
      placeholder: "0.19",
    },
    companyId: {
      label: "Company",
      description: "Asocia este producto con una empresa",
    },
    categoryId: {
      label: "Categoría",
      description: "Categoría de productos",
    },
    imageUrl: {
      label: "Imagen URL",
      description: "URL a una imagen de producto",
      placeholder: "https://example.com/product.jpg",
    },
    isSubscription: {
      label: "Producto de suscripción",
      description: "Carga a los clientes sobre una base recurrente",
    },
    billingInterval: {
      label: "Intervalo de facturación",
      description: "Cuantas veces se cobran los clientes",
      placeholder: "Seleccionar intervalo",
      monthly: "Mensual",
      yearly: "Anual",
    },
    errors: {
      validation: {
        title: "Error de validación",
        description: "Revise los campos del formulario e inténtelo de nuevo",
      },
      unauthorized: {
        title: "No se registró",
        description: "Inicia sesión para crear un producto",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "Usted no tiene permiso para crear este producto",
      },
      conflict: {
        title: "Ya existe.",
        description: "Un producto con este SKU ya existe",
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
      title: "Producto Creado",
      description: "Su producto está ahora en el catálogo.",
    },
    response: {
      id: "Producto ID",
      name: "Nombre del producto",
    },
    widget: {
      viewProduct: "Ver producto",
      backToList: "Volver a Productos",
      back: "Atrás",
    },
  },
};
