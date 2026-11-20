import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Sistema",

  errors: {
    repositoryInternalError: "Se produjo un error interno",
    fetchErrorLogs: "Fallado para buscar registros de errores: {{error}}",
    updateErrorLog: "Failed to update error log status: {{error}}",
    missingTarget: "Pase huellas dactilares o id.",
    idNotUnique:
      "Prefijo Id {{id}} coincide con las filas {{count}}. Usa la huella o el id completo.",
  },

  statusFilter: {
    all: "Todos",
    active: "Activa",
    resolved: "Resolved",
  },

  get: {
    title: "Registros de errores",
    titleShort: "Registros de errores",
    description:
      "Navega registros de errores de backend con filtrado y paginación",
    tags: {
      monitoring: "Monitoreo",
    },
    fields: {
      status: {
        label: "Situación",
        description: "Filtro por estado resuelto",
      },
      search: {
        label: "Buscar errores",
        description: "Buscar mensajes, huellas o ID de registro",
        placeholder: "Buscar mensajes, huellas o ID de registro",
      },
      errorType: {
        label: "Tipo de error",
        description: "Filtro por tipo de error clasificación",
        placeholder: "Por ejemplo. INTERNAL_ERROR",
      },
      startDate: {
        label: "Desde",
        description: "Mostrar errores después de esta fecha",
      },
      endDate: {
        label: "A",
        description: "Mostrar errores antes de esta fecha",
      },
      limit: {
        label: "Limitación",
        description: "Número de resultados a la vuelta",
        placeholder: "50",
      },
      offset: {
        label: "Offset",
        description: "Número de resultados para saltar",
        placeholder: "0",
      },
    },
    response: {
      logs: {
        title: "Registro de errores",
      },
      totalCount: {
        title: "Total Conde",
      },
      hasMore: {
        title: "Tiene más",
      },
      unresolvedCount: {
        title: "Conde sin resolver",
      },
    },
    success: {
      title: "Logs Retrieved",
      description: "Registros de errores obtenidos con éxito",
    },
    errors: {
      validation: {
        title: "Error de validación",
        description: "Parámetros de solicitud no válidos",
      },
      unauthorized: {
        title: "Se requiere autenticación",
        description: "Inicia sesión para continuar",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "Acceso denegado",
      },
      notFound: {
        title: "No encontrado",
        description: "No hay registros encontrados",
      },
      network: {
        title: "Error de red",
        description: "Ocurrió un error de red",
      },
      server: {
        title: "Error del servidor",
        description: "Fallado para recuperar registros de errores",
      },
      unknown: {
        title: "Error desconocido",
        description: "Ocurrió un error desconocido",
      },
      unsavedChanges: {
        titleChanges: "Cambios sin guardar",
        title: "Cambios sin guardar",
        description: "Tienes cambios sin guardar",
      },
      conflict: {
        title: "Conflicto",
        description: "Hay un conflicto entre los datos",
      },
    },
  },

  patch: {
    title: "Actualizar el registro de errores",
    titleShort: "Actualización",
    description: "Resolver o reabrir un registro de error por huella dactilar",
    tags: {
      monitoring: "Monitoreo",
    },
    fields: {
      fingerprint: {
        label: "Huella",
        description:
          "La huella del registro de errores (column `fingerprint` en la lista). Pasa esto o id.",
        placeholder: "Introduzca la huella dactilar",
      },
      id: {
        label: "Log ID",
        description:
          "La fila id de la lista (completa uuid o sus primeros 8+ caracteres). Usar en lugar de huellas digitales.",
        placeholder: "por ejemplo, c21bd4c7",
      },
      resolved: {
        label: "Resolved",
        description: "Es verdad para resolver, falso para reabrir",
      },
    },
    response: {
      fingerprint: {
        title: "Huella",
      },
      resolved: {
        title: "Resolved",
      },
      affectedRows: {
        title: "Filas afectadas",
      },
    },
    success: {
      title: "Actualización de los registros",
      description: "Estado del registro de errores actualizado con éxito",
    },
    errors: {
      validation: {
        title: "Error de validación",
        description: "Parámetros de solicitud no válidos",
      },
      unauthorized: {
        title: "Se requiere autenticación",
        description: "Inicia sesión para continuar",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "Acceso denegado",
      },
      notFound: {
        title: "No encontrado",
        description: "Registro de error no encontrado",
      },
      network: {
        title: "Error de red",
        description: "Ocurrió un error de red",
      },
      server: {
        title: "Error del servidor",
        description: "Fallado para actualizar el registro de errores",
      },
      unknown: {
        title: "Error desconocido",
        description: "Ocurrió un error desconocido",
      },
      unsavedChanges: {
        titleChanges: "Cambios sin guardar",
        title: "Cambios sin guardar",
        description: "Tienes cambios sin guardar",
      },
      conflict: {
        title: "Conflicto",
        description: "Hay un conflicto entre los datos",
      },
    },
  },

  post: {
    title: "Correr monitor de error",
    description:
      "Escaneo mensajes de chat y registros de backend para patrones de error",
    tags: {
      monitoring: "Monitoreo",
    },
    response: {
      errorsFound: "Errores encontrados",
      threadsScanned: "Panes escaneados",
      scanWindowFrom: "Ventana de exploración",
      scanWindowTo: "Ventana de exploración para",
      patterns: "Patrones de error",
    },
    success: {
      title: "Escáner completo",
      description: "Análisis del monitor de error completado con éxito",
    },
    errors: {
      validation: {
        title: "Error de validación",
        description: "Solicitud inválida",
      },
      unauthorized: {
        title: "Se requiere autenticación",
        description: "Inicia sesión para continuar",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "Acceso denegado",
      },
      notFound: {
        title: "No encontrado",
        description: "No se encontró el recurso",
      },
      network: {
        title: "Error de red",
        description: "Ocurrió un error de red",
      },
      server: {
        title: "Error del servidor",
        description: "Fallado para ejecutar el análisis del monitor de error",
      },
      unknown: {
        title: "Error desconocido",
        description: "Ocurrió un error desconocido",
      },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Tienes cambios sin guardar",
      },
      conflict: {
        title: "Conflicto",
        description: "Hay un conflicto entre los datos",
      },
    },
  },

  errorMonitor: {
    name: "Monitor de error",
    description: "Escáneos para patrones de error cada 3 horas",
  },

  widget: {
    emptyFiltered:
      "Ningún grupo coincide con estos filtros. Quita un filtro y vuelve a intentarlo.",
    emptyActive:
      "No hay grupos de errores activos. Selecciona Todos para ver los errores resueltos.",
    severity: {
      error: "Error",
      warning: "Advertencia",
    },
    title: "Registros de errores",
    loading: "Cargando registros...",
    empty: "No hay registros de errores encontrados",
    header: {
      refresh: "Actualizar",
      runScan: "Corre Escáner",
      back: "Atrás",
      activeCount: "Total abiertos: {{count}}",
    },
    col: {
      message: "Mensaje",
      errorType: "Tipo de error",
      occurrences: "Occurrences",
      firstSeen: "Primer visto",
      createdAt: "El último visto.",
    },
    status: {
      active: "Activa",
      resolved: "Resolved",
    },
    action: {
      confirm: "Guardar estado",
      clear: "Filtros claros",
      resolve: "Resolver",
      reopen: "Reabrir",
    },
    detail: {
      context: "Contexto del error",
      stackTrace: "Stack Trace",
      metadata: "Metadatos",
      collapse: "Collapse",
      resolved: "Resolved",
    },
    pagination: {
      matches: "Grupos coincidentes: {{count}}",
      info: "Página {{page}} de {{totalPages}} (Total {{total}})",
      prev: "Anterior",
      next: "Siguiente",
    },
  },
};
