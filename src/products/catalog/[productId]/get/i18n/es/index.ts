import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    products: "Productos",
    catalog: "Catálogo",
    get: "¡Vamos!",
  },
  get: {
    title: "Obtener catálogo producto",
    titleShort: "Detalles del producto",
    description: "Recuperar un producto de catálogo único por ID.",
    productId: {
      label: "Producto ID",
      description: "El ID del producto para recuperar",
    },
    errors: {
      validation: {
        title: "Error de validación",
        description: "Compruebe el producto ID e inténtelo de nuevo",
      },
      unauthorized: {
        title: "No se registró",
        description: "Inicie sesión para ver detalles del producto",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "Usted no tiene permiso para ver este producto",
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
      title: "Producto retrocedido",
      description: "Detalles del producto cargados.",
    },
    response: {
      id: "Producto ID",
      companyId: "Company",
      name: "Nombre del producto",
      description: "Descripción",
      sku: "SKU",
      type: "Tipo",
      unit: "Dependencia",
      basePrice: "Precio básico",
      currency: "Moneda",
      defaultTaxRate: "Tasa de impuestos por defecto",
      categoryId: "Categoría",
      imageUrl: "Imagen URL",
      isActive: "Activa",
      isSubscription: "Suscripción",
      billingInterval: "Frecuencia de facturación",
      createdAt: "Creado",
      updatedAt: "Actualizado",
    },
    widget: {
      unavailable: "Producto no disponible",
      prices: "Tarifas activas",
      stock: "Inventario",
      viewStock: "Ver existencias del almacén",
      offers: "Ofertas del procesador",
      noOffers: "Este producto no tiene ofertas activas vinculadas.",
      configureOffer: "Configurar oferta de pago",
      offerNeedsSku:
        "Active el producto y añada un SKU para configurar la oferta.",
      revenueAccount: "Cuenta de ingresos",
      liabilityAccount: "Cuenta de ingresos diferidos",
      edit: "Editar",
      deactivate: "Desactivar",
      activate: "Activar",
      active: "Activa",
      inactive: "Inactivo",
      back: "Atrás",
      loading: "Cargando producto...",
      typeService: "Servicio",
      typePhysical: "Física",
      typeDigital: "Digital",
      recurring: "Recurriendo",
      billingMonthly: "Mensual",
      billingYearly: "Anual",
      addToInvoice: "Añadir a factura",
      details: "Detalles",
      select: "Seleccione el producto",
    },
  },
};
