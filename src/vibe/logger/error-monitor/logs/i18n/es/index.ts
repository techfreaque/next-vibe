import { translations as analyticsTranslations } from "next-vibe/unified-ui/analytics/i18n/es";

import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  ...analyticsTranslations,
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
    active: "Sin resolver",
    resolved: "Resolved",
  },
  levelFilter: {
    all: "Todos los niveles",
    error: "Errores",
    warn: "Avisos",
  },
  sourceFilter: {
    all: "Todas las fuentes",
    client: "Navegador",
    server: "Servidor",
  },
  trendSplit: {
    newVsRecurring: "Nuevos vs recurrentes",
    level: "Nivel",
    source: "Fuente",
  },
  sort: {
    windowOccurrences: "Más apariciones en el periodo",
    lastSeen: "Visto por última vez",
    firstSeen: "Más nuevos",
    totalOccurrences: "Más apariciones en total",
  },

  get: {
    title: "Registros de errores",
    titleShort: "Registros de errores",
    description:
      "Clases de error con el número exacto de no resueltas, apariciones en el tiempo, principales culpables y usuarios afectados. Filtra por periodo, estado, nivel, fuente, endpoint o texto; resuelve con un clic.",
    tags: {
      monitoring: "Monitoreo",
    },
    fields: {
      group: {
        label: "Agrupar similares",
        description:
          "Una fila por mensaje: las variantes en distintas rutas cuentan juntas",
      },
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
      level: {
        label: "Nivel",
        description: "Errores o avisos",
      },
      source: {
        label: "Fuente",
        description: "Lanzado en el navegador (client log) o en el servidor",
      },
      endpoint: {
        label: "Endpoint o ruta",
        description:
          "La ruta del endpoint, el alias o la ruta de la página contiene este texto",
        placeholder: "p. ej. payment/providers",
      },
      fingerprint: {
        label: "Huella",
        description: "Mostrar una sola clase de error",
        placeholder: "Huella",
      },
      split: {
        label: "División del gráfico",
        description: "Cómo apila el gráfico de apariciones",
      },
      sort: {
        label: "Orden",
        description: "Orden de la lista",
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
      window: {
        title: "Periodo",
      },
      kpis: {
        title: "Cifras clave",
      },
      trend: {
        title: "Apariciones en el tiempo",
      },
      byEndpoint: {
        title: "Por endpoint",
      },
      historySince: {
        title: "Historial desde",
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
      similarTo: {
        label: "Mismo mensaje que",
        description:
          "Resolver o reabrir cada clase con el mismo mensaje que esta huella",
      },
      fingerprints: {
        label: "Huellas",
        description:
          "Varias huellas a la vez (resolver o reabrir en bloque, máx. 200)",
      },
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
    subtitle:
      "Todos los errores y avisos agrupados por clase. Marca como resuelto lo que esté arreglado; si se repite, se reabre.",
    kpi: {
      unresolvedInScope: "Sin resolver en esta vista",
      unresolvedAllTimeLink:
        "Todas las clases sin resolver, errores y avisos, desde el inicio: {{count}}",
      unresolvedMessages: "{{messages}} mensajes · {{occurrences}} apariciones",
      unresolvedMatching: "{{count}} sin resolver coinciden con los filtros",
      unresolved: "Clases sin resolver (total)",
      unresolvedHint: "{{occurrences}} apariciones en total",
      unresolvedOutside: "{{count}} no vistas en este periodo",
      occurrences: "Apariciones",
      newClasses: "Clases nuevas",
      activeClasses: "Clases afectadas",
      affectedUsers: "Usuarios afectados",
      affectedLeads: "Visitantes afectados",
    },
    chart: {
      noEndpoint: "Sin endpoint registrado",
      emptyFiltered:
        "Ninguna aparición coincide con estos filtros en este periodo.",
      trendTitle: "Apariciones",
      trendSubtitle: "Haz clic en una barra para acotar el periodo",
      endpointTitle: "Dónde se rompe",
      endpointSubtitle:
        "Endpoints y rutas por apariciones. Haz clic en una fila para filtrar.",
      endpoint: "Endpoint / ruta",
      occurrences: "Apariciones",
      classes: "Clases",
      unresolved: "Abiertas",
      historyNote:
        "Historial diario desde el {{date}}. Las apariciones anteriores solo cuentan en los totales.",
      historyNone:
        "Aún no hay historial diario. Los totales por clase siguen siendo exactos.",
    },
    series: {
      new: "Nuevos",
      recurring: "Recurrentes",
      error: "Errores",
      warn: "Avisos",
      client: "Navegador",
      server: "Servidor",
    },
    list: {
      viewGroup: "Ver {{count}}",
      noSession: "Sin contexto de sesión",
      cliAct:
        "acción: vibe update-error-log --fingerprint={{fingerprint}} --resolved={{resolved}}",
      cliStatus: "Estado: {{status}}",
      groupSize: "{{count}} clases",
      resolveGroup: "Resolver todas ({{count}})",
      reopenGroup: "Reabrir todas ({{count}})",
      groupHint: "Agrupado por mensaje",
      subtitleGrouped: "{{count}} mensajes vistos en este periodo",
      bulkResolveOf: "Resolver {{shown}} de {{total}} coincidentes",
      cliGroup:
        '{{count}} clases. Listar: vibe error-logs --group=false --search="{{search}}" · Todas: vibe update-error-log --similarTo={{fingerprint}} --resolved=true',
      allClear: "Nada abierto coincide con estos filtros.",
      allClearHint: "Quita los filtros para ver el resto.",
      similar: "+{{count}} similares",
      cliFilters:
        "Filtros (los valores son las claves de enum mostradas): --range=analytics.range.last7Days --status=statusFilter.all --level=levelFilter.error --source=sourceFilter.server --endpoint=<texto> --search=<texto>. En bloque: vibe update-error-log --fingerprints=<a>,<b> --resolved=true",
      more: "+{{count}} más",
      doneResolved: "Resuelta: {{label}}",
      doneReopened: "Reabierta: {{label}}",
      doneResolvedMany: "{{count}} clases resueltas",
      doneReopenedMany: "{{count}} clases reabiertas",
      undo: "Deshacer",
      dismiss: "Cerrar",
      bulkResolve: "Resolver las {{count}} mostradas",
      bulkConfirm: "Confirmar: resolver {{count}}",
      cliHits: "{{period}} en el periodo / {{total}} en total",
      resolveFailed: "No se guardó. Inténtalo de nuevo.",
      cliResolve:
        "Acción: vibe update-error-log --fingerprint={{fingerprint}} --resolved={{resolved}}",
      cliHint:
        "Resolver: vibe update-error-log --fingerprint=<fingerprint> --resolved=true. Detalle: --fingerprint=<fingerprint>. Página siguiente: --offset={{next}}",
      title: "Clases de error",
      subtitle: "{{count}} vistas en este periodo",
      hitsPeriod: "{{count}} en el periodo",
      hitsTotal: "{{count}} en total",
      users: "Usuarios {{count}}",
      leads: "Visitantes {{count}}",
      firstSeen: "primera {{date}}",
      lastSeen: "última {{date}}",
      open: "Detalles",
      close: "Ocultar",
      focus: "Solo esta",
      affected: "Usuarios afectados",
      affectedLeads: "Visitantes afectados",
      resolving: "Guardando...",
    },
    filter: {
      apply: "Aplicar filtros",
      more: "Filtros",
      moreCount: "Filtros ({{count}})",
      moreDescription: "Filtre por estado, gravedad u origen.",
      fingerprint: "Clase",
      endpoint: "Endpoint",
      search: "Buscar",
      errorType: "Tipo",
      status: "Estado",
      level: "Nivel",
      source: "Fuente",
    },
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
      active: "Sin resolver",
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
    source: {
      client: "Navegador",
      server: "Servidor",
    },
    pagination: {
      matches: "Grupos coincidentes: {{count}}",
      info: "Página {{page}} de {{totalPages}} (Total {{total}})",
      prev: "Anterior",
      next: "Siguiente",
    },
  },
};
