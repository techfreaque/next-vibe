import { regionalCountryNames } from "next-vibe/core/i18n/core/regions";

import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    import: "Importación",
    leads: "Contactos",
    csv: "CSV",
  },

  category: "Importación de datos",
  post: {
    title: "Importar contactos",
    titleShort: "Importar contactos",
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
      importGuideSubtitle: "Cargue un archivo CSV con las siguientes columnas:",
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
        description: "Obtenga detalles de un trabajo específico de importación",
        actions: {
          retry: "Volver a intentar",
          stop: "Para.",
          viewLeads: "View Leads",
        },
        jobId: {
          label: "Job ID",
          description: "Unico identificador para el trabajo de importación",
        },
        form: {
          title: "Importación del estado laboral",
          description: "Situación actual y progreso del trabajo de importación",
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
          description: "Modificar la configuración del trabajo de importación",
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
            description: "Autenticación necesaria para actualizar los empleos",
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
      titleShort: "Importación de empleos",
      description: "Lista y monitorea trabajos de importación CSV",
      actions: {
        refresh: "Actualizar",
        refreshing: "Refrescante...",
      },
      form: {
        title: "Filtros de trabajo",
        description: "Filtrar trabajos de importación por estado y paginación",
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
        description: "Lista de trabajos de importación con su situación actual",
        statusCounts: "Cuentas de Estado",
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
        description: "Los datos no cumplen el formato o las reglas requeridos",
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
      retry: "Volver a intentar",
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
    en: "Inglés",
    de: "Alemán",
    pl: "Polaco",
    fr: "Francés",
  },
};
