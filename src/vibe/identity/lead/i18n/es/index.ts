import { regionalCountryNames } from "next-vibe/core/i18n/core/regions";

import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Contactos",
  tags: {
    leads: "Contactos",
    batch: "Batch",
    campaigns: "Campañas",
    management: "Gestión",
    create: "Crear",
    search: "Buscar",
    export: "Exportación",
    import: "Importación",
    csv: "CSV",
    jobs: "Trabajos",
    list: "Lista",
  },
  admin: {
    title: "Leads Management",
    tabs: {
      overview: "Leads Navigation",
      stats: "Sinopsis",
      stats_description: "Ver estadísticas de contacto y análisis",
      leads: "Contactos",
      leads_description: "Explore y administre todos los cables",
      emails: "Campañas de correo electrónico",
      emails_description:
        "Gestionar campañas de correo electrónico y plantillas",
      abTesting: "A/B Testing",
      abTesting_description: "Configurar variantes de ensayo A/B",
      campaignStarter: "Campaign Starter",
      campaignStarter_description:
        "Configurar y comenzar campañas de liderazgo",
    },
    import: {
      label: "Importación",
      description: "Importar leads de archivos CSV",
    },
    emails: {
      preview: {
        error: "Fallado para presentar la vista previa del correo electrónico",
        live: "Vista previa en vivo",
        actions: {
          title: "E-mail Preview",
          description:
            "Previsualizar cómo el correo electrónico buscará a los destinatarios",
        },
      },
      preview_title: "E-mail Preview",
      testEmail: {
        button: "Enviar prueba de email",
      },
      from: "Desde",
      recipient: "Recipiente",
      subject: "Asunto",
      email_preview: "E-mail Preview",
      stage_of: "de",
      stages: "etapas",
      journey: "Viaje",
      back: "Atrás",
      previous: "Anterior",
      next: "Siguiente",
    },
  },
  auth: {
    public: {
      validCookie: "Líder de galleta válida encontrado",
      invalidCookie: "Guía de cookies inválidas",
      created: "Anónimo de contacto creado",
      error: "Error en el contacto público auth",
    },
    authenticated: {
      primaryFound: "Principales resultados encontrados para el usuario",
      noPrimary: "No se encontró ningún contacto primario para el usuario",
      error: "Error en la austeridad de contacto autenticado",
    },
    link: {
      alreadyExists: "El enlace principal ya existe",
      created: "Enlace de contacto creado",
      error: "Líderes de enlace de error",
    },
    validate: {
      error: "Error de validación del contacto",
    },
    getOrCreate: {
      invalid: "Líder inválido ID",
      error: "Error obteniendo o creando contacto",
    },
    create: {
      existingFound: "Líder anónimo existente encontrado",
      success: "contacto creado con éxito",
      error: "Error de creación de contacto",
    },
    createForUser: {
      success: "contacto creado para el usuario",
      error: "Líder de creación de errores para el usuario",
    },
    cookie: {
      set: "Juego de cookies principales",
      error: "Configuración de errores cookie principal",
    },
    getUserLeads: {
      error: "Líderes de usuario de error",
    },
    linkLeads: {
      sameId: "El enlace no puede conducirse a sí mismo",
      alreadyExists: "El enlace principal ya existe",
      created: "Liderazgo vinculado con éxito",
      error: "Líderes de enlace de error",
    },
    getLinkedLeads: {
      error: "Líderes conectados",
    },
    getAllLinkedLeads: {
      error: "Error con todos los cables conectados",
    },
  },
  errors: {
    cannotLinkLeadToItself: "El enlace no puede conducirse a sí mismo",
    linkFailed: "Failed to link leads",
  },
  filters: {
    search: {
      label: "Buscar",
      description: "Buscar guías por correo electrónico o nombre comercial",
      placeholder: "Escriba correo electrónico o nombre de empresa...",
    },
    status: {
      label: "Situación",
      description: "Filtro por estado de contacto",
      placeholder: "Todos los estados",
    },
    currentCampaignStage: {
      label: "Etapa de campaña",
      description: "Filtrar por el escenario de la campaña de email",
      placeholder: "Todas las etapas",
    },
    source: {
      label: "Fuente",
      description: "Filtro por fuente de contacto",
      placeholder: "Todas las fuentes",
    },
    country: {
      label: "Región del idioma",
      description: "Filtrar por la región del idioma elegido en el sitio",
      placeholder: "Todas las regiones",
    },
    language: {
      label: "Idioma",
      description: "Filtro por idioma",
      placeholder: "Todos los idiomas",
    },
    sortBy: {
      label: "Ordenar por",
      description: "Elija el campo para ordenar",
      placeholder: "Campo tipo",
    },
    sortOrder: {
      label: "Ordenar orden",
      description: "Ordenar ascender o descender",
      placeholder: "Orden ordenada",
    },
    statusFilters: {
      title: "Estado &quot; Filtros de campaña",
      description: "Filtro por estado, etapa de campaña y fuente",
    },
    locationFilters: {
      title: "Filtros de ubicación",
      description: "Filtro por país e idioma",
    },
    sortingOptions: {
      title: "Opciones de clasificación",
      description: "Configurar la orden de tipo",
    },
  },
  batch: {
    category: "Contactos",
    tags: {
      leads: "Contactos",
      batch: "Batch",
    },

    patch: {
      title: "Actualización de los lotes",
      description:
        "Líderes de actualización de lotes basados en criterios de filtro",
      form: {
        title: "Configuración de actualización de lotes",
        description: "Configurar parámetros de actualización del lote",
      },
      search: {
        label: "Buscar",
        description: "Buscar guías por correo electrónico o nombre comercial",
        placeholder: "Introduzca correo electrónico o nombre de empresa",
      },
      status: {
        label: "Filtro de estado",
        description: "Filtros liderados por el estado actual",
      },
      currentCampaignStage: {
        label: "Filtro de la campaña",
        description: "Filtros liderados por la fase de campaña actual",
      },
      source: {
        label: "Filtro fuente",
        description: "Filtros por fuente",
      },
      scope: {
        label: "Alcance de la operación",
        description: "Definir el alcance de la operación por lotes",
      },
      dryRun: {
        label: "Dry Run",
        description: "Avance de los cambios sin aplicarlos",
      },
      maxRecords: {
        label: "Max Records",
        description: "Número máximo de registros para procesar",
      },
      updates: {
        title: "Actualización de campos",
        description: "Especifique qué campos actualizar",
        status: {
          label: "Estado nuevo",
          description: "Actualizar el estado de contacto a este valor",
        },
        currentCampaignStage: {
          label: "Nueva etapa de campaña",
          description: "Actualizar la etapa de campaña a este valor",
        },
        source: {
          label: "New Source",
          description: "Actualizar la fuente de contacto a este valor",
        },
        notes: {
          label: "Notas",
          description: "Añadir o actualizar notas para el contacto",
        },
      },
      response: {
        title: "Respuesta de actualización",
        description: "Datos de respuesta de actualización del lote",
        success: "Operación completada",
        totalMatched: "Total emparejado",
        totalProcessed: "Total procesada",
        totalUpdated: "Total actualizado",
        preview: "Vista previa",
        errors: "Errores",
      },
      errors: {
        unauthorized: {
          title: "Se requiere autenticación",
          description: "Autenticación necesaria para las operaciones por lotes",
        },
        validation: {
          title: "Error de validación",
          description:
            "Parámetros de solicitud inválidos para la actualización del lote",
        },
        server: {
          title: "Error del servidor",
          description:
            "Error del servidor interno ocurrido durante la actualización del lote",
        },
        unknown: {
          title: "Error desconocido",
          description:
            "Un error desconocido ocurrió durante la actualización del lote",
        },
        network: {
          title: "Error de red",
          description:
            "Error de red ocurrido durante la actualización del lote",
        },
        forbidden: {
          title: "Acceso denegado",
          description: "Acceso prohibido para las operaciones por lotes",
        },
        notFound: {
          title: "No encontrado",
          description: "Recursos no encontrados para la actualización del lote",
        },
        conflict: {
          title: "Conflicto",
          description:
            "Conflicto de datos ocurrido durante la actualización del lote",
        },
        unsavedChanges: {
          title: "Cambios sin guardar",
          description: "Hay cambios sin salvar en la actualización del lote",
        },
      },
      success: {
        title: "Actualizar el éxito",
        description:
          "Funcionamiento de actualización de lotes completado con éxito",
      },
    },
    delete: {
      title: "Batch Delete",
      description: "Límites de eliminación basados en criterios de filtro",
      form: {
        title: "Batch Eliminar configuración",
        description: "Configurar los parámetros de eliminación de lotes",
      },
      search: {
        label: "Buscar",
        description: "Buscar guías por correo electrónico o nombre comercial",
      },
      status: {
        label: "Filtro de estado",
        description: "Filtros liderados por el estado actual",
      },
      confirmDelete: {
        label: "Confirmación Borrador",
        description: "Confirme que desea eliminar los cables seleccionados",
      },
      dryRun: {
        label: "Dry Run",
        description:
          "Examinar las eliminaciones sin eliminar realmente los registros",
      },
      maxRecords: {
        label: "Max Records",
        description: "Número máximo de registros para eliminar",
      },
      response: {
        title: "Suprímase la respuesta",
        description: "Batch eliminar datos de respuesta",
        success: "Operación completada",
        totalMatched: "Total emparejado",
        totalProcessed: "Total procesada",
        totalDeleted: "Total suprimido",
        preview: "Vista previa",
        errors: "Errores",
      },
      errors: {
        unauthorized: {
          title: "Se requiere autenticación",
          description:
            "Autenticación requerida para operaciones de eliminación de lotes",
        },
        validation: {
          title: "Error de validación",
          description:
            "Parámetros de solicitud inválidos para el borrador del lote",
        },
        server: {
          title: "Error del servidor",
          description:
            "Error del servidor interno ocurrió durante el borrado del lote",
        },
        unknown: {
          title: "Error desconocido",
          description:
            "Un error desconocido ocurrió durante el borrado de lote",
        },
        network: {
          title: "Error de red",
          description: "Error de red ocurrido durante el borrado del lote",
        },
        forbidden: {
          title: "Acceso denegado",
          description:
            "Acceso prohibido para operaciones de eliminación de lotes",
        },
        notFound: {
          title: "No encontrado",
          description: "Recursos no encontrados para el borrador del lote",
        },
        conflict: {
          title: "Conflicto",
          description:
            "Conflicto de datos ocurrido durante la eliminación de lotes",
        },
        unsavedChanges: {
          title: "Cambios sin guardar",
          description: "Hay cambios sin salvar en el borrador del lote",
        },
      },
      success: {
        title: "Eliminar el éxito",
        description: "Batch delete operation completed",
      },
    },
    widget: {
      update: {
        headerTitle: "Líderes de actualización de lotes",
        emptyStateTitle: "Líderes de actualización de lotes",
        emptyStateDescription:
          "Aplicar una actualización de campo a muchos leads inmediatamente basado en criterios de filtro. Uso",
        emptyStateDescriptionStrong: "Dry Run",
        emptyStateDescriptionSuffix:
          "para previsualizar qué leads se verá afectado antes de cometer cambios.",
        emptyStateTip1:
          "Establecer filtros y haga clic en Enviar para ejecutar una vista previa de funcionamiento seco primero",
        emptyStateTip2: "Desmarque Dry Run para aplicar cambios de verdad",
        highVolumeTitle: "Lote grande: {{count}} lidera concordado",
        highVolumeDescription:
          "Esto afectará a un gran número de registros. Revise la vista previa cuidadosamente antes de desactivar Dry Run y presentar para real.",
        partialBatchTitle: "Lote parcial procesado",
        partialBatchDescription:
          "{{processed}} de {{matched}} se procesaron los cables emparejados. Aumente Max Records o vuelva a funcionar para procesar más.",
        successTitle: "Operación de lotes terminada",
        failureTitle: "Falló la operación del lote",
        statMatched: "Coincidido",
        statProcessed: "Procesado",
        statUpdated: "Actualizado",
        btnRunAgain: "Corre otra vez",
        btnViewAllAffected: "Ver todos los contactos afectados",
        btnViewInList: "Ver en la lista",
        dryRunPreviewTitle:
          "Previsualización de la ejecución seca (las pistas de {{count}} serían afectadas)",
        leadFallback: "Lead {{number}}",
        errorsTitle: "Errores {{count}}(s)",
        errorRow: "Lead {{leadId}} : {{error}}",
        sectionFilter: "Criterios de filtro",
        sectionUpdates: "Actualización de campos",
        sectionSettings: "Configuración de la operación",
        activeFiltersLabel: "Filtros activos de la lista (prefilados)",
        filterSearch: "Buscar",
        submitButton: "Actualizaciones de aplicaciones",
        submitButtonLoading: "Aplicando...",
      },
      delete: {
        headerTitle: "Batch Delete Leads",
        warningTitle:
          "Advertencia: El contacto {{count}} será eliminado permanentemente",
        warningTitlePlural:
          "Advertencia: los cables {{count}} serán eliminados permanentemente",
        warningDescription:
          "Esta acción no se puede deshacer. Todos los datos para las pistas concordadas serán eliminados permanentemente. Desactivar Dry Run y confirmar proceder.",
        successTitle: "Supresión completa",
        failureTitle: "La eliminación falló",
        statMatched: "Coincidido",
        statDeleted: "Suprimidos",
        btnRunAgain: "Corre otra vez",
        btnViewRemainingLeads: "Ver Líderes restantes",
        previewTitle: "Los cables {{count}} serán eliminados permanentemente",
        leadFallback: "Lead {{number}}",
        errorRow: "Lead {{leadId}} : {{error}}",
        sectionFilter: "Criterios de filtro",
        sectionSettings: "Eliminar configuración",
        activeFiltersLabel: "Filtros activos de la lista (prefilados)",
        filterSearch: "Buscar",
        submitButton: "Suprímase los principales",
        submitButtonLoading: "Eliminar...",
      },
    },
    enums: {
      batchOperationScope: {
        currentPage: "Página actual",
        allPages: "Todas las páginas",
      },
      leadStatus: {
        new: "Nuevo",
        pending: "Pendiente",
        campaignRunning: "Campaign Running",
        websiteUser: "Sitio web Usuario",
        newsletterSubscriber: "Newsletter Suscríbase",
        inContact: "En contacto",
        signedUp: "Signed Up",
        subscriptionConfirmed: "Suscripción confirmada",
        unsubscribed: "Suscripción cancelada",
        bounced: "Bounced",
        invalid: "Inválidos",
      },
      emailCampaignStage: {
        notStarted: "No empezó",
        initial: "Contacto inicial",
        followup1: "Seguimiento 1",
        followup2: "Seguimiento 2",
        followup3: "Seguimiento 3",
        nurture: "Nutrición",
        reactivation: "Reactivación",
      },
      leadSource: {
        website: "Sitio web",
        socialMedia: "Social Media",
        emailCampaign: "Campaña de correo electrónico",
        referral: "Referidos",
        csvImport: "Importación CSV",
      },
    },
    email: {
      admin: {
        batchUpdate: {
          title: "Batch Update Complete",
          subject: "Resultados de actualización del lote",
          preview: "Los cables {{totalProcessed}} fueron procesados",
          message:
            "La operación de actualización del lote ha finalizado con los cables {{totalProcessed}} procesados.",
          operationSummary: "Resumen de la Operación",
          totalMatched: "Total emparejado",
          totalProcessed: "Total procesada",
          totalUpdated: "Total actualizado",
          errors: "Errores",
          dryRunNote:
            "Esto fue una carrera seca - no se hicieron cambios reales.",
          viewLeads: "Lea más actualizados",
          error: {
            noData: "No hay datos de actualización de lotes disponibles",
          },
        },
        batchDelete: {
          title: "Batch Delete Complete",
          subject: "Batch Eliminar los resultados",
          preview:
            "Los cables {{totalProcessed}} fueron procesados para su eliminación",
          message:
            "La operación de eliminación de lotes se ha completado con los cables {{totalProcessed}} procesados.",
          operationSummary: "Resumen de la Operación",
          totalMatched: "Total emparejado",
          totalProcessed: "Total procesada",
          totalDeleted: "Total suprimido",
          errors: "Errores",
          dryRunNote:
            "Esta era una carrera seca - no se hicieron borraciones reales.",
          viewLeads: "View Leads",
          error: {
            noData: "No hay datos de eliminación de lotes disponibles",
          },
        },
      },
      error: {
        general: {
          internal_server_error: "Se produjo un error de servidor interno",
        },
      },
    },
  },
  campaigns: {
    category: "Gestión de campañas",
    tags: {
      campaigns: "Campañas",
      management: "Gestión",
    },
    campaignStarter: {
      category: "Gestión de campañas",
      tag: "Campaign Starter",
      task: {
        description:
          "Iniciar campañas para nuevos leads transfiriéndolos al estado PENDING",
      },
      errors: {
        server: {
          title: "Error del servidor",
          description:
            "Se produjo un error al procesar la solicitud de inicio de campaña",
        },
        invalidTransition: "Transición de estado inválido para la campaña",
        unauthorized: {
          title: "Se requiere autenticación",
          description: "Inicia sesión para continuar",
        },
        forbidden: {
          title: "Acceso denegado",
          description: "No tienes acceso",
        },
        validation: {
          title: "Error de validación",
          description: "Parámetros de solicitud no válidos",
        },
        unknown: {
          title: "Error desconocido",
          description: "Ocurrió un error desconocido",
        },
        network: {
          title: "Error de red",
          description: "Ocurrió un error de red",
        },
        notFound: {
          title: "No encontrado",
          description: "No se encontró el recurso",
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
      post: {
        title: "Campaign Starter",
        description: "Inicio de campañas para nuevas pistas",
        errors: {
          unauthorized: {
            title: "Se requiere autenticación",
            description: "Inicia sesión para continuar",
          },
          forbidden: {
            title: "Acceso denegado",
            description: "No tienes acceso",
          },
          validation: {
            title: "Error de validación",
            description: "Parámetros de solicitud no válidos",
          },
          server: {
            title: "Error del servidor",
            description: "Se produjo un error al iniciar las campañas",
          },
          unknown: {
            title: "Error desconocido",
            description: "Ocurrió un error desconocido",
          },
          network: {
            title: "Error de red",
            description: "Ocurrió un error de red",
          },
          notFound: {
            title: "No encontrado",
            description: "No se encontró el recurso",
          },
          conflict: {
            title: "Conflicto",
            description: "Hay un conflicto entre los datos",
          },
          unsavedChanges: {
            title: "Cambios sin guardar",
            description: "Tienes cambios sin guardar",
          },
        },
        fields: {
          timezone: {
            label: "Zona horaria",
            description:
              "Zona horaria del navegador para la conversión de hora",
          },
          dryRun: {
            label: "Dry Run",
            description: "Corre sin hacer cambios",
          },
          force: {
            label: "Fuerza",
            description: "Previa día/hora horario restricciones",
          },
        },
        response: {
          leadsProcessed: "Prospectos procesados",
          leadsStarted: "Arrancamientos",
          leadsSkipped: "Salteados de contacto",
          executionTimeMs: "Tiempo de ejecución (ms)",
          errors: "Errores",
          quotaDetails: "Quota Detalles",
        },
        success: {
          title: "Campaign Starter Completed",
          description: "El inicio de la campaña corrió con éxito",
        },
      },
      get: {
        title: "Obtener Config de Inicio de Campaña",
        description: "Recuperar configuración de arranque de campaña",
        errors: {
          unauthorized: {
            title: "Se requiere autenticación",
            description: "Inicia sesión para continuar",
          },
          forbidden: {
            title: "Acceso denegado",
            description: "No tienes acceso",
          },
          validation: {
            title: "Error de validación",
            description: "Parámetros de solicitud no válidos",
          },
          server: {
            title: "Error del servidor",
            description: "Ocurrió un error interno del servidor",
          },
          unknown: {
            title: "Error desconocido",
            description: "Ocurrió un error desconocido",
          },
          network: {
            title: "Error de red",
            description: "Ocurrió un error de red",
          },
          notFound: {
            title: "No encontrado",
            description: "No se encontró el recurso",
          },
          conflict: {
            title: "Conflicto",
            description: "Hay un conflicto entre los datos",
          },
          unsavedChanges: {
            title: "Cambios sin guardar",
            description: "Tienes cambios sin guardar",
          },
        },
        fields: {
          timezone: {
            label: "Zona horaria",
            description:
              "Zona horaria del navegador para la conversión de hora",
          },
        },
        response: {
          dryRun: "Modo de ejecución seca",
          minAgeHours: "Horas de edad mínima",
          enabledDays: "Días habilitados",
          enabledHours: "Horas habilitadas",
          localeConfig: "Configuración local",
          leadsPerWeek: "contacto por semana",
          schedule: "Horario",
          enabled: "Enabled",
          priority: "Prioridad",
          timeout: "Hora de salir",
          retries: "Retries",
          retryDelay: "Retry Delay",
        },
        success: {
          title: "Config Retrieved",
          description:
            "Configuración de arranque de campaña recuperada con éxito",
        },
      },
      put: {
        title: "Campaign Starter Config",
        description: "Configuración de arranque de campaña de actualización",
        dryRun: {
          label: "Modo de ejecución seca",
          description: "Activar el modo de funcionamiento seco para la prueba",
        },
        minAgeHours: {
          label: "Horas de edad mínima",
          description: "Edad mínima en horas antes de procesar los cables",
        },
        enabledDays: {
          label: "Días habilitados",
          description: "Días de la semana en que se activan las campañas",
          monday: "Lunes",
          tuesday: "Martes",
          wednesday: "Miércoles",
          thursday: "Jueves",
          friday: "Viernes",
          saturday: "Sábado",
          sunday: "Domingo",
        },
        enabledHours: {
          label: "Horas habilitadas",
          description: "Horas del día en que las campañas están habilitadas",
          start: {
            label: "Hora de inicio",
            description: "Hora del día en que comienzan las campañas (0-23)",
          },
          end: {
            label: "Hora final",
            description: "Hora del día cuando terminan las campañas (0-23)",
          },
        },
        localeConfig: {
          label: "Configuración local",
          description:
            "Ajustes por ubicación: conduce por semana, días activos y horas activas",
        },
        leadsPerWeek: {
          label: "contacto por semana",
          description: "Número máximo de pistas al proceso por semana",
        },
        schedule: {
          label: "Horario",
          description: "Calendario de ejecución de campañas",
        },
        enabled: {
          label: "Enabled",
          description: "Activar o desactivar el arranque de la campaña",
        },
        priority: {
          label: "Prioridad",
          description: "Nivel de prioridad para la ejecución de campañas",
        },
        timeout: {
          label: "Hora de salir",
          description: "Valor de tiempo en milisegundos",
        },
        retries: {
          label: "Retries",
          description: "Número de intentos de reingreso",
        },
        retryDelay: {
          label: "Retry Delay",
          description: "Dilatación entre intentos de retry en milisegundos",
        },
        success: {
          title: "Config Guardado",
          description: "Configuración de inicio de campaña guardada con éxito",
        },
      },
      priority: {
        critical: "Crítica",
        high: "Alto",
        medium: "Mediana",
        low: "Baja",
        background: "Antecedentes",
        filter: {
          all: "Todas las prioridades",
          highAndAbove: "Alto y arriba",
          mediumAndAbove: "Medio y superior",
        },
      },
      widget: {
        title: "Campaign Starter",
        titleSaved: "Configuración Guardada",
        description:
          "Iniciar campañas para nuevas pistas que están listas para ser contactadas.",
        saving: "Salvando...",
        save: "Guardar configuración",
        addLocale: "+ Añadir locale",
        guidanceTitle: "Configurar el Starter de Campaña",
        guidanceDescription:
          "Establezca el horario, días/horas activos, objetivos directos por semana y ajustes de tareas cron.",
        runButton: "Inicio Campañas",
        running: "Corriendo...",
        done: "Listo",
        perRunBudget:
          "~ {{perRunBudget}} leads/run · {{totalRunsPerWeek}} carreras/semana",
        perRunBudgetFractional:
          "{{exactBudget}} /run · {{totalRunsPerWeek}} funciona/semana (fraccional - se acumula a través de las carreras)",
        perRunBudgetZeroHint:
          "- aumentar los leads/semana o reducir la frecuencia de los horarios",
        sections: {
          general: "General",
          generalDescription:
            "Controles de maestría para habilitar el modo de arranque de la campaña y de ejecución seca.",
          schedule: "Horario",
          scheduleDescription:
            "¿Cuándo deben correr las campañas? Establece el horario cron, días activos y horas.",
          hoursTimezoneNote:
            "Horas en la zona horaria de su navegador ({{offset}}). Almacenado como UTC en el servidor.",
          quotas: "Quotas",
          quotasDescription:
            "Cuántos conducen al proceso por semana, derribado por la localidad.",
          advanced: "Avances",
          advancedDescription:
            "Ajustes de ejecución de tareas como prioridad, timeouts y comportamiento de reingreso.",
        },
        days: {
          mon: "Mon",
          tue: "Tue",
          wed: "Wed",
          thu: "Thu",
          fri: "Fri.",
          sat: "Sat",
          sun: "Sol",
        },
      },
    },
    emailCampaigns: {
      category: "Gestión de campañas",
      tag: "Campañas de correo electrónico",
      task: {
        description:
          "Enviar campañas de correo electrónico automatizadas a los líderes en función de su etapa y tiempo",
      },
      errors: {
        unauthorized: {
          title: "Se requiere autenticación",
          description: "Inicia sesión para continuar",
        },
        forbidden: {
          title: "Acceso denegado",
          description: "No tienes acceso",
        },
        validation: {
          title: "Error de validación",
          description: "Parámetros de solicitud no válidos",
        },
        server: {
          title: "Error del servidor",
          description: "Ocurrió un error interno del servidor",
        },
        unknown: {
          title: "Error desconocido",
          description: "Ocurrió un error desconocido",
        },
        network: {
          title: "Error de red",
          description: "Ocurrió un error de red",
        },
        notFound: {
          title: "No encontrado",
          description: "No se encontró el recurso",
        },
        conflict: {
          title: "Conflicto",
          description: "Hay un conflicto entre los datos",
        },
        unsavedChanges: {
          title: "Cambios sin guardar",
          description: "Tienes cambios sin guardar",
        },
      },
      post: {
        title: "Campañas de correo electrónico",
        description:
          "Campañas de correo electrónico de procesos para los líderes",
        errors: {
          unauthorized: {
            title: "Se requiere autenticación",
            description: "Inicia sesión para continuar",
          },
          forbidden: {
            title: "Acceso denegado",
            description: "No tienes acceso",
          },
          validation: {
            title: "Error de validación",
            description: "Parámetros de solicitud no válidos",
          },
          server: {
            title: "Error del servidor",
            description: "Ocurrió un error interno del servidor",
          },
          unknown: {
            title: "Error desconocido",
            description: "Ocurrió un error desconocido",
          },
          network: {
            title: "Error de red",
            description: "Ocurrió un error de red",
          },
          notFound: {
            title: "No encontrado",
            description: "No se encontró el recurso",
          },
          conflict: {
            title: "Conflicto",
            description: "Hay un conflicto entre los datos",
          },
          unsavedChanges: {
            title: "Cambios sin guardar",
            description: "Tienes cambios sin guardar",
          },
        },
        fields: {
          batchSize: {
            label: "Tamaño del lote",
            description: "Número de pistas para procesar por lote",
          },
          maxEmailsPerRun: {
            label: "Max Emails Per Run",
            description:
              "Número máximo de correos electrónicos para enviar por carrera",
          },
          dryRun: {
            label: "Dry Run",
            description: "Corre sin enviar correos electrónicos",
          },
        },
        response: {
          emailsScheduled: "Correos electrónicos programados",
          emailsSent: "Emails Sent",
          emailsFailed: "Correos fallidos",
          leadsProcessed: "Prospectos procesados",
        },
        success: {
          title: "Operación completada",
          description: "La operación se completó correctamente",
        },
      },
      get: {
        title: "Consiga campañas de correo electrónico Config",
        description:
          "Recuperar las campañas de correo electrónico configuración de la tarea de fondo",
        errors: {
          unauthorized: {
            title: "Se requiere autenticación",
            description: "Inicia sesión para continuar",
          },
          forbidden: {
            title: "Acceso denegado",
            description: "No tienes acceso",
          },
          validation: {
            title: "Error de validación",
            description: "Parámetros de solicitud no válidos",
          },
          server: {
            title: "Error del servidor",
            description: "Ocurrió un error interno del servidor",
          },
          unknown: {
            title: "Error desconocido",
            description: "Ocurrió un error desconocido",
          },
          network: {
            title: "Error de red",
            description: "Ocurrió un error de red",
          },
          notFound: {
            title: "No encontrado",
            description: "No se encontró el recurso",
          },
          conflict: {
            title: "Conflicto",
            description: "Hay un conflicto entre los datos",
          },
          unsavedChanges: {
            title: "Cambios sin guardar",
            description: "Tienes cambios sin guardar",
          },
        },
        response: {
          enabled: "Enabled",
          dryRun: "Modo de ejecución seca",
          batchSize: "Tamaño del lote",
          maxEmailsPerRun: "Max Emails Per Run",
          schedule: "Horario",
          priority: "Prioridad",
          timeout: "Hora de salir",
          retries: "Retries",
          retryDelay: "Retry Delay",
        },
        success: {
          title: "Config Retrieved",
          description:
            "Configuración de campañas de correo electrónico recuperada con éxito",
        },
      },
      put: {
        title: "Email Campaigns Config",
        description:
          "Actualizar la configuración de la tarea de correo electrónico",
        enabled: {
          label: "Enabled",
          description:
            "Activar o desactivar la tarea de fondo de las campañas de correo electrónico",
        },
        dryRun: {
          label: "Modo de ejecución seca",
          description: "Procesar correos electrónicos sin enviarlos realmente",
        },
        batchSize: {
          label: "Tamaño del lote",
          description: "Número de pistas para procesar por lote (1–100)",
        },
        maxEmailsPerRun: {
          label: "Max Emails Per Run",
          description:
            "Número máximo de correos electrónicos para enviar por carrera de fondo (1–1000)",
        },
        schedule: {
          label: "Horario",
          description:
            "Expresión de cron para cuándo ejecutar campañas de correo electrónico",
        },
        priority: {
          label: "Prioridad",
          description: "Nivel de prioridades para la ejecución de tareas",
        },
        timeout: {
          label: "Hora de salida (ms)",
          description: "Tiempo máximo de ejecución en milisegundos",
        },
        retries: {
          label: "Retries",
          description: "Número de intentos de reingreso al fracaso",
        },
        retryDelay: {
          label: "Retry Delay (ms)",
          description: "Dilatación entre intentos de retry en milisegundos",
        },
        success: {
          title: "Config Guardado",
          description:
            "Configuración de campañas de correo electrónico guardada con éxito",
        },
      },
      priority: {
        critical: "Crítica",
        high: "Alto",
        medium: "Mediana",
        low: "Baja",
        background: "Antecedentes",
      },
      widget: {
        title: "Configuración de campañas de correo electrónico",
        titleSaved: "Configuración Guardada",
        saving: "Salvando...",
        save: "Guardar configuración",
        guidanceTitle:
          "Configurar la tarea de fondo de campañas de correo electrónico",
        guidanceDescription:
          "Habilitar o desactivar la tarea cron de las campañas de correo electrónico y configurar su calendario, tamaño del lote y configuración de ejecución.",
        runButton: "Corre ahora.",
        running: "Corriendo...",
        done: "Listo",
        sections: {
          general: "General",
          generalDescription:
            "Controles de maestría para habilitar la tarea de campañas de correo electrónico y el modo de ejecución seco.",
          schedule: "Horario",
          scheduleDescription:
            "Establece el calendario cron para cuando se envían correos electrónicos.",
          processing: "Procesamiento",
          processingDescription:
            "Configure cuántas pistas y correos electrónicos procesar por carrera.",
          advanced: "Avances",
          advancedDescription:
            "Ajustes de ejecución de tareas como prioridad, timeouts y comportamiento de reingreso.",
        },
      },
    },
    emails: {
      common: {
        logoPart1: "Siguiente",
        logoPart2: "Vibe",
      },
      email: {
        template: {
          tagline: "Construir mejores productos más rápido",
        },
      },
      emailJourneys: {
        components: {
          footer: {
            copyright: "© 2024 {{appName}}. Todos los derechos reservados.",
            helpText:
              "Si tiene alguna pregunta, póngase en contacto con nosotros en {{config.emails.support}}",
            unsubscribeText: "¿Prefieres dejar de recibir estos correos?",
            unsubscribeLink: "Cancelar suscripción",
          },
          socialProof: {
            quotePrefix: "201C",
            quoteSuffix: "201D",
            attribution: ",  Nombre del cliente, Compañía",
          },
        },
      },
      journeys: {
        emailJourneys: {
          components: {
            defaults: {
              signatureName: "Un usuario de unbottled.ai",
              previewLeadId: "vista previa-lead-id",
              previewEmail: "preview@example.com",
              previewBusinessName: "Acme Corp",
              previewContactName: "Previsualizar usuario",
              previewPhone: "+1234567890",
              previewCampaignId: "vista previa-campaign-id",
            },
            footer: {
              unsubscribeText: "Estás recibiendo esto porque has optado.",
              unsubscribeLink: "Cancelar suscripción",
            },
            journeyInfo: {
              uncensoredConvert: {
                name: "Conversión a modelos sin censura",
                description:
                  "Un entusiasta compartiendo su descubrimiento de unbottled.ai",
                longDescription:
                  "Enthusiast persona compartiendo un verdadero descubrimiento con transparencia afiliada",
                characteristics: {
                  tone: "Tono casual y conspirador",
                  story: "Historia personal genuina",
                  transparency: "Transparencia de los afiliados",
                  angle: "Ángulo de anticensura",
                  energy: "Energía entusiasta",
                },
              },
              sideHustle: {
                name: "Hustle lateral",
                description:
                  "Un afiliado transparente que comparte casos de uso real",
                longDescription:
                  "Transparent affiliate marketer share real semanal use cases",
                characteristics: {
                  disclosure:
                    "Publicación completa de afiliados en primera línea",
                  updates: "Actualizaciones semanales de casos de uso",
                  income: "Historia pasiva de ingresos",
                  proof: "Prueba práctica, no hipócrita",
                  energy: "Honest bull energy",
                },
              },
              quietRecommendation: {
                name: "Recomendación silenciosa",
                description:
                  "Un profesional de bajo rango que pasa por una herramienta probada",
                longDescription:
                  "Profesional de bajo rango pasando por una herramienta probada durante semanas",
                characteristics: {
                  signal: "Corto, alta señal a ruido",
                  specifics: "Sin hype, sólo detalles",
                  testing: "3 semanas de pruebas de backstory",
                  comparison: "Comparación honesta con ChatGPT",
                  affiliate: "Mención de afiliado mínimo",
                },
              },
              signupNurture: {
                name: "Nutrición de registro",
                description:
                  "Secuencia de embarque para usuarios recién firmados",
                longDescription:
                  "E-mails de bienvenida y a bordo ayudando a los nuevos usuarios a empezar con la plataforma",
              },
              retention: {
                name: "Retención",
                description: "Reiniciación de los suscriptores existentes",
                longDescription:
                  "Correos electrónicos basados en el valor para mantener a los suscriptores activos comprometidos y explorar características",
              },
              winback: {
                name: "Winback",
                description: "Ganar usuarios inactivos o retorcidos",
                longDescription:
                  "Campaña de reactivación dirigida a usuarios que se han mantenido en silencio o cancelados",
              },
              newsletterMay2026: {
                name: "Boletín May 2026",
                description:
                  "Boletín de noticias único sobre Cortex, Dreamer, Autopilot y generación de medios",
                longDescription:
                  "May 2026 boletín de noticias de actualización de productos enviado a todos los usuarios registrados con la admisión honesta de errores y características destacados",
              },
              newsletterNov2026: {
                name: "Boletín de noviembre 2026",
                description:
                  "Boletín de reactivación de un solo paso: un compañero a su lado, su filtro y un predeterminado más barato",
                longDescription:
                  "Boletín de la conversión de noviembre 2026 enviado al boletín de noticias consensuado opt-ins, liderando con el ethos compañero y el modelo por defecto más barato",
              },
            },
          },
        },
      },
      services: {
        scheduler: {
          cancelledBySystem: "Cancelado por el sistema",
        },
        abTesting: {
          invalidWeights: "Los pesos variantes totales deben igual al 100%",
          negativeWeight: "El peso variable debe ser positivo",
        },
        post: {
          title: "Servicios",
          description: "Punto final de servicio",
          form: {
            title: "Configuración de servicios",
            description: "Configurar los parámetros de servicios",
          },
          response: {
            title: "Respuesta",
            description: "Datos de respuesta a los servicios",
          },
          errors: {
            unauthorized: {
              title: "Se requiere autenticación",
              description: "Inicia sesión para continuar",
            },
            validation: {
              title: "Error de validación",
              description: "Parámetros de solicitud no válidos",
            },
            server: {
              title: "Error del servidor",
              description: "Ocurrió un error interno del servidor",
            },
            unknown: {
              title: "Error desconocido",
              description: "Ocurrió un error desconocido",
            },
            network: {
              title: "Error de red",
              description: "Ocurrió un error de red",
            },
            forbidden: {
              title: "Acceso denegado",
              description: "No tienes acceso",
            },
            notFound: {
              title: "No encontrado",
              description: "No se encontró el recurso",
            },
            conflict: {
              title: "Conflicto",
              description: "Hay un conflicto entre los datos",
            },
          },
          success: {
            title: "Operación completada",
            description: "La operación se completó correctamente",
          },
        },
      },
      testMail: {
        category: "Contactos",
        tags: {
          campaigns: "Campañas",
          leads: "Contactos",
        },
        post: {
          title: "Test Mail",
          description:
            "Enviar correo electrónico de prueba con datos de contacto personalizados",
          form: {
            title: "Configuración de correo de prueba",
            description:
              "Configurar parámetros de correo de prueba y datos de contacto",
          },
          campaignType: {
            label: "Tipo de campaña",
            description: "Tipo de campaña de correo electrónico",
            placeholder: "Introduzca el tipo de campaña",
          },
          emailJourneyVariant: {
            label: "Variedad de viaje por correo electrónico",
            description:
              "Variante de prueba A/B para el viaje por correo electrónico",
            placeholder: "Seleccione la variante de viaje",
          },
          emailCampaignStage: {
            label: "Correo electrónico Campaña Stage",
            description: "Etapa actual en la campaña de correo electrónico",
            placeholder: "Seleccionar la etapa de campaña",
          },
          testEmail: {
            label: "Test Email Address",
            description:
              "Dirección de correo electrónico para enviar correo de prueba",
            placeholder: "test@example.com",
          },
          leadData: {
            title: "Datos principales",
            description:
              "Información principal para la reproducción de plantillas",
            businessName: {
              label: "Nombre del negocio",
              description: "Nombre del negocio",
              placeholder: "Acme Corporation",
            },
            contactName: {
              label: "Nombre de contacto",
              description: "Nombre de la persona contacto",
              placeholder: "John Doe",
            },
            website: {
              label: "Sitio web",
              description: "Sitio web de la empresa URL",
              placeholder: "https://example.com",
            },
            country: {
              label: "País",
              description: "Código del país",
              placeholder: "GLOBAL",
            },
            language: {
              label: "Idioma",
              description: "Código de idioma preferido",
              placeholder: "en inglés",
            },
            status: {
              label: "Situación",
              description: "Situación principal",
              placeholder: "NEW",
            },
            source: {
              label: "Fuente",
              description: "Fuente principal",
              placeholder: "WEBSITE",
            },
            notes: {
              label: "Notas",
              description: "Notas adicionales sobre el contacto",
              placeholder: "Ingrese cualquier nota adicional",
            },
          },
          response: {
            title: "Test Email Resultado",
            description: "Resultado del envío de correo electrónico de prueba",
            success: {
              content: "Operación completada",
            },
            messageId: {
              content: "Mensaje ID",
            },
            testEmail: {
              content: "Test Email",
            },
            subject: {
              content: "Asunto",
            },
            sentAt: {
              content: "Enviado",
            },
          },
          errors: {
            unauthorized: {
              title: "Se requiere autenticación",
              description: "Inicia sesión para continuar",
            },
            validation: {
              title: "Error de validación",
              description: "Parámetros de solicitud no válidos",
            },
            server: {
              title: "Error del servidor",
              description: "Ocurrió un error interno del servidor",
            },
            unknown: {
              title: "Error desconocido",
              description: "Ocurrió un error desconocido",
            },
            network: {
              title: "Error de red",
              description: "Ocurrió un error de red",
            },
            forbidden: {
              title: "Acceso denegado",
              description: "No tienes acceso",
            },
            notFound: {
              title: "No encontrado",
              description: "No se encontró el recurso",
            },
            unsavedChanges: {
              title: "Cambios sin guardar",
              description: "Hay cambios sin salvar",
            },
            conflict: {
              title: "Conflicto",
              description: "Hay un conflicto entre los datos",
            },
            templateNotFound: {
              title: "Plantilla no encontrada",
              description:
                "Plantilla de correo electrónico no encontrada para parámetros especificados",
            },
            sendingFailed: {
              title: "Enviando fracasado",
              description:
                "Fallado para enviar el correo electrónico de prueba",
            },
          },
          success: {
            title: "Operación completada",
            description: "E-mail de prueba enviado con éxito",
          },
          selectionCriteria: "Criterios de selección SMTP",
          widget: {
            title: "Enviar prueba de email",
            send: "Enviar prueba de email",
            sending: "Enviando…",
            successMessage: "E-mail de prueba enviado con éxito",
            sentTo: "Enviado a: ",
            subject: "Asunto: ",
            sentAt: "Enviada a: ",
            campaignConfig: "Campaign Config",
            sendAnother: "Enviar otro",
          },
        },
      },
    },
  },
  create: {
    category: "Contactos",
    tags: {
      leads: "Contactos",
      create: "Crear",
    },

    enums: {
      leadSource: {
        website: "Sitio web",
        socialMedia: "Social Media",
        emailCampaign: "Campaña de correo electrónico",
        referral: "Referidos",
        csvImport: "Importación CSV",
      },
    },
    widget: {
      headerLeadCreated: "Contacto creado",
      headerCreateLead: "Crear contacto",
      subheaderFillDetails: "Rellene los detalles a continuación",
      fallbackLeadName: "Prospecto",
      buttonCopyId: "Copiar ID",
      buttonViewLead: "Ver contacto",
      buttonEditLead: "Editar contacto",
      buttonBackToList: "Volver a la lista",
    },
    post: {
      title: "Crear contacto",
      description: "Crear una nueva pista en el sistema",
      backButton: {
        label: "Regreso a los contactos",
      },
      submitButton: {
        label: "Crear contacto",
        loadingText: "Creando contacto...",
      },
      form: {
        title: "Nuevo formulario de arrendamiento",
        description:
          "Ingrese la información principal para crear un nuevo contacto",
      },
      contactInfo: {
        title: "Información de contacto",
        description: "Detalles de contacto primarios para el contacto",
      },
      email: {
        label: "Dirección de correo electrónico",
        description:
          "Dirección de correo electrónico primaria para la comunicación",
        placeholder: "john@example.com",
      },
      businessName: {
        label: "Nombre del negocio",
        description: "Nombre de la empresa o empresa",
        placeholder: "Ejemplo Corp",
      },
      phone: {
        label: "Número de teléfono",
        description: "Número de teléfono de contacto con código de país",
        placeholder: "+1234567890",
      },
      website: {
        label: "Sitio web",
        description: "Sitio web de la empresa URL",
        placeholder: "https://example.com",
      },
      locationPreferences: {
        title: "Lugar &quot; Preferencias",
        description: "Preferencias geográficas y lingüísticas",
      },
      country: {
        label: "País",
        description: "Localización comercial o mercado de destino",
        placeholder: "Seleccione un país",
      },
      language: {
        label: "Idioma",
        description: "Idioma de comunicación preferido",
        placeholder: "Seleccione un idioma",
      },
      leadDetails: {
        title: "Detalles del contacto",
        description: "Información adicional sobre el contacto",
      },
      source: {
        label: "Origen del contacto",
        description: "Cómo se adquirió el contacto",
        placeholder: "Seleccionar fuente",
      },
      notes: {
        label: "Notas",
        description: "Notas o comentarios adicionales",
        placeholder: "Ingrese cualquier información adicional...",
      },
      response: {
        title: "Created Lead",
        description: "Detalles del nuevo contacto creado",
        summary: {
          title: "Resumen",
          id: "ID del contacto",
          businessName: "Nombre del negocio",
          email: "Dirección de correo electrónico",
          status: "Estado del contacto",
        },
        contactDetails: {
          title: "Datos de contacto",
          phone: "Número de teléfono",
          website: "Sitio web URL",
          country: "País",
          language: "Idioma",
        },
        trackingInfo: {
          title: "Seguimiento de la información",
          source: "Origen del contacto",
          emailsSent: "Cuenta de correo electrónico",
          currentCampaignStage: "Etapa de campaña",
        },
        metadata: {
          title: "Metadatos",
          notes: "Notas",
          createdAt: "Fecha de creación",
          updatedAt: "Última actualización",
        },
      },
      errors: {
        unauthorized: {
          title: "Se requiere autenticación",
          description: "Autenticación necesaria para crear leads",
        },
        validation: {
          title: "Error de validación",
          description: "Información de contacto inválida",
        },
        server: {
          title: "Error del servidor",
          description:
            "Error del servidor interno se produjo al crear el contacto",
        },
        unknown: {
          title: "Error desconocido",
          description: "Se produjo un error desconocido al crear el contacto",
        },
        network: {
          title: "Error de red",
          description: "Se produjo error de red al crear el contacto",
        },
        forbidden: {
          title: "Acceso denegado",
          description: "Acceso prohibido para la creación de contacto",
        },
        notFound: {
          title: "No encontrado",
          description:
            "Recursos necesarios no encontrados para la creación de contacto",
        },
        conflict: {
          title: "Conflicto",
          description:
            "El contacto ya existe o se produjo un conflicto de datos",
        },
        unsavedChanges: {
          title: "Cambios sin guardar",
          description: "Hay cambios sin salvar en la forma de contacto",
        },
      },
      success: {
        title: "Contacto creado",
        description: "contacto creado con éxito",
      },
    },
    email: {
      welcome: {
        subject: "Bienvenido a {{companyName}}",
        title: "Bienvenido a {{companyName}}, {{businessName}}!",
        preview: "Bienvenida. Así es como empezar.",
        greeting:
          "Bienvenido a {{companyName}}, {{businessName}}! Me alegro de tenerte.",
        defaultName: "allí.",
        introduction:
          "Gracias por su interés. Tus detalles nos alcanzaron, y una persona real los leyó.",
        nextSteps: {
          title: "¿Qué pasa después?",
          step1Number: "1.",
          step1:
            "Empieza a charlar de inmediato. Sin configuración, sin tarjeta.",
          step2Number: "2.",
          step2:
            "¿Preguntas? Responder a este correo electrónico. Un humano lo lee.",
          step3Number: "3.",
          step3: "Respondemos tan pronto como podamos.",
        },
        cta: {
          getStarted: "Empieza a chatear",
        },
        support:
          "¿Tiene preguntas? Responder a este correo electrónico o contactar con nosotros en {{supportEmail}}",
        error: {
          noEmail:
            "No se puede enviar correo electrónico de bienvenida - no email proporcionado",
        },
      },
      admin: {
        newLead: {
          subject: "Nuevo contacto: {{businessName}}",
          title: "Nuevo Lead Creado",
          preview: "Nuevo contacto de {{businessName}} requiere seguimiento",
          message:
            "Se ha creado una nueva pista en el sistema de {{businessName}} y requiere su atención.",
          leadDetails: "Detalles del contacto",
          businessName: "Nombre del negocio",
          email: "Correo electrónico",
          phone: "Teléfono",
          website: "Sitio web",
          source: "Fuente",
          status: "Situación",
          notes: "Notas",
          notProvided: "No se proporcionó",
          viewLead: "Ver detalles del contacto",
          viewAllLeads: "Ver todos los contactos",
          error: {
            noData:
              "No se puede enviar notificación de administración - no se proporcionan datos de contacto",
          },
          defaultName: "Nuevo contacto",
        },
      },
      error: {
        general: {
          internal_server_error: "Se produjo un error de servidor interno",
        },
      },
    },
  },
  export: {
    category: "Contactos",
    tags: {
      leads: "Contactos",
      export: "Exportación",
    },

    get: {
      title: "Export Leads",
      description: "Exportar lleva datos al archivo",
      form: {
        title: "Configuración de exportación",
        description:
          "Configurar parámetros y filtros de exportación de contacto",
      },
      format: {
        label: "Formato de exportación",
        description: "Formato de archivo para la exportación",
      },
      status: {
        label: "Estado del contacto",
        description: "Filtro por estado de contacto",
      },
      country: {
        label: "País",
        description: "Filtro por país",
        placeholder: "Seleccionar país",
      },
      language: {
        label: "Idioma",
        description: "Filtro por idioma",
        placeholder: "Seleccionar idioma",
      },
      source: {
        label: "Origen del contacto",
        description: "Filtro por fuente de contacto",
        placeholder: "Seleccionar fuente",
      },
      search: {
        label: "Buscar",
        description: "Búsqueda de guías por texto",
        placeholder: "Búsqueda conduce...",
      },
      dateFrom: {
        label: "Fecha de inicio",
        description: "Export leads created from this date",
      },
      dateTo: {
        label: "Fecha final",
        description: "Exportar leads creados hasta esta fecha",
      },
      includeMetadata: {
        label: "Incluir los metadatos",
        description: "Incluya la creación y actualizaciones timetamps",
      },
      includeEngagementData: {
        label: "Incluir los datos de compromiso",
        description:
          "Incluir datos de seguimiento y campaña de correo electrónico",
      },
      response: {
        title: "Archivo de exportación",
        description: "Archivo de exportación generado con datos de contacto",
        fileName: "Nombre del archivo",
        fileContent: "Contenido del archivo (Base64)",
        mimeType: "Tipo MIME",
        totalRecords: "Total Records",
        exportedAt: "Exportado en",
      },
      errors: {
        unauthorized: {
          title: "Se requiere autenticación",
          description: "Autenticación necesaria para exportar los contactos",
        },
        validation: {
          title: "Error de validación",
          description: "Parámetros o filtros de exportación inválidos",
        },
        server: {
          title: "Error del servidor",
          description:
            "Error del servidor interno ocurrido durante la exportación",
        },
        unknown: {
          title: "Error desconocido",
          description: "Se produjo un error desconocido durante la exportación",
        },
        network: {
          title: "Error de red",
          description: "Error de red ocurrido durante la exportación",
        },
        forbidden: {
          title: "Acceso denegado",
          description: "Acceso prohibido para exportación de contacto",
        },
        notFound: {
          title: "No Data",
          description:
            "No hay pistas encontradas que coincidan con los criterios de exportación",
        },
        conflict: {
          title: "Conflicto",
          description: "Conflicto de datos ocurrido durante la exportación",
        },
        unsavedChanges: {
          title: "Cambios sin guardar",
          description: "Hay cambios no salvos en la forma de exportación",
        },
      },
      success: {
        title: "Exportación completa",
        description: "Exportación de contacto completada con éxito",
      },
    },
    widget: {
      exportLeads: "Export Leads",
      import: "Importación",
      viewList: "Ver lista",
      importLeadsTitle: "Importar contactos",
      viewLeadsListTitle: "Ver Lista de Líderes",
      copyCsvTitle: "Copiar el contenido de CSV para el portapapeles",
      generatingExport: "Generando exportación...",
      generatingExportHint:
        "Esto puede tomar un momento para grandes conjuntos de datos",
      exportReady: "Exportar",
      fileReadyToDownload: "Su archivo está listo para descargar",
      records: "Documentos",
      format: "Format",
      fileSize: "Tamaño del archivo",
      copied: "¡Copiado!",
      copy: "Copiar",
      download: "Descargar",
      exportedAt: "Exportado a:",
      nextSteps: "Siguientes pasos:",
      viewLeads: "View Leads",
      importLeads: "Importar contactos",
      configureExport: "Configure Export",
      configureExportHint:
        "Seleccione el formato y los filtros a continuación, haga clic en Exportar para generar su archivo",
      formatLabel: "Format",
      formatHint: "Elija CSV o Excel (XLSX)",
      statusFilter: "Filtro de estado",
      statusFilterHint: "Exportar sólo conduce a un estado específico",
      dateRange: "Gama de fecha",
      dateRangeHint: "Exportación estrecha a una ventana de tiempo específica",
      metadataEngagement: "Metadatos y compromiso",
      metadataEngagementHint:
        "Opcionalmente incluye columnas adicionales para análisis avanzado",
      viewLeadsList: "Ver Lista de Líderes",
      excelSpreadsheet: "Excel Spreadsheet",
      csvFile: "CSV File",
    },
    enums: {
      exportFormat: {
        csv: "CSV",
        xlsx: "Excel",
      },
      leadStatus: {
        new: "Nuevo",
        pending: "Pendiente",
        campaignRunning: "Campaign Running",
        websiteUser: "Sitio web Usuario",
        newsletterSubscriber: "Newsletter Suscríbase",
        inContact: "En contacto",
        signedUp: "Signed Up",
        subscriptionConfirmed: "Suscripción confirmada",
        unsubscribed: "Suscripción cancelada",
        bounced: "Bounced",
        invalid: "Inválidos",
      },
      leadSource: {
        website: "Sitio web",
        socialMedia: "Social Media",
        emailCampaign: "Campaña de correo electrónico",
        referral: "Referidos",
        csvImport: "Importación CSV",
      },
    },
    headers: {
      email: "Correo electrónico",
      businessName: "Nombre del negocio",
      contactName: "Nombre de contacto",
      phone: "Teléfono",
      country: "País",
      language: "Idioma",
      status: "Situación",
      source: "Fuente",
      website: "Sitio web",
      notes: "Notas",
      campaignStage: "Etapa de campaña",
      emailsSent: "Emails Sent",
      emailsOpened: "Correos electrónicos abiertos",
      emailsClicked: "Emails Clicked",
      lastEmailSent: "Último mensaje enviado",
      lastEngagement: "Último compromiso",
      unsubscribedAt: "Suscritas en",
      createdAt: "Creado en",
      updatedAt: "Actualizado en",
      lastEngagementAt: "Último compromiso",
      metadata: "Metadatos",
      ipAddress: "Dirección de IP",
      userAgent: "Agente de usuario",
      deviceType: "Tipo de dispositivo",
      browser: "Navegador",
      os: "OS",
      referralCode: "Código de referido",
    },
  },
  import: {
    tags: {
      import: "Importación",
      leads: "Contactos",
      csv: "CSV",
    },

    category: "Importación de datos",
    post: {
      title: "Importar contactos",
      description: "Importancias desde el archivo CSV",
      form: {
        title: "Configuración de importación",
        description: "Configurar parámetros de importación de contacto",
      },
      file: {
        label: "CSV File",
        description: "Contenido de archivo CSV (base64 codificado)",
        placeholder: "Paste base64 contenido CSV codificado",
        helpText: "Cargue un archivo CSV con datos de contacto",
      },
      fileName: {
        label: "Nombre del archivo",
        description: "Nombre del archivo CSV",
        placeholder: "leads.csv",
        helpText: "Proporcionar un nombre de archivo descriptivo",
      },
      skipDuplicates: {
        label: "Skip Duplicates",
        description: "Saltar pistas con direcciones de correo duplicados",
        helpText:
          "Permite saltar automáticamente las direcciones de correo electrónico existentes",
      },
      updateExisting: {
        label: "Actualización existente",
        description: "Actualizar los cables existentes con nuevos datos",
        helpText: "Permite actualizar los cables existentes en lugar de saltar",
      },
      defaultCountry: {
        label: "País predeterminado",
        description:
          "País predeterminado para los contactos sin país especificado",
        helpText: "Seleccione el código de país predeterminado",
      },
      defaultLanguage: {
        label: "Idioma predeterminado",
        description:
          "Lenguaje predeterminado para cables sin idioma especificado",
        helpText: "Seleccione el código de idioma predeterminado",
      },
      defaultStatus: {
        label: "Estado predeterminado",
        description: "Estado predeterminado de los contactos importados",
        helpText: "Seleccione el estado inicial para nuevos leads",
      },
      defaultCampaignStage: {
        label: "Etapa de campaña predeterminada",
        description:
          "Etapa de campaña de correo electrónico predeterminada para los contactos importados",
        helpText: "Seleccione la etapa inicial de la campaña",
      },
      defaultSource: {
        label: "Fuente predeterminada",
        description:
          "Atribución por defecto de fuente para los contactos importados",
        helpText: "Seleccione la fuente principal para el seguimiento",
      },
      useChunkedProcessing: {
        label: "Usar procesamiento en polvo",
        description: "Procesar grandes importaciones en pedazos de fondo",
        helpText: "Permite para archivos con más de 1000 filas",
      },
      batchSize: {
        label: "Tamaño del lote",
        description: "Número de filas para procesar por lote",
        helpText: "Recomendado: 2000 filas por lote",
      },
      response: {
        batchId: "Batch ID",
        totalRows: "Total Rows",
        successfulImports: "Importaciones exitosas",
        failedImports: "Importaciones fallidas",
        duplicateEmails: "Correos electrónicos duplicados",
        errors: "Importar errores",
        summary: "Resumen de la importación",
        isChunkedProcessing: "Usando el procesamiento de Chunked",
        jobId: "Antecedentes Job ID",
      },
      errors: {
        validation: {
          title: "Error de validación",
          description: "Parámetros de importación inválidos o formato CSV",
        },
        unauthorized: {
          title: "Se requiere autenticación",
          description: "Autenticación necesaria para importar los contactos",
        },
        forbidden: {
          title: "Acceso denegado",
          description: "Acceso prohibido para la importación de contacto",
        },
        notFound: {
          title: "No encontrado",
          description: "Archivo CSV no encontrado o no",
        },
        conflict: {
          title: "Conflicto",
          description: "Conflicto de datos durante la importación",
        },
        server: {
          title: "Error del servidor",
          description: "Error del servidor interno durante la importación",
        },
        unknown: {
          title: "Error desconocido",
          description: "Se produjo un error desconocido durante la importación",
        },
        network: {
          title: "Error de red",
          description: "Error de red durante la importación",
        },
        unsavedChanges: {
          title: "Cambios sin guardar",
          description: "Hay cambios insalvados en el formulario de importación",
        },
      },
      success: {
        title: "Importación iniciada",
        description: "La importación de contacto se ha iniciado con éxito",
      },
      widget: {
        headerTitle: "Importar contactos de CSV",
        exportTemplateButton: "Plantilla de exportación",
        importGuideTitle: "Guía de importación",
        importGuideSubtitle:
          "Cargue un archivo CSV con las siguientes columnas:",
        importGuideNote:
          "Sólo {{email}} es necesario. Todas las demás columnas son opcionales y se volverán a los predeterminados configurados a continuación.",
        fileRequirementsTitle: "Requisitos de archivo",
        fileRequirementFormat:
          "Formato: CSV (valores separados por computadora, UTF-8 codificado)",
        fileRequirementHeader:
          "Primera fila debe ser la fila de encabezado con nombres de columna",
        fileRequirementSize: "Tamaño máximo recomendado: 50 MB por subida",
        fileRequirementChunked:
          "Para archivos más grandes de ~5 000 filas, active {{chunkedProcessing}} para evitar los timeouts",
        chunkedProcessingLabel: "Procesamiento de calamizado",
        downloadTemplateLink: "Descargar plantilla CSV",
        loadingText: "Importar pistas...",
        backgroundProcessingTitle: "Procesamiento de antecedentes",
        backgroundProcessingNote:
          "Importación grande queued como trabajo: {{jobId}}. Procesando filas {{totalRows}} en el fondo.",
        checkJobStatusButton: "Compruebe el estado del trabajo",
        stopJobButton: "Para Job.",
        retryFailedButton: "Retry Failed",
        statTotalRows: "Total Rows",
        statImported: "Importados",
        statDuplicates: "Duplicados",
        statFailed: "Failed",
        viewImportedLeadsButton: "Ver Líderes importados",
        retryFailedWithCountButton: "Retry Failed ({{count}})",
        summaryTitle: "Resumen",
        summaryNewLeads: "Nuevos contactos",
        summaryUpdated: "Actualizado",
        summarySkipped: "Saltó.",
        successRateLabel: "Tasa de éxito",
        importErrorsTitle: "Errores de importación {{count}}",
        errorRowLabel: "Row {{row}}",
        findLeadButton: "Encontrar Lead",
      },
    },
    process: {
      tag: "Proceso de importación",
      post: {
        title: "Trabajos de importación de procesos",
        titleShort: "Importación de procesos",
        description: "Proceso pendiente de trabajo de importación CSV",
        container: {
          title: "Configuración del Proceso de Importación",
          description: "Configurar los parámetros del proceso de importación",
        },
        fields: {
          maxJobsPerRun: {
            label: "Max Jobs Per Run",
            description: "Número máximo de empleos para procesar por carrera",
          },
          maxRetriesPerJob: {
            label: "Max Retries Per Job",
            description: "Número máximo de retries por trabajo",
          },
          dryRun: {
            label: "Dry Run",
            description: "Corre sin hacer cambios",
          },
          selfTaskId: {
            label: "Self Task ID",
            description:
              "Tareas internas ID para autolimpieza después del procesamiento",
          },
        },
        response: {
          jobsProcessed: "Empleos procesados",
          totalRowsProcessed: "Total Rows Processed",
          successfulImports: "Importaciones exitosas",
          failedImports: "Importaciones fallidas",
        },
        errors: {
          unauthorized: {
            title: "Se requiere autenticación",
            description: "Inicia sesión para continuar",
          },
          forbidden: {
            title: "Acceso denegado",
            description: "No tienes acceso",
          },
          server: {
            title: "Error del servidor",
            description: "Se produjo un error al procesar las importaciones",
          },
          unknown: {
            title: "Error desconocido",
            description: "Ocurrió un error desconocido",
          },
          validation: {
            title: "Error de validación",
            description: "Parámetros de solicitud no válidos",
          },
        },
        success: {
          title: "Procesamiento de Importación Completa",
          description: "Importar trabajos procesados con éxito",
        },
      },
    },
    widget: {
      header: {
        title: "Importación de empleos",
        newImport: "Nueva importancia",
      },
      filter: {
        all: "Todos",
        completed: "Completado",
        failed: "Failed",
        pending: "Pendiente",
        running: "Corriendo",
      },
      loading: "Cargando trabajos de importación...",
      empty: {
        title: "No hay puestos de importación encontrados",
        withFilter:
          "Pruebe un filtro diferente o comience una nueva importación.",
        withoutFilter: "Comience su primera importación para verlo aquí.",
        newImport: "Nueva importancia",
      },
    },
    jobs: {
      jobId: {
        category: "Importación de datos",
        tags: {
          leads: "Contactos",
          management: "Gestión",
        },

        get: {
          title: "Obtener importación de empleo",
          description:
            "Obtenga detalles de un trabajo específico de importación",
          actions: {
            retry: "Retrocedimiento",
            stop: "Para.",
            viewLeads: "View Leads",
          },
          jobId: {
            label: "Job ID",
            description: "Unico identificador para el trabajo de importación",
          },
          form: {
            title: "Importación del estado laboral",
            description:
              "Situación actual y progreso del trabajo de importación",
          },
          response: {
            title: "Información sobre el empleo",
            description: "Datos del trabajo de importación actuales",
            info: {
              title: "Información sobre el empleo",
              description: "Información básica sobre el trabajo",
            },
            id: {
              content: "Job ID",
            },
            fileName: {
              content: "Nombre del archivo",
            },
            status: {
              content: "Situación laboral",
            },
            progress: {
              title: "Progresos en la importación",
              description:
                "Progresos y estadísticas actuales de las importaciones",
            },
            totalRows: {
              content: "Total Rows",
            },
            processedRows: {
              content: "Filas procesadas",
            },
            successfulImports: {
              content: "Importaciones exitosas",
            },
            failedImports: {
              content: "Importaciones fallidas",
            },
            duplicateEmails: {
              content: "Correos electrónicos duplicados",
            },
            configuration: {
              title: "Configuración de empleo",
              description: "Ajustes de configuración de trabajo actuales",
            },
            currentBatchStart: {
              content: "Comienzo del lote actual",
            },
            batchSize: {
              content: "Tamaño del lote",
            },
            retryCount: {
              content: "Conde de reingreso",
            },
            maxRetries: {
              content: "Max Retries",
            },
            error: {
              content: "Mensaje de error",
            },
            timestamps: {
              title: "Job Timestamps",
              description: "Horarios de vida de trabajo",
            },
            createdAt: {
              content: "Creado en",
            },
            updatedAt: {
              content: "Actualizado en",
            },
            startedAt: {
              content: "Comenzó en",
            },
            completedAt: {
              content: "Completado en",
            },
          },
          errors: {
            validation: {
              title: "Error de validación",
              description: "El trabajo proporcionado ID es inválido",
            },
            unauthorized: {
              title: "Se requiere autenticación",
              description: "Autenticación necesaria para ver empleos",
            },
            forbidden: {
              title: "Acceso denegado",
              description: "No tienes permiso para ver este trabajo.",
            },
            notFound: {
              title: "Job no se encontró",
              description:
                "No hay trabajo de importación encontrado con el ID proporcionado",
            },
            server: {
              title: "Error del servidor",
              description: "Se produjo un error al recuperar el trabajo",
            },
            unknown: {
              title: "Error desconocido",
              description: "Ocurrió un error inesperado",
            },
            network: {
              title: "Error de red",
              description: "Incapaz de conectarse al servidor",
            },
            unsavedChanges: {
              title: "Cambios sin guardar",
              description: "Tienes cambios sin guardar",
            },
            conflict: {
              title: "Conflicto",
              description:
                "Se produjo un conflicto mientras se recuperaba el empleo",
            },
          },
          success: {
            title: "Operación completada",
            description: "Trabajo de importación recuperado con éxito",
          },
        },
        patch: {
          title: "Actualizar el trabajo de importación",
          description: "Actualizar la configuración del trabajo de importación",
          jobId: {
            label: "Job ID",
            description: "Unico identificador para el trabajo de importación",
          },
          form: {
            title: "Actualizar Configuración de empleo",
            description:
              "Modificar la configuración del trabajo de importación",
          },
          settings: {
            title: "Configuración de empleo",
            description:
              "Ajustes de configuración para el trabajo de importación",
          },
          batchSize: {
            label: "Tamaño del lote",
            description: "Número de filas para procesar en cada lote",
            placeholder: "100",
          },
          maxRetries: {
            label: "Max Retries",
            description:
              "Número máximo de intentos de reingreso para filas fallidas",
            placeholder: "3",
          },
          response: {
            title: "Información actualizada sobre el empleo",
            description: "Datos actualizados sobre el trabajo de importación",
            info: {
              title: "Información sobre el empleo",
              description: "Información básica sobre el trabajo",
            },
            id: {
              content: "Job ID",
            },
            fileName: {
              content: "Nombre del archivo",
            },
            status: {
              content: "Situación laboral",
            },
            progress: {
              title: "Progresos en la importación",
              description:
                "Progresos y estadísticas actuales de las importaciones",
            },
            totalRows: {
              content: "Total Rows",
            },
            processedRows: {
              content: "Filas procesadas",
            },
            successfulImports: {
              content: "Importaciones exitosas",
            },
            failedImports: {
              content: "Importaciones fallidas",
            },
            duplicateEmails: {
              content: "Correos electrónicos duplicados",
            },
            configuration: {
              title: "Configuración de empleo",
              description: "Ajustes de configuración de trabajo actuales",
            },
            currentBatchStart: {
              content: "Comienzo del lote actual",
            },
            batchSize: {
              content: "Tamaño del lote",
            },
            retryCount: {
              content: "Conde de reingreso",
            },
            maxRetries: {
              content: "Max Retries",
            },
            error: {
              content: "Mensaje de error",
            },
            timestamps: {
              title: "Job Timestamps",
              description: "Horarios de vida de trabajo",
            },
            createdAt: {
              content: "Creado en",
            },
            updatedAt: {
              content: "Actualizado en",
            },
            startedAt: {
              content: "Comenzó en",
            },
            completedAt: {
              content: "Completado en",
            },
          },
          errors: {
            validation: {
              title: "Error de validación",
              description: "Los datos proporcionados son inválidos",
            },
            unauthorized: {
              title: "Se requiere autenticación",
              description:
                "Autenticación necesaria para actualizar los empleos",
            },
            forbidden: {
              title: "Acceso denegado",
              description: "No tienes permiso para actualizar este trabajo",
            },
            notFound: {
              title: "Job no se encontró",
              description:
                "No hay trabajo de importación encontrado con el ID proporcionado",
            },
            server: {
              title: "Error del servidor",
              description: "Se produjo un error al actualizar el trabajo",
            },
            unknown: {
              title: "Error desconocido",
              description: "Ocurrió un error inesperado",
            },
            network: {
              title: "Error de red",
              description: "Incapaz de conectarse al servidor",
            },
            unsavedChanges: {
              title: "Cambios sin guardar",
              description: "Tienes cambios sin guardar",
            },
            conflict: {
              title: "Actualización de conflictos",
              description: "El trabajo fue modificado por otro usuario",
            },
          },
          success: {
            title: "Operación completada",
            description: "Trabajo de importación actualizado con éxito",
          },
        },
        delete: {
          title: "Eliminar el trabajo de importación",
          description: "Eliminar un trabajo de importación específico",
          jobId: {
            label: "Job ID",
            description:
              "Identificador único para el trabajo de importación para eliminar",
          },
          form: {
            title: "Eliminar el trabajo de importación",
            description:
              "Confirmación de la supresión del trabajo de importación",
          },
          response: {
            title: "Resultado de la eliminación",
            description: "Resultado de la operación de eliminación",
            success: {
              content: "Situación de éxito",
            },
            message: {
              content: "Mensaje de eliminación",
            },
          },
          errors: {
            validation: {
              title: "Error de validación",
              description: "El trabajo proporcionado ID es inválido",
            },
            unauthorized: {
              title: "Se requiere autenticación",
              description: "Autenticación necesaria para eliminar empleos",
            },
            forbidden: {
              title: "Acceso denegado",
              description: "No tienes permiso para borrar este trabajo",
            },
            notFound: {
              title: "Job no se encontró",
              description:
                "No hay trabajo de importación encontrado con el ID proporcionado",
            },
            server: {
              title: "Error del servidor",
              description: "Se produjo un error al eliminar el trabajo",
            },
            unknown: {
              title: "Error desconocido",
              description: "Ocurrió un error inesperado",
            },
            network: {
              title: "Error de red",
              description: "Incapaz de conectarse al servidor",
            },
            unsavedChanges: {
              title: "Cambios sin guardar",
              description: "Tienes cambios sin guardar",
            },
            conflict: {
              title: "Conflicto por eliminación",
              description:
                "No se puede eliminar el trabajo que está procesando actualmente",
            },
          },
          success: {
            title: "Operación completada",
            description: "Trabajo de importación eliminado con éxito",
          },
        },
        retry: {
          category: "Importación de datos",
          tags: {
            leads: "Contactos",
            management: "Gestión",
          },

          post: {
            title: "Retry Import Job",
            description: "Retratar un trabajo de importación fallido",
            jobId: {
              label: "Job ID",
              description:
                "Unico identificador para el trabajo de importación para reingresar",
            },
            form: {
              title: "Retry Import Job",
              description: "Regresar el trabajo de importación fallido",
            },
            response: {
              title: "Resultado de la entrada",
              description: "Resultado de la operación de reingreso",
              success: {
                content: "Situación de éxito",
              },
              message: {
                content: "Mensaje de entrada",
              },
            },
            errors: {
              validation: {
                title: "Error de validación",
                description: "El trabajo proporcionado ID es inválido",
              },
              unauthorized: {
                title: "Se requiere autenticación",
                description: "Autenticación necesaria para reintentar empleos",
              },
              forbidden: {
                title: "Acceso denegado",
                description: "No tienes permiso para reintentar este trabajo",
              },
              notFound: {
                title: "Job no se encontró",
                description:
                  "No hay trabajo de importación encontrado con el ID proporcionado",
              },
              server: {
                title: "Error del servidor",
                description: "Se produjo un error al reintentar el trabajo",
              },
              unknown: {
                title: "Error desconocido",
                description: "Ocurrió un error inesperado",
              },
              network: {
                title: "Error de red",
                description: "Incapaz de conectarse al servidor",
              },
              unsavedChanges: {
                title: "Cambios sin guardar",
                description: "Tienes cambios sin guardar",
              },
              conflict: {
                title: "Conflicto de retretes",
                description:
                  "No se puede reintentar trabajo que actualmente está procesando",
              },
            },
            success: {
              title: "Operación completada",
              description: "Trabajo de importación retrigado con éxito",
            },
          },
          widget: {
            title: "Retry Import Job",
            successMessage: "Retromisión de empleo iniciada con éxito",
          },
        },
        stop: {
          category: "Importación de datos",
          tags: {
            leads: "Contactos",
            management: "Gestión",
          },

          post: {
            title: "Dejar de importar trabajo",
            description: "Dejar un trabajo de importación en funcionamiento",
            jobId: {
              label: "Job ID",
              description:
                "Unico identificador para el trabajo de importación para detener",
            },
            form: {
              title: "Dejar de importar trabajo",
              description: "Parar el trabajo de importación en funcionamiento",
            },
            response: {
              title: "Stop Result",
              description: "Resultado de la operación de parada",
              success: {
                content: "Situación de éxito",
              },
              message: {
                content: "Alto Mensaje",
              },
            },
            errors: {
              validation: {
                title: "Error de validación",
                description: "El trabajo proporcionado ID es inválido",
              },
              unauthorized: {
                title: "Se requiere autenticación",
                description: "Autenticación necesaria para detener el empleo",
              },
              forbidden: {
                title: "Acceso denegado",
                description: "No tienes permiso para detener este trabajo.",
              },
              notFound: {
                title: "Job no se encontró",
                description:
                  "No hay trabajo de importación encontrado con el ID proporcionado",
              },
              server: {
                title: "Error del servidor",
                description: "Se produjo un error al detener el trabajo",
              },
              unknown: {
                title: "Error desconocido",
                description: "Ocurrió un error inesperado",
              },
              network: {
                title: "Error de red",
                description: "Incapaz de conectarse al servidor",
              },
              unsavedChanges: {
                title: "Cambios sin guardar",
                description: "Tienes cambios sin guardar",
              },
              conflict: {
                title: "Alto conflicto",
                description:
                  "No puede detener el trabajo que no está procesando actualmente",
              },
            },
            success: {
              title: "Operación completada",
              description: "Trabajo de importación detenido con éxito",
            },
          },
          widget: {
            title: "Dejar de importar trabajo",
            successMessage: "Job se detuvo con éxito",
          },
        },
        widget: {
          status: {
            title: "Importación del estado laboral",
            loadingJobStatus: "Carga de estado laboral...",
            totalRows: "Total Rows",
            processed: "Procesado",
            imported: "Importados",
            failed: "Failed",
            duplicates: "Duplicados",
            progress: "Progresos",
            configurationTitle: "Configuración",
            batchSize: "Tamaño del lote",
            batchStart: "Batch Start",
            retries: "Retries",
            timestampsTitle: "Timestamps",
            created: "Creado",
            started: "Comienzo",
            completed: "Completado",
            jobStatus: {
              enums: {
                csvImportJobStatus: {
                  pending: "Pendiente",
                  processing: "Procesamiento",
                  completed: "Completado",
                  failed: "Failed",
                },
              },
            },
          },
          retry: {
            title: "Retry Import Job",
            loadingRetrying: "Retiro de trabajo...",
            successMessage: "Job se retractó exitosamente",
            failureMessage: "Retry Failed",
            viewJobStatus: "Ver el estado del trabajo",
            viewLeads: "View Leads",
          },
          stop: {
            title: "Dejar de importar trabajo",
            loadingStopping: "Dejar de trabajar...",
            successMessage: "Job se detuvo exitosamente",
            failureMessage: "¡Deténganse!",
            viewLeads: "View Leads",
            startNewImport: "Inicio de nueva importación",
          },
        },
      },
    },
    status: {
      category: "Importación de datos",
      tags: {
        import: "Importación",
        jobs: "Trabajos",
        list: "Lista",
      },

      get: {
        title: "Importación del Estado de Empleo",
        description: "Lista y monitorea trabajos de importación CSV",
        form: {
          title: "Filtros de trabajo",
          description:
            "Filtrar trabajos de importación por estado y paginación",
        },
        filters: {
          title: "Filtros",
          description: "Opciones de filtro para trabajos de importación",
        },
        status: {
          label: "Situación laboral",
          description: "Filtro por estado de trabajo",
          placeholder: "Seleccione el estado",
        },
        limit: {
          label: "Resultados por página",
          description: "Número de puestos de trabajo para regresar",
          placeholder: "50",
        },
        offset: {
          label: "Page Offset",
          description: "Número de empleos para saltar",
          placeholder: "0",
        },
        response: {
          title: "Importación de empleos",
          description:
            "Lista de trabajos de importación con su situación actual",
          items: {
            title: "Jobs List",
          },
        },
        errors: {
          validation: {
            title: "Error de validación",
            description: "Parámetros de filtro inválidos",
          },
          unauthorized: {
            title: "Se requiere autenticación",
            description:
              "Autenticación necesaria para ver los trabajos de importación",
          },
          forbidden: {
            title: "Acceso denegado",
            description: "Acceso prohibido para trabajos de importación",
          },
          notFound: {
            title: "No encontrado",
            description: "No hay puestos de importación encontrados",
          },
          server: {
            title: "Error del servidor",
            description: "Error del servidor interno mientras busca trabajo",
          },
          unknown: {
            title: "Error desconocido",
            description: "Ocurrió un error desconocido",
          },
          network: {
            title: "Error de red",
            description: "Error de red mientras busca trabajo",
          },
          unsavedChanges: {
            title: "Cambios sin guardar",
            description: "Hay cambios sin salvar",
          },
          conflict: {
            title: "Conflicto",
            description: "Hay un conflicto entre los datos",
          },
        },
        success: {
          title: "Jobs Retrieved",
          description: "Lista de trabajos de importación recuperada con éxito",
        },
      },
      widget: {
        status: {
          pending: "Pendiente",
          running: "Corriendo",
          completed: "Completado",
          failed: "Failed",
          stopped: "Detenido.",
        },
        filter: {
          all: "Todos",
          pending: "Pendiente",
          running: "Corriendo",
          completed: "Completado",
          failed: "Failed",
        },
        progress: {
          rows: "filas",
        },
        job: {
          total: "Total:",
          processed: "Procesado:",
          ok: "OK:",
          fail: "Fail:",
          created: "Creado:",
          done: "Hecho:",
        },
        header: {
          title: "Importación de empleos",
          newImport: "Nueva importancia",
        },
        loading: "Cargando trabajos de importación...",
        empty: {
          title: "No hay puestos de importación encontrados",
          withFilter:
            "Pruebe un filtro diferente o comience una nueva importación.",
          withoutFilter: "Comience su primera importación para verlo aquí.",
          newImport: "Nueva importancia",
        },
      },
    },
    csv: {
      post: {
        title: "Importar datos CSV",
        description:
          "Importar datos de archivos CSV con procesamiento y validación inteligentes",
        form: {
          title: "Configuración de importación CSV",
          description:
            "Configurar la configuración de importación CSV para obtener resultados óptimos",
        },
        fileSection: {
          title: "Cargo de archivos",
          description:
            "Seleccione su archivo CSV y especifique el dominio de destino",
        },
        file: {
          label: "CSV File",
          description: "Seleccione un archivo CSV para cargar (max 10MB)",
          placeholder: "Elija el archivo CSV...",
          helpText:
            "Formato compatible: CSV con valores separados por coma. La primera fila debe contener cabeceras de columna.",
        },
        fileName: {
          label: "Nombre del archivo",
          description: "Nombre para esta importación (para su referencia)",
          placeholder: "por ejemplo, enero 2024 Principales Importación",
        },
        domain: {
          label: "Importar dominio",
          description: "¿Qué tipo de datos estás importando?",
          placeholder: "Seleccione el tipo de datos...",
        },
        processingSection: {
          title: "Opciones de procesamiento",
          description: "Configure cómo deben procesarse sus datos",
        },
        skipDuplicates: {
          label: "Skip Duplicates",
          description: "Skip records with duplicate email addresses",
          helpText: "Recomendado: Evita importar el mismo contacto dos veces",
        },
        updateExisting: {
          label: "Actualización existente",
          description:
            "Actualizar los registros existentes con nuevos datos de CSV",
          helpText:
            "Si no se controla, los registros existentes serán dejados sin cambios",
        },
        useChunkedProcessing: {
          label: "Procesamiento de antecedentes",
          description: "Procesar archivos grandes en el fondo",
          helpText: "Recomendado para archivos con más de 500 registros",
        },
        batchSize: {
          label: "Tamaño del lote",
          description: "Número de registros a procesar inmediatamente",
          placeholder: "100",
          helpText:
            "Los lotes más pequeños son más estables, los lotes más grandes son más rápido",
        },
        defaultsSection: {
          title: "Valores predeterminados (opcional)",
          description:
            "Establecer valores predeterminados para los registros que faltan esta información",
        },
        defaultCountry: {
          label: "País predeterminado",
          description: "País para registros sin ubicación",
          placeholder: "Seleccionar país...",
        },
        defaultLanguage: {
          label: "Idioma predeterminado",
          description: "Idioma para registros sin preferencia de idioma",
          placeholder: "Seleccione el idioma...",
        },
        response: {
          title: "Resultados de importación",
          description: "Resumen de su operación de importación CSV",
          basicResults: {
            title: "Resultados básicos",
            description: "Estadísticas básicas de las importaciones",
          },
          batchId: {
            label: "Batch ID",
          },
          totalRows: {
            label: "Total Rows",
          },
          isChunkedProcessing: {
            label: "Procesamiento de antecedentes",
          },
          jobId: {
            label: "Job ID",
          },
          statistics: {
            title: "Estadísticas de importación",
            description: "Desglose detallado de la operación de importación",
          },
          successfulImports: {
            label: "Importaciones exitosas",
          },
          failedImports: {
            label: "Importaciones fallidas",
          },
          duplicateEmails: {
            label: "Correos electrónicos duplicados",
          },
          processingTimeMs: {
            label: "Tiempo de procesamiento (ms)",
          },
          summary: {
            title: "Resumen de la importación",
            description:
              "Panorama general de los resultados de las importaciones",
          },
          newRecords: {
            label: "New Records",
          },
          updatedRecords: {
            label: "Registros actualizados",
          },
          skippedDuplicates: {
            label: "Duplicados",
          },
          errors: {
            title: "Detalles del error",
            row: {
              label: "Fila",
            },
            email: {
              label: "Correo electrónico",
            },
            error: {
              label: "Error",
            },
          },
          nextSteps: {
            title: "Siguientes pasos",
            item: {
              label: "Siguiente paso",
            },
          },
        },
        errors: {
          validation: {
            title: "Datos de importación inválidos",
            description: "Por favor, compruebe su archivo CSV y los ajustes",
            emptyFile: "El contenido de archivo CSV es necesario",
            emptyFileName: "Proporcione un nombre para esta importación",
            invalidDomain: "Seleccione un dominio de importación válido",
            invalidBatchSize: "El tamaño del lote debe ser entre 10 y 1000",
            fileTooLarge:
              "El tamaño del archivo supera el límite de 10MB. Considere usar el procesamiento de antecedentes.",
          },
          unauthorized: {
            title: "Acceso denegado",
            description: "Usted no tiene permiso para importar datos",
          },
          fileTooLarge: {
            title: "El archivo demasiado grande",
            description:
              "El archivo seleccionado supera el límite de tamaño máximo de 10MB",
          },
          server: {
            title: "Importación fallada",
            description:
              "Se produjo un error al procesar su importación. Por favor, inténtalo de nuevo.",
          },
          network: {
            title: "Error de red",
            description: "La conexión de red fracasó durante la importación",
          },
          forbidden: {
            title: "Acceso denegado",
            description: "No tienes permiso para realizar esta importación",
          },
          notFound: {
            title: "No encontrado",
            description: "Recursos de importación no encontrados",
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
            title: "Conflicto de datos",
            description: "Se produjo un conflicto con los datos existentes",
          },
        },
        success: {
          title: "Importación exitosa",
          description: "Sus datos CSV han sido importados con éxito",
        },
      },
    },
    enum: {
      status: {
        pending: {
          label: "Pendiente",
          description: "Job está esperando ser procesado",
        },
        processing: {
          label: "Procesamiento",
          description: "Actualmente se está procesando el empleo",
        },
        completed: {
          label: "Completado",
          description: "Job terminó con éxito",
        },
        failed: {
          label: "Failed",
          description: "Job encontró un error",
        },
        cancelled: {
          label: "Cancelada",
          description: "Job fue cancelado por el usuario",
        },
        paused: {
          label: "Pausa",
          description: "El procesamiento de trabajo se pausa temporalmente",
        },
      },
      domain: {
        leads: {
          label: "Contactos",
          description: "Clientes potenciales y contactos comerciales",
        },
        contacts: {
          label: "Contactos",
          description: "Información general de contacto y libro de direcciones",
        },
        businessData: {
          label: "Datos empresariales",
          description: "Información de la empresa y perfiles de negocios",
        },
        emails: {
          label: "Listas de correo electrónico",
          description: "Listas y campañas de marketing por email",
        },
        users: {
          label: "Usuarios",
          description: "Usuarios del sistema e información de la cuenta",
        },
        templates: {
          label: "Plantillas",
          description: "Plantillas de correo electrónico y contenido",
        },
      },
      format: {
        csv: {
          label: "CSV File",
          description: "Valores separados por los comma (más comunes)",
        },
        xlsx: {
          label: "Excel File",
          description: "hoja de cálculo Microsoft Excel",
        },
        json: {
          label: "JSON File",
          description: "Datos de notación de objetos JavaScript",
        },
        tsv: {
          label: "TSV File",
          description: "Valores separados por pestañas",
        },
      },
      processing: {
        immediate: {
          label: "Proceso Ahora",
          description: "Procesar el archivo inmediatamente (rápido)",
        },
        background: {
          label: "Antecedentes",
          description: "Proceso en el fondo (para archivos grandes)",
        },
        scheduled: {
          label: "Horarios más tarde",
          description: "Procesamiento de horario específico",
        },
      },
      errorType: {
        validation: {
          label: "Error de validación",
          description:
            "Los datos no cumplen el formato o las reglas requeridos",
        },
        duplicate: {
          label: "Datos duplicados",
          description: "El registro ya existe en el sistema",
        },
        format: {
          label: "Error de formato",
          description: "El formato de archivo es incorrecto o corrupto",
        },
        processing: {
          label: "Error de procesamiento",
          description: "Se produjo un error durante el procesamiento de datos",
        },
        system: {
          label: "Error de sistema",
          description: "Error del sistema interno",
        },
      },
      batchSize: {
        small: {
          label: "Pequeño (50)",
          description: "Mejor para pruebas o pequeñas importaciones",
        },
        medium: {
          label: "Media (100)",
          description: "Recomendado para la mayoría de las importaciones",
        },
        large: {
          label: "Grandes (250)",
          description: "Bien para archivos grandes con datos simples",
        },
        xlarge: {
          label: "Extra Large (500)",
          description: "Para archivos muy grandes (usuarios avanzados)",
        },
      },
    },
    nextSteps: {
      reviewErrors:
        "Revisa los detalles del error para entender lo que salió mal",
      checkDuplicates: "Considerar ajustes de manipulación duplicados",
      reviewLeads:
        "Revise sus leads importados en la sección de gestión de lideratos",
      startCampaign:
        "Considere comenzar una campaña de correo electrónico con sus nuevos clientes",
      reviewContacts:
        "Revise sus contactos importados en la sección de contactos",
      organizeContacts: "Organiza tus contactos en grupos o etiquetas",
      reviewImported: "Revise sus datos importados en la sección pertinente",
      monitorProgress: "Supervisar el progreso en la historia laboral",
      checkJobsList:
        "Consultar la lista de empleos para actualizaciones detalladas de estado",
    },
    errors: {
      cancel: {
        server: "No cancelar el trabajo de importación",
      },
      retry: {
        server: "Failed to retry import job",
      },
      delete: {
        server: "Fallado para eliminar el empleo de importación",
      },
      status: {
        server: "Fallado para obtener el estado de trabajo",
      },
    },
    error: {
      default: "Se produjo un error",
    },
    enums: {
      csvImportJobStatus: {
        pending: "Pendiente",
        processing: "Procesamiento",
        completed: "Completado",
        failed: "Failed",
      },
      csvImportJobAction: {
        retry: "Retrocedimiento",
        delete: "Eliminar",
        stop: "Para.",
      },
      importMode: {
        createOnly: "Crear sólo",
        updateOnly: "Sólo actualización",
        createOrUpdate: "Crear o actualizar",
        skipDuplicates: "Skip Duplicates",
      },
      importFormat: {
        csv: "CSV",
        tsv: "TSV",
        json: "JSON",
      },
      importProcessingType: {
        immediate: "Inmediatamente",
        chunked: "Chunked",
        scheduled: "Programado",
      },
      importErrorType: {
        validationError: "Error de validación",
        duplicateEmail: "Correo electrónico Duplicado",
        invalidFormat: "Formato inválido",
        missingRequiredField: "Falta de campo obligatorio",
        processingError: "Error de procesamiento",
        systemError: "Error de sistema",
      },
      batchProcessingStatus: {
        pending: "Pendiente",
        processing: "Procesamiento",
        completed: "Completado",
        failed: "Failed",
        retrying: "Retiro",
      },
      importPriority: {
        low: "Baja",
        normal: "Normal",
        high: "Alto",
        urgent: "Urgente",
      },
      importSource: {
        webUpload: "Subir Web",
        apiUpload: "API Sube",
        scheduledImport: "Importación programada",
        bulkOperation: "Operación a granel",
      },
      csvDelimiter: {
        comma: "Comma",
        semicolon: "Semicolon",
        tab: "Tab",
        pipe: "Pipe",
      },
      importValidationLevel: {
        strict: "Strict",
        moderate: "Moderado",
        lenient: "Lenient",
      },
      importNotificationType: {
        email: "Correo electrónico",
        inApp: "In-App",
        webhook: "Webhook",
        none: "Ninguno",
      },
      leadStatus: {
        new: "Nuevo",
        pending: "Pendiente",
        campaignRunning: "Campaign Running",
        websiteUser: "Sitio web Usuario",
        newsletterSubscriber: "Newsletter Suscríbase",
        inContact: "En contacto",
        signedUp: "Signed Up",
        subscriptionConfirmed: "Suscripción confirmada",
        unsubscribed: "Suscripción cancelada",
        bounced: "Bounced",
        invalid: "Inválidos",
      },
      emailCampaignStage: {
        notStarted: "No empezó",
        initial: "Contacto inicial",
        followup1: "Seguimiento 1",
        followup2: "Seguimiento 2",
        followup3: "Seguimiento 3",
        nurture: "Nutrición",
        reactivation: "Reactivación",
      },
      leadSource: {
        website: "Sitio web",
        socialMedia: "Social Media",
        emailCampaign: "Campaña de correo electrónico",
        referral: "Referidos",
        csvImport: "Importación CSV",
      },
    },
  },
  lead: {
    id: {
      category: "Contactos",
      tags: {
        leads: "Contactos",
        management: "Gestión",
      },

      get: {
        title: "Obtener detalles de contacto",
        description:
          "Recuperar información detallada sobre un contacto específico",
        backButton: {
          label: "Regreso a los contactos",
        },
        editButton: {
          label: "Editar contacto",
        },
        deleteButton: {
          label: "Suprimir el texto",
        },
        id: {
          label: "ID del contacto",
          description: "Unico identificador para el contacto",
        },
        form: {
          title: "Lead Details Request",
          description:
            "Solicitar parámetros para recuperar la información de contacto",
        },
        response: {
          title: "Lead Information",
          description: "Detalles completos del contacto e historia",
          basicInfo: {
            title: "Información básica",
            description:
              "Identificación básica de los principales jefes y situación",
          },
          id: {
            content: "ID del contacto",
          },
          email: {
            content: "Dirección de correo electrónico",
          },
          businessName: {
            content: "Nombre del negocio",
          },
          contactName: {
            content: "Nombre de contacto",
          },
          status: {
            content: "Estado del contacto",
          },
          contactDetails: {
            title: "Datos de contacto",
            description: "Información de contacto y preferencias",
          },
          phone: {
            content: "Número de teléfono",
          },
          website: {
            content: "Sitio web URL",
          },
          country: {
            content: "País",
          },
          language: {
            content: "Idioma",
          },
          campaignTracking: {
            title: "Seguimiento de campañas",
            description:
              "Campaña de correo electrónico e información de seguimiento",
          },
          source: {
            content: "Origen del contacto",
          },
          currentCampaignStage: {
            content: "Estadio de campaña actual",
          },
          emailJourneyVariant: {
            content: "Variedad de viaje por correo electrónico",
          },
          emailsSent: {
            content: "Emails Sent",
          },
          lastEmailSentAt: {
            content: "Último mensaje enviado",
          },
          engagement: {
            title: "Metrices de compromiso",
            description:
              "Datos de compromiso e interacción por correo electrónico",
          },
          emailsOpened: {
            content: "Correos electrónicos abiertos",
          },
          emailsClicked: {
            content: "Emails Clicked",
          },
          lastEngagementAt: {
            content: "Último compromiso",
          },
          unsubscribedAt: {
            content: "Suscritas en",
          },
          conversion: {
            title: "Seguimiento de la conversión",
            description: "Conversión de contacto y seguimiento de hitos",
          },
          convertedUserId: {
            content: "Usuario convertido ID",
          },
          convertedAt: {
            content: "Convertirse en",
          },
          signedUpAt: {
            content: "Se registró en",
          },
          subscriptionConfirmedAt: {
            content: "Suscripción confirmada a",
          },
          metadata: {
            title: "Información adicional",
            description: "Notas y metadatos",
            content: "Metadatos",
          },
          notes: {
            content: "Notas",
          },
          createdAt: {
            content: "Creado en",
          },
          updatedAt: {
            content: "Actualizado en",
          },
          identity: {
            title: "Dispositivo &quot; identidad &quot;",
            description:
              "Seguimiento de la identidad y la información del dispositivo",
          },
          ipAddress: {
            content: "Dirección de IP",
          },
          userAgent: {
            content: "Agente de usuario",
          },
          deviceType: {
            content: "Tipo de dispositivo",
          },
          browser: {
            content: "Navegador",
          },
          os: {
            content: "Sistema operativo",
          },
          referralCode: {
            content: "Código de referido",
          },
          lifecycle: {
            title: "Lifecycle",
            description: "Horarios adicionales del ciclo de vida",
          },
          bouncedAt: {
            content: "Bounced At",
          },
          invalidAt: {
            content: "Inválido",
          },
          campaignStartedAt: {
            content: "Campaña iniciada",
          },
          linkedLeads: {
            title: "Líderes vinculados",
            description: "Principales identificados como la misma persona",
            linkedLeadId: {
              content: "Linked Lead ID",
            },
            linkReason: {
              content: "Razón de enlace",
            },
            linkedAt: {
              content: "Enlaces a",
            },
            email: {
              content: "Correo electrónico",
            },
            businessName: {
              content: "Nombre del negocio",
            },
            status: {
              content: "Situación",
            },
            ipAddress: {
              content: "Dirección de IP",
            },
            userAgent: {
              content: "Agente de usuario",
            },
            createdAt: {
              content: "Creado en",
            },
          },
          linkedUsers: {
            title: "Cuentas de usuario vinculadas",
            description: "Cuentas de usuario asociadas con este contacto",
            userId: {
              content: "Usuario ID",
            },
            linkReason: {
              content: "Razón de enlace",
            },
            linkedAt: {
              content: "Enlaces a",
            },
            email: {
              content: "Correo electrónico",
            },
            publicName: {
              content: "Nombre de pantalla",
            },
          },
          referralHistory: {
            title: "Historial de referencia",
            description:
              "Códigos de referencia este contacto clicado antes de registrarse",
            code: {
              content: "Código de referido",
            },
            ownerUserId: {
              content: "Code Owner",
            },
            clickedAt: {
              content: "Seguido en",
            },
          },
        },
        errors: {
          validation: {
            title: "Error de validación",
            description: "El contacto ID proporcionado es inválido",
          },
          unauthorized: {
            title: "Se requiere autenticación",
            description:
              "Autenticación necesaria para acceder a los detalles del contacto",
          },
          forbidden: {
            title: "Acceso denegado",
            description: "No tienes permiso para ver esta pista.",
          },
          notFound: {
            title: "Lead Not Found",
            description: "No se encontró ninguna pista con el ID proporcionado",
          },
          server: {
            title: "Error del servidor",
            description:
              "Se produjo un error al recuperar detalles del contacto",
          },
          unknown: {
            title: "Error desconocido",
            description: "Ocurrió un error inesperado",
          },
          network: {
            title: "Error de red",
            description: "Incapaz de conectarse al servidor",
          },
          unsavedChanges: {
            title: "Cambios sin guardar",
            description: "Tienes cambios sin guardar",
          },
          conflict: {
            title: "Conflicto de datos",
            description: "Los datos principales han sido modificados",
          },
        },
        success: {
          title: "Operación completada",
          description: "Principales detalles recuperados con éxito",
        },
      },
      patch: {
        title: "Actualización Lead",
        description: "Actualizar la información y el estado del contacto",
        backButton: {
          label: "Volver a Lead",
        },
        deleteButton: {
          label: "Suprimir el texto",
        },
        submitButton: {
          label: "Actualización Lead",
          loadingText: "Actualizando a Lead...",
        },
        id: {
          label: "ID del contacto",
          description:
            "Unico identificador para el contacto a la actualización",
        },
        form: {
          title: "Actualización Lead",
          description: "Modificar la información de contacto",
        },
        updates: {
          title: "Actualizaciones principales",
          description: "Campos para actualizar",
        },
        basicInfo: {
          title: "Información básica",
          description: "Información actualizada sobre el contacto básico",
        },
        email: {
          label: "Dirección de correo electrónico",
          description: "Dirección de correo electrónico de Lead",
          placeholder: "email@example.com",
        },
        businessName: {
          label: "Nombre del negocio",
          description: "Nombre del negocio",
          placeholder: "Acme Corporation",
        },
        contactName: {
          label: "Nombre de contacto",
          description: "Persona de contacto principal",
          placeholder: "John Doe",
        },
        status: {
          label: "Estado del contacto",
          description: "Situación actual de la dirección",
          placeholder: "Seleccione el estado",
        },
        contactDetails: {
          title: "Datos de contacto",
          description: "Información de contacto actualizada",
        },
        phone: {
          label: "Número de teléfono",
          description: "Número de teléfono",
          placeholder: "+1234567890",
        },
        website: {
          label: "Sitio web",
          description: "Sitio web de negocios URL",
          placeholder: "https://example.com",
        },
        country: {
          label: "País",
          description: "País de negocios",
          placeholder: "Seleccionar país",
        },
        language: {
          label: "Idioma",
          description: "Idioma preferido",
          placeholder: "Seleccionar idioma",
        },
        campaignManagement: {
          title: "Gestión de campañas",
          description: "Gestionar la configuración de campaña",
        },
        source: {
          label: "Origen del contacto",
          description: "Origen del contacto",
          placeholder: "Seleccionar fuente",
        },
        currentCampaignStage: {
          label: "Etapa de campaña",
          description: "Etapa actual de la campaña de email",
          placeholder: "Seleccionar etapa",
        },
        additionalDetails: {
          title: "Detalles adicionales",
          description: "Notas y metadatos",
        },
        notes: {
          label: "Notas",
          description: "Notas internas sobre el contacto",
          placeholder: "Añadir notas aquí",
        },
        metadata: {
          label: "Metadatos",
          description: "Metadatos adicionales (JSON)",
          placeholder: '{"key": "value"}',
        },
        convertedUserId: {
          label: "Usuario convertido ID",
          description: "ID de la cuenta de usuario convertido",
          placeholder: "Usuario ID",
        },
        subscriptionConfirmedAt: {
          label: "Suscripción confirmada a",
          description: "Fecha en que se confirmó la suscripción",
          placeholder: "Selecciona una fecha",
        },
        response: {
          title: "Lead actualizado",
          description: "Información actualizada sobre el contacto",
          basicInfo: {
            title: "Información básica",
            description: "Información actualizada sobre el contacto básico",
          },
          id: {
            content: "ID del contacto",
          },
          email: {
            content: "Dirección de correo electrónico",
          },
          businessName: {
            content: "Nombre del negocio",
          },
          contactName: {
            content: "Nombre de contacto",
          },
          status: {
            content: "Estado del contacto",
          },
          contactDetails: {
            title: "Datos de contacto",
            description: "Información actualizada de contacto",
          },
          phone: {
            content: "Número de teléfono",
          },
          website: {
            content: "Sitio web URL",
          },
          country: {
            content: "País",
          },
          language: {
            content: "Idioma",
          },
          campaignTracking: {
            title: "Seguimiento de campañas",
            description: "Información actualizada sobre la campaña",
          },
          source: {
            content: "Origen del contacto",
          },
          currentCampaignStage: {
            content: "Estadio de campaña actual",
          },
          emailJourneyVariant: {
            content: "Variedad de viaje por correo electrónico",
          },
          emailsSent: {
            content: "Emails Sent",
          },
          lastEmailSentAt: {
            content: "Último mensaje enviado",
          },
          engagement: {
            title: "Metrices de compromiso",
            description: "Datos de compromiso por correo electrónico",
          },
          emailsOpened: {
            content: "Correos electrónicos abiertos",
          },
          emailsClicked: {
            content: "Emails Clicked",
          },
          lastEngagementAt: {
            content: "Último compromiso",
          },
          unsubscribedAt: {
            content: "Suscritas en",
          },
          conversion: {
            title: "Seguimiento de la conversión",
            description: "Seguimiento de los hitos de conversión",
          },
          convertedUserId: {
            content: "Usuario convertido ID",
          },
          convertedAt: {
            content: "Convertirse en",
          },
          signedUpAt: {
            content: "Se registró en",
          },
          subscriptionConfirmedAt: {
            content: "Suscripción confirmada a",
          },
          metadata: {
            title: "Información adicional",
            description: "Notas y metadatos",
            content: "Metadatos",
          },
          notes: {
            content: "Notas",
          },
          createdAt: {
            content: "Creado en",
          },
          updatedAt: {
            content: "Actualizado en",
          },
        },
        errors: {
          validation: {
            title: "Error de validación",
            description: "Los datos proporcionados son inválidos",
          },
          unauthorized: {
            title: "Se requiere autenticación",
            description: "Autenticación necesaria para actualizar los cables",
          },
          forbidden: {
            title: "Acceso denegado",
            description: "No tienes permiso para actualizar esta pista.",
          },
          notFound: {
            title: "Lead Not Found",
            description: "No se encontró ninguna pista con el ID proporcionado",
          },
          conflict: {
            title: "Actualización de conflictos",
            description: "El contacto fue modificado por otro usuario",
          },
          server: {
            title: "Error del servidor",
            description: "Se produjo un error al actualizar el contacto",
          },
          unknown: {
            title: "Error desconocido",
            description: "Ocurrió un error inesperado",
          },
          network: {
            title: "Error de red",
            description: "Incapaz de conectarse al servidor",
          },
          unsavedChanges: {
            title: "Cambios sin guardar",
            description: "Tienes cambios sin guardar",
          },
        },
        success: {
          title: "Operación completada",
          description: "Lead updated successfully",
        },
      },
      post: {
        title: "[id]",
        description: "[id] endpoint",
        form: {
          title: "[id] Configuración",
          description: "Configurar los parámetros [id]",
        },
        response: {
          title: "Respuesta",
          description: "[id] response data",
        },
        errors: {
          unauthorized: {
            title: "Se requiere autenticación",
            description: "Inicia sesión para continuar",
          },
          validation: {
            title: "Error de validación",
            description: "Parámetros de solicitud no válidos",
          },
          server: {
            title: "Error del servidor",
            description: "Ocurrió un error interno del servidor",
          },
          unknown: {
            title: "Error desconocido",
            description: "Ocurrió un error desconocido",
          },
          network: {
            title: "Error de red",
            description: "Ocurrió un error de red",
          },
          forbidden: {
            title: "Acceso denegado",
            description: "No tienes acceso",
          },
          notFound: {
            title: "No encontrado",
            description: "No se encontró el recurso",
          },
          conflict: {
            title: "Conflicto",
            description: "Hay un conflicto entre los datos",
          },
        },
        success: {
          title: "Operación completada",
          description: "La operación se completó correctamente",
        },
      },
      enums: {
        leadStatus: {
          new: "Nuevo",
          pending: "Pendiente",
          campaignRunning: "Campaign Running",
          websiteUser: "Sitio web Usuario",
          newsletterSubscriber: "Newsletter Suscríbase",
          inContact: "En contacto",
          signedUp: "Signed Up",
          subscriptionConfirmed: "Suscripción confirmada",
          unsubscribed: "Suscripción cancelada",
          bounced: "Bounced",
          invalid: "Inválidos",
        },
        leadSource: {
          website: "Sitio web",
          referral: "Referidos",
          socialMedia: "Social Media",
          emailCampaign: "Campaña de correo electrónico",
          csvImport: "Importación CSV",
          api: "API",
          manual: "Manual",
          other: "Otro",
        },
        emailCampaignStage: {
          notStarted: "No empezó",
          initial: "Contacto inicial",
          followup1: "Seguimiento 1",
          followup2: "Seguimiento 2",
          followup3: "Seguimiento 3",
          nurture: "Nutrición",
          reactivation: "Reactivación",
        },
        emailJourneyVariant: {
          uncensoredConvert: "Conversión a modelos sin censura",
          sideHustle: "Hustle lateral",
          quietRecommendation: "Recomendación silenciosa",
        },
      },
      widget: {
        loading: "Carga de contacto...",
        notFound: "El contacto no se encontró.",
        back: "Atrás",
        leadFallbackTitle: "Prospecto",
        edit: "Editar",
        delete: "Eliminar",
        converted: "Conversión",
        quickActions: "Medidas rápidas",
        editLead: "Editar contacto",
        sendTestEmail: "Enviar prueba de email",
        viewInSearch: "View in Search",
        userProfile: "Perfil de usuario",
        userDetail: "Detalle de usuario",
        creditHistory: "Historia del crédito",
        campaignFunnel: "Embudo de campaña",
        sourceLabel: "Fuente:",
        lastEmailLabel: "Último correo electrónico:",
        campaignPerformance: "Ejecución de la campaña",
        emailsSent: "Emails Sent",
        opened: "Abierto",
        clicked: "Seguido",
        openRate: "Tasa abierta",
        clickRate: "Tasa de clic",
        clickToOpenRate: "Tasa de clic a abrir",
        contactDetails: "Datos de contacto",
        country: "País",
        language: "Idioma",
        engagement: "Engagement",
        emailsOpened: "Correos electrónicos abiertos",
        emailsClicked: "Emails Clicked",
        lastEngagement: "Último compromiso",
        unsubscribed: "Suscripción cancelada",
        conversion: "Conversión",
        signedUp: "Signed Up",
        convertedAt: "Convertirse en",
        subscriptionConfirmed: "Suscripción confirmada",
        convertedUserId: "Usuario convertido ID",
        activeSubscriberSince: "Suscriptor activo desde",
        viewUserProfile: "Ver perfil de usuario",
        viewUserDetail: "Ver detalle de usuario",
        notesAndMetadata: "Notas &quot; Metadatos &quot;",
        notes: "Notas",
        metadata: "Metadatos",
        created: "Creado",
        lastUpdated: "Última actualización",
        daysOld: "días",
        lastEngaged: "Último compromiso",
        ago: "hace mucho tiempo.",
        variant: "Variante:",
        copyEmail: "correo electrónico",
        copyId: "ID",
        copyPhone: "teléfono",
        copyUserId: "usuario ID",
        stageNotStarted: "No empezó",
        stageInitial: "Inicial",
        stageFollowup1: "Seguimiento 1",
        stageFollowup2: "Seguimiento 2",
        stageFollowup3: "Seguimiento 3",
        stageNurture: "Nutrición",
        stageReactivation: "Reactivación",
        tabOverview: "Sinopsis",
        tabDetails: "Detalles",
        tabIdentity: "Identidad",
        tabBasic: "Básica",
        tabCampaign: "Campaña",
        tabAdvanced: "Avances",
        deviceIdentity: "Dispositivo &quot; identidad &quot;",
        ipAddress: "Dirección de IP",
        userAgent: "Agente de usuario",
        deviceType: "Tipo de dispositivo",
        browser: "Navegador",
        os: "Sistema operativo",
        referralCode: "Código de referido",
        lifecycleTimestamps: "Lifecycle",
        bouncedAt: "Bounced At",
        invalidAt: "Inválido",
        campaignStartedAt: "Campaña iniciada",
        linkedLeadsSection: "Líderes vinculados",
        linkedLeadsEmpty: "No hay cables conectados",
        linkedUsersSection: "Cuentas de usuario vinculadas",
        linkedUsersEmpty: "No hay cuentas de usuario vinculadas",
        linkReason: "Razón de enlace:",
        linkedAt: "Vinculado a:",
        copyIp: "IP",
        copyLinkedLeadId: "contacto ID",
        copyUserId2: "usuario ID",
      },
      delete: {
        title: "Suprimir el texto",
        description: "Suprimir una ventaja del sistema",
        container: {
          title: "Suprimir el texto",
          description:
            "¿Estás seguro de que quieres eliminar permanentemente esta pista?",
        },
        backButton: {
          label: "Volver a Lead",
        },
        submitButton: {
          label: "Suprimir el texto",
          loadingText: "Eliminando a Lead...",
        },
        actions: {
          delete: "Suprimir el texto",
          deleting: "Eliminando a Lead...",
        },
        id: {
          label: "ID del contacto",
          description: "Identificador único para el contacto para eliminar",
        },
        errors: {
          validation: {
            title: "Error de validación",
            description: "El contacto ID proporcionado es inválido",
          },
          unauthorized: {
            title: "Se requiere autenticación",
            description: "Autenticación necesaria para eliminar los cables",
          },
          forbidden: {
            title: "Acceso denegado",
            description: "Usted no tiene permiso para eliminar esta pista",
          },
          notFound: {
            title: "Lead Not Found",
            description: "No se encontró ninguna pista con el ID proporcionado",
          },
          conflict: {
            title: "Suprímase el conflicto",
            description:
              "El contacto no puede suprimirse debido a las dependencias existentes",
          },
          server: {
            title: "Error del servidor",
            description: "Se produjo un error al eliminar el contacto",
          },
          unknown: {
            title: "Error desconocido",
            description: "Ocurrió un error inesperado",
          },
          network: {
            title: "Error de red",
            description: "Incapaz de conectarse al servidor",
          },
          unsavedChanges: {
            title: "Cambios sin guardar",
            description: "Tienes cambios sin guardar",
          },
        },
        success: {
          title: "Liderazgo suprimido",
          description: "El contacto se ha eliminado con éxito",
        },
      },
    },
  },
  list: {
    category: "Contactos",
    tags: {
      leads: "Contactos",
      management: "Gestión",
    },

    get: {
      title: "Líderes de lista",
      description: "Recuperar una lista de pistas con filtro",
      createButton: {
        label: "Crear contacto",
      },
      form: {
        title: "Filtros de lista de contacto",
        description: "Configurar filtros para lista de contacto",
      },
      actions: {
        refresh: "Actualizar",
        refreshing: "Refrescante...",
      },
      page: {
        label: "Número de página",
        description: "Número de página para la paginación",
        placeholder: "Introduzca el número de página",
      },
      limit: {
        label: "Resultados por página",
        description: "Número de resultados para mostrar por página",
        placeholder: "Ingrese el límite",
      },
      status: {
        label: "Estado del contacto",
        description: "Filtro por estado de contacto",
        placeholder: "Seleccione el estado",
      },
      currentCampaignStage: {
        label: "Etapa de campaña",
        description: "Filtro por fase de campaña actual",
        placeholder: "Seleccionar la etapa de campaña",
      },
      source: {
        label: "Origen del contacto",
        description: "Filtro por fuente de contacto",
        placeholder: "Seleccionar fuente",
      },
      country: {
        label: "País",
        description: "Filtro por país",
        placeholder: "Seleccionar países",
      },
      language: {
        label: "Idioma",
        description: "Filtro por idioma",
        placeholder: "Seleccionar idiomas",
      },
      search: {
        label: "Buscar",
        description: "Buscar guías por nombre, correo electrónico o negocio",
        placeholder: "Introduzca el término de búsqueda",
      },
      searchPagination: {
        title: "Búsqueda &quot; Paginación &quot;",
        description: "Controles de búsqueda y paginación",
      },
      statusFilters: {
        title: "Estado &quot; Filtros de campaña",
        description: "Filtro por estado, etapa de campaña y fuente",
      },
      locationFilters: {
        title: "Filtros de ubicación",
        description: "Filtro por país e idioma",
      },
      sortingOptions: {
        title: "Opciones de clasificación",
        description: "Configurar la clasificación de resultados",
      },
      sortBy: {
        label: "Ordenar por",
        description: "Campo para clasificar los resultados por",
        placeholder: "Seleccionar campo de tipo",
      },
      sortOrder: {
        label: "Ordenar orden",
        description: "Ordenar por resultados",
        placeholder: "Seleccione el orden",
      },
      response: {
        title: "Respuesta de la lista principal",
        description: "Listado de cables con metadatos",
        leads: {
          title: "Detalles del contacto",
          description: "Información individual sobre el contacto",
          id: "ID del contacto",
          email: "Dirección de correo electrónico",
          businessName: "Nombre del negocio",
          contactName: "Nombre de contacto",
          phone: "Número de teléfono",
          website: "Sitio web",
          country: "País",
          language: "Idioma",
          status: "Situación",
          source: "Fuente",
          notes: "Notas",
          convertedUserId: "Usuario convertido ID",
          convertedAt: "Convertirse en",
          signedUpAt: "Se registró en",
          subscriptionConfirmedAt: "Suscripción confirmada a",
          currentCampaignStage: "Estadio de campaña actual",
          emailsSent: "Emails Sent",
          lastEmailSentAt: "Último correo electrónico enviado en",
          unsubscribedAt: "Suscritas en",
          emailsOpened: "Correos electrónicos abiertos",
          emailsClicked: "Emails Clicked",
          lastEngagementAt: "Último compromiso en",
          metadata: "Metadatos",
          createdAt: "Creado en",
          updatedAt: "Actualizado en",
        },
        total: "Total de productos básicos",
        page: "Página actual",
        limit: "Tamaño de página",
        totalPages: "Total de páginas",
      },
      errors: {
        unauthorized: {
          title: "Se requiere autenticación",
          description: "Autenticación requerida para listar los leads",
        },
        validation: {
          title: "Error de validación",
          description: "Parámetros de filtro inválidos",
        },
        server: {
          title: "Error del servidor",
          description:
            "Error del servidor interno ocurrió mientras que las pistas de búsqueda",
        },
        unknown: {
          title: "Error desconocido",
          description:
            "Se produjo un error desconocido mientras se traían pistas",
        },
        network: {
          title: "Error de red",
          description:
            "Se produjo error de red mientras que las pistas de búsqueda",
        },
        forbidden: {
          title: "Acceso denegado",
          description: "Acceso prohibido para lista de contacto",
        },
        notFound: {
          title: "No encontrado",
          description: "Líderes no encontrados",
        },
        conflict: {
          title: "Conflicto",
          description:
            "Conflicto de datos ocurrió mientras se capturan los contactos",
        },
        unsavedChanges: {
          title: "Cambios sin guardar",
          description: "Hay cambios insalvados en la lista principal",
        },
      },
      success: {
        title: "Operación completada",
        description: "Lista de contacto recuperada con éxito",
      },
      emptySearch: "No hay pistas que coincidan con sus filtros",
      emptyState: "Aún no hay pistas.",
    },
    widget: {
      converted: "Conversión",
      emailsSent: "Correos electrónicos {{count}} enviados",
      openRate: "Tasa de apertura {{percent}} %",
      clicks: "{{count}} hace clic",
      stats: "Stats",
      graphs: "Gráficos",
      search: "Buscar",
      export: "Exportación",
      import: "Importación",
      batch: "Batch",
      refresh: "Actualizar",
      view: "Vista",
      edit: "Editar",
      delete: "Eliminar",
      allSources: "Todas las fuentes",
      clearSearch: "Búsqueda clara",
      clearStatusFilter: "Filtro de estado claro",
      clearSourceFilter: "Filtro de fuente clara",
      addLead: "Añadir el contacto",
      importCsv: "Importe CSV",
      pagination: "Página {{page}} de {{totalPages}} · Líderes {{total}}",
      tabAll: "Todos",
      tabNew: "Nuevo",
      tabCampaign: "Campaña",
      tabConfirmed: "Confirmado",
      tabUnsubscribed: "Suscripción cancelada",
      tabBounced: "Bounced",
      sortNewest: "Más reciente primero",
      sortOldest: "Más antiguo primero",
      sortEmailsSentHigh: "Correos electrónicos enviados (alto)",
      sortEmailsSentLow: "Correos electrónicos enviados (bajo)",
      sortBusinessNameAZ: "Nombre de empresa (A-Z)",
      sortBusinessNameZA: "Nombre de empresa (Z-A)",
      linkedCount: "{{count}} linked",
      hasLinkedUser: "Usuario",
      referralCode: "Código de referencia",
    },
  },
  search: {
    category: "Gestión de contactos",
    tags: {
      leads: "Contactos",
      search: "Buscar",
    },
    get: {
      title: "Búsqueda de contactos",
      description: "Búsqueda conduce con filtrado y paginación",
      form: {
        title: "Formulario de búsqueda principal",
        description: "Introduzca criterios de búsqueda para encontrar leads",
      },
      search: {
        label: "Búsqueda",
        description:
          "Términos de búsqueda para filtrar leads por correo electrónico, nombre de negocio o notas",
        placeholder: "Ingrese el término de búsqueda...",
      },
      status: {
        label: "Filtro de estado",
        description: "Filtros por estado",
      },
      limit: {
        label: "Límite de resultados",
        description: "Número máximo de resultados a la vuelta (1-100)",
      },
      offset: {
        label: "Resultados Offset",
        description: "Número de resultados para saltar para paginación",
      },
      response: {
        title: "Resultados de búsqueda",
        description: "Resultados de búsqueda con datos de contacto",
        leads: {
          title: "Contactos",
          item: "Prospecto",
        },
        total: "Total de resultados",
        hasMore: "Tiene más resultados",
      },
      errors: {
        unauthorized: {
          title: "Se requiere autenticación",
          description: "Autenticación necesaria para buscar los leads",
        },
        validation: {
          title: "Error de validación",
          description: "Parámetros de búsqueda inválidos proporcionados",
        },
        server: {
          title: "Error del servidor",
          description:
            "Error del servidor interno se produjo mientras que las guías de búsqueda",
        },
        unknown: {
          title: "Error desconocido",
          description:
            "Se produjo un error desconocido mientras se registran las pistas",
        },
        network: {
          title: "Error de red",
          description:
            "Error de la red ocurrió mientras que los guías de búsqueda",
        },
        forbidden: {
          title: "Acceso denegado",
          description: "Acceso prohibido para la búsqueda de contacto",
        },
        notFound: {
          title: "No hay resultados",
          description:
            "No hay pistas encontradas criterios de búsqueda coincidentes",
        },
        unsavedChanges: {
          title: "Cambios sin guardar",
          description: "Hay cambios sin salvar en el formulario de búsqueda",
        },
        conflict: {
          title: "Conflicto",
          description:
            "Conflicto de datos ocurrió mientras se registraban los líderes",
        },
      },
      success: {
        title: "Búsqueda Completa",
        description: "Búsqueda de contacto completada con éxito",
      },
    },
    widget: {
      title: "Búsqueda de contactos",
      filterLabel: "Filtro:",
      clearFilter: "Limpiar",
      noResultsTitle: "No se encontraron resultados",
      noResultsSubtitle:
        "Búsqueda por correo electrónico, nombre de empresa o teléfono",
      createLead: "Crear contacto",
      noLeadsMatchFilter:
        "No hay pistas que coincidan con los filtros seleccionados.",
      clearFilters: "Filtros claros",
      loadMore: "Carga más",
      openRateSuffix: "% abierto",
      noEmails: "no emails",
      converted: "Conversión",
      emailsSentSuffix: "enviado",
      copyEmailTitle: "Copiar correo electrónico",
      editLeadTitle: "Editar el contacto",
      deleteLeadTitle: "Suprímase el contacto",
      statusNew: "Nuevo",
      statusPending: "Pendiente",
      statusCampaign: "Campaña",
      statusWebUser: "Web User",
      statusNewsletter: "Boletín",
      statusInContact: "En contacto",
      statusSignedUp: "Signed Up",
      statusSubscribed: "Suscrito",
      statusUnsub: "Unsub",
      statusBounced: "Bounced",
      statusInvalid: "Inválidos",
    },
  },
  stats: {
    title: "Principales estadísticas",
    description: "Estadísticas y análisis completos con datos históricos",
    category: "Gestión de contactos",
    tags: {
      leads: "Contactos",
      statistics: "Estadísticas",
      analytics: "Analítica",
    },
    container: {
      title: "Filtros estadísticos",
      description:
        "Configura tus filtros de estadísticas principales y opciones de visualización",
    },
    refresh: "Actualizar",
    sections: {
      timeFilters: "Período de tiempo &amp; Rango de fecha",
      comparison: "Ajustes de comparación",
      leadFilters: "Filtros de contactos",
      engagement: "Filtros de compromiso",
      conversion: "Filtros de conversión",
      dataCompleteness: "Completación de datos",
      additional: "Filtros adicionales",
      searchSort: "Buscar &quot; Ordenar &quot;",
    },
    timePeriod: {
      label: "Período de tiempo",
      description:
        "Seleccione el período de tiempo para las estadísticas agregadas",
      hour: "Hora",
      day: "Día",
      week: "Semana",
      month: "Mes",
      quarter: "Trimestre",
      year: "Año",
    },
    dateRangePreset: {
      label: "Date Range Preset",
      description: "Elija un rango de fecha predefinido",
    },
    dateRange: {
      today: "Hoy",
      yesterday: "Ayer",
      last7Days: "Últimos 7 días",
      last30Days: "Últimos 30 días",
      last90Days: "Los últimos 90 días",
      thisWeek: "Esta semana",
      lastWeek: "La semana pasada",
      thisMonth: "Este mes",
      lastMonth: "El último mes",
      thisQuarter: "Este trimestre",
      lastQuarter: "Último trimestre",
      thisYear: "Este año",
      lastYear: "Último año",
      custom: "Rango personalizado",
    },
    dateFrom: {
      label: "Fecha de inicio",
      description: "Fecha inicial de las estadísticas",
    },
    dateTo: {
      label: "Fecha final",
      description: "Fecha límite de las estadísticas",
    },
    chartType: {
      label: "Tipo de carga",
      description:
        "Seleccione el tipo de gráfico para la visualización de datos",
      line: "Gráfico de línea",
      bar: "Bar Chart",
      area: "Area Chart",
      pie: "Pie Chart",
      donut: "Donut Chart",
    },
    includeComparison: {
      label: "Incluir la comparación",
      description: "Comparar con un período anterior",
    },
    comparisonPeriod: {
      label: "Período de comparación",
      description: "Seleccione el período de comparación",
    },
    status: {
      label: "Estado del contacto",
      description: "Filtro por estado de contacto",
    },
    source: {
      label: "Origen del contacto",
      description: "Filtro por fuente de contacto",
    },
    country: {
      ...regionalCountryNames("es"),
      label: "País",
      description: "Filtro por país",
      all: "Todos los países",
      de: "Alemania",
      pl: "Polonia",
      fr: "Francia",
      global: "Global",
    },
    language: {
      it: "Italiano",
      es: "Español",
      sk: "Eslovaco",
      label: "Idioma",
      description: "Filtro por preferencia de idioma",
      all: "Idiomas",
      en: "Inglés",
      de: "Alemán",
      pl: "Polaco",
      fr: "Francés",
    },
    campaignStage: {
      label: "Etapa de campaña",
      description: "Filtrar por el escenario de la campaña de email",
    },
    hasEngagement: {
      label: "Has Engagement",
      description: "Filtros con cualquier compromiso de correo electrónico",
    },
    minEmailsOpened: {
      label: "Correos electrónicos mínimos Abiertos",
      description: "Número mínimo de correos electrónicos abiertos",
    },
    minEmailsClicked: {
      label: "Correos electrónicos mínimos Clicked",
      description: "Número mínimo de correos electrónicos pulsados",
    },
    isConverted: {
      label: "Is Converted",
      description: "Filtro convertidos",
    },
    hasSignedUp: {
      label: "Se ha registrado",
      description: "Filtros que han firmado",
    },
    hasConfirmedSubscription: {
      label: "Ha confirmado suscripción",
      description: "Filtros con suscripción confirmada",
    },
    hasBusinessName: {
      label: "Tiene nombre de negocio",
      description: "Filtros con nombre de negocio",
    },
    hasContactName: {
      label: "Tiene nombre de contacto",
      description: "Filtros con nombre de contacto",
    },
    hasPhone: {
      label: "Tiene teléfono.",
      description: "Filtros con número de teléfono",
    },
    hasWebsite: {
      label: "Tiene sitio web",
      description: "Filtros con sitio web",
    },
    hasNotes: {
      label: "Has Notes",
      description: "Filtros con notas",
    },
    sortBy: {
      label: "Ordenar por",
      description: "Campo para clasificar los resultados por",
    },
    sortOrder: {
      label: "Ordenar orden",
      description: "Orden ascendente o descendente",
    },
    limit: {
      label: "Límite de resultados",
      description: "Número máximo de resultados",
    },
    hasUserId: {
      label: "Tiene usuario ID",
      description: "Filtros conduce con el usuario asociado ID",
    },
    emailVerified: {
      label: "Email Verificado",
      description: "Filtro por estado de verificación del email",
    },
    journeyVariant: {
      label: "Variante de viaje",
      description: "Filtro por variante de viaje por correo electrónico",
    },
    minEmailsSent: {
      label: "Emails Mínimos enviados",
      description: "Número mínimo de correos electrónicos enviados al contacto",
    },
    createdAfter: {
      label: "Creado después",
      description: "Filtros creados después de esta fecha",
    },
    createdBefore: {
      label: "Creado antes",
      description: "Filtros creados antes de esta fecha",
    },
    updatedAfter: {
      label: "Actualizado después",
      description: "Filtros actualizados después de esta fecha",
    },
    updatedBefore: {
      label: "Actualizado antes",
      description: "Filtros actualizados antes de esta fecha",
    },
    search: {
      label: "Buscar",
      description:
        "Buscar guías por correo electrónico, nombre o nombre de empresa",
      placeholder: "Búsqueda conduce...",
    },
    engagementLevel: {
      high: "Alta participación",
      medium: "Participación mediana",
      low: "Bajo compromiso",
      none: "No Engage",
    },
    response: {
      overview: "Sinopsis",
      emailPerformance: "Rendimiento de correo electrónico",
      conversionRates: "Tasas de conversión",
      activityTimeline: "Tiempo de actividad",
      campaignDistribution: "Distribución de las campañas",
      geographicDistribution: "Distribución geográfica y fuente",
      dataQuality: "Calidad de datos",
      performanceMetrics: "Metrices de rendimiento",
      engagementLevels: "Niveles de participación",
      conversionFunnel: "Funnel de conversión",
      totalLeads: "Total de productos básicos",
      newLeads: "Nuevos contactos",
      activeLeads: "contacto activo",
      inactiveLeads: "contacto inactivo",
      leadsByStatus: "contactos por Estado",
      leadsBySource: "contactos por Fuente",
      leadsByCountry: "contacto por país",
      leadsByLanguage: "Líderes por idioma",
      websiteUserLeads: "Usuarios Web",
      newsletterSubscriberLeads: "Suscriptores de boletín",
      convertedLeads: "contacto convertido",
      consultationBookedLeads: "Consulta reservada",
      signedUpLeads: "Signed Up Leads",
      subscriptionConfirmedLeads: "Suscripción confirmada",
      unsubscribedLeads: "contacto no suscrito",
      bounces: "Bounced",
      qualifiedLeads: "Líderes calificados",
      nonQualifiedLeads: "Líderes no cuantificados",
      nurturingLeads: "Nurturing Leads",
      engagedLeads: "Engaged Leads",
      leadsWithEmailEngagement: "Con compromiso de correo electrónico",
      leadsWithoutEmailEngagement: "Sin compromiso de correo electrónico",
      averageEmailEngagementScore: "Avg Email Engagement",
      totalEmailEngagements: "Total de contribuciones por correo electrónico",
      signupRate: "Tasa de inscripción",
      subscriptionConfirmationRate: "Tasa de confirmación de suscripción",
      dataCompletenessRate: "Completación de datos",
      leadsWithBusinessName: "Con nombre de negocio",
      leadsWithContactName: "Con el nombre de contacto",
      leadsWithPhone: "Con teléfono",
      leadsWithWebsite: "Con el sitio web",
      leadsWithNotes: "Con notas",
      averageBusinessDataCompleteness: "Complejidad de datos empresariales",
      leadsByCampaignStage: "Líderes por la etapa de campaña",
      leadsInActiveCampaigns: "En Campañas Activas",
      leadsNotInCampaigns: "No en Campañas",
      recentLeads: "Líderes recientes",
      topLeadsByEngagement: "Top Leads by Engagement",
      mostActiveLeads: "Principales contactos activos",
      recentConversions: "Conversiones recientes",
      recentSignups: "Registros recientes",
      timeSeriesData: "Datos de la serie de tiempo",
      comparisonData: "Datos de comparación",
      averageTimeToConversion: "Tiempo de conversión de Avg",
      averageTimeToConsultation: "Tiempo de Consulta de Avg",
      averageTimeToSignup: "Tiempo de registro de Avg",
      topPerformingCampaigns: "Principales campañas de realización",
      topPerformingSources: "Fuentes de alto rendimiento",
      topPerformingCountries: "Países de alto nivel",
      conversionRate: "Tasa de conversión",
      consultationBookingRate: "Consulta Tarifa de reserva",
      averageOpenRate: "Tasa media de apertura",
      averageClickRate: "Tasa media de clic",
      campaignRunningLeads: "En las campañas de ejecución",
      bouncedLeads: "Bounced Leads",
      invalidLeads: "Líderes inválidos",
      totalEmailsSent: "Total Emails Sent",
      totalEmailsOpened: "Correos electrónicos totales abiertos",
      totalEmailsClicked: "Correos electrónicos totales Clicked",
      averageEmailsPerLead: "Correos electrónicos promedio por contacto",
      leadVelocity: "Líder Velocity",
      leadsCreatedToday: "Principales Creados hoy",
      leadsCreatedThisWeek: "Los contactos creados esta semana",
      leadsCreatedThisMonth: "Los contactos creados este mes",
      leadsUpdatedToday: "Líderes Actualizados hoy",
      leadsUpdatedThisWeek: "Leads Actualizado Esta semana",
      leadsUpdatedThisMonth: "Líderes Actualizados Este Mes",
      leadsByJourneyVariant: "Líderes de Viaje Variante",
      historicalData: "Datos históricos",
      groupedStats: "Estadísticas agrupadas",
      recentActivity: "Actividad reciente",
      metadata: "Información sobre el informe",
      generatedAt: "Generado en",
      dataRange: "Gama de datos",
      data: "Datos estadísticos",
      campaignName: "Campaña",
      leadsGenerated: "Contactos",
      openRate: "Tasa abierta",
      clickRate: "Tasa de clic",
      source: "Fuente",
      qualityScore: "Quality Score",
      activityType: "Actividad",
      email: "Correo electrónico",
      businessName: "Negocios",
      timestamp: "Hora",
      status: "Situación",
    },
    errors: {
      unauthorized: {
        title: "Acceso no autorizado",
        description:
          "Autenticación necesaria para ver las estadísticas de contacto",
      },
      validation: {
        title: "Error de validación",
        description: "Parámetros de solicitud de estadísticas inválidas",
      },
      server: {
        title: "Error del servidor",
        description:
          "Error del servidor interno ocurrió mientras que la recuperación de las estadísticas de leads",
      },
      unknown: {
        title: "Error desconocido",
        description:
          "Se produjo un error inesperado mientras se registran estadísticas",
      },
      network: {
        title: "Error de red",
        description:
          "Se produjo error de red mientras se registran estadísticas",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "Acceso prohibido para las estadísticas de contacto",
      },
      notFound: {
        title: "No Data",
        description:
          "No se han encontrado datos estadísticos para los criterios especificados",
      },
      conflict: {
        title: "Conflicto",
        description: "Conflicto de datos se produjo al generar estadísticas",
      },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Hay cambios insalvados en los filtros estadísticos",
      },
    },
    success: {
      title: "Estadísticas generadas",
      description: "Estadísticas de contacto recuperadas con éxito",
    },
    widget: {
      title: "Principales estadísticas",
      refresh: "Actualizar",
      viewAllLeads: "Ver todos los contactos",
      searchLeads: "Búsqueda de contactos",
      export: "Exportación",
      import: "Importación",
      batchUpdate: "Actualización de los lotes",
      totalLeads: "Total de productos básicos",
      activeLeads: "contacto activo",
      converted: "Conversión",
      conversionRate: "Tasa de conversión",
      openRate: "Tasa abierta",
      clickRate: "Tasa de clic",
      unsubscribeRate: "Tasa de subscripción",
      newThisMonth: "Nuevo (30d)",
      newLeadsTimeline: "Nuevo plazo de arrendamientos",
      today: "Hoy",
      thisWeek: "Esta semana",
      thisMonth: "Este mes",
      conversionFunnel: "Funnel de conversión",
      funnelTotalLeads: "Total de productos básicos",
      funnelCampaignRunning: "Campaign Running",
      funnelSignedUp: "Signed Up",
      funnelSubscriptionConfirmed: "Suscripción confirmada",
      byStatus: "Por Estado",
      clickToFilter: "(haga clic para filtrar)",
      bySource: "By Source",
      byCountry: "Por País",
      byCampaignStage: "Por campaña Stage",
      topPerformingCampaigns: "Principales campañas de realización",
      topSources: "Fuentes principales",
      viewAll: "Ver todo",
      recentActivity: "Actividad reciente",
      filters: "Filtros",
      applyFilters: "Aplicar filtros",
      openRateSuffix: "% abierto",
      conversionRateSuffix: "% cvr",
      emDash: ", ",
      dateSeparator: "–",
    },
    enums: {
      sortOrder: {
        asc: "Ascendencia",
        desc: "Descendiente",
      },
      leadSortField: {
        email: "Correo electrónico",
        businessName: "Nombre del negocio",
        createdAt: "Fecha de creación",
        updatedAt: "Fecha actualizada",
        lastEngagementAt: "Último compromiso",
      },
      leadStatusFilter: {
        all: "Todos",
        new: "Nuevo",
        pending: "Pendiente",
        campaignRunning: "Campaign Running",
        websiteUser: "Sitio web Usuario",
        newsletterSubscriber: "Newsletter Suscríbase",
        inContact: "En contacto",
        signedUp: "Signed Up",
        subscriptionConfirmed: "Suscripción confirmada",
        unsubscribed: "Suscripción cancelada",
        bounced: "Bounced",
        invalid: "Inválidos",
      },
      emailCampaignStageFilter: {
        all: "Todos",
        notStarted: "No empezó",
        initial: "Contacto inicial",
        followup1: "Seguimiento 1",
        followup2: "Seguimiento 2",
        followup3: "Seguimiento 3",
        nurture: "Nutrición",
        reactivation: "Reactivación",
      },
      leadSourceFilter: {
        all: "Todos",
        website: "Sitio web",
        socialMedia: "Social Media",
        emailCampaign: "Campaña de correo electrónico",
        referral: "Referidos",
        csvImport: "Importación CSV",
      },
    },
  },
  tracking: {
    engagement: {
      category: "Seguimiento de contacto",
      tags: {
        tracking: "Seguimiento",
        engagement: "Engagement",
      },
      post: {
        title: "Grabación de contacto",
        description: "Grabar un nuevo evento de compromiso para una pista",
        form: {
          title: "Formulario de compromiso principal",
          description: "Detalles del compromiso de la pista de grabación",
        },
        leadId: {
          label: "ID del contacto",
          description: "Unico identificador para el contacto",
          placeholder: "Ingrese el contacto ID",
          helpText: "UUID del contacto para rastrear el compromiso para",
        },
        engagementType: {
          label: "Tipo de compromiso",
          description: "Tipo de evento de compromiso",
          placeholder: "Seleccione el tipo de compromiso",
          helpText: "El tipo de interacción o compromiso",
        },
        campaignId: {
          label: "Campaign ID",
          description: "identificador de la campaña asociada",
          placeholder: "Ingrese la campaña ID",
          helpText: "Campaña opcional que este compromiso es parte de",
        },
        metadata: {
          label: "Metadatos",
          description: "Metadatos de compromiso adicionales",
          placeholder: "Ingrese metadatos como JSON",
          helpText: "Datos personalizados sobre este compromiso",
        },
        userId: {
          label: "Usuario ID",
          description: "identificador de usuario asociado",
          placeholder: "Introduzca el usuario ID",
          helpText:
            "Usuario opcional ID si el contacto está asociado con un usuario",
        },
        response: {
          id: "Participación ID",
          leadId: "ID del contacto",
          engagementType: "Tipo de compromiso",
          campaignId: "Campaign ID",
          metadata: "Metadatos",
          timestamp: "Timestamp",
          ipAddress: "Dirección de IP",
          userAgent: "Agente de usuario",
          createdAt: "Creado en",
          leadCreated: "Contacto creado",
          relationshipEstablished: "Relación establecida",
        },
        errors: {
          unauthorized: {
            title: "Se requiere autenticación",
            description: "Inicia sesión para continuar",
          },
          validation: {
            title: "Error de validación",
            description: "Parámetros de solicitud no válidos",
          },
          server: {
            title: "Error del servidor",
            description: "Ocurrió un error interno del servidor",
          },
          unknown: {
            title: "Error desconocido",
            description: "Ocurrió un error desconocido",
          },
          forbidden: {
            title: "Acceso denegado",
            description: "No tienes acceso",
          },
          notFound: {
            title: "No encontrado",
            description: "No se encontró el recurso",
          },
          conflict: {
            title: "Conflicto",
            description: "Hay un conflicto entre los datos",
          },
          network: {
            title: "Error de red",
            description: "Ocurrió un error de red",
          },
          unsavedChanges: {
            title: "Cambios sin guardar",
            description: "Tienes cambios sin guardar",
          },
        },
        success: {
          title: "Participación grabada",
          description: "Contrato de contacto registrado con éxito",
        },
      },
      get: {
        title: "Pista de contacto Haga clic",
        description:
          "Rastrear el clic del contacto y redirigir al objetivo URL",
        form: {
          title: "Parámetros de seguimiento",
          description: "Parámetros para el seguimiento de clics y redirigir",
        },
        id: {
          label: "ID del contacto",
          description: "Unico identificador para el contacto",
          placeholder: "Ingrese el contacto ID",
          helpText: "UUID del contacto para seguir clic para",
        },
        stage: {
          label: "Etapa de campaña",
          description: "Etapa de campaña de correo electrónico",
          placeholder: "Seleccionar la etapa de campaña",
          helpText: "Etapa de campaña opcional este clic es parte de",
        },
        source: {
          label: "Origen del contacto",
          description: "Fuente de la dirección",
          placeholder: "Seleccione la fuente principal",
          helpText: "Fuente en la que el contacto se originó",
        },
        url: {
          label: "Objetivo URL",
          description: "URL para redirigir a después de rastrear",
          placeholder: "Ingrese el objetivo URL",
          helpText: "El destino URL para la redirección",
        },
        ref: {
          label: "Referencia ID",
          description: "Identificador de referencia para el seguimiento",
          placeholder: "Ingrese referencia ID",
          helpText:
            "Referencia opcional ID para el contexto de seguimiento adicional",
        },
        response: {
          success: "Operación completada",
          redirectUrl: "Redirect URL",
          leadId: "ID del contacto",
          campaignId: "Campaign ID",
          engagementRecorded: "Participación grabada",
          leadStatusUpdated: "Estado del contacto Actualizado",
          isLoggedIn: "Está Logged In",
        },
        errors: {
          unauthorized: {
            title: "Se requiere autenticación",
            description: "Inicia sesión para continuar",
          },
          validation: {
            title: "Error de validación",
            description: "Parámetros de solicitud no válidos",
          },
          server: {
            title: "Error del servidor",
            description: "Ocurrió un error interno del servidor",
          },
          unknown: {
            title: "Error desconocido",
            description: "Ocurrió un error desconocido",
          },
          forbidden: {
            title: "Acceso denegado",
            description: "No tienes acceso",
          },
          notFound: {
            title: "No encontrado",
            description: "No se encontró el recurso",
          },
          conflict: {
            title: "Conflicto",
            description: "Hay un conflicto entre los datos",
          },
          network: {
            title: "Error de red",
            description: "Ocurrió un error de red",
          },
          unsavedChanges: {
            title: "Cambios sin guardar",
            description: "Tienes cambios sin guardar",
          },
        },
        success: {
          title: "Haz clic en Tracked",
          description: "Pulso de guía rastreado con éxito",
        },
      },
      widget: {
        post: {
          headerTitle: "Grabación de registros",
          viewStatsTitle: "View Lead Statistics",
          statsButton: "Stats",
          loading: "Grabando compromiso...",
          successTitle: "Participación grabada",
          successSubtitle: "seguimiento con éxito",
          event: "Evento",
          labels: {
            engagementId: "Participación ID",
            type: "Tipo",
            leadId: "ID del contacto",
            campaignId: "Campaign ID",
            ipAddress: "Dirección de IP",
            recordedAt: "Grabado en",
            leadCreated: "Contacto creado",
            leadCreatedYes: "Sí (nueva pista)",
            leadCreatedNo: "No (existe)",
            relationshipEst: "Relación.",
            relationshipYes: "Sí.",
            relationshipNo: "No.",
            metadata: "Metadatos",
          },
          nextSteps: "Siguientes pasos:",
          viewLeadButton: "Ver contacto",
          leadStatsButton: "Estadísticas de contactos",
          emptyTitle: "Seguimiento de un evento de compromiso",
          emptyDescription:
            "Rellene el siguiente formulario y envíe para grabar un nuevo evento de compromiso para una pista",
          viewLeadStatsButton: "Ver los puntos principales",
        },
        get: {
          headerTitle: "Seguimiento de clics",
          viewStatsTitle: "View Lead Statistics",
          statsButton: "Stats",
          loading: "Procesando el seguimiento de clics...",
          successTitle: "Haz clic en Tracked",
          successSubtitle: "Participación registrada y redirigir URL listo",
          failTitle: "Rastreo fallado",
          failSubtitle: "No podía grabar el evento de clics",
          labels: {
            engagementLabel: "Engagement",
            recorded: "Grabado",
            notRecorded: "No se registró",
            leadStatusLabel: "Estado del contacto",
            updated: "Actualizado",
            unchanged: "Sin cambios",
            userLabel: "Usuario",
            loggedIn: "Logged in",
            anonymous: "Anónimo",
            leadId: "ID del contacto",
            campaignId: "Campaign ID",
            redirectUrl: "Redirect URL",
          },
          nextSteps: "Siguientes pasos:",
          openUrlButton: "Open URL",
          viewLeadButton: "Ver contacto",
          leadStatsButton: "Estadísticas de contactos",
          emptyTitle: "Seguimiento de un evento Click",
          emptyDescription:
            "Introduzca los parámetros de seguimiento a continuación para grabar un clic y recuperar el URL redireccionado",
          viewLeadStatsButton: "Ver los puntos principales",
        },
      },
      enums: {
        engagementLevel: {
          high: "Alto",
          medium: "Mediana",
          low: "Baja",
          none: "Ninguno",
        },
      },
      error: {
        default: "Se produjo un error al procesar el compromiso",
      },
    },
    pixel: {
      category: "API Endpoint",
      tags: {
        pixel: "Pixel",
      },
      // Add endpoint-specific translations here
    },
    existing: {
      found: "Búsqueda de contacto existente encontrado",
    },
    component: {
      initialized: "Componente de seguimiento inicializado",
    },
    error: "Error en el seguimiento de contacto",
    errors: {
      default: "Se produjo un error",
      missingId: "Falta de seguimiento ID",
      invalidUrl: "Inválido URL",
    },
    data: {
      captured: "Datos de rastreo de contacto capturados",
      capture: {
        error: "Captura de errores datos de seguimiento de plomo",
      },
      retrieve: {
        error: "Recuperar datos de seguimiento de plomo",
      },
      loaded: {
        signup: "Datos de rastreo de plomo cargados para registro",
      },
      load: {
        error: {
          noncritical:
            "Datos de seguimiento de la carga de errores (no críticos)",
        },
      },
      stored: "Datos de rastreo de plomo almacenados",
      store: {
        error: "Recuperar datos de seguimiento de plomo",
      },
      cleared: "Datos de rastreo de plomo despejados",
      clear: {
        error: "Borrar los datos de seguimiento de plomo",
      },
      format: {
        error: "Datos de seguimiento del formato de error",
      },
    },
    params: {
      validate: {
        error: "Parámetros de seguimiento validados por error",
      },
    },
  },
  enums: {
    engagementTypes: {
      emailOpen: "Correo electrónico abierto",
      emailClick: "Clic en el correo",
      websiteVisit: "Visita del sitio web",
      formSubmit: "Presentación de formularios",
      leadAttribution: "Atribución del lead",
      creditWall: "Sin créditos",
      consentDeclined: "Consentimiento +18 rechazado",
    },
    leadStatus: {
      new: "Nuevo",
      pending: "Pendiente",
      campaignRunning: "Campaign Running",
      websiteUser: "Sitio web Usuario",
      newsletterSubscriber: "Newsletter Suscríbase",
      inContact: "En contacto",
      signedUp: "Signed Up",
      subscriptionConfirmed: "Suscripción confirmada",
      unsubscribed: "Suscripción cancelada",
      bounced: "Bounced",
      invalid: "Inválidos",
    },
    emailCampaignStage: {
      notStarted: "No empezó",
      initial: "Contacto inicial",
      followup1: "Seguimiento 1",
      followup2: "Seguimiento 2",
      followup3: "Seguimiento 3",
      nurture: "Nutrición",
      reactivation: "Reactivación",
    },
    emailStatus: {
      pending: "Pendiente",
      sent: "Sent",
      delivered: "Entrega",
      opened: "Abierto",
      clicked: "Seguido",
      bounced: "Bounced",
      failed: "Failed",
      unsubscribed: "Suscripción cancelada",
    },
    emailJourneyVariant: {
      uncensoredConvert: "Conversión a modelos sin censura",
      sideHustle: "Hustle lateral",
      quietRecommendation: "Recomendación silenciosa",
      signupNurture: "Nutrición de registro",
      retention: "Retención",
      winback: "Winback",
      newsletterMay2026: "Boletín May 2026",
      newsletterNov2026: "Boletín de noviembre 2026",
    },
    emailJourneyVariantFilter: {
      all: "Todos",
      uncensoredConvert: "Conversión a modelos sin censura",
      sideHustle: "Hustle lateral",
      quietRecommendation: "Recomendación silenciosa",
      signupNurture: "Nutrición de registro",
      retention: "Retención",
      winback: "Winback",
      newsletterMay2026: "Boletín May 2026",
      newsletterNov2026: "Boletín de noviembre 2026",
    },
    sortOrder: {
      asc: "Ascendencia",
      desc: "Descendiente",
    },
    leadSortField: {
      email: "Correo electrónico",
      businessName: "Nombre del negocio",
      createdAt: "Fecha de creación",
      updatedAt: "Fecha actualizada",
      lastEngagementAt: "Último compromiso",
    },
    exportFormat: {
      csv: "CSV",
      xlsx: "Excel",
    },
    mimeType: {
      csv: "text/csv",
      xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    },
    activityType: {
      leadCreated: "Contacto creado",
      leadUpdated: "Lead Updated",
      emailSent: "Email Sent",
      emailOpened: "Correo electrónico abierto",
      emailClicked: "Correo electrónico Clicked",
      leadConverted: "Conversión de plomo",
      leadUnsubscribed: "Lead Unsubscribed",
    },
    userAssociation: {
      withUser: "Con el Usuario",
      withLead: "Con contacto",
      standalone: "Standalone",
      withBoth: "Con ambos",
    },
    deviceType: {
      desktop: "Escritorio",
      mobile: "Móvil",
      tablet: "Tablet",
      bot: "Bot",
      unknown: "Desconocida",
    },
    leadSource: {
      website: "Sitio web",
      socialMedia: "Social Media",
      emailCampaign: "Campaña de correo electrónico",
      referral: "Referidos",
      csvImport: "Importación CSV",
    },
    leadStatusFilter: {
      all: "Todos",
      new: "Nuevo",
      pending: "Pendiente",
      campaignRunning: "Campaign Running",
      websiteUser: "Sitio web Usuario",
      newsletterSubscriber: "Newsletter Suscríbase",
      inContact: "En contacto",
      signedUp: "Signed Up",
      subscriptionConfirmed: "Suscripción confirmada",
      unsubscribed: "Suscripción cancelada",
      bounced: "Bounced",
      invalid: "Inválidos",
    },
    emailCampaignStageFilter: {
      all: "Todos",
      notStarted: "No empezó",
      initial: "Contacto inicial",
      followup1: "Seguimiento 1",
      followup2: "Seguimiento 2",
      followup3: "Seguimiento 3",
      nurture: "Nutrición",
      reactivation: "Reactivación",
    },
    leadSourceFilter: {
      all: "Todos",
      website: "Sitio web",
      socialMedia: "Social Media",
      emailCampaign: "Campaña de correo electrónico",
      referral: "Referidos",
      csvImport: "Importación CSV",
    },
    batchOperationScope: {
      currentPage: "Página actual",
      allPages: "Todas las páginas",
    },
    country: {
      ...regionalCountryNames("es"),
      de: "Alemania",
      pl: "Polonia",
      fr: "Francia",
      global: "Global",
    },
    language: {
      it: "Italiano",
      es: "Español",
      sk: "Eslovaco",
      de: "Alemán",
      pl: "Polaco",
      fr: "Francés",
      en: "Inglés",
    },
    emailProvider: {
      resend: "Resend",
      sendgrid: "SendGrid",
      mailgun: "Mailgun",
      ses: "Amazon SES",
      smtp: "SMTP",
      mailjet: "Mailjet",
      postmark: "Postmark",
      other: "Otro",
    },
  },
  error: {
    general: {
      internal_server_error: "Error del servidor interno",
      not_found: "Cuenta o sesión no encontradas",
      unauthorized: "Se requiere autenticación",
      forbidden: "Acceso denegado",
      bad_request: "Mala solicitud",
      validation_error: "Error de validación",
    },
  },
  leadsErrors: {
    batch: {
      update: {
        error: {
          validation: {
            title: "Solicitud de actualización inválida por lotes",
          },
          server: {
            title: "Actualización de errores del servidor conduce en lote",
          },
          default: "Líderes de actualización de errores en lotes",
        },
      },
    },
    leads: {
      get: {
        error: {
          server: {
            title: "Líderes de recuperación de errores del servidor",
            detail:
              "Líderes de recuperación de errores del servidor: {{error}}",
          },
          not_found: {
            title: "Líderes no encontrados",
          },
        },
      },
      post: {
        error: {
          duplicate: {
            title: "Lead con este correo electrónico ya existe",
          },
          server: {
            title: "Error del servidor creando plomo",
          },
        },
      },
      patch: {
        error: {
          not_found: {
            title: "Lead not found",
          },
          server: {
            title: "Actualización de errores del servidor",
          },
        },
      },
    },
    leadsUnsubscribe: {
      post: {
        success: {
          description: "Sucesivamente no suscrito",
        },
        error: {
          validation: {
            title: "Solicitud de cancelación inválida",
          },
          server: {
            title: "Procesamiento de error del servidor unsubscribe",
          },
        },
      },
    },
    leadsEngagement: {
      post: {
        error: {
          validation: {
            title: "Datos de compromiso inválidos",
          },
          server: {
            title: "Compromiso de registro de errores del servidor",
          },
        },
      },
    },
    leadsExport: {
      get: {
        error: {
          server: {
            title: "Líderes de exportación de errores del servidor",
          },
        },
      },
    },
    campaigns: {
      common: {
        error: {
          server: {
            title: "Campaña de procesamiento de errores del servidor",
          },
        },
      },
    },
  },
  countries: {
    ...regionalCountryNames("es"),
    global: "Global",
    de: "Alemania",
    pl: "Polonia",
    fr: "Francia",
    us: "Estados Unidos",
  },
  languages: {
    it: "Italiano",
    es: "Español",
    sk: "Eslovaco",
    hi: "Hindi",
    en: "Inglés",
    de: "Alemán",
    pl: "Polaco",
    fr: "Francés",
  },
};
