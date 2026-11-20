import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Importación de datos",
  tags: {
    leads: "Contactos",
    management: "Gestión",
  },

  get: {
    title: "Obtener importación de empleo",
    titleShort: "Importación de empleo",
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
        description: "Progresos y estadísticas actuales de las importaciones",
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
        description: "Se produjo un conflicto mientras se recuperaba el empleo",
      },
    },
    success: {
      title: "Operación completada",
      description: "Trabajo de importación recuperado con éxito",
    },
  },
  patch: {
    title: "Actualizar el trabajo de importación",
    titleShort: "Editar trabajo de importación",
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
      description: "Ajustes de configuración para el trabajo de importación",
    },
    batchSize: {
      label: "Tamaño del lote",
      description: "Número de filas para procesar en cada lote",
      placeholder: "100",
    },
    maxRetries: {
      label: "Max Retries",
      description: "Número máximo de intentos de reingreso para filas fallidas",
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
        description: "Progresos y estadísticas actuales de las importaciones",
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
    titleShort: "Eliminar el trabajo de importación",
    description: "Eliminar un trabajo de importación específico",
    jobId: {
      label: "Job ID",
      description:
        "Identificador único para el trabajo de importación para eliminar",
    },
    form: {
      title: "Eliminar el trabajo de importación",
      description: "Confirmación de la supresión del trabajo de importación",
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
      jobId: "Job ID",
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
};
