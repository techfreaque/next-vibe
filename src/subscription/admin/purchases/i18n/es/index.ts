import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  get: {
    title: "Compras de crédito",
    titleShort: "Admin Purchases",
    description: "Historial de compra del paquete de crédito",
    form: {
      title: "Historia de compra",
      description: "Ver las compras de paquetes de crédito",
    },
    searchFilters: {
      title: "Búsqueda &quot; Filtros",
      description: "Compras de filtros",
    },
    search: {
      label: "Buscar",
      description: "Buscar por correo electrónico del usuario",
      placeholder: "Compras de búsqueda...",
    },
    packType: {
      label: "Tipo de paquete",
      description: "Filtro por tipo de paquete de crédito",
      placeholder: "Cualquier tipo",
    },
    source: {
      label: "Fuente",
      description: "Filtro por fuente de compra",
      placeholder: "Cualquier fuente",
    },
    dateFrom: {
      label: "Desde",
      description: "Filtro de fecha de inicio",
    },
    dateTo: {
      label: "A",
      description: "Filtro de fecha final",
    },
    sortingOptions: {
      title: "Clasificación",
      description: "Configurar la clasificación de resultados",
    },
    sortBy: {
      label: "Ordenar por",
      description: "Campo tipo",
      placeholder: "Seleccione el campo de clase...",
    },
    sortOrder: {
      label: "Ordenar orden",
      description: "Dirección",
      placeholder: "Seleccione el orden...",
    },
    response: {
      title: "Compras",
      description: "Historial de compra del paquete de crédito",
      purchases: {
        id: "ID",
        userEmail: "Correo electrónico",
        userName: "Nombre",
        packType: "Tipo",
        source: "Fuente",
        originalAmount: "Monto",
        remaining: "Permaneciendo",
        expiresAt: "Expires",
        createdAt: "Comprado",
      },
      totalCount: "Total de compras",
      pageCount: "Total de páginas",
    },
    page: { label: "Página" },
    limit: { label: "Por página" },
    errors: {
      unauthorized: {
        title: "Se requiere autenticación",
        description: "Acceso requerido",
      },
      validation: {
        title: "Error de validación",
        description: "Parámetros inválidos",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "Acceso de los administradores necesario",
      },
      server: {
        title: "Error del servidor",
        description: "Incapaz de recuperar compras",
      },
      unknown: {
        title: "Error desconocido",
        description: "Error inesperado",
      },
      conflict: { title: "Conflicto", description: "Conflicto de datos" },
      network: {
        title: "Error de red",
        description: "Incapaz de conectarse",
      },
      notFound: {
        title: "No encontrado",
        description: "No se han encontrado compras",
      },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Cambios sin guardar",
      },
    },
    success: {
      title: "Operación completada",
      description: "Compras recuperadas",
    },
  },
  widget: {
    noPurchases: "No se han encontrado compras de paquetes de crédito.",
    noMatchingPurchases: "No hay compras que coincidan con sus filtros.",
    searchPlaceholder: "Búsqueda por correo electrónico...",
    refresh: "Actualizar",
    expired: "Gastos",
    neverExpires: "Nunca.",
  },
  enums: {
    creditPackTypeFilter: {
      any: "Cualquiera",
      subscription: "Suscripción",
      permanent: "Permanente",
      bonus: "Bonus",
      earned: "Ganado",
    },
    creditPackSourceFilter: {
      any: "Cualquiera",
      stripePurchase: "Stripe Purchase",
      stripeSubscription: "Subscripción",
      adminGrant: "Admin Grant",
      referralEarning: "Pendientes de referencia",
    },
    purchaseSortField: {
      createdAt: "Creado en",
      amount: "Monto",
      type: "Tipo",
      userEmail: "Correo electrónico",
    },
    sortOrder: {
      asc: "Ascendencia",
      desc: "Descendiente",
    },
  },
};
