import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Contactos",
  tags: {
    leads: "Contactos",
    batch: "Batch",
  },

  patch: {
    title: "Actualización de los lotes",
    titleShort: "Actualización de los lotes",
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
        description: "Error de red ocurrido durante la actualización del lote",
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
    titleShort: "Batch Delete",
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
        description: "Un error desconocido ocurrió durante el borrado de lote",
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
};
