import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Protección",
  post: {
    title: "Estado de la guardia",
    titleShort: "Estado de la guardia",
    description: "Estado del entorno de guardia",
    tag: "Situación",
    container: {
      title: "Configuración de estado de guardia",
      description: "Configurar los parámetros de verificación del estado",
    },
    fields: {
      projectPath: {
        title: "Project Path",
        description: "Camino al proyecto de guardia",
        placeholder: "/path/to/project",
      },
      guardId: {
        title: "Guardia ID",
        description: "Unico identificador para el guardia",
        placeholder: "guard-123",
      },
      username: {
        title: "Nombre de usuario",
      },
      status: {
        title: "Situación",
      },
      createdAt: {
        title: "Creado en",
      },
      securityLevel: {
        title: "Nivel de seguridad",
      },
      isolationMethod: {
        title: "Método de solución",
      },
      isRunning: {
        title: "Está corriendo.",
      },
      userHome: {
        title: "User Home",
      },
      listAll: {
        title: "List All Guards",
        description: "Listar todos los entornos de guardia",
      },
      success: {
        title: "Operación completada",
      },
      output: {
        title: "Producto",
      },
      guards: {
        title: "Guards",
      },
      totalGuards: {
        title: "Total Guards",
      },
      activeGuards: {
        title: "Guardias activos",
      },
    },
    form: {
      title: "Configuración del estado",
      description: "Configurar parámetros de estado",
    },
    response: {
      title: "Respuesta",
      description: "Datos sobre la respuesta al estado",
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
      internal: {
        title: "Error interno",
        description: "Ocurrió un error interno del servidor",
      },
      statusFailed:
        "Error interno al comprobar el estado de la guardia: {{detail}}",
    },
    success: {
      title: "Operación completada",
      description: "La operación se completó correctamente",
    },
  },
};
