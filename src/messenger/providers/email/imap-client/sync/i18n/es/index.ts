import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Cliente IMAP",

  title: "Sincronización IMAP",
  titleShort: "IMAP Sync",
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
      detail_sync: "Sincronización: {{error}}",
      detail_status: "No podía leer el estado de sincronización: {{error}}",
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
};
