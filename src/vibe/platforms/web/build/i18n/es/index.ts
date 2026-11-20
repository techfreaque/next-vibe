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
    build: "Compilación",
  },
  post: {
    title: "Aplicación de construcción",
    titleShort: "Construir la aplicación",
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
        description: "Ejecute la generación de códigos durante la construcción",
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
      vibeMode: {
        title: "Modo de instalación",
        description:
          "Hornea el modo de instancia en el paquete Next.js. 'agent' = instancia local personal. 'cloud' = Despliegue de SaaS. 'dev' = instancia de codificación (default). Supera el NEXT_PUBLIC_VIBE_MODE en.env.",
        options: {
          agent: "Agente (cuestión local personal)",
          cloud: "Cloud (desplegación de SA)",
          dev: "Dev (cuestión de codificación, predeterminado)",
        },
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
        description: "Se produjo un error desconocido durante la construcción",
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
        packageBuildFailed: "Fallo de la construcción del paquete: {{error}}",
        buildPrerequisites: "Ejecutando requisitos de construcción...",
        skipGeneration:
          "Omitiendo la generación de puntas de API (--generación del esquip)",
        generatingEndpoints: "Generando puntos finales de API...",
        generationSuccess:
          "Identificar la generación de códigos completado con éxito",
        generationFailed: "La generación de códigos falló",
        generationFailedDetail: "La generación del código falló: {{error}}",
        tanstackBuildStart: "Building TanStack Start (SSR)...",
        tanstackBuildSuccess: "✅ TanStack Start (SSR) construir con éxito",
        tanstackBuildFailed: "TanStack Start build failed",
        tanstackBuildFailedDetail: "TanStack Start build failed: {{error}}",
        skipNextBuild:
          "Saltar Next.js construir (se manejará por package.json)",
        buildingNextjs: "Construcción Siguiente.js aplicación...",
        nextjsBuildSuccess: "✅ Next.js construir con éxito",
        nextjsBuildFailed: "Next.js build failed: {{error}}",
        nextjsBuildOom:
          "Next.js construyen asesinados por el OS (de memoria similar) - señal: {{signal}}",
        nextjsBuildExitCode: "Next.js construir salió con código {{code}}",
        skipProdDb:
          "Omitiendo las operaciones de la base de datos de producción (--run-prod-database=false)",
        buildFailed: "❌ Build failed: {{error}}",
        unknownError: "error desconocido",
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
          "❌ Producción no se pudo realizar durante las operaciones de la base de datos: {{error}}. Pruebe ejecutar 'docker compose -f docker-compose-dev.yml up -d' para iniciar la base de datos.",
        prodDbConnectionFailed:
          "❌ Producción no se logró durante las operaciones de la base de datos: la base de datos es inalcanzable ({{error}}). Asegúrese de que está funcionando, luego trate de 'docker compose -f docker-compose-dev.yml up -d' para empezar.",
        prodDbNotReady:
          "♥ Esta construcción es NOT listo para el despliegue de la producción",
        deploymentReady:
          " ⁇  Su aplicación está lista para el despliegue de producción!",
        nextBuildHandled:
          "✅ Next.js construir será manejado por el comando de construcción de hilo",
        failedProdMigrations: "Falló en la migración de producción",
      },
    },
  },
};
