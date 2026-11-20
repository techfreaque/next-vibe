import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Cliente IMAP",
  tag: "Cliente IMAP",
  tags: {
    health: "Salud",
    monitoring: "Monitoreo",
    sync: "Sincronización",
    accounts: "Cuentas",
    folders: "Carpetas",
    messages: "Mensajes",
    config: "Configuración",
  },
  messages: {
    tag: "Mensajes",
    id: {
      widget: {
        markRead: "Marcar como Leer",
        markUnread: "Marcar como no leído",
        flag: "Bandera",
        unflag: "Unflag",
      },
    },
    errors: {
      server: { title: "Error del servidor" },
      notFound: { title: "Mensaje no encontrado" },
      accountNotFound: { title: "Cuenta no encontrada" },
      syncFailed: { title: "Sincronizado" },
      syncSuccess: { message: "Mensajes sincronizados con éxito" },
      list: {
        get: {
          errors: { server: { title: "Mensajes de error del servidor" } },
        },
      },
    },
  },
  sync: {
    category: "Cliente IMAP",

    title: "IMAP Sync",
    description: "Servicio de sincronización IMAP",
    container: {
      title: "Configuración de sincronización IMAP",
      description: "Configurar los parámetros de sincronización IMAP",
    },
    accountIds: {
      label: "ID de la cuenta",
      description: "ID de cuenta IMAP para sincronizar",
      placeholder: "Introduzca ID de cuenta separados por comas",
    },
    force: {
      label: "Force Sync",
      description:
        "Sincronización de la fuerza incluso si se ha sincronizado recientemente",
    },
    dryRun: {
      label: "Dry Run",
      description: "Realizar una prueba sin hacer cambios",
    },
    maxMessages: {
      label: "Mensajes Max",
      description: "Número máximo de mensajes para sincronizar por carpeta",
      placeholder: "Introduzca el número máximo de mensajes",
    },
    post: {
      title: "Sincronización",
      description: "Punto final sincrónico",
      form: {
        title: "Configuración de sincronización",
        description: "Configurar parámetros de sincronización",
      },
      response: {
        title: "Respuesta",
        description: "Datos de respuesta sincronizada",
        result: {
          title: "Resultados sincronizados",
          description: "Resultados de sincronización detallados",
          accountsProcessed: "Cuentas procesadas",
          foldersProcessed: "Carpetas procesadas",
          messagesProcessed: "Mensajes procesados",
          messagesAdded: "Mensajes añadidos",
          messagesUpdated: "Mensajes Actualizados",
          messagesDeleted: "Mensajes eliminados",
          duration: "Duración",
        },
        errors: {
          error: {
            title: "Error de sincronización",
            description: "Detalles del error",
            code: "Código de error",
            message: "Mensaje de error",
          },
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
    },
    success: {
      title: "Operación completada",
      description: "La operación se completó correctamente",
    },
    widget: {
      title: "Full IMAP Sync",
      options: "Opciones de sincronización",
      noAccounts: "No existen cuentas IMAP configuradas",
      result: "Resultado sincronizado",
      duration: "Duración",
      errors: "Errores",
      accountsProcessed: "Cuentas procesadas",
      foldersProcessed: "Carpetas procesadas",
      messagesProcessed: "Mensajes procesados",
      messagesAdded: "Mensajes añadidos",
      messagesUpdated: "Mensajes Actualizados",
      messagesDeleted: "Mensajes eliminados",
      submit: "Start Sync",
      submitting: "Sincronización...",
    },
  },
  imapErrors: {
    accounts: {
      post: {
        error: {
          duplicate: {
            title: "Cuentas ya existentes",
          },
          server: {
            title: "Error del servidor creando cuenta",
          },
        },
      },
      get: {
        error: {
          not_found: {
            title: "Cuenta no encontrada",
          },
          server: {
            title: "Cuenta de recuperación de errores del servidor",
          },
        },
      },
      put: {
        error: {
          not_found: {
            title: "Cuenta no encontrada",
          },
          duplicate: {
            title: "Cuenta con este correo electrónico ya existe",
          },
          server: {
            title: "Cuenta de actualización de errores del servidor",
          },
        },
      },
      delete: {
        error: {
          not_found: {
            title: "Cuenta no encontrada",
          },
          server: {
            title: "Cuenta de eliminación del error del servidor",
          },
        },
        success: {
          title: "Cuenta eliminada con éxito",
        },
      },
    },
    folders: {
      get: {
        error: {
          not_found: {
            title: "Carpeta no encontrada",
          },
          server: {
            title: "Carpeta de recuperación de errores del servidor",
          },
        },
      },
      sync: {
        error: {
          missing_account: {
            title: "Cuenta no encontrada para sincronización de carpetas",
          },
        },
      },
    },
    messages: {
      get: {
        error: {
          not_found: {
            title: "Mensaje no encontrado",
          },
          server: {
            title: "Mensaje de recuperación del error del servidor",
          },
        },
      },
    },
    connection: {
      failed: "La conexión falló",
      timeout: {
        title: "Tiempo de conexión",
      },
      test: {
        failed: "Prueba de conexión falló",
      },
      close: {
        failed: "No cerrar la conexión",
      },
      folders: {
        list: {
          failed: "Failed to list folders",
        },
      },
      messages: {
        list: {
          failed: "No listar mensajes",
        },
      },
    },
    sync: {
      failed: "Sincronización fallida",
      account: {
        failed: "La sincronización de la cuenta falló: {{error}}",
      },
      folder: {
        failed: "La sincronización de carpetas falló",
      },
      message: {
        failed: "Sincronización del mensaje falló",
      },
      post: {
        error: {
          server: {
            title: "Error del servidor durante la sincronización",
          },
        },
      },
    },
    validation: {
      account: {
        username: {
          required: "Se requiere el nombre de usuario",
        },
        port: {
          invalid: "Número de puerto inválido",
        },
        host: {
          invalid: "Inválido anfitrión",
        },
      },
    },
  },
  imap: {
    "example.com": "imap.example.com",
    "gmail.com": "imap.gmail.com",
    connection: {
      test: {
        success: "Prueba de conexión exitosa",
        failed: "Prueba de conexión falló",
        timeout: "Tiempo de prueba de conexión",
      },
    },
    sync: {
      messages: {
        accounts: {
          success: "Todas las cuentas se sincronizaron con éxito",
          successWithErrors: "Cuentas sincronizadas con errores",
        },
        account: {
          success: "Consecuencias de la cuenta",
          successWithErrors: "Cuenta sincronizada con errores",
        },
        folders: {
          success: "Carpetas sincronizadas con éxito",
          successWithErrors: "Carpetas sincronizadas con errores",
        },
        messages: {
          success: "Mensajes sincronizados con éxito",
          successWithErrors: "Mensajes sincronizados con errores",
        },
      },
      errors: {
        default: "Sincronización IMAP falló",
        account_failed: "La sincronización de la cuenta falló: {{error}}",
        folder_sync_failed: "Falló la sincronización de carpetas: {{error}}",
        message_sync_error: "Error de sincronización del mensaje",
        message_sync_failed: "Sincronización del mensaje falló",
      },
    },
  },
  enums: {
    loggingLevel: {
      error: "Error",
      warn: "Advertencia",
      info: "Info",
      debug: "Depuración",
    },
    syncStatus: {
      pending: "Pendiente",
      syncing: "Sincronización",
      synced: "Sincronizado",
      error: "Error",
    },
    overallSyncStatus: {
      idle: "Idle",
      running: "Corriendo",
      completed: "Completado",
      failed: "Failed",
      cancelled: "Cancelada",
    },
    sortOrder: {
      asc: "Ascendencia",
      desc: "Descendiente",
    },
    authMethod: {
      plain: "Plain",
      oauth2: "OAuth2",
      xoauth2: "XOAuth2",
    },
    imapAuthMethod: {
      plain: "Plain",
      oauth2: "OAuth2",
      xoauth2: "XOAuth2",
    },
    specialUseType: {
      inbox: "Bandeja de entrada",
      sent: "Sent",
      drafts: "Proyectos",
      trash: "Trash",
      junk: "Junk",
      archive: "Archivar",
    },
    folderSortField: {
      name: "Nombre",
      displayName: "Nombre de pantalla",
      messageCount: "Cuenta del mensaje",
      unseenCount: "Cuenta invisible",
      createdAt: "Creado en",
    },
    accountSortField: {
      name: "Nombre",
      email: "Correo electrónico",
      host: "Host",
      enabled: "Enabled",
      lastSyncAt: "Último Sync At",
      createdAt: "Creado en",
    },
    connectionStatus: {
      disconnected: "Desconectado",
      connecting: "Conexión",
      connected: "Conectado",
      error: "Error",
      timeout: "Hora de salir",
    },
    syncStatusFilter: {
      all: "Todos los estados sincronizados",
    },
    accountStatusFilter: {
      all: "Todos los estados de cuenta",
      enabled: "Enabled",
      disabled: "Discapacitados",
    },
    accountFilter: {
      all: "Todas las cuentas",
    },
    messageSortField: {
      subject: "Asunto",
      senderName: "Nombre del remitente",
      senderEmail: "Correo electrónico del remitente",
      recipientEmail: "Recipiente Email",
      recipientName: "Nombre del destinatario",
      isRead: "Leer estado",
      isFlagged: "Flagged",
      messageSize: "Tamaño del mensaje",
      sentAt: "Enviado",
      createdAt: "Creado en",
    },
    messageStatusFilter: {
      all: "Todos los mensajes",
      read: "Leer",
      unread: "No.",
      flagged: "Flagged",
      unflagged: "Unflagged",
      draft: "Proyecto",
      deleted: "Suprimidos",
      hasAttachments: "Tiene adjuntos",
      noAttachments: "No hay adjuntos",
    },
    healthStatus: {
      healthy: "Salud",
      warning: "Advertencia",
      error: "Error",
      maintenance: "Mantenimiento",
    },
    performanceStatus: {
      good: "Buena",
      warning: "Advertencia",
      error: "Error",
    },
  },
};
