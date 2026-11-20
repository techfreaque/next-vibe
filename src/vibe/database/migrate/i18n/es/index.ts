import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Operaciones de base de datos",

  tag: "migration",
  post: {
    title: "Migración de bases de datos",
    titleShort: "Migrar DB",
    description: "Ejecutar la migración de bases de datos",
    form: {
      title: "Configuración migratoria",
      description: "Configurar las opciones de migración de bases de datos",
    },
    response: {
      title: "Respuesta a la migración",
      description: "Resultado de la operación migratoria",
    },
    errors: {
      validation: {
        title: "Error de validación",
        description: "Parámetros de migración inválidos",
      },
      internal: {
        title: "Error interno",
        description: "La operación de migración falló",
      },
      unauthorized: {
        title: "Se requiere autenticación",
        description: "Autenticación necesaria para las operaciones migratorias",
      },
      forbidden: {
        title: "Acceso denegado",
        description:
          "Autorizaciones insuficientes para las operaciones de migración",
      },
      notFound: {
        title: "No encontrado",
        description: "Recursos de migración no encontrados",
      },
      server: {
        title: "Error del servidor",
        description: "Error del servidor interno durante la migración",
      },
      unknown: {
        title: "Error desconocido",
        description: "Se produjo un error desconocido durante la migración",
      },
      conflict: {
        title: "Conflicto",
        description: "Conflicto de migración detectado",
      },
      network: {
        title: "Error de red",
        description: "Error de red durante la operación migratoria",
        detail: "La migración falló: {{error}}",
        exitCode: "drizzle-kit migrate salió con el código {{code}}",
      },
    },
    success: {
      title: "Migración exitosa",
      description: "La migración de bases de datos se completó con éxito",
    },
  },
  fields: {
    generate: {
      title: "Generar migraciones",
      description:
        "Generar nuevos archivos de migración desde cambios de esquemas",
    },
    redo: {
      title: "Redo Last Migration",
      description: "Retroceder y volver a aplicar la última migración",
    },
    schema: {
      title: "Plan de base de datos",
      description:
        "Objetivo de la base de datos esquema (por defecto: público)",
    },
    success: {
      title: "Situación de éxito",
    },
    migrationsRun: {
      title: "Migraciones Run",
    },
    migrationsGenerated: {
      title: "Migraciones generadas",
    },
    output: {
      title: "Producto",
    },
    duration: {
      title: "Duración ms)",
    },
  },
  errors: {
    validation: {
      title: "Error de validación",
      description: "Parámetros de migración inválidos",
    },
    internal: {
      title: "Error interno",
      description: "La operación de migración falló",
    },
    unauthorized: {
      title: "Se requiere autenticación",
      description: "Autenticación necesaria para las operaciones migratorias",
    },
    forbidden: {
      title: "Acceso denegado",
      description:
        "Autorizaciones insuficientes para las operaciones de migración",
    },
    notFound: {
      title: "No encontrado",
      description: "Recursos de migración no encontrados",
    },
    server: {
      title: "Error del servidor",
      description: "Error del servidor interno durante la migración",
    },
    unknown: {
      title: "Error desconocido",
      description: "Se produjo un error desconocido durante la migración",
    },
    conflict: {
      title: "Conflicto",
      description: "Conflicto de migración detectado",
    },
    generationFailed: "Failed to generate migrations: {{message}}",
    generationFailedWithCode:
      "Generación de migración falló con el código {{code}} : {{output}}",
    migrationFailed: "Fallado en la migración: {{message}}",
  },
  success: {
    title: "Migración exitosa",
    description: "La migración de bases de datos se completó con éxito",
  },
  status: {
    pending: "Pendiente",
    running: "Corriendo",
    success: "Operación completada",
    failed: "Failed",
    rolledBack: "Retrocedido",
  },
  direction: {
    up: "Arriba",
    down: "Abajo",
  },
  environment: {
    development: "Desarrollo",
    staging: "Staging",
    production: "Producción",
  },
  messages: {
    dryRun: "DRY RUN : Dirigir las migraciones",
    generatingMigrations: "Generación migratoria:\n{{output}}\n",
    noMigrationsFolder: "No hay carpeta de migración encontrada",
    noMigrationFiles: "No hay archivos de migración encontrados",
    executedMigrations: "Ejecutado las migraciones {{count}} con éxito",
    redoNotImplemented: "La funcionalidad de redo se implementaría aquí",
    repairCompleted: "Reparación de la migración con éxito",
    repairDryRun: "Corrección seca: Se realizará la reparación migratoria",
    trackingReset: "Reajuste de seguimiento de migración con éxito",
    productionCompleted: "Migraciones de producción completadas con éxito",
    productionWithBackup: " (con respaldo)",
    syncCompleted: "Sincronización de migración con éxito ({{direction}})",
    failedToGenerate: "Failed to generate migrations: {{error}}",
    failedToExecute: "Failed to execution migrations: {{error}}",
    failedToRedo: "Fallado para rehacer la migración: {{error}}",
  },
};
