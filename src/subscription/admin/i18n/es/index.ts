import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Suscripciones",
  tags: {
    admin: "Administrador",
    stats: "Estadísticas",
    list: "Lista",
    purchases: "Compras",
    referrals: "Remisiones",
  },
  // Stats endpoint translations
  stats: {
    get: {
      title: "Estadísticas de suscripción",
      description: "Ingresos, suscripción, crédito y métricas de remisión",
      form: {
        title: "Oficina de Estadística",
        description: "métricas de negocio agregadas",
      },
      timePeriodOptions: {
        title: "Período de tiempo",
        description: "Configurar el rango de tiempo",
      },
      timePeriod: {
        label: "Período",
        description: "Intervalo de agrupación",
      },
      dateRangePreset: {
        label: "Fecha de rango",
        description: "Rango de fecha predefinido",
      },
      response: {
        revenueStats: {
          title: "Ingresos",
          description: "Revenue metrics",
          mrr: { label: "MRR" },
          arr: { label: "ARR" },
          totalRevenue: { label: "Total de ingresos" },
          avgOrderValue: { label: "Orden de Avg" },
        },
        subscriptionStats: {
          title: "Suscripciones",
          description: "Cuentas de suscripción",
          activeCount: { label: "Activa" },
          trialingCount: { label: "Juicio" },
          canceledCount: { label: "Cancelado" },
          churnRate: { label: "Tasa de Churn" },
        },
        intervalStats: {
          title: "Intervalos de facturación",
          description: "Dividencia mensual vs anual",
          monthlyCount: { label: "Mensual" },
          yearlyCount: { label: "Anual" },
          yearlyRevenuePct: { label: "% Ingresos anuales" },
        },
        creditStats: {
          title: "Créditos",
          description: "métricas del paquete de crédito",
          totalPurchased: { label: "Comprado" },
          totalSpent: { label: "Gasto" },
          packsSold: { label: "Paquetes vendidos" },
          avgPackSize: { label: "Tamaño del paquete de Avg" },
        },
        referralStats: {
          title: "Remisiones",
          description: "Metrices de programas de referencia",
          totalReferrals: { label: "Total de referencias" },
          conversionRate: { label: "Conversión" },
          totalEarned: { label: "Total pendiente" },
          pendingPayouts: { label: "Pagos pendientes" },
        },
        growthMetrics: {
          title: "Crecimiento",
          description: "Tendencias de ingresos y suscripción",
          revenueChart: {
            label: "Ingresos a través del tiempo",
            description: "Tendencia de ingresos",
          },
          subscriptionChart: {
            label: "Crecimiento de la suscripción",
            description: "Tendencia de suscripción activa",
          },
        },
        businessInsights: {
          title: "Insights",
          description: "Metrices generadas",
          generatedAt: { label: "Generado en" },
        },
      },
      errors: {
        unauthorized: {
          title: "Se requiere autenticación",
          description: "Acceso requerido para ver estadísticas",
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
          description: "Incapaz de generar estadísticas",
        },
        unknown: {
          title: "Error desconocido",
          description: "Se produjo un error inesperado",
        },
        conflict: { title: "Conflicto", description: "Conflicto de datos" },
        network: {
          title: "Error de red",
          description: "Incapaz de conectarse",
        },
        notFound: {
          title: "No encontrado",
          description: "Estadísticas no disponibles",
        },
        unsavedChanges: {
          title: "Cambios sin guardar",
          description: "Tienes cambios sin guardar",
        },
      },
      success: {
        title: "Operación completada",
        description: "Estadísticas generadas",
      },
    },
    widget: {
      refresh: "Actualizar",
      filters: "Filtros",
    },
  },
  // List endpoint translations
  list: {
    get: {
      title: "Lista de suscripciones",
      description: "Examine todas las suscripciones",
      form: {
        title: "Gestión de las suscripciones",
        description: "Filtrar y navegar suscripciones",
      },
      searchFilters: {
        title: "Búsqueda y Filtros",
        description: "Suscripciones de filtros",
      },
      search: {
        label: "Buscar",
        description: "Buscar por correo electrónico o nombre del usuario",
        placeholder: "Suscripciones de búsqueda...",
      },
      status: {
        label: "Situación",
        description: "Filtro por estado de suscripción",
        placeholder: "Seleccione el estado...",
      },
      interval: {
        label: "Frecuencia de facturación",
        description: "Filtro por intervalo de facturación",
        placeholder: "Cualquier intervalo",
      },
      provider: {
        label: "Proveedor",
        description: "Filtro por proveedor de pago",
        placeholder: "Cualquier proveedor",
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
          providerSubscriptionId: "Proveedor ID",
        },
        totalCount: "Suscripciones totales",
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
          description: "Incapaz de recuperar suscripciones",
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
          description: "No se han encontrado suscripciones",
        },
        unsavedChanges: {
          title: "Cambios sin guardar",
          description: "Cambios sin guardar",
        },
      },
      success: {
        title: "Operación completada",
        description: "Suscripciones recuperadas",
      },
    },
    widget: {
      noSubscriptions: "No se han encontrado suscripciones.",
      noMatchingSubscriptions:
        "No hay suscripciones que coincidan con sus filtros.",
      searchPlaceholder: "Búsqueda por correo electrónico o nombre...",
      refresh: "Actualizar",
      viewStats: "Estadísticas",
    },
  },
  // Purchases endpoint translations
  purchases: {
    get: {
      title: "Compras de crédito",
      description: "Historial de compra del paquete de crédito",
      form: {
        title: "Historia de compra",
        description: "Ver las compras de paquetes de crédito",
      },
      searchFilters: {
        title: "Búsqueda y Filtros",
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
  },
  // Referrals endpoint translations
  referrals: {
    get: {
      title: "Panel de mando de referencia",
      description: "Códigos de referido, ingresos y pagos",
      form: {
        title: "Gestión de referencias",
        description: "Gestionar el programa de remisión",
      },
      searchFilters: {
        title: "Búsqueda y Filtros",
        description: "Datos de referencia del filtro",
      },
      search: {
        label: "Buscar",
        description: "Buscar por correo electrónico del usuario",
        placeholder: "Remisiones de búsqueda...",
      },
      payoutStatus: {
        label: "Estado de pago",
        description: "Filtro por solicitud de pago",
        placeholder: "Cualquier condición",
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
        title: "Remisiones",
        description: "Datos del programa de referencia",
        summary: {
          title: "Resumen",
          description: "Estadísticas de referencia agregadas",
          totalCodes: { label: "Total Codes" },
          totalSignups: { label: "Total Signups" },
          totalEarned: { label: "Total pendiente" },
          totalPaidOut: { label: "Total pagado" },
          pendingPayouts: { label: "Pagos pendientes" },
        },
        codes: {
          code: "Código",
          ownerEmail: "Propietario",
          ownerName: "Nombre",
          currentUses: "Clics",
          totalSignups: "Signups",
          totalEarned: "Ganado",
          isActive: "Activa",
          createdAt: "Creado",
        },
        payoutRequests: {
          id: "ID",
          userEmail: "Usuario",
          amountCents: "Monto",
          currency: "Moneda",
          status: "Situación",
          walletAddress: "Wallet",
          adminNotes: "Notas",
          rejectionReason: "Rechazo de rechazo",
          createdAt: "Solicitudes",
          processedAt: "Procesado",
        },
        totalCount: "Total",
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
          description: "Incapaz de recuperar las referencias",
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
          description: "No se han encontrado datos de referencia",
        },
        unsavedChanges: {
          title: "Cambios sin guardar",
          description: "Cambios sin guardar",
        },
      },
      success: {
        title: "Operación completada",
        description: "Remisiones recuperadas",
      },
    },
    post: {
      title: "Acción de pago",
      description: "Aprobar, rechazar o completar una solicitud de pago",
      form: {
        title: "Acción de pago",
        description: "Procesar una solicitud de pago",
      },
      requestId: {
        label: "Solicitud ID",
        description: "Solicitud de pago para procesar",
        placeholder: "Ingrese solicitud ID...",
      },
      action: {
        label: "Medida",
        description: "Medidas adoptadas",
        placeholder: "Seleccionar acción...",
      },
      adminNotes: {
        label: "Admin Notes",
        description: "Notas opcionales",
        placeholder: "Añada notas...",
      },
      rejectionReason: {
        label: "Rechazo de rechazo",
        description: "Se requiere cuando se rechaza",
        placeholder: "Introdúzcase la razón...",
      },
      response: {
        title: "Resultado",
        description: "Resultado de la acción",
        success: "Operación completada",
        message: "Mensaje",
      },
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
          description: "Incapaz de procesar el pago",
        },
        unknown: {
          title: "Error desconocido",
          description: "Error inesperado",
        },
        conflict: {
          title: "Conflicto",
          description: "Pagos ya procesados",
        },
        network: {
          title: "Error de red",
          description: "Incapaz de conectarse",
        },
        notFound: {
          title: "No encontrado",
          description: "Solicitud de pago no encontrada",
        },
        unsavedChanges: {
          title: "Cambios sin guardar",
          description: "Cambios sin guardar",
        },
      },
      success: { title: "Operación completada", description: "Pagos tratados" },
    },
    widget: {
      noReferrals: "No se encontraron códigos de referido.",
      noPayouts: "No hay solicitudes de pago.",
      approve: "Aprobar",
      reject: "Rechazo",
      complete: "Completado",
      sectionCodes: "Códigos de referido",
      sectionPayouts: "Solicitudes de pago",
      refresh: "Actualizar",
      codeActive: "Activa",
      codeInactive: "Inactivo",
      clicks: "clics",
      signups: "signups",
      earned: "ganado",
      confirm: {
        title: "Confirme la acción de pago",
        description:
          "¿Estás seguro de que quieres proceder con esta acción de pago? Esto no puede ser deshecho.",
        cancel: "Cancelar",
        proceed: "Procede",
      },
    },
  },
  // Enum translations
  enums: {
    subscriptionStatusFilter: {
      incomplete: "Incompleta",
      incompleteExpired: "Incompleto expirado",
      all: "Todos",
      active: "Activa",
      trialing: "Juicio",
      pastDue: "Puestos atrasados",
      canceled: "Cancelado",
      unpaid: "No pagados",
      paused: "Pausa",
    },
    billingIntervalFilter: {
      any: "Cualquiera",
      monthly: "Mensual",
      yearly: "Anual",
    },
    providerFilter: {
      any: "Cualquiera",
      stripe: "Stripe",
      nowpayments: "NowPayments",
    },
    subscriptionSortField: {
      periodEnd: "Final del período",
      createdAt: "Creado en",
      status: "Situación",
      interval: "Interval",
      userEmail: "Correo electrónico",
    },
    sortOrder: {
      asc: "Ascendencia",
      desc: "Descendiente",
    },
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
    payoutStatusFilter: {
      all: "Todos",
      pending: "Pendiente",
      approved: "Aprobados",
      rejected: "Rechazado",
      processing: "Procesamiento",
      completed: "Completado",
      failed: "Failed",
    },
    referralSortField: {
      createdAt: "Creado en",
      earnings: "Total de recursos",
      signups: "Signups",
    },
    payoutAction: {
      approve: "Aprobar",
      reject: "Rechazo",
      complete: "Completado",
    },
  },
};
