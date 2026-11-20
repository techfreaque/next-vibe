import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Gestión de servidores",
  enum: {
    processStatus: {
      running: "Corriendo",
      stopped: "Detenido.",
      error: "Error",
    },
    environment: {
      development: "Desarrollo",
      production: "Producción",
      testing: "Pruebas",
      staging: "Staging",
    },
    mode: {
      development: "Desarrollo",
      production: "Producción",
    },
    framework: {
      next: "Next.js",
      tanstack: "TanStack/Vite",
    },
  },
  build: {
    category: "Gestión de servidores",
    tags: {
      build: "Compilación",
    },
    post: {
      title: "Aplicación de construcción",
      description: "Construir la aplicación para el despliegue de producción",
      form: {
        title: "Configuración de construcción",
        description: "Configurar opciones y ajustes de construcción",
      },
      fields: {
        package: {
          title: "Paquete de construcción",
          description: "Construir el paquete antes de construir la aplicación",
        },
        skipNextCommand: {
          title: "Skip Next.js Command",
          description: "Skip running Next.js construye comando",
        },
        target: {
          title: "Objetivo",
          description:
            "Especifique el objetivo de construcción (por ejemplo, 'producción', 'estancia')",
        },
        skipGeneration: {
          title: "Skip Code Generation",
          description: "Skip API endpoint generation during build",
        },
        generate: {
          title: "Generar código",
          description:
            "Ejecute la generación de códigos durante la construcción",
        },
        generateEndpoints: {
          title: "Generar puntos finales",
          description: "Generar archivos API endpoint durante la construcción",
        },
        generateSeeds: {
          title: "Generar semillas",
          description: "Generar archivos de semilla durante la construcción",
        },
        nextBuild: {
          title: "Next.js Build",
          description: "Corre Next.js proceso de construcción",
        },
        migrate: {
          title: "Ejecutar las migraciones",
          description:
            "Ejecutar las migraciones de bases de datos durante la construcción",
        },
        seed: {
          title: "Correspondiendo",
          description: "Ejecutar la base de datos durante la construcción",
        },
        force: {
          title: "Force Build",
          description: "Continúe acumulando incluso si ocurren errores",
        },
        framework: {
          title: "Framework",
          description: "Marco de Frontend/bundler para construir",
        },
        webpack: {
          title: "Use Webpack",
          description:
            "Usa la webpack en lugar de Turbopack. Uso de memoria inferior (~7.5 GB vs ~12 GB). Permitido por defecto en la producción Docker construye.",
        },
        skipEndpoints: {
          title: "Skip Endpoints Generation",
          description: "Saltar la generación de archivos endpoint",
        },
        skipSeeds: {
          title: "Skip Seeds Generation",
          description: "Saltar la generación de archivos de semilla",
        },
        skipProdMigrations: {
          title: "Skip Production Migrations",
          description: "Skip running database migrations for production",
        },
        skipProdSeeding: {
          title: "Skip Production Seeding",
          description: "Skip database seeding for production",
        },
        runProdDatabase: {
          title: "Ejecutar las operaciones de base de datos de producción",
          description:
            "Ejecutar las operaciones de la base de datos de producción después de construir",
        },
        success: {
          title: "Construir el éxito",
        },
        output: {
          title: "Producto de construcción",
        },
        duration: {
          title: "Construir la duración (ms)",
        },
        errors: {
          title: "Errores de construcción",
        },
        steps: {
          title: "Pasos de construcción",
        },
        label: {
          title: "Paso",
        },
        ok: {
          title: "Operación completada",
        },
        skipped: {
          title: "Saltó.",
        },
      },
      errors: {
        validation: {
          title: "Validación fallida",
          description: "Parámetros de construcción inválidos proporcionados",
        },
        network: {
          title: "Error de red",
          description: "La conexión de red falló durante la construcción",
        },
        unauthorized: {
          title: "Se requiere autenticación",
          description: "Debes iniciar sesión para construir la aplicación",
        },
        forbidden: {
          title: "Acceso denegado",
          description: "Usted no tiene permiso para construir la aplicación",
        },
        notFound: {
          title: "No encontrado",
          description: "Construir recursos no encontrados",
        },
        server: {
          title: "Error del servidor",
          description:
            "Se produjo un error de servidor interno durante la construcción",
        },
        unknown: {
          title: "Error desconocido",
          description:
            "Se produjo un error desconocido durante la construcción",
        },
        conflict: {
          title: "Conflicto",
          description: "Detectar conflictos",
        },
        nextjs_build_failed: {
          title: "Next.js Construir Failed",
          description: "El proceso de construcción Next.js falló: {{error}}",
        },
      },
      success: {
        title: "Construido completado",
        description: "Construcción de aplicaciones terminada con éxito",
      },
      repository: {
        messages: {
          buildStart: " ⁇  Inicio de la aplicación construir...",
          packageBuildStart: "Paquete de construcción...",
          packageBuildSuccess: "↑ Construido de paquetes completados con éxito",
          packageBuildFailed: "Paquete de construcción fallido",
          buildPrerequisites: "Ejecutando requisitos de construcción...",
          skipGeneration:
            "Omitiendo la generación de puntas de API (--generación del esquip)",
          generatingEndpoints: "Generando puntos finales de API...",
          generationSuccess:
            "Identificar la generación de códigos completado con éxito",
          generationFailed: "La generación de códigos falló",
          skipNextBuild:
            "Saltar Next.js construir (se manejará por package.json)",
          buildingNextjs: "Construcción Siguiente.js aplicación...",
          nextjsBuildSuccess: "✅ Next.js construir con éxito",
          nextjsBuildFailed: "Next.js build failed",
          skipProdDb:
            "Omitiendo las operaciones de la base de datos de producción (--run-prod-database=false)",
          buildFailed: "❌ Build failed",
          schemaGenerationStart: "Generando esquema de base...",
          schemaGenerationSuccess:
            "↑ Generación de esquemas de base de datos completado",
          schemaGenerationFailed: "Generación de esquemas de base falló",
          skipSchemaGeneration:
            "Omitiendo la generación de esquemas de base de datos (--run-prod-database=false)",
          reportsGenerationStart: "Generando todos los informes...",
          reportsGenerationSuccess:
            "Identificar todos los informes generados con éxito",
          reportsGenerationFailed: "La generación de informes falló",
          prodDbStart:
            " ⁇  Ejecutando las operaciones de la base de datos de producción...",
          prodDbSuccess:
            ":: Realización de las operaciones de la base de datos de producción",
          prodDbFailed:
            "❌ Producción de construcción falló durante las operaciones de la base de datos",
          prodDbNotReady:
            "♥ Esta construcción es NOT listo para el despliegue de la producción",
          deploymentReady:
            " ⁇  Su aplicación está lista para el despliegue de producción!",
          dbConnectionError:
            "La conexión de bases de datos falló. Por favor, asegúrese de que la base de datos esté funcionando y sea accesible.",
          dbStartSuggestion:
            "Pruebe ejecutar 'docker compose -f docker-compose-dev.yml up -d' para iniciar la base de datos",
          nextBuildHandled:
            "✅ Next.js construir será manejado por el comando de construcción de hilo",
          failedProdMigrations: "Falló en la migración de producción",
        },
      },
    },
  },
  dev: {
    category: "Gestión de servidores",

    post: {
      title: "Dev",
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
  },
  health: {
    category: "Gestión de servidores",

    tag: "Salud",
    get: {
      title: "Control de salud",
      description: "Obtenga el estado de salud del servidor y los diagnósticos",
      form: {
        title: "Opciones de control de salud",
        description: "Configurar los parámetros de control de salud",
      },
      fields: {
        detailed: {
          title: "Informe detallado",
          description: "Incluir información detallada del sistema",
        },
        includeDatabase: {
          title: "Incluir bases de datos",
          description: "Incluye cheques de salud de la base de datos",
        },
        includeTasks: {
          title: "Incluir tareas",
          description: "Incluye cheques de salud para corredores de tareas",
        },
        includeSystem: {
          title: "Incluido el sistema",
          description: "Incluir información sobre los recursos del sistema",
        },
      },
      response: {
        status: {
          title: "Situación",
          description: "Situación general de la salud",
        },
        timestamp: {
          title: "Timestamp",
          description: "Hora de la comprobación de salud",
        },
        uptime: {
          title: "Horas de actualización",
          description: "Tiempo de actualización del servidor en segundos",
        },
        environment: {
          title: "para el Medio Ambiente",
          description: "Información sobre el medio ambiente del servidor",
          name: {
            title: "Environment Name",
          },
          nodeEnv: {
            title: "Node Environment",
          },
          platform: {
            title: "Plataforma",
          },
          supportsTaskRunners: {
            title: "Soporta a los corredores de tareas",
          },
        },
        database: {
          title: "Estado de la base de datos",
          description: "Estado de conexión de bases de datos",
          status: {
            title: "Estado de conexión",
          },
          responseTime: {
            title: "Tiempo de respuesta (ms)",
          },
          error: {
            title: "Mensaje de error",
          },
        },
        tasks: {
          title: "Estado de la tarea",
          description: "Estado del corredor de tareas",
          runnerStatus: {
            title: "Runner Status",
          },
          activeTasks: {
            title: "Tareas activas",
          },
          totalTasks: {
            title: "Total de tareas",
          },
          errors: {
            title: "Cuenta de error",
          },
          lastError: {
            title: "Último error",
          },
        },
        system: {
          title: "Información del sistema",
          description: "Información sobre los recursos del sistema",
          memory: {
            title: "Uso de la memoria",
            description: "Información de memoria del sistema",
            used: {
              title: "Memoria de uso usado",
            },
            total: {
              title: "Total Memory",
            },
            percentage: {
              title: "Uso de la memoria %",
            },
          },
          cpu: {
            title: "CPU Usage",
            description: "Sistema CPU",
            usage: {
              title: "Uso de CPU %",
            },
            loadAverage: {
              title: "Promedio de carga",
            },
          },
          disk: {
            title: "Disk Usage",
            description: "Información del disco del sistema",
            available: {
              title: "Espacio disponible",
            },
            total: {
              title: "Total del espacio",
            },
            percentage: {
              title: "Uso de discos %",
            },
          },
        },
        checks: {
          title: "Controles de salud",
          description: "Comprobaciones de salud individuales del componente",
          item: {
            title: "Control de salud",
            description: "Resultado de comprobación de salud individual",
            name: {
              title: "Nombre del cheque",
            },
            status: {
              title: "Estado de control",
            },
            message: {
              title: "Mensaje",
            },
            duration: {
              title: "Duración ms)",
            },
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
        unsavedChanges: {
          title: "Cambios sin guardar",
          description: "Hay cambios sin salvar",
        },
      },
      success: {
        title: "Operación completada",
        description: "Comprobación de salud terminada con éxito",
      },
    },
  },
  start: {
    category: "Gestión de servidores",
    tags: {
      start: "Comienzo",
    },
    post: {
      title: "Inicio Servidor de Producción",
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
  },
};
