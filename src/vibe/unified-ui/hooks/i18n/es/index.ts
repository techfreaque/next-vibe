import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  widgets: {
    errorBoundary: {
      title: "Algo salió mal",
      defaultMessage: "Ocurrió un error inesperado",
      errorDetails: "Detalles del error",
    },
    error: {
      title: "Error",
    },
    chart: {
      noDataAvailable: "No hay datos disponibles",
      noDataToDisplay: "No hay datos para mostrar",
    },
    codeQualityFiles: {
      affectedFiles: "Archivos afectados",
      andMoreFiles: "... y {{count}} archivos más",
    },
    codeQualityList: {
      noIssues: "No se encontraron problemas",
    },
    codeQualitySummary: {
      errors: "Errores",
      files: "Archivos",
      issues: "Problemas",
      of: "de",
      summary: "Resumen",
    },
    container: {
      noContent: "Sin contenido",
    },
    endpointRenderer: {
      cancel: "Cancelar",
      submit: "Enviar",
      submitting: "Enviando...",
      showResults: "Mostrar resultados",
      saveChanges: "Guardar cambios",
      saving: "Guardando...",
      result: "Resultado",
      fixFields: "Revisa los campos marcados e inténtalo de nuevo.",
      hiddenInvalid:
        "Falta «{{field}}» o no es válido. Recarga la página e inténtalo de nuevo.",
    },
    toolUnavailable: {
      permissionTitle: "No tienes acceso a esta herramienta",
      permissionMessage:
        "Tu rol no puede abrirla. Pide acceso a un propietario del espacio.",
      instanceTitle: "Esta herramienta no está en esta instancia",
      instanceMessage:
        "Funciona en otra instancia conectada. Cambia de instancia en la barra lateral para abrirla.",
      setupTitle: "Esta herramienta necesita configuración",
      setupMessage:
        "Falta un ajuste obligatorio. Termina la configuración y vuelve a abrir la herramienta.",
      unknownTitle: "Este enlace no lleva a ninguna herramienta",
      unknownMessage: "Puede que el enlace esté desactualizado o mal escrito.",
    },
    recordState: {
      loading: "Cargando",
      notFoundMessage:
        "Puede que se haya eliminado o que el enlace esté desactualizado.",
      loadFailed: "No se pudo cargar: {{title}}",
      serverError:
        "Algo falló por nuestra parte. Inténtalo de nuevo en un momento.",
      technicalDetails: "Detalles técnicos",
      moreActions: "Más acciones",
      more: "Más",
      confirmCancel: "Cancelar",
      details: "Detalles",
      emptyTitle: "Aún no hay nada",
      copy: "Copiar",
    },
    formField: {
      requiresContext: "Este campo requiere contexto",
    },
    markdown: {
      noContent: "Sin contenido",
    },
    pagination: {
      itemsPerPage: "Elementos por página",
      page: "Página",
      showing: "Mostrando",
    },
    rangeSlider: {
      max: "Máximo",
      min: "Mínimo",
    },
    toolCall: {
      creditsUsed_one: "{{count}} crédito usado",
      creditsUsed_other: "{{count}} créditos usados",
      actions: {
        confirm: "Confirmar",
        deny: "Rechazar",
        runInBackground: "Ejecutar en segundo plano",
        resumeWhenDone: "Reanudar al terminar",
      },
      status: {
        complete: "Completado",
        confirmed: "Confirmado",
        confirmedWakeUp: "Confirmado, reanudar agente",
        deferred: "Pospuesto",
        denied: "Rechazado",
        deniedWakeUp: "Rechazado, reanudar agente",
        error: "Error",
        executing: "En ejecución",
        pendingCancellation: "Pendiente de cancelación",
        pendingConfirmation: "Pendiente de confirmación",
        sentToBackground: "Enviado a segundo plano",
        waitingForConfirmation: "En espera de confirmación",
        waitingForConfirmationWakeUp: "En espera de confirmación para reanudar",
        waitingForRemote: "En espera de la instancia remota",
        wakeUpBackground: "Reanudar en segundo plano",
      },
      messages: {
        confirmationRequired: "Se requiere confirmación",
        confirmationRequiredWakeUp: "Se requiere confirmación para reanudar",
        deferredResult: "Resultado pospuesto",
        errorLabel: "Error",
        executingTool: "Ejecutando herramienta...",
      },
    },
    formFields: {
      common: {
        enterPhoneNumber: "Ingresa el número de teléfono",
        required: "Obligatorio",
        selectDate: "Selecciona una fecha",
        openCalendar: "Abrir el calendario",
        time: "Hora",
        startDate: "Fecha de inicio",
        endDate: "Fecha de fin",
        decreaseValue: "Reducir el valor",
        increaseValue: "Aumentar el valor",
        unknownFieldType: "Tipo de campo desconocido",
      },
      entityPicker: {
        change: "Cambiar",
        loading: "Cargando...",
        noItems: "No se encontraron elementos",
        required: "Obligatorio",
        select: "Seleccionar...",
        selectLabel: "Seleccionar {{label}}",
        useToFind: "Busca con {{alias}}",
      },
      markdownTextarea: {
        edit: "Editar",
        preview: "Vista previa",
        toolbar: {
          blockquote: "Cita",
          bold: "Negrita",
          bulletList: "Lista con viñetas",
          code: "Código",
          heading1: "Encabezado de nivel 1",
          heading2: "Encabezado de nivel 2",
          heading3: "Encabezado de nivel 3",
          horizontalRule: "Línea horizontal",
          italic: "Cursiva",
          link: "Enlace",
          linkPrompt: "Ingresa la URL",
          orderedList: "Lista numerada",
          strike: "Tachado",
        },
      },
    },
  },
  formErrors: {
    required: "Introduce un valor",
    invalid: "Este valor no es válido",
    minLength: "Usa al menos {{min}} caracteres",
    maxLength: "Usa como máximo {{max}} caracteres",
    minNumber: "Introduce {{min}} o más",
    maxNumber: "Introduce {{max}} o menos",
    minItems: "Añade al menos {{min}}",
    email: "Introduce un correo electrónico válido",
    url: "Introduce un enlace completo, por ejemplo https://example.com",
    choose: "Elige una de las opciones",
  },
  localstorage: {
    noCallback:
      "Falta la función de devolución de llamada para la operación de localStorage",
  },
  apiUtils: {
    errors: {
      // Bare labels - kept placeholder-free for generic rendering.
      http_error: "Error HTTP",
      validation_error: "Error de validación",
      internal_error: "Error interno",
      auth_required: "Se requiere autenticación",
      missingUrlParam: "Falta el parámetro de URL «{{param}}» para {{path}}",
      httpStatus: "Falló la solicitud a {{url}} con el estado {{status}}",
      responseValidation:
        "La respuesta del servidor no superó la validación: {{error}}",
      malformedResponse: "Respuesta de {{url}} con formato no válido",
      recordTimeout:
        "Este registro tarda demasiado en cargarse. Vuelva a intentarlo.",
      requestFailed: "Falló la solicitud a {{path}}: {{error}}",
      /**
       * `reason` is the endpoint's own declared error-type description, already
       * translated in its scope - this frame only adds the where and the cause.
       */
      endpointFailed: "{{reason}} ({{path}}: {{error}})",
    },
  },
  mutationForm: {
    post: {
      errors: {
        mutation_failed: {
          title: "Falló la actualización",
        },
        validation_error: {
          title: "Error de validación",
          detail: "No se pudo validar el formulario: {{errors}}",
        },
      },
    },
  },
  queryForm: {
    errors: {
      network_failure: "Error de red en el formulario {{formId}}: {{error}}",
      validation_failed: "Falló la validación",
      validationFailedDetail:
        "Falló la validación del formulario {{formId}}: {{error}}",
    },
  },
  store: {
    errors: {
      validation_failed: "Falló la validación",
      request_failed: "Falló la solicitud",
      mutation_failed: "Falló la actualización",
      unexpected_failure: "Error inesperado",
      refetch_failed: "No se pudieron volver a cargar los datos",
    },
    status: {
      loading_data: "Cargando datos...",
      cached_data: "Usando datos de la caché",
      success: "Operación completada",
      mutation_pending: "Actualizando...",
      mutation_success: "Actualización completada",
    },
  },
};
