import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  errors: {
    find_failed:
      "No se pudieron encontrar los roles del usuario {{userId}}: {{error}}",
    batch_find_failed:
      "No se pudieron consultar en lote los roles de {{count}} usuarios: {{error}}",
    not_found: "No se encontró el rol {{role}} del usuario {{userId}}",
    lookup_failed:
      "No se pudo consultar el rol {{role}} del usuario {{userId}}: {{error}}",
    add_failed:
      "No se pudo asignar el rol {{role}} al usuario {{userId}}: {{error}}",
    no_data_returned: "La base de datos no devolvió datos",
    remove_failed:
      "No se pudo quitar el rol {{role}} al usuario {{userId}}: {{error}}",
    check_failed:
      "No se pudo verificar el rol {{role}} del usuario {{userId}}: {{error}}",
    delete_failed:
      "No se pudieron eliminar los roles del usuario {{userId}}: {{error}}",
    endpoint_not_created:
      "El endpoint de roles de usuario aún no está disponible",
  },
  post: {
    title: "Roles de usuario",
    description: "Endpoint de roles de usuario",
    form: {
      title: "Configuración de roles de usuario",
      description: "Configura los parámetros de los roles de usuario",
    },
    response: {
      title: "Respuesta",
      description: "Datos de respuesta de los roles de usuario",
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
      database_connection_failed: {
        title: "Falló la conexión con la base de datos",
        description: "No se pudo conectar con la base de datos",
      },
    },
    success: {
      title: "Operación completada",
      description: "La operación se completó correctamente",
    },
  },
  enums: {
    userRole: {
      public: "Público",
      customer: "Cliente",
      partnerAdmin: "Administrador del socio",
      partnerEmployee: "Empleado del socio",
      admin: "Administrador",
      cliOff: "CLI desactivada",
      cliAuthBypass: "CLI sin autenticación",
      aiToolOff: "Herramienta de IA desactivada",
      webOff: "Web desactivada",
      mcpOff: "MCP desactivado",
      mcpVisible: "Visible en MCP",
      cronAllowed: "Permitido en cron",
      productionOff: "Desactivado en producción",
      skillOff: "Habilidad desactivada",
    },
  },
};
