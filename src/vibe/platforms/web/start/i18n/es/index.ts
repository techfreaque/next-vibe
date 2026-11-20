import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Gestión de servidores",
  enum: {
    framework: {
      next: "Next.js",
      tanstack: "TanStack/Vite",
    },
  },
  tags: {
    start: "Comienzo",
  },
  post: {
    title: "Inicio Servidor de Producción",
    titleShort: "Inicio Servidor",
    description: "Iniciar el servidor de producción con pre-tareas y Next.js",
    form: {
      title: "Configuración de inicio",
      description: "Configurar los parámetros de inicio del servidor",
    },
    response: {
      title: "Respuesta",
      description: "Datos de respuesta inicial",
    },
    fields: {
      skipPre: {
        title: "Skip Pre-tasks",
        description: "Saltar pre-tareas antes de iniciar el servidor",
      },
      skipNextCommand: {
        title: "Skip Next.js Command",
        description: "Skip running Next.js comienza el comando",
      },
      mode: {
        title: "Modo de servidor",
        description:
          "Que subsistemas a ejecutar: todo (por defecto), web (Siguiente.js + WS solamente), tareas (sólo corredor de tareas)",
        options: {
          all: "Todos (por defecto)",
          web: "Web solamente (Siguiente.js + WebSocket)",
          tasks: "Sólo tareas (corredor de cron)",
        },
      },
      seed: {
        title: "Correspondiendo",
        description: "Ejecución de bases de datos en la puesta en marcha",
      },
      dbSetup: {
        title: "Configuración de bases de datos",
        description:
          "Configuración de bases de datos y migraciones en la puesta en marcha",
      },
      taskRunner: {
        title: "Task Runner",
        description: "Iniciar el sistema de corredores de tareas",
      },
      nextServer: {
        title: "Next.js Server",
        description: "Iniciar el servidor Next.js",
      },
      port: {
        title: "Port",
        description: "Número de puerto para el servidor",
      },
      profile: {
        title: "Perfil",
        description:
          "Profilado: establece NEXT_CPU_PROF =1 (escribe.cpuprofile en la salida) para la producción Next.js servidor",
      },
      framework: {
        title: "Framework",
        description: "Marco de Frontend/bundler para comenzar",
      },
      vibeMode: {
        title: "Modo de instalación",
        description:
          "Modo de instancia de override en tiempo de ejecución. Patea el paquete construido. 'agent' = instancia local personal. 'cloud' = SaaS. 'dev' = coding instance.",
        options: {
          agent: "Agente (cuestión local personal)",
          cloud: "Cloud (desplegación de SA)",
          dev: "Dev (cuestión de codificación)",
        },
      },
      skipTaskRunner: {
        title: "Skip Task Runner",
        description: "Skip start the task runner",
      },
      success: {
        title: "Operación completada",
      },
      serverStarted: {
        title: "Server Started",
      },
      output: {
        title: "Producto",
      },
      serverInfo: {
        title: "Información del servidor",
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
      tanstackBuildNotFound:
        'No TanStack Start build found - ¿"Vibe build --tanstack" funcionó?',
      tanstackServerExited:
        "El servidor de inicio de TanStack salió inmediatamente",
      nextBuildNotFound: 'No.next-prod build found - ¿"vibe build" corrió?',
      startFailed: "Fallado para iniciar el servidor",
    },
    success: {
      title: "Operación completada",
      description: "La operación se completó correctamente",
    },
    repository: {
      messages: {
        startingServer: " ⁇  Comenzar servidor de producción...",
        environment: "✅ Environment: ",
        runningPreTasks: "Ejecutando tareas previas a la puesta en marcha...",
        runningMigrations: "Ejecutando las migraciones de bases de datos...",
        migrationsCompleted: "Completo las migraciones de bases de datos",
        failedMigrations: "Falló en la migración",
        seedingDatabase: "Ver la base de datos...",
        seedingCompleted: "Identificar la base de datos completado",
        failedSeeding: "Fallado en la base de datos de semillas",
        startingTaskRunner:
          "Inicio del sistema de ejecución de tareas de producción...",
        failedTaskRunner: "No ha comenzado a ejecutar la tarea de producción",
        taskRunnerStarted:
          "TENIDO Corredor de tareas de producción iniciado con ",
        taskRunnerStartedSuffix: " tareas",
        taskRunnerSkipped:
          "Corredor de tareas de producción saltado (-- bandera de punta de tacón utilizado)",
        skipNextStart:
          "Saltar Siguiente.js inicio (se manejará por package.json)",
        serverWillStart:
          "El servidor de producción será iniciado por package.json",
        serverAvailable: "El servidor estará disponible en http://localhost:",
        startupPrepared:
          "Escucho la creación del servidor de producción preparado con éxito",
        failedStart: "❌ Failed to start production server: ",
        gracefulShutdown:
          "Cerramiento elegante solicitado para el corredor de tareas de producción",
      },
    },
  },
};
