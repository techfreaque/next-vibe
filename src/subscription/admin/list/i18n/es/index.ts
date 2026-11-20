import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  get: {
    title: "Suscripciones",
    titleShort: "Sub Lista",
    description: "Examine todas las suscripciones",
    form: {
      title: "Gestión de las suscripciones",
      description: "Filtrar y navegar suscripciones"
    },
    searchFilters: {
      title: "Búsqueda &quot; Filtros",
      description: "Suscripciones de filtros"
    },
    search: {
      label: "Buscar",
      description: "Buscar por correo electrónico o nombre del usuario",
      placeholder: "Suscripciones de búsqueda..."
    },
    status: {
      label: "Situación",
      description: "Filtro por estado de suscripción",
      placeholder: "Seleccione el estado..."
    },
    interval: {
      label: "Frecuencia de facturación",
      description: "Filtro por intervalo de facturación",
      placeholder: "Cualquier intervalo"
    },
    provider: {
      label: "Proveedor",
      description: "Filtro por proveedor de pago",
      placeholder: "Cualquier proveedor"
    },
    dateFrom: {
      label: "Desde",
      description: "Filtro de fecha de inicio"
    },
    dateTo: {
      label: "A",
      description: "Filtro de fecha final"
    },
    sortingOptions: {
      title: "Clasificación",
      description: "Configurar la clasificación de resultados"
    },
    sortBy: {
      label: "Ordenar por",
      description: "Campo tipo",
      placeholder: "Seleccione el campo de clase..."
    },
    sortOrder: {
      label: "Ordenar orden",
      description: "Dirección",
      placeholder: "Seleccione el orden..."
    },
    response: {
      title: "Suscripciones",
      description: "Suscripciones coincidentes",
      subscriptions: {
        id: "ID",
        userEmail: "Correo electrónico",
        userName: "Nombre",
        planId: "Plan",
        billingInterval: "Interval",
        status: "Situación",
        createdAt: "Comienzo",
        currentPeriodEnd: "Período final",
        cancelAtPeriodEnd: "Cancelar en End",
        canceledAt: "Cancelado",
        cancellationReason: "Cancel Reason",
        provider: "Proveedor",
        providerSubscriptionId: "Proveedor ID"
      },
      totalCount: "Suscripciones totales",
      pageCount: "Total de páginas"
    },
    page: {
      label: "Página"
    },
    limit: {
      label: "Por página"
    },
    errors: {
      unauthorized: {
        title: "Se requiere autenticación",
        description: "Acceso requerido"
      },
      validation: {
        title: "Error de validación",
        description: "Parámetros inválidos"
      },
      forbidden: {
        title: "Acceso denegado",
        description: "Acceso de los administradores necesario"
      },
      server: {
        title: "Error del servidor",
        description: "Incapaz de recuperar suscripciones",
        detail: "No se puede cargar la lista de suscripción: {{error}}"
      },
      unknown: {
        title: "Error desconocido",
        description: "Error inesperado"
      },
      conflict: {
        title: "Conflicto",
        description: "Conflicto de datos"
      },
      network: {
        title: "Error de red",
        description: "Incapaz de conectarse"
      },
      notFound: {
        title: "No encontrado",
        description: "No se han encontrado suscripciones"
      },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Cambios sin guardar"
      }
    },
    success: {
      title: "Operación completada",
      description: "Suscripciones recuperadas"
    }
  },
  widget: {
    noSubscriptions: "No se han encontrado suscripciones.",
    noMatchingSubscriptions: "No hay suscripciones que coincidan con sus filtros.",
    searchPlaceholder: "Búsqueda por correo electrónico o nombre...",
    refresh: "Actualizar",
    viewStats: "Estadísticas"
  },
  enums: {
    subscriptionStatusFilter: {
      all: "Todos",
      active: "Activa",
      trialing: "Juicio",
      pastDue: "Puestos atrasados",
      canceled: "Cancelado",
      unpaid: "No pagados",
      paused: "Pausa"
    },
    billingIntervalFilter: {
      any: "Cualquiera",
      monthly: "Mensual",
      yearly: "Anual"
    },
    providerFilter: {
      any: "Cualquiera",
      stripe: "Stripe",
      nowpayments: "NowPayments"
    },
    subscriptionSortField: {
      createdAt: "Creado en",
      status: "Situación",
      interval: "Interval",
      userEmail: "Correo electrónico"
    },
    sortOrder: {
      asc: "Ascendencia",
      desc: "Descendiente"
    }
  }
};
