import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  acquisition: {
    title: "Captación de contactos",
    fields: { currency: "Moneda de ingresos" },
  },
  get: {
    title: "Panel de mando de referencia",
    titleShort: "Actividad de referidos",
    description: "Códigos de referido, ingresos y pagos",
    form: {
      title: "Gestión de referencias",
      description: "Gestionar el programa de remisión",
    },
    searchFilters: {
      title: "Búsqueda &quot; Filtros",
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
        currentUses: "Usos del código",
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
    titleShort: "Acción de pago",
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
  enums: {
    currency: { eur: "EUR", usd: "USD", pln: "PLN" },
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
    sortOrder: {
      asc: "Ascendencia",
      desc: "Descendiente",
    },
    payoutAction: {
      approve: "Aprobar",
      reject: "Rechazo",
      complete: "Completado",
    },
  },
};
