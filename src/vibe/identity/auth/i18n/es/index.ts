import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Autenticación",
  search: {
    tag: "Auth",
  },
  authClient: {
    errors: {
      status_save_failed: "Fallado para salvar el estado de autenticación",
      status_remove_failed: "Fallado para eliminar el estado de autenticación",
      status_check_failed: "Fallado para comprobar el estado de autenticación",
      token_save_failed: "Fallado para salvar el token de autenticación",
      token_get_failed: "Fallado para recuperar ficha de autenticación",
      token_remove_failed: "Fallado para eliminar el token de autenticación",
      token_save_failed_detail:
        "Fallado para guardar ficha de autenticación: {{error}}",
      token_get_failed_detail:
        "Fallado para recuperar ficha de autenticación: {{error}}",
      token_remove_failed_detail:
        "Fallado para eliminar el token de autenticación: {{error}}",
    },
  },
  debug: {
    getAuthMinimalUserNext: {
      start: "getAuthMinimalUserNext : - Revisando la autenticación primero",
      result: "getAuthMinimalUserNext : Resultado de getCurrentUserNext",
      authenticated:
        "getAuthMinimalUserNext : El usuario es autenticado, obteniendo leadId",
      returningAuth: "getAuthMinimalUserNext : Devolver usuario autenticado",
      notAuthenticated:
        "getAuthMinimalUserNext : Usuario no autenticado, usuario público que regresa",
    },
    signingJwt: "Firmando JWT",
    jwtSignedSuccessfully: "JWT firmó con éxito",
    errorSigningJwt: "Firma de error JWT",
    verifyingJwt: "Verificar JWT",
    invalidTokenPayload: "Carga de pago con token inválida",
    jwtVerifiedSuccessfully: "JWT verificado con éxito",
    errorVerifyingJwt: "Verificación de errores JWT",
    userIdNotExistsInDb: "El usuario ID no existe en la base de datos",
    sessionNotFound: "Período de sesiones no encontrado",
    sessionExpired: "Período de sesiones expirado",
    errorValidatingUserSession: "Sesion de usuario validada por error",
    errorGettingUserRoles: "Error obteniendo roles de usuario",
    errorCheckingUserAuth:
      "Verificación de errores de autenticación del usuario",
    authenticatingCliUserWithPayload:
      "Authenticating CLI usuario con carga útil",
    errorAuthenticatingCliUserWithPayload:
      "autenticador de errores CLI usuario con carga útil",
    creatingCliToken: "Creación de token CLI",
    errorCreatingCliToken: "Error creando token CLI",
    validatingCliToken: "Validación de token CLI",
    errorValidatingCliToken: "Error de validación CLI token",
    gettingCurrentUserFromNextjs: "Obtener el usuario actual de Next.js",
    errorGettingAuthUserForNextjs:
      "Error obteniendo el usuario de auth para Next.js",
    settingNextjsAuthCookies: "Configuración Siguiente.js auth cookies",
    clearingNextjsAuthCookies: "Clearing Next.js auth cookies",
    gettingCurrentUserFromToken: "Obtener el usuario actual de token",
    errorGettingCurrentUserFromCli: "Error obteniendo el usuario actual de CLI",
    errorGettingAuthUserForCli: "Error de obtener el usuario de auth para CLI",
    errorGettingUserRolesForCli: "Error obteniendo roles de usuario para CLI",
    tokenFromAuthHeader: "Token from auth header",
    tokenFromCookie: "Token de cookie",
    noTokenFound: "No hay token encontrada",
    errorExtractingToken: "Extracción de errores token",
    errorParsingCookies: "Errores que analizan las cookies",
  },
  errors: {
    token_generation_failed: "Fallado para generar la autenticación token",
    invalid_session: "El período de sesiones es nulo o expirado",
    missing_request_context: "Falta el contexto de solicitud",
    missing_locale: "Locale no está bajo petición",
    unsupported_platform: "La plataforma no está respaldada",
    session_retrieval_failed: "Fallado para recuperar la sesión",
    missing_token: "Authentication token está desaparecido",
    invalid_token_signature: "La firma token es nula",
    invalid_token_signature_detail:
      "Error de comprobación de la firma token: {{error}}",
    jwt_payload_missing_id: "JWT payload is missing user ID",
    cookie_set_failed:
      "Fallado para establecer la cookie de autenticación: {{error}}",
    cookie_clear_failed:
      "No se puede limpiar la cookie de autenticación: {{error}}",
    publicPayloadNotSupported:
      "La carga de pago JWT pública no es compatible con la autenticación CLI",
    jwt_signing_failed: "Fallado para firmar JWT token: {{error}}",
    authentication_failed: "La autenticación falló: {{error}}",
    user_not_authenticated: "El usuario no está autenticado: {{email}}",
    publicUserNotAllowed:
      "El usuario público no está permitido para este punto final",
    validation_failed: "Falló la validación",
    failed_to_create_lead: "Failed to create lead",
    native: {
      unsupported:
        "Este método de autenticación no es compatible con React Native",
      storage_failed: "Failed to store autation data: {{error}}",
      clear_failed: "Failed to clear autentication data: {{error}}",
    },
    not_implemented_native:
      "Esta característica todavía no se implementa para React Native",
    unknownError: "Un error desconocido ocurrió durante la autenticación",
  },
  post: {
    title: "Auth",
    description: "Auth endpoint",
    form: {
      title: "Configuración de Auth",
      description: "Configurar parámetros de austeridad",
    },
    response: {
      title: "Respuesta",
      description: "Datos de respuesta de Auth",
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
      missing_locale: {
        title: "Missing Locale",
        description: "Parámetro local es necesario",
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
      token_generation_failed: {
        title: "Token Generation Failed",
        description: "Fallado para generar la autenticación token",
      },
      invalid_session: {
        title: "Período de sesiones inválido",
        description: "El período de sesiones es nulo o expirado",
      },
      missing_request_context: {
        title: "Solicitud de desaparición Contexto",
        description: "Falta el contexto de solicitud",
      },
      unsupported_platform: {
        title: "Plataforma no apoyada",
        description: "La plataforma no está respaldada",
      },
      session_retrieval_failed: {
        title: "Sesión de recuperación fracasada",
        description: "Fallado para recuperar la sesión",
      },
      missing_token: {
        title: "Perdido Token",
        description: "Authentication token está desaparecido",
      },
      invalid_token_signature: {
        title: "Inválido Token Signature",
        description: "La firma token es nula",
      },
      jwt_payload_missing_id: {
        title: "JWT Payload Missing ID",
        description: "JWT payload is missing user ID",
      },
      cookie_set_failed: {
        title: "Juego de cookies Failed",
        description: "Fallado para establecer la cookie de autenticación",
      },
      cookie_clear_failed: {
        title: "Cookie Clear Failed",
        description: "No se puede limpiar la cookie de autenticación",
      },
    },
    success: {
      title: "Operación completada",
      description: "La operación se completó correctamente",
    },
  },
  check: {
    get: {
      title: "Revisar Authentication",
      description: "Compruebe el estado de autenticación actual",
      response: {
        title: "Estado de autenticación",
        description: "Estado de autenticación actual",
        authenticated: "Authenticated",
        tokenValid: "Token Valid",
      },
    },
  },
  enums: {
    webSocketErrorCode: {
      unauthorized: "Se requiere autenticación",
      forbidden: "Acceso denegado",
      invalidToken: "Token inválido",
      tokenExpired: "Token Expired",
      serverError: "Error del servidor",
    },
  },
};
