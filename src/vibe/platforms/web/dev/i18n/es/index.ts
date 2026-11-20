import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Gestión de servidores",
  enum: {
    framework: {
      next: "Next.js",
      tanstack: "TanStack/Vite",
    },
  },
  post: {
    title: "Dev",
    titleShort: "Servidor Dev",
    description: "Punto final de Dev",
    form: {
      title: "Configuración de Dev",
      description: "Configurar parámetros dev",
    },
    response: {
      title: "Respuesta",
      description: "Datos de respuesta de Dev",
    },
    fields: {
      debug: {
        title: "Modo de depuración",
        description: "Enable modo de depuración para salida de verbose",
      },
      skipDbSetup: {
        title: "Saltar DB Configuración",
        description: "Pasos de configuración de la base de datos",
      },
      skipNextCommand: {
        title: "Skip Next Command",
        description: "Skip running Next.js development server",
      },
      skipDbReset: {
        title: "Skip DB Reset",
        description: "Omitir la operación de reajuste de bases de datos",
      },

      port: {
        title: "Port",
        description: "Número de puerto para el servidor de desarrollo",
      },
      skipGeneratorWatcher: {
        title: "Skip Generator Watcher",
        description: "Skip automatic code generation watcher",
      },
      generatorWatcherInterval: {
        title: "Generator Interval",
        description: "Intervalo para relojero generador en milisegundos",
      },
      skipTaskRunner: {
        title: "Skip Task Runner",
        description: "Saltar a iniciar el sistema de corredores de tareas",
      },
      skipMigrations: {
        title: "Skip Migrations",
        description: "Saltar las migraciones de bases de datos",
      },
      skipMigrationGeneration: {
        title: "Skip Migration Generation",
        description: "Pasar a la generación de migración automática",
      },
      skipSeeding: {
        title: "Skip Seeding",
        description: "Skip database seeing with initial data",
      },
      framework: {
        title: "Framework",
        description: "Marco de Frontend/bundler para utilizar",
      },
      profile: {
        title: "Perfil",
        description:
          "Profilado: establece NEXT_TURBOPACK_TRACING =1 (archivo de tráfico en.next/dev/trace-turbopack) y NEXT_CPU_PROF =1 (escribe.cpuprofile en la salida)",
      },
      success: {
        title: "Operación completada",
      },
      output: {
        title: "Producto",
      },
      duration: {
        title: "Duración",
      },
      serverUrl: {
        title: "Servidor URL",
      },
      databaseStatus: {
        title: "Estado de la base de datos",
      },
      processes: {
        title: "Procesos",
      },
      errors: {
        title: "Errores",
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
};
