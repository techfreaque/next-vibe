import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Ayudar a la documentación",
  tag: "Ayuda",
  uncategorized: "Otro",
  catalog: {
    title: "Catálogo de herramientas",
    searchLabel: "Buscar en el catálogo de herramientas",
    searchAction: "Herramientas de búsqueda",
    clearSearch: "Búsqueda de herramientas claras",
    findRecord: "Encontrar un registro",
    recordPlaceholder: "Nombre, correo electrónico o referencia",
    loadError: "El catálogo no podía cargar",
    retry: "Volver a intentar",
    noTools: "No hay herramientas disponibles en esta vista",
    noMatches:
      "Ninguna herramienta coincide con “ {{query}} ”. Prueba otro nombre de herramienta.",
    openPrimary: "Open {{title}}",
    allInCategory: "Todas las herramientas",
    general: "General",
    toolUnavailable: "Disponible en otra plataforma",
    previous: "Anterior",
    next: "Siguiente",
    page: "Página {{page}} de {{total}}",
    openSidebar: "Barra lateral de herramientas abierta",
    browse: "Herramientas de búsqueda",
    toolNotFound: "Esta herramienta no está disponible",
    localInstance: "Casos locales",
    allowTool: "Permitir que AI llame a esta herramienta",
    blockTool: "Block AI de llamar a esta herramienta",
    pinWeb: "Pin a barra lateral",
    unpinWeb: "Unpin de la barra lateral",
    webSidebar: "Barra lateral web",
    webSidebarHint: "Herramientas clavadas en la barra lateral.",
  },
  groups: {
    ai: "IA",
    analytics: "Analítica",
    business: "Negocios",
    system: "Sistema",
    comms: "Comms",
    platform: "Plataforma",
  },
  get: {
    title: "Ayuda de herramienta - Descubra las herramientas disponibles",
    titleShort: "Ayuda a la herramienta",
    description:
      "Busca y descubre todas las herramientas disponibles para ti. Llame sin params para enumerar todas las herramientas y categorías. Utilice la consulta para buscar por nombre/descripción/alias. Utilice toolName para obtener el esquema del parámetro completo para una herramienta específica. Utilice la categoría para filtrar por categoría. Soporta paginación a través de página/ pageSize. Tamaño de página predeterminado para AI / MCP es 100.",
    tags: {
      tools: "herramientas",
    },
    fields: {
      interactive: {
        label: "Interactivo",
        description: "Abra el navegador de herramientas interactivas",
      },
      query: {
        label: "Búsqueda de búsqueda (opcional)",
        description:
          'Herramientas de filtro por palabra clave. Todas las palabras separadas por espacio son necesarias (por ejemplo, "resistente" coinciden con las herramientas con ambas palabras). Coincidencia insensible de caso en nombre, alias, descripción, etiquetas - nombre/alias coinciden en rango superior. Nombre/alias exactos coinciden con los detalles completos. Omitir para listar todas las herramientas.',
        placeholder: "por ejemplo, url de búsqueda, gen de imagen, memoria...",
      },
      category: {
        label: "Categoría Filtro",
        description:
          "Herramientas de filtro por categoría o nombre de subcategoría (case-insensible). Acepta una clave de categoría padre (por ejemplo, 'ai') o un nombre subcategoría (por ejemplo, 'Search'). Omitir ver todas las categorías.",
      },
      toolName: {
        label: "Nombre de la herramienta (Detalle)",
        description:
          "Obtenga el esquema del parámetro completo para una herramienta específica por su toolName exacto (por ejemplo, agent_search_brave_GET) o alias. Usa esto antes de llamar a una herramienta desconocida.",
      },
      page: {
        label: "Página",
        description:
          "Número de página para los resultados paginados (default: 1)",
        title: "Número de página actual",
      },
      pageSize: {
        label: "Tamaño de página",
        description:
          "Número de resultados por página. AI / MCP default: 100. Web/ CLI default: 800. 1000.",
        title: "Tamaño de página eficaz",
      },
      tools: {
        title: "Herramientas disponibles",
      },
      totalCount: {
        title: "Conteo total de herramientas",
      },
      matchedCount: {
        title: "Conteo de herramientas emparejado",
      },
      categories: {
        title: "Categorías de herramientas",
      },
      hint: {
        title: "Insinuación de uso",
      },
      pinnedCount: {
        title: "Conteo de herramientas Pinned",
      },
      allowedCount: {
        title: "Conteo de herramientas permitido",
      },
      webPinnedCount: {
        title: "Cuenta de herramientas de apoyo web",
      },
      currentPage: {
        title: "Página actual",
      },
      effectivePageSize: {
        title: "Tamaño de página eficaz",
      },
      totalPages: {
        title: "Páginas totales",
      },
      parameters: {
        title: "Parámetros",
      },
      aliases: {
        title: "Aliases",
      },
      openTool: {
        label: "Herramienta abierta",
      },
      platform: {
        label: "Plataforma",
        description:
          "Herramientas de filtro por plataforma (sólo memoria). Muestra herramientas disponibles en la plataforma seleccionada. Use 'all' para ver herramientas en todas las plataformas.",
      },
      includeProdOnly: {
        label: "Incluir herramientas de producción-únicamente",
        description:
          "Cuando es cierto, incluye herramientas marcadas como sólo producción (admin solamente). Use 'all' filtro de plataforma para ver herramientas en todas las plataformas.",
      },
      platforms: {
        title: "Plataformas disponibles",
      },
      viewAsRole: {
        label: "View as Role",
        description:
          "Vea qué herramientas son visibles para un papel específico del usuario (sólo admin)",
        options: {
          admin: "Administrador",
          customer: "Cliente",
          public: "Público",
        },
      },
      instanceId: {
        label: "Instance ID",
        description:
          "Opcional. Filtrar a herramientas desde una instancia remota específica solamente. Omitir buscar herramientas locales.",
      },
      pinnedToolIds: {
        label: "IDs de herramientas grabadas",
        description:
          "Lista opcional de ID de herramienta que el usuario ha marcado. Cuando se proporciona, el servidor filtra a estas herramientas sólo pero todavía devuelve el totalCount completo.",
      },
      statsFilter: {
        label: "Filtro de herramientas",
        description:
          "Mostrar todas las herramientas, sólo las herramientas fijas, o solo las herramientas permitidas",
      },
    },
    hints: {
      noCapabilitySnapshot:
        'No hay instantánea de la capacidad por ejemplo " {{instanceId}}". Conecta el caso y espera un pulso de sincronización.',
      remoteFullSchema:
        'Esquema completo para herramienta {{count}}(s) de " {{instanceId}}". Llamar a través de: ejecutar-tool toolName =" {{instanceId}} __ <name> " input= {...}.',
      remoteList:
        '{{matched}} de las herramientas {{total}} desde instancia remota " {{instanceId}}". Búsqueda estrecha a ≤{{detailThreshold}} resultados para esquemas completos, o pasar toolName= para una herramienta específica.{{pagination}}',
      toolNotFound:
        'Herramienta " {{name}}" no encontrada. Utilice la consulta para buscar por palabra clave.',
      detailMode:
        'Llamar como: ejecutar-tool toolName =" {{name}} " {{aliases}}. CLI : vibe {{name}} [--field=value].',
      detailModeAliases: " (aliases: {{aliases}})",
      noToolsMatched:
        "No hay herramientas. Pruebe una consulta más amplia o llame sin params para ver todas las categorías.",
      compactFullSchema:
        'Esquema completo para herramienta {{count}}(s). Llamar a través de: ejecutar-tool toolName =" <name> " input= {...}.',
      compactCategoryOnly:
        'Herramientas {{matched}} en las categorías {{categories}}. Utilice la categoría=" <name> " para obtener resultados estrechos (acepta la categoría de padre o subcategoría). Bajo los resultados de {{listThreshold}} muestra nombres de herramientas; bajo {{detailThreshold}} muestra esquemas completos.',
      compactList:
        'Herramientas {{matched}}. Camiseta a ≤ {{detailThreshold}} para esquemas completos, o pase toolName =" <name> " para detalle. Llame a cualquier herramienta: ejecutar-tool toolName =" <name> ". {{pagination}}',
      cliFullDetail:
        "Mostrando el detalle completo para herramienta {{count}}(s). CLI : vibe <name> [--field=value].",
      cliList:
        "Página {{page}} / {{total}} - Las herramientas {{matched}} coinciden. Use vibe help <name> para obtener detalles completos.",
      cliListSingle:
        "Las herramientas {{matched}} coinciden. Use vibe help <name> para obtener detalles completos.",
      pagination:
        " Página {{page}} / {{total}} - pasar página= {{next}} para continuar.",
      paginationCli: " - ayuda vibe --page= {{next}}",
    },
    success: {
      title: "Herramientas con éxito",
      description: "Herramientas disponibles recuperadas",
    },
    errors: {
      validation: {
        title: "Error de validación",
        description: "Parámetros de solicitud no válidos",
      },
      network: {
        title: "Error de red",
        description: "No se pudo conectar con el servidor",
      },
      unauthorized: {
        title: "Se requiere autenticación",
        description: "Inicia sesión para continuar",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "No tienes permiso para acceder a herramientas",
      },
      notFound: {
        title: "No encontrado",
        description: "Herramientas punto final no encontrado",
      },
      server: {
        title: "Error del servidor",
        description: "Failed to etch tools",
      },
      unknown: {
        title: "Error desconocido",
        description: "Ocurrió un error inesperado",
      },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Tienes cambios sin guardar",
      },
      conflict: {
        title: "Conflicto",
        description: "Se produjo un conflicto mientras se traían herramientas",
      },
    },
  },
  interactive: {
    post: {
      title: "Modo interactivo",
      description:
        "Iniciar el modo interactivo explorador de archivos para navegar y ejecutar rutas",
      category: "Ayuda al sistema",
      tags: {
        system: "sistema",
        help: "ayuda",
      },
      summary: "Inicio del modo interactivo",
    },
    ui: {
      title: "Interactive API Explorer",
      description: "Examine y ejecute todos",
      availableEndpoints: "puntos finales disponibles",
      endpointsLabel: "Puntos finales",
      aliasesLabel: "Aliases:",
      selectEndpoint: "Seleccione un punto final de la lista para empezar",
    },
    response: {
      started: "El modo interactivo comenzó con éxito",
    },
    errors: {
      cliOnly: {
        title: "CLI Only",
        description: "El modo interactivo solo está disponible desde CLI",
      },
      unauthorized: {
        title: "Se requiere autenticación",
        description: "Autenticación necesaria para modo interactivo",
      },
      server: {
        title: "Error del servidor",
        description: "Fallado para iniciar el modo interactivo",
      },
    },
    success: {
      title: "Operación completada",
      description: "El modo interactivo comenzó con éxito",
    },
    grouping: {
      category: "Categoría",
      tags: "Tags",
      path: "Camino",
    },
  },
  post: {
    title: "Mostrar información de ayuda",
    description: "Mostrar información sobre comandos CLI",
    form: {
      title: "Opciones de ayuda",
      description: "Obtener ayuda para comandos específicos o uso general",
    },
    errors: {
      validation: {
        title: "Error de validación",
        description: "Parámetros de comando de ayuda inválida",
      },
      network: {
        title: "Error de red",
        description: "Failed totch help information",
      },
      unauthorized: {
        title: "Se requiere autenticación",
        description: "No está autorizado para ver ayuda",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "Usted no tiene permiso para ver la ayuda",
      },
      notFound: {
        title: "Comando no encontrado",
        description: "El comando especificado no fue encontrado",
      },
      server: {
        title: "Error del servidor",
        description: "Failed to generate help information",
      },
      unknown: {
        title: "Error desconocido",
        description: "Se produjo un error inesperado mientras se genera ayuda",
      },
      conflict: {
        title: "Conflicto",
        description: "Conflicto de generación de ayuda detectado",
      },
    },
    success: {
      title: "Ayuda generada",
      description: "Generada exitosamente información de ayuda",
    },
  },
  fields: {
    command: {
      label: "Comando",
      description:
        "Comando específico para obtener ayuda para (salir vacío para la ayuda general)",
      placeholder: "por ejemplo, cheque, lista, db:ping",
    },
    header: {
      title: "Header",
      description: "Header Descripción",
    },
    title: {
      label: "Título",
    },
    description: {
      label: "Descripción",
    },
    usage: {
      title: "Usage",
      patterns: {
        item: "Patrón",
      },
    },
    commonCommands: {
      title: "Comandos comunes",
      items: "Comandos",
      command: "Comando",
      description: "Descripción",
    },
    options: {
      title: "Opciones",
      items: "Opciones",
      flag: "Bandera",
      description: "Descripción",
    },
    examples: {
      title: "Ejemplos",
      items: "Ejemplos",
      command: "Comando",
      description: "Descripción",
    },
    details: {
      title: "Detalles",
      category: {
        content: "Categoría",
      },
      path: {
        content: "Camino",
      },
      method: {
        content: "Método",
      },
      aliases: {
        content: "Aliases",
      },
    },
  },
  aiTools: {
    modal: {
      webPinnedLabel: "pins web",
      webPinnedTooltip:
        "Herramientas fijadas en la barra lateral para un acceso rápido",
      pinnedLabel: "Pintada",
      pinnedTooltip:
        "Las herramientas pintadas siempre están en contexto - el AI las ve cada vuelta",
      enabledLabel: "AI permitido",
      enabledTooltip:
        "AI - las herramientas adaptadas se pueden llamar a la demanda cuando la ayuda está habilitada",
      totalLabel: "total",
      totalTooltip:
        "Mostrar todas las herramientas - haga clic en para limpiar el filtro",
      searchPlaceholder: "Herramientas de búsqueda...",
      chipWeb: "Web",
      chipAiPins: "Pistas AI",
      chipAiAllowed: "AI permitido",
      chipAll: "Todos",
      chipCli: "CLI",
      chipMcpPinned: "MCP vis",
      chipMcpAllowed: "MCP todos",
      searchNoResults: "No hay resultados",
      searchResultOne: "1 resultado",
      searchResultMany: "Resultados {{count}}",
      expandAll: "Ampliar todos",
      collapseAll: "Collapse All",
      deselectAll: "Deseleccionar todos",
      selectAll: "Seleccione todos",
      resetToDefault: "Reset to Default",
      loading: "Cargando...",
      noToolsFound: "No hay herramientas que coincidan con su búsqueda",
      noToolsAvailable: "No existen herramientas AI disponibles",
      legendActive: "Siempre en contexto (pintado)",
      legendConfirm: "Pregunta antes de correr",
      legendWebPin: "Pinned in sidebar",
      stats: "{{pinned}} de herramientas {{total}} enfiladas",
      activeOn: "Siempre en el contexto de AI. unpin to make on-demand only",
      activeOff: "No en contexto. pin para incluir en cada giro AI",
      confirmOn: "AI te pregunta antes de correr. haga clic para autoaprobar",
      confirmOff:
        "Ejecuta sin preguntar. haga clic para requerir su aprobación",
      closeSidebar: "Cerrar herramientas de barra lateral",
      selectTool: "Seleccione una herramienta",
      selectToolHint: "Elija una herramienta de la barra lateral para empezar",
      allPlatforms: "Todas las plataformas",
      prodOnly: "Prod solamente",
      adminFilters: "Filtros de Admin",
      resetPins: "Reiniciar los pines a predeterminados",
      aiPinsTitle: "AI Tool Pins",
      aiPinsDescription:
        "Estas herramientas están activas en cada conversación AI. El AI puede llamarlos automáticamente, sin necesidad de incitar.",
      resetToDefaults: "Reset to defaults",
      noPinnedTools: "Aún no hay herramientas pintadas.",
      noPinnedToolsHint:
        "Examine todas las herramientas y pin los que desea que el AI utilice",
      webPinsDescription:
        "Atajos laterales. Herramientas de lanzamiento rápido clavadas en tu panel de administración.",
      aiAllowedDescription:
        "Herramientas el AI puede llamar a la demanda. Cualquier cosa aquí puede ser invocada cuando el AI decide que es necesario.",
      noAllowedTools: "Sin herramientas permitidas",
    },

    platformFilter: {
      all: "Todas las plataformas",
      cli: "CLI",
      cliPackage: "CLI Pkg",
      mcp: "MCP",
      ai: "IA",
      web: "Web",
      cron: "Cron",
      electron: "Escritorio",
      frame: "Frame",
      skill: "Habilidad",
      nextPage: "Página siguiente",
      nextApi: "Siguiente API",
    },
    envFilter: {
      development: "Desarrollo",
      production: "Producción",
    },
  },
  list: {
    post: {
      title: "Lista Comandos disponibles",
      description:
        "Mostrar todos los comandos CLI disponibles con sus descripciones y alias",
      form: {
        title: "Opciones de lista de comandos",
        description: "Configurar cómo se muestran los comandos",
      },
      errors: {
        validation: {
          title: "Error de validación",
          description: "Parámetros de comando de lista inválida",
        },
        network: {
          title: "Error de red",
          description: "Failed para buscar la lista de comandos",
        },
        unauthorized: {
          title: "Se requiere autenticación",
          description: "Usted no está autorizado a enumerar comandos",
        },
        forbidden: {
          title: "Acceso denegado",
          description: "Usted no tiene permiso para enumerar comandos",
        },
        notFound: {
          title: "No encontrado",
          description: "Lista de comandos no encontrada",
        },
        server: {
          title: "Error del servidor",
          description: "Failed to generate command list",
          errorLoading: "Comandos de carga de errores: {{error}}",
        },
        unknown: {
          title: "Error desconocido",
          description:
            "Se produjo un error inesperado mientras se enumeran los comandos",
        },
        conflict: {
          title: "Conflicto",
          description: "Conflicto de la lista de comandos detectado",
        },
      },
      success: {
        title: "Comandos enumerados",
        description: "Lista de comandos recuperada con éxito",
      },
    },
    tag: "Ayuda",
    fields: {
      category: {
        label: "Filtro por categoría",
        description: "Mostrar sólo comandos en esta categoría",
        placeholder: "por ejemplo, sistema, base de datos, usuario",
      },
      format: {
        label: "Formato de salida",
        description: "Cómo mostrar la lista de comandos",
        options: {
          tree: "Vista del árbol (coordinación fija)",
          flat: "Lista plana (lista simple)",
          json: "Formato JSON (para el perseo)",
        },
      },
      showAliases: {
        label: "Mostrar Aliases",
        description: "Mostrar todos los alias de comando disponibles",
      },
      showDescriptions: {
        label: "Mostrar descripciones",
        description: "Incluye descripciones de comandos en la salida",
      },
      success: {
        label: "Operación completada",
      },
      totalCommands: {
        label: "Total Commands",
        description: "Número de comandos disponibles",
      },
      commandsText: {
        label: "Comandos disponibles",
        description: "Lista formada de todos los comandos disponibles",
      },
      commands: {
        alias: "Comando Alias",
        message: "Mensaje del Comando",
        description: "Comando Descripción",
        category: "Categoría de comandos",
        aliases: "Mando Aliases",
        rule: "Regla de mando",
      },
    },
    response: {
      commands: {
        title: "Comandos disponibles",
        emptyState: {
          description: "No hay órdenes encontradas",
        },
        alias: "Comando",
        path: "Sendero API",
        method: "Método HTTP",
        category: "Categoría",
        description: "Descripción",
        aliases: "Aliases",
      },
    },
  },
};
