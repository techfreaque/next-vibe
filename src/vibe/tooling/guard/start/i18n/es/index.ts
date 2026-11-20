import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Comienzo de guardia",
  titleShort: "Comienzo de guardia",
  description: "Inicio ambientes de guardia para proyectos VSCode",
  tag: "Comienzo",
  category: "Protección",
  container: {
    title: "Configuración de inicio",
    description: "Configurar los parámetros de inicio de guardia",
  },
  fields: {
    projectPath: {
      title: "Project Path",
      description: "Camino al proyecto VSCode",
      placeholder: "/home/user/projects/my-project",
    },
    guardId: {
      title: "Guardia ID",
      description: "Unico identificador para el ambiente de guardia",
      placeholder: "guard_my_project_abc123",
    },
    startAll: {
      title: "Comiencen todos los guardias",
      description: "Comience todos los entornos de guardia disponibles",
    },
    totalStarted: {
      title: "Total inicial",
    },
    output: {
      title: "Producto",
    },
    startedGuards: {
      columns: {
        username: "Nombre de usuario",
        projectPath: "Project Path",
      },
    },
    summary: {
      title: "Resumen",
    },
    status: {
      title: "Situación",
    },
    hasIssues: {
      title: "Tiene problemas",
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
    internal: {
      title: "Error interno",
      description: "Ocurrió un error interno del servidor",
    },
    notFound: {
      title: "No encontrado",
      description: "Ambiente de guardia no encontrado",
    },
    conflict: {
      title: "Conflicto",
      description: "El ambiente de guardia ya comenzó",
    },
    jailSetupFailed: "La cárcel de guardia falló: {{detail}}",
    vscodeSetupFailed:
      "La configuración de integración VSCode falló: {{detail}}",
    startFailed: "Error interno al iniciar la guardia: {{detail}}",
    guardIdLookupUnsupported:
      "La búsqueda por guardia ID no se implementa todavía - utilizar la ruta del proyecto en su lugar.",
    notAVscodeProject:
      "Guardia requiere un proyecto VSCode - no.vscode directorio en {{projectPath}}",
  },
  success: {
    title: "Operación completada",
    description: "La guardia comenzó con éxito",
  },
};
