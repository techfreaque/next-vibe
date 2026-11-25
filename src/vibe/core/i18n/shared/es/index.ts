import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  errorTypes: {
    auth_error: "Error de autenticación",
    bad_request: "Mala solicitud",
    conflict: "Conflicto",
    purchased_model_required:
      "Este modelo requiere créditos de pago. Elige un modelo gratuito o añade créditos.",
    shared_allowance_reached:
      "Se han agotado los créditos gratuitos compartidos. Añade créditos o espera a que se renueve el saldo.",
    consent_required: "Consentimiento requerido",
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
    email_confirmation_required: "Código de confirmación por correo",
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
    // Detailed variants. The bare labels above and every `errorTypes.*` entry
    // double as generic, param-free banner text, so the cause gets its own key
    // rather than a placeholder bolted onto a shared label.
    invalidLocaleDetail: 'Inválido locale "{{locale}}"',
    invalidRequestDataDetail: "Datos de solicitud inválidos: {{error}}",
    invalidResponseDetail: "Datos de respuesta inválidos: {{error}}",
    invalidErrorResponseDetail: "Respuesta de error malformada: {{error}}",
    csrfFailedDetail: "Solicitud bloqueada por CSRF: {{reason}}",
    csrfReasonUnknown: "La validación de token CSRF falló",
    uploadTooLargeDetail:
      "Subir demasiado grande: {{size}} MB. Un mensaje puede llevar hasta {{limit}} MB de archivos. Quitar o encoger un archivo y enviar de nuevo.",
    internalDetail: "Error interno: {{error}}",
    authenticationFailed: "Falló la autenticación del usuario",
  },
  validation: {
    invalidEmail: "Introduce una dirección de correo electrónico válida.",
    missingFields: "Falta de campos necesarios ({{count}}):",
    failedOne: "La validación falló (1 error):",
    failedMany: "Falló la validación (errores {{count}}):",
    cliHints:
      "\n\nEjemplo:\n  {{example}}\n\nO correr de forma interactiva:\n  {{interactive}}\n\nMás información:\n  {{help}}",
    /**
     * Assembly shell, deliberately word-free so it is identical in every
     * language: `fail()` takes a single already-translated message, so the
     * header/bullet/hint parts have to meet inside one final `t()` call.
     */
    report: "{{header}}{{fields}}{{hints}}",
    unexpected: "La validación falló inesperadamente: {{error}}",
  },
  shared: {
    permissions: {
      errors: {
        definitionError: "Error de definición de punto final: {{reason}}",
        allowedRolesMissing:
          "Error de definición de punto final: allowedRoles está desaparecido o no es una lista",
        /**
         * One key per denial cause from checkPlatformAccess. The cause code
         * selects the key; `platform` is the only parameter, and it is a raw
         * runtime value.
         */
        platformAccessDenied: {
          productionDisabled:
            "Acceso denegado en {{platform}} : este punto final está desactivado en la producción",
          platformExcluded:
            "Acceso denegado en {{platform}} : este punto final no está expuesto en esta plataforma",
          cliPackageAuthRequired:
            "Acceso denegado en {{platform}} : este punto final necesita autenticación, que el paquete CLI no puede proporcionar",
          mcpNotListed:
            "Acceso denegado en {{platform}} : este punto final no está listado en MCP",
        },
        /**
         * Four variants instead of one key with `{{userId}}`/`{{userRoles}}`
         * placeholders filled by translated nouns: "public" and "none" are
         * words, not values, so they belong inside the sentence.
         */
        insufficientRoles:
          "El usuario {{userId}} carece de los roles necesarios: {{requiredRoles}} (tiene: {{userRoles}})",
        insufficientRolesNoRoles:
          "El usuario {{userId}} carece de los roles necesarios: {{requiredRoles}} (tiene: ninguno)",
        insufficientRolesPublic:
          "Faltas públicas del usuario roles necesarios: {{requiredRoles}} (tiene: {{userRoles}})",
        insufficientRolesPublicNoRoles:
          "El público del usuario carece de los roles necesarios: {{requiredRoles}} (tiene: ninguno)",
      },
    },
    endpoints: {
      definition: {
        loader: {
          errors: {
            endpointNotFound: "Punto final no encontrado: {{identifier}}",
            loadFailed: "Failed to load endpoint {{identifier}} : {{error}}",
            batchLoadFailed:
              "Failed to load {{failedCount}} of {{totalCount}} endpoints",
            batchLoadError:
              "Failed to load {{failedCount}} of {{totalCount}} endpoints: {{error}}",
          },
        },
      },
    },
  },
};
