import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  error: {
    title: "Error",
    message: "Se produjo un error. Por favor, inténtalo de nuevo.",
    general: {
      unknown_validation_error:
        "Se produjo un error de validación desconocido.",
    },
  },
  errorTypes: {
    auth_error: "Error de autenticación",
    bad_request: "Mala solicitud",
    database_error: "Error de base",
    email_error: "Error de correo electrónico",
    external_service_error: "Error de servicio externo",
    forbidden: "Acceso denegado",
    http_error: "Error HTTP",
    internal_error: "Error interno",
    invalid_credentials_error: "Credenciales inválidos",
    invalid_data_error: "Datos inválidos",
    invalid_format_error: "Formato inválido",
    invalid_input_error: "Entrada inválida",
    invalid_method_error: "Método inválido",
    invalid_parameter_error: "Parámetro inválido",
    invalid_path_error: "Camino inválido",
    invalid_payload_error: "Carga de pago inválida",
    invalid_query_error: "Query inválido",
    invalid_request_error: "Solicitud inválida",
    invalid_response_error: "Respuesta inválida",
    invalid_status_error: "Estado inválido",
    invalid_token_error: "Token inválido",
    invalid_url_error: "Inválido URL",
    no_response_data: "No hay datos de respuesta",
    not_found: "Cuenta o sesión no encontradas",
    partial_failure: "Fallo parcial",
    payment_failed: "El pago falló",
    payment_required: "Pago requerido",
    permission_denied: "Permiso denegado",
    permission_error: "Error de permiso",
    sms_error: "Error SMS",
    token_expired_error: "Token expired",
    two_factor_required: "Se requiere autenticación de dos factores",
    unauthorized: "Se requiere autenticación",
    unknown_error: "Error desconocido",
    validation_error: "Error de validación",
  },
  stats: {
    chartType: {
      area: "Zona",
      bar: "Bar",
      donut: "Donut",
      line: "Línea",
      pie: "Pie",
    },
    dateRange: {
      custom: "Personalizado",
      last30Days: "Últimos 30 días",
      last7Days: "Últimos 7 días",
      last90Days: "Los últimos 90 días",
      lastMonth: "Mes",
      lastQuarter: "Último trimestre",
      lastWeek: "La semana pasada",
      lastYear: "El año pasado",
      thisMonth: "Este mes",
      thisQuarter: "Este trimestre",
      thisWeek: "Esta semana",
      thisYear: "Este año",
      today: "Hoy",
      yesterday: "Ayer",
    },
    timePeriod: {
      day: "Día",
      month: "Mes",
      quarter: "Trimestre",
      week: "Semana",
      year: "Año",
    },
  },
  errors: {
    invalid_request_data: "Datos de solicitud inválidos",
    serverError: {
      description:
        "Se produjo un error de servidor. Por favor, inténtalo de nuevo.",
    },
    validationFailed: {
      description: "La validación falló. Por favor, compruebe su entrada.",
    },
  },
  cli: {
    vibe: {
      errors: {
        routeNotFound: "Ruta no encontrada para herramienta: {{toolName}}",
        routeUnavailableOnServer:
          "{{toolName}} solo funciona en la CLI de vibe. Este servidor no lo ofrece.",
        executionFailed: "La ejecución falló",
        // Bare label - the CLI error formatter renders it param-free as its
        // last-resort fallback, so the cause gets its own key.
        unknownError: "Ocurrió un error desconocido",
        unknownErrorDetail: "Se produjo un error desconocido: {{error}}",
      },
    },
  },
  shared: {
    permissions: {
      errors: {
        definitionError: "Error de definición de punto final",
        platformAccessDenied: "Acceso denegado en {{platform}} : {{reason}}",
        insufficientRoles:
          "El usuario {{userId}} carece de los roles necesarios: {{requiredRoles}}",
      },
    },
    endpoints: {
      definition: {
        loader: {
          errors: {
            endpointNotFound: "Punto final no encontrado",
            loadFailed: "No se puede cargar el punto final",
            batchLoadFailed: "No se puede cargar puntos finales",
          },
        },
      },
    },
  },
  utils: {
    parseJsonWithComments: {
      errors: {
        invalid_json: "Inválido JSON",
      },
    },
    time: {
      errors: {
        invalid_time_format: {
          title: "Formato de tiempo inválido",
        },
        invalid_time_range: {
          title: "Rango de tiempo inválido",
        },
      },
    },
  },
};
