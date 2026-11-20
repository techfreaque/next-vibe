import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  setup: {
    install: {
      post: {
        title: "Instala",
        description: "Instalar el punto final",
        form: {
          title: "Configuración de instalación",
          description: "Configurar parámetros de instalación",
        },
        response: {
          title: "Respuesta",
          description: "Instalar datos de respuesta",
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
    status: {
      post: {
        title: "Estado de instalación CLI",
        description: "Compruebe el estado de instalación actual del Vibe CLI",
        form: {
          title: "Configuración del estado",
          description: "Configurar parámetros de estado",
        },
        response: {
          title: "Estado de instalación",
          description: "Detalles de la instalación CLI actual",
          fields: {
            success: "Situación de la operación",
            installed: "Instalados",
            version: "Versión CLI",
            path: "Sendero de instalación",
            message: "Mensaje de Estado",
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
    uninstall: {
      post: {
        title: "Desinstalación",
        description: "Punto final de desinstalación",
        form: {
          title: "Configuración de desinstalación",
          description: "Configurar parámetros de desinstalación",
        },
        response: {
          title: "Respuesta",
          description: "Datos de respuesta desinstalación",
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
    update: {
      post: {
        title: "Actualización",
        description: "Punto final de actualización",
        form: {
          title: "Configuración de actualización",
          description: "Configurar parámetros de actualización",
        },
        response: {
          title: "Respuesta",
          description: "Datos de respuesta actualizada",
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
  },
  request: "Solicitud",
  response: {
    success: "Respuesta",
    error: "Error",
  },
  auth: {
    errors: {
      userNotFound:
        "Usuario CLI con correo electrónico {{email}} no se encuentra en la base de datos. Por favor, corre 'vibe seed' primero.",
      databaseError:
        "Error de base de datos al buscar el usuario CLI: {{error}}",
      authNotAvailable: "La autenticación no está disponible",
    },
  },
  vibe: {
    noFields: "No hay campos para mostrar",
    startingUp: "Comenzando Vibe CLI...",
    executeCommand: "Ejecución del comando",
    executing: "En ejecución",
    listCommands: "Listar todos los comandos disponibles",
    output: "Formato de salida",
    utils: {
      debug: {
        executionSummary:
          "Ejecución: {{executionSeconds}} s TENIDO: {{overheadSeconds}} s TEN TOTAL: {{totalSeconds}} s",
      },
    },
    help: {
      title: "Vibe CLI Ayuda",
      description:
        "Vibe CLI - Herramienta de ejecución API de próxima generación",
      usage: "Usage: vibe <command> [options]",
      commands: "Comandos disponibles",
      options: "Opciones",
      examples: "Ejemplos",
      locale: "Especificar locale (en- GLOBAL, de- DE, pl- PL)",
      verbose: "Producción de verbosa",
      target:
        "Objetivo de ejecución: dev (default) o local (preview DB with --hermes)",
      thea: "Shorthand for --remote (targets thea) instance)",
      remote:
        "Ejecute en una instancia remota por ID (predeterminado: thea). Busca la conexión desde el DB activo.",
      interactive: "Introducir modo interactivo",
    },
    errors: {
      routeNotFound: "Herramienta no encontrada: {{toolName}}",
      executionFailed: "La ejecución falló",
      executionFailedDetail: "La ejecución falló: {{error}}",
      unknownError: "Error desconocido ocurrido",
      publicPayloadNotSupported: "Carga pública no soportada",
      invalidTokenPayload: "Carga de pago con token inválida",
      invalidToken: "Token inválido",
      signingFailed: "La firma de Token falló",
      userNotFound: "Usuario no encontrado",
      authenticationFailed: "Falló la autenticación",
      invalidFormat: "Formato de sesión inválido",
      sessionExpired: "Período de sesiones expirado",
      notFound: "Período de sesiones no encontrado",
      readFailed: "No ha leído el período de sesiones",
      invalidData: "Datos del período de sesiones inválido",
      writeFailed: "Failed to write session: {{error}}",
      deleteFailed: "Failed to delete session: {{error}}",
      storeFailed: "Failed to store session: {{error}}",
      clearFailed: "Failed to clear session: {{error}}",
      setLeadIdCookieFailed: "Falló para establecer la galleta ID líder",
      remoteNoToken: "La sesión remota no tiene un token activo",
      remoteExpired: "Sesión remota expirada",
      remoteNotFound:
        "No se ha encontrado ninguna sesión remota. Run: vibe login --target remote",
      remoteReadFailed: "No se lee la sesión remota",
      remoteWriteFailed: "Falló en escribir una sesión remota",
      remoteClearFailed: "No se pudo aclarar la sesión remota",
      remoteNoConnection:
        "No hay conexión activa por ejemplo ' {{instanceId}}'. Correr: Vibe conectar <url>",
      remoteNotLoggedIn:
        "No se ha conectado a host remoto. Corre: vibe --remote login",
      remoteNoLeadId: "No podía obtener identidad de host remoto",
      remoteServerError: "Error del servidor remoto",
      remoteNotAvailable:
        "La ejecución remota no está disponible en esta construcción",
    },
    endpoints: {
      endpointHandler: {
        error: {
          form_validation_failed: "Fallo de validación de formularios",
          unauthorized: "Acceso no autorizado",
          errors: {
            unknown_validation_error: "Error de validación desconocido",
            invalid_request_data: "Datos de solicitud inválidos",
            invalid_url_parameters: "Parámetros inválidos URL",
          },
          general: {
            internal_server_error: "Error del servidor interno",
          },
        },
      },
      renderers: {
        cliUi: {
          helpHandler: {
            noDescription: "No hay descripción disponible",
            flagDataDesc: "Proveer datos de solicitud como JSON",
            flagUserTypeDesc:
              "Especifique el tipo de usuario (admin, cliente, público)",
            flagLocaleDesc: "Especificar locale (en- GLOBAL, de- DE, pl- PL)",
            flagOutputDesc: "Formato de salida (pretty, json)",
            flagVerboseDesc: "Producción de verbosa",
            flagDryRunDesc: "Realizar una carrera seca sin ejecutar",
            usageLabel: "Usage",
            availableCommandsLabel: "Comandos disponibles",
            globalOptionsLabel: "Opciones mundiales",
            examplesLabel: "Ejemplos",
          },
          noEndpoint:
            "Esta característica todavía no está disponible. Por favor, inténtelo más tarde.",
          widgets: {
            common: {
              noDataAvailable: "No hay datos disponibles",
              noIssuesFound: "No se encontraron problemas",
              invalidDataFormat: "Formato de datos inválidos",
              invalidFormType:
                "El contexto de la forma no es un estado de forma de tinta. No se puede hacer entrada interactiva.",
              info: "Info",
              items: "Temas",
              andMoreItems: "y {{count}} más artículos",
              affectedFiles: "Archivos afectados",
              summary: "Resumen",
              files: "Archivos",
              issues: "Problemas",
              other: "Otro",
              error: "Error",
              errors: "Errores",
              warning: "Advertencia",
              warnings: "Advertencias",
              hints: {
                spaceToToggle: "(espacio para cambiar)",
                arrowsToChange: "(←/→ para cambiar)",
                dollarPrompt: "$ ",
                executing: "Ejecutando...",
                tabNextField:
                  "ficha: siguiente campo TEN entra: enviar TEN q/esc: salida",
                ctrlCExitHint: "Pulse Ctrl+C de nuevo para salir",
                escExitHint: "Pulse Esc otra vez para salir",
              },
            },
            pagination: {
              notImplemented:
                "Pagination not implemented for CLI. Use filtros para reducir resultados.",
            },
          },
        },
      },
    },
    interactive: {
      welcome: "Bienvenido al Modo Interactivo Vibe",
      goodbye: "¡Adiós!",
      help: {
        selectCategory: "Seleccione una categoría para buscar herramientas",
        selectTool: "Seleccione una herramienta para ver detalles",
        category: "Categoría  ",
        method: "Método  ",
        credits: "Créditos  ",
        callAs: "Llamar   ",
        fields: "Campos",
        hintsNavSelect:
          "flechas: navegando Silencio enter: select Silencio q: dejar de fumar",
        hintsNavSelectBack:
          "flechas: navegando Silencio enter: select ¦ esc: back TEN q: quit",
        hintsExecuteBack:
          "enter: ejecute Silencio esc: volver Silencio q: dejar",
        hintsBack: "enter/esc: back Silencio q: quit",
        success: "Operación completada",
        error: "Error",
        result: "Resultado",
      },
      navigation: {
        rootName: "Root",
        directoryIcon: "📁",
        upIcon: "⬆️",
        goUp: "Sube.",
        routeIcon: "🔗",
        routes: "Rutas",
        settingsIcon: "⚙️",
        settings: "Configuración",
        exitIcon: "🚪",
        exit: "Exit",
        navigate: "Navigate",
        route: "Route",
        method: "Método",
        description: "Descripción",
        noDefinition: "No hay definición encontrada",
        executionFailed: "La ejecución falló",
        executeAnother: "Ejecutar a otro",
        selectLocale: "Seleccione locale",
        englishGlobal: "Inglés (Global)",
        requestData: "Solicitar datos",
        urlParameters: "Parámetros URL",
        preview: "Vista previa",
        executeWithParams: "Ejecutar con parámetros",
        navigationError: "Error de navegación",
        chooseSettingToModify: "Elija la configuración para modificar",
        outputFormatCurrent: "Formato de salida (actual",
        verboseModeCurrent: "Modo de verbosa (corriente",
        localeCurrent: "Locale (actual",
        backToMainMenu: "Volver al menú principal",
        chooseOutputFormat: "Elija el formato de salida",
        prettyFormatted: "Bonito formato",
        jsonRaw: "JSON (Raw)",
        enableVerboseOutput: "Producción de verbosa",
        chooseLocale: "Elija locale",
        german: "Alemán",
        polish: "Polaco",
        settingUpdated: "Configuración actualizada con éxito",
        viewAllRoutes: "Ver todas las rutas",
        selectRoute: "Seleccione una ruta para ejecutar",
        backToNavigation: "Volver a la navegación",
      },
    },
  },
};
