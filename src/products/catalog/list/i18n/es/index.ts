import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    products: "Productos",
    catalog: "Catálogo",
    list: "Lista",
  },
  enums: {
    productType: {
      service: "Servicio",
      physical: "Física",
      digital: "Digital",
    },
  },
  get: {
    title: "Productos",
    titleShort: "Productos",
    description:
      "Recuperar todos los productos en su catálogo. Filtrar por empresa, categoría, tipo o estado activo.",
    companyId: {
      label: "Company ID",
      description: "Filtrar productos pertenecientes a esta empresa",
    },
    categoryId: {
      label: "Categoría ID",
      description: "Filtros para productos en esta categoría",
    },
    type: {
      label: "Tipo de producto",
      description: "Filtro por servicio, físico o digital",
      placeholder: "Todos los tipos",
    },
    isActive: {
      label: "Únicamente activo",
      description: "Mostrar sólo productos activos",
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
        description: "Inicie sesión para ver su catálogo",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "Usted no tiene permiso para ver este catálogo",
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
        description: "No se han encontrado productos",
      },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Tienes cambios sin guardar",
      },
    },
    success: {
      title: "Productos Conseguidos",
      description: "Sus productos de catálogo están listados a continuación.",
    },
    response: {
      id: "Producto ID",
      name: "Nombre del producto",
      type: "Tipo",
      sku: "SKU",
      basePrice: "Precio básico",
      currency: "Moneda",
      unit: "Dependencia",
      isActive: "Activa",
      isSubscription: "Suscripción",
      billingInterval: "Frecuencia de facturación",
      categoryId: "Categoría",
      createdAt: "Creado",
      total: "Total",
    },
    widget: {
      checkout: "Ofertas de pago de la plataforma",
      checkoutHint:
        "Consulte los planes y paquetes y sus precios para este mercado. Para vincular la venta con la contabilidad, elija abajo un producto de empresa y configure su oferta de pago.",
      checkoutReference: "Referencia de pago",
      checkoutCredits: "Créditos incluidos",
      oneTime: "Precio único",
      searchPage: "Buscar por nombre o SKU en esta página",
      noMatches: "No hay productos que coincidan en esta página",
      retry: "Reintentar",
      previous: "Anterior",
      next: "Siguiente",
      status: "Estado",
      addProduct: "Agregar producto",
      active: "Activa",
      inactive: "Inactivo",
      empty:
        "No hay productos encontrados. Ajuste los filtros o agregue un nuevo producto.",
      columnProduct: "Producto",
      columnTypePrice: "Tipo / Precio / Estado",
      filterLoad: "Carga",
      filterAllTypes: "Todos los tipos",
      filterActiveOnly: "Activo solamente",
      filterAllStatus: "Situación general",
      recurring: "Recurriendo",
      billingMonthly: "Mensual",
      billingYearly: "Anual",
      navCategories: "Categorías",
      navTaxRates: "Tasas impositivas",
      back: "Atrás",
    },
  },
};
