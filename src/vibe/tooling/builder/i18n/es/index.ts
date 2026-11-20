import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Builder",
  description: "Herramienta de construcción y paquete para el proyecto",
  cli: {
    build: {
      description: "Tipo de construcción: construcción",
      configOption: "especifique la ruta del archivo config",
      defaultConfig: "build.config.ts",
    },
  },
  enums: {
    profile: {
      development: "Desarrollo",
      production: "Producción",
    },
    buildType: {
      reactTailwind: "React + Tailwind",
      react: "React",
      vanilla: "Vanilla JS",
      executable: "Ejecutible (Bun)",
      spa: "SPA (Vite app build)",
    },
    bunTarget: {
      bun: "Bun Runtime",
      node: "Node.js",
      browser: "Navegador",
    },
    sourcemap: {
      external: "Externo (archón de mapa)",
      inline: "Inline (embedded)",
      none: "Ninguno (discapacitado)",
    },
    format: {
      esm: "Módulo ES",
      cjs: "CommonJS",
      iife: "IIFE (Browser)",
    },
    viteMinify: {
      esbuild: "esbuild (fast)",
      terser: "Terser (pequeña)",
      false: "Discapacitados",
    },
    viteLibFormat: {
      es: "Módulo ES",
      cjs: "CommonJS",
      umd: "UMD",
      iife: "IIFE",
    },
    viteSourcemap: {
      true: "Enabled",
      false: "Discapacitados",
      inline: "Inline",
      hidden: "Oculto",
    },
  },
  errors: {
    inputFileNotFound: "Archivo de entrada {{filePath}} no existe",
    invalidOutputFileName: "Nombre del archivo de salida es inválido",
    invalidBuildConfig:
      "Formato de configuración de construcción inválido. Asegúrese de que el config exporte un objeto BuildConfig predeterminado.",
    configNotFound: "Archivo de confianza no encontrado: {{path}}",
    inputRequired:
      "El archivo de entrada es necesario para este objetivo de construcción",
    emptyConfig: "Configuración vacía - no se definen pasos de construcción",
  },
  warnings: {
    outputIsDirectory:
      "La ruta de salida debe ser un archivo, no un directorio: {{path}}",
    sourceNotFound: "Archivo fuente no encontrado: {{path}}",
  },
  suggestions: {
    checkFilePaths:
      "Compruebe que todas las rutas de archivo son correctas y los archivos existen",
    runFromProjectRoot:
      "Asegúrese de que se está ejecutando desde el directorio raíz del proyecto",
    checkPermissions:
      "Consultar permisos de archivo para directorios de entrada y salida",
    checkDependencies:
      "Algunas dependencias pueden faltar - las importaciones de cheques",
    runInstall:
      "Pruebe ejecutar 'bun install' para asegurar que todas las dependencias estén disponibles",
    increaseMemory:
      "Para grandes construcciones, trate de aumentar la memoria: NODE_OPTIONS =--max-old-space-size=4096",
    useExternals:
      "Considerar la posibilidad de marcar grandes dependencias como externas",
    checkSyntax: "Compruebe los errores de sintaxis en sus archivos fuente",
    runTypecheck: "Ejecute 'bun typecheck' para comprobar errores de tipo",
    increaseTimeout:
      "Aumentar el valor de tiempo para la operación de construcción",
    checkNetworkConnection: "Comprueba tu conexión de red",
    checkDiskSpace: "Compruebe el espacio de disco disponible",
    cleanBuildCache:
      "Pruebe limpiar el caché de construcción y archivos temporales",
  },
  messages: {
    buildStart: "Comenzando a construir...",
    cleaningDist: "Directorio de salidas de limpieza...",
    cleaningFolders: "Carpetas de limpieza...",
    buildingVersion: "Versión de construcción {{version}}...",
    bundlingCli: "Bundling CLI con Bun...",
    bundleFailed: "El paquete falló: {{error}}",
    bundleFailedUnknown: "Bundle falló sin un mensaje de error",
    outputMissing:
      "El paquete no produjo salida: {{output}} falta o está vacío",
    bundleSuccess: "CLI con éxito",
    creatingPackageJson: "Creando paquete.json...",
    copyingFiles: "Copiar README y LICENSE...",
    copyingAdditionalFiles: "Copiando archivos adicionales...",
    publishInstructions: "Publicar:",
    buildComplete: "¡Construye completo!",
    buildFailed: "Construído fallido",
    loadingConfig: "Cargando config de {{path}}...",
    cleaningFolder: "Carpeta de limpieza: {{folder}}",
    compilingFiles: "Compilar archivos con Vite...",
    compilingFile: "Compiling: {{file}}",
    fileCompiled: "Compilado: {{file}}",
    buildingWithVite: "Edificio con Vite ({{type}})...",
    usingInlineConfig: "Usando la configuración inline...",
    filesCopied: "Archivos copiados con éxito",
    dryRunMode: "[DRY RUNNo se harán cambios",
    buildSummary: "Construir Resumen:",
    totalDuration: "Duración total",
    filesBuilt: "Archivos construidos",
    filesCopiedCount: "Archivos copiados",
    stepsCompleted: "Pasos completados",
    usingProfile: "Perfil de uso: {{profile}}",
    runningPreBuild: "Correndo gancho pre-construido...",
    runningPostBuild: "Correndo gancho post-build...",
    preBuildComplete: "Gancho pre-construido completado",
    postBuildComplete: "Gancho post-build completado",
    analyzingBundles: "Analizar tamaños de paquetes...",
    bundleAnalysis: "Análisis de la capacidad",
    optimizationTips: "Consejos de optimización",
    suggestions: "Sugerencia",
    validatingConfig: "Validando la configuración de construcción...",
    configValid: "La configuración es válida",
    configWarnings: "Avisos de configuración",
    tsEntrypointWithNode:
      "Punto de entrada TypeScript con el objetivo Node - considerar utilizar el objetivo Bun para una mejor compatibilidad",
    watchModeStarted:
      "El modo de reloj comenzó - esperando cambios de archivo...",
    watchModeRebuild: "Cambio de archivo: {{file}} - reconstrucción...",
    watchModeReady: "Construir completo - mirar para los cambios...",
    watchModeError: "Error del modo de reloj: {{error}}",
    watchModeStopped: "Modo de reloj parado",
    parallelCompiling: "Compilar archivos {{count}} en paralelo...",
    parallelComplete:
      "Compilación paralela completa: archivos {{count}} en {{duration}} ms",
    cacheHit: "Golpe de caché: {{file}} (pateada)",
    cacheMiss: "Cache miss: {{file}} (reconstrucción)",
    cacheCleared: "Construir caché despejado",
    cacheStats:
      "Cache: {{hits}} hits, {{misses}} misses ({{hitRate}} % hit rate)",
    generatingReport: "Generando informe de construcción...",
    reportGenerated: "Informe de construcción generado: {{path}}",
    progress: "[{{current}}/{{total}}] {{step}}",
    spinnerBuilding: "Edificio...",
    spinnerCompiling: "Compilando...",
    spinnerBundling: "Bundling...",
  },
  post: {
    title: "Paquete de construcción",
    titleShort: "Paquete de construcción",
    description:
      "Herramienta de construcción completa que soporta la agrupación CLI, Vite construye, React/Tailwind, y distribución npm",
    form: {
      title: "Configuración de construcción",
      description:
        "Configurar configuración de construcción o utilizar un archivo build.config.ts",
    },
    fields: {
      // Config file path
      configPath: {
        title: "Carpe de archivo Config",
        description:
          "Camino para construir archivo de configuración (build.config.ts)",
        placeholder: "build.config.ts",
      },
      // Config object
      configObject: {
        title: "Construir opciones",
        description:
          "Configuración de construcción en línea (archivo de configuración de overrides)",
      },
      // Runtime options
      profile: {
        title: "Perfil de construcción",
        description:
          "Desarrollo (rápido, depuro) o Producción (optimizada, minificada)",
      },
      dryRun: {
        title: "Dry Run",
        description:
          "Previsualizar lo que se construiría sin ejecutar realmente",
      },
      verbose: {
        title: "Productos de Verbose",
        description: "Mostrar información detallada y progreso",
      },
      analyze: {
        title: "Análisis de la capacidad",
        description:
          "Analizar tamaños de paquetes e identificar oportunidades de optimización",
      },
      watch: {
        title: "Modo de reloj",
        description: "Vea los cambios de archivo y reconstruya automáticamente",
      },
      parallel: {
        title: "Parallel Build",
        description:
          "Compilar múltiples archivos en paralelo para construcciones más rápidas",
      },
      cache: {
        title: "Construir Cache",
        description:
          "Cache construye artefactos para saltar archivos no cambiados",
      },
      report: {
        title: "Generar informe",
        description: "Generar un informe JSON con métricas detalladas",
      },
      minify: {
        title: "Minificar",
        description:
          "Minifique el paquete de salida (figuración de perfil de overrides)",
      },
      // Folders to clean
      foldersToClean: {
        title: "Carpetas para limpiar",
        description:
          "Carpetas para eliminar antes de construir (por ejemplo, dist, build)",
        placeholder: "dist, build,.cache",
      },
      // Files to compile
      filesToCompile: {
        title: "Archivos a Compile",
        description: "Lista de archivos para compilar con Vite o Bun",
      },
      fileToCompile: {
        title: "Configuración de archivos",
      },
      disabled: {
        title: "Discapacitados",
        description: "Saltar esta entrada durante la construcción",
      },
      input: {
        title: "Input File",
        description:
          "Camino del archivo de punto de entrada (por ejemplo, src/index.ts)",
        placeholder: "src/index.ts",
      },
      output: {
        title: "Archivo de salida",
        description:
          "Carril de salida del archivo (por ejemplo, dist/index.js)",
        placeholder: "dist/index.js",
      },
      type: {
        title: "Tipo de construcción",
        description: "Tipo de construcción: React, Vanilla JS, o ejecutable",
      },
      modulesToExternalize: {
        title: "Módulos externos",
        description:
          "Módulos para excluir del paquete (por ejemplo, reaccionar, lodash)",
        placeholder: "react, react-dom, lodash",
      },
      inlineCss: {
        title: "Inline CSS",
        description: "Inyecte CSS directamente en el paquete JavaScript",
      },
      bundleReact: {
        title: "Bundle React",
        description: "Incluir React en el paquete en lugar de como externo",
      },
      // Package config
      packageConfig: {
        title: "Paquete Config",
        description:
          "Ajustes para bibliotecas se construye con declaraciones TypeScript",
      },
      isPackage: {
        title: "Is Package",
        description:
          "Activar el modo bibliotecario con las exportaciones de paquetes",
      },
      dtsInclude: {
        title: "DTS Include",
        description:
          "Pautas de brillo para los archivos TypeScript para incluir en declaraciones",
        placeholder: "src/**/*.ts",
      },
      dtsEntryRoot: {
        title: "DTS Entry Root",
        description:
          "Directorio raíz para la generación de archivo de declaración",
        placeholder: "src",
      },
      // Bun options
      bunOptions: {
        title: "Opciones de los grupos",
        description:
          "Opciones de construcción específicas para grupos ejecutables",
      },
      bunTarget: {
        title: "Plazo de destino",
        description: "Tiempo de ejecución del objetivo: Bun, Node.js o Browser",
      },
      bunMinify: {
        title: "Minificar",
        description: "Minificación habilitada para menor producción",
      },
      sourcemap: {
        title: "Mapas de fuentes",
        description: "Generar mapas de fuentes para depurar",
      },
      external: {
        title: "Módulos externos",
        description: "Módulos para excluir del paquete",
        placeholder: "react, react-dom",
      },
      define: {
        title: "Definir Constantes",
        description:
          "Constantes de tiempo compil como JSON (por ejemplo, process.env. NODE_ENV)",
        placeholder: '{"process.env.NODE_ENV": "\\"production\\""}',
      },
      splitting: {
        title: "Código de división",
        description: "Activar código de división para pedazos compartidos",
      },
      format: {
        title: "Formato de salida",
        description: "Formato del módulo: ESM, CommonJS o IIFE",
      },
      bytecode: {
        title: "Bytecode",
        description:
          "Compilar a Bun bytecode para una puesta en marcha más rápida",
      },
      banner: {
        title: "Banner",
        description:
          "Texto para prependir a la salida (por ejemplo, línea de shebang)",
        placeholder: "#!/usr/bin/env node",
      },
      footer: {
        title: "Footer",
        description: "Texto para el apéndice de la salida",
        placeholder: "// End of file",
      },
      publicPath: {
        title: "Sendero público",
        label: "Sendero público",
        description: "Prefijo de ruta pública para activos",
      },
      naming: {
        title: "Naming",
        label: "Naming",
        description: "Patrón de nombres de salida",
      },
      root: {
        title: "Root",
        label: "Root",
        description: "Directorio Root",
      },
      conditions: {
        title: "Condiciones",
        label: "Condiciones",
        description: "Condiciones de exportación",
      },
      loader: {
        title: "Loader",
        label: "Loader",
        description: "Cargador de archivos",
      },
      drop: {
        title: "Drop",
        label: "Drop",
        description: "Identificadores para dejar caer",
      },
      // Vite options
      viteOptions: {
        title: "Opciones de vibración",
        description: "Configuración avanzada de construcción Vite",
      },
      viteTarget: {
        title: "Objetivo",
        description:
          "Objetivos de navegador/ambiente (por ejemplo, es2020, cromo80)",
        placeholder: "es2020, chrome80, node18",
      },
      viteOutDir: {
        title: "Directorio de productos",
        description: "Directorio para la producción de construcción",
        placeholder: "dist",
      },
      viteAssetsDir: {
        title: "Assets Directory",
        description: "Subdirectorio para activos estáticos",
        placeholder: "assets",
      },
      viteAssetsInlineLimit: {
        title: "Límite de línea",
        description: "Tamaño máximo (bytes) a activos en línea como base64",
        placeholder: "4096",
      },
      viteChunkSizeWarningLimit: {
        title: "Advertencia de tamaño del trozo",
        description: "Tamaño del trozo (KB) que activa una advertencia",
        placeholder: "500",
      },
      viteCssCodeSplit: {
        title: "Código CSS Split",
        description: "Split CSS en archivos separados por pedazo",
      },
      viteSourcemap: {
        title: "Mapas de fuentes",
        description: "Modo de generación de mapas fuente",
      },
      viteMinify: {
        title: "Minifier",
        description: "Herramienta de Mineción: esbuild o terser",
      },
      viteEmptyOutDir: {
        title: "Empty Output Dir",
        description: "Directorio de salida limpia antes de construir",
      },
      viteReportCompressedSize: {
        title: "Informe comprimido",
        description: "Informe de los tamaños de los paquetes con cremallera",
      },
      viteManifest: {
        title: "Manifiesto de construcción",
        description:
          "Generar un manifiesto.json para la huella dactilar del activo",
      },
      // Vite lib options
      viteLib: {
        title: "Modo de biblioteca",
        description: "Configurar el modo de construcción de biblioteca Vite",
      },
      viteLibEntry: {
        title: "Punto de entrada",
        description: "Archivo(s) del punto de entrada de la biblioteca",
        placeholder: "src/index.ts",
      },
      viteLibName: {
        title: "Nombre de la biblioteca",
        description: "Nombre de variable global para UMD / IIFE construye",
        placeholder: "MyLibrary",
      },
      viteLibFormats: {
        title: "Formatos de producción",
        description: "Formatos de salida de la biblioteca (ES, CJS, UMD, IIFE)",
      },
      viteLibFileName: {
        title: "Nombre del archivo",
        description: "Nombre del archivo de salida (sin extensión)",
        placeholder: "my-library",
      },
      // Rollup options
      viteRollupOptions: {
        title: "Opciones de rodillo",
        description: "Configuración avanzada de rodillos",
      },
      rollupExternal: {
        title: "Módulos externos",
        description: "Módulos para excluir del paquete",
        placeholder: "react, react-dom",
      },
      rollupTreeshake: {
        title: "Árbol sacudiendo",
        description: "Eliminar código no utilizado del paquete",
      },
      rollupOutput: {
        title: "Opciones de producción de rodillos",
        label: "Opciones de producción de rodillos",
        description: "Opciones de salida de la lista de pasos",
      },
      viteTsconfigPath: {
        title: "tsconfig Path",
        description:
          "Camino a tsconfig para los tópicos vite-tsconfig (modo SPA)",
        placeholder: "tsconfig.tanstack.json",
      },
      viteModuleAliases: {
        label: "Módulo Aliases",
        description:
          "Mapa de los especificadores de importación para resolver las trayectorias de archivo (aplica tanto al cliente como a SSR)",
      },
      vitePlugins: {
        title: "Plugins Vite",
        label: "Plugins Vite",
        description: "Raw Vite plugins array (para uso programático)",
      },
      viteBuild: {
        title: "Opciones de construcción en bruto",
        label: "Opciones de construcción en bruto",
        description: "Opciones de construcción Passthrough Vite",
      },
      // Files to copy
      filesOrFoldersToCopy: {
        title: "Archivos para copiar",
        description:
          "Archivos o carpetas para copiar después de la compilación",
      },
      copyConfig: {
        title: "Configuración de copia",
      },
      copyInput: {
        title: "Fuente",
        description: "Archivo fuente o ruta de carpeta",
        placeholder: "README.md",
      },
      copyOutput: {
        title: "Destino",
        description: "Archivo o ruta de carpeta",
        placeholder: "dist/README.md",
      },
      copyPattern: {
        title: "Patrón",
        description: "Patrón de brillo para los archivos filtrantes",
        placeholder: "**/*.json",
      },
      // NPM package
      npmPackage: {
        title: "Paquete NPM",
        description: "Generar paquete.json para distribución npm",
      },
      packageName: {
        title: "Nombre del paquete",
        description: "npm nombre del paquete (por ejemplo, @scope/package)",
        placeholder: "@myorg/package-name",
      },
      packageVersion: {
        title: "Version",
        description: "Versión del paquete (defaults to root package.json)",
        placeholder: "1.0.0",
      },
      packageDescription: {
        title: "Descripción",
        description: "Breve descripción del paquete para npm",
        placeholder: "Una breve descripción de su paquete",
      },
      packageMain: {
        title: "Entrada principal",
        description: "Punto de entrada CommonJS (campo principal)",
        placeholder: "./dist/index.cjs",
      },
      packageModule: {
        title: "Entrada del módulo",
        description: "Punto de entrada del módulo ES (campo de módulos)",
        placeholder: "./dist/index.mjs",
      },
      packageTypes: {
        title: "Tipos Entrada",
        description: "Entrada de declaración TypeScript (campo de tipos)",
        placeholder: "./dist/index.d.ts",
      },
      packageBin: {
        title: "Binarios",
        description: "CLI realiza asignaciones como JSON",
        placeholder: '{"my-cli": "./dist/bin/cli.js"}',
      },
      packageExports: {
        title: "Mapa de las exportaciones",
        description: "Campo de exportación de paquetes como JSON",
        placeholder:
          '{".": {"import": "./dist/index.mjs", "require": "./dist/index.cjs"}}',
      },
      packageDependencies: {
        title: "Dependencias",
        description: "Dependencias de tiempo de ejecución como JSON",
        placeholder: '{"lodash": "^4.17.21"}',
      },
      packagePeerDependencies: {
        title: "Dependencias entre los propios países",
        description: "Las dependencias de los usuarios como JSON",
        placeholder: '{"react": ">=18.0.0"}',
      },
      packagePeerDependenciesMeta: {
        title: "Peer Dependencies Meta",
        description: "Marcar las dependencias de los pares como opcional",
        placeholder: '{"react": {"optional": true}}',
      },
      packageFiles: {
        title: "Archivos incluidos",
        description: "Archivos para incluir en paquete publicado",
        placeholder: "dist, README.md, LICENSE",
      },
      packageKeywords: {
        title: "Palabras clave",
        description: "Palabras clave de búsqueda npm",
        placeholder: "typescript, build, vite",
      },
      packageLicense: {
        title: "Licencia",
        description: "Licencia de paquete (por ejemplo, MIT, Apache-2.0)",
        placeholder: "MIT",
      },
      packageRepository: {
        title: "Repositorio",
        description: "Repositorio de Git URL",
        placeholder: "https://github.com/user/repo",
      },
      packageOutputDir: {
        title: "Directorio de productos",
        description:
          "Directorio donde paquete.json está escrito (defaults to dist/)",
        placeholder: ".dist/checker",
      },
      // Response fields
      success: {
        title: "Operación completada",
      },
      buildOutput: {
        title: "Producto de construcción",
      },
      duration: {
        title: "Duración ms)",
      },
      outputPath: {
        title: "Sendero de salida",
      },
      filesBuilt: {
        title: "Archivos construidos",
        item: "Archivo construido",
      },
      filesCopied: {
        title: "Archivos copiados",
        item: "Archivo copiado",
      },
      packageJson: {
        title: "Paquete generado.json",
      },
      profileUsed: {
        title: "Perfil utilizado",
      },
      cacheStats: {
        title: "Estadísticas de los lugares de destino",
        description: "Construir métricas de rendimiento de caché",
      },
      reportPath: {
        title: "Report Path",
        description: "Camino al informe de construcción generado",
      },
      stepTimings: {
        title: "Tiempos de paso",
        description:
          "Desglose detallado de los plazos para cada paso de construcción",
        step: "Paso",
        duration: "Duración ms)",
        status: "Situación",
        filesAffected: "Archivos",
      },
    },
    errors: {
      buildFailed: {
        title: "Construido Failed: {{error}}",
        description: "El proceso de construcción falló con un error",
      },
      validation: {
        title: "Error de validación",
        description: "La configuración de construcción proporcionada es nula",
      },
      network: {
        title: "Error de red",
        description:
          "Se produjo un error de red durante el proceso de construcción",
      },
      unauthorized: {
        title: "Se requiere autenticación",
        description: "No está autorizado para ejecutar obras",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "El acceso al sistema de construcción está prohibido",
      },
      server: {
        title: "Error del servidor",
        description: "Se produjo un error durante el proceso de construcción",
      },
      notFound: {
        title: "No encontrado",
        description: "No se encontró el archivo o el config especificado",
      },
      unknown: {
        title: "Error desconocido",
        description: "Ocurrió un error inesperado",
      },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description:
          "Hay cambios sin salvar que pueden afectar a la construcción",
      },
      conflict: {
        title: "Construir conflictos",
        description:
          "Ya está en marcha una operación de construcción conflictiva",
      },
    },
    success: {
      title: "Conseguir éxito",
      description: "Paquete construido con éxito",
    },
  },
  tags: {
    build: "build",
    npm: "npm",
    vite: "vite",
  },
  profiles: {
    development: "Desarrollo",
    production: "Producción",
  },
  analysis: {
    criticalSize:
      "CRITICAL : El tamaño del paquete ({{size}}) supera el umbral",
    largeBundle: "WARNING : Gran paquete detectado ({{size}})",
    considerTreeShaking:
      "Considere la posibilidad de permitir el afeitado de árboles para reducir el tamaño del paquete",
    checkLargeDeps:
      "Comprobación de grandes dependencias que podrían ser reemplazadas",
    largeSourcemaps:
      "Grandes mapas de fuentes detectados - considerar desactivación en la producción",
    possibleDuplicates:
      "Posibles dependencias duplicadas detectadas - considerar la deduplicación",
    totalSize: "Tamaño total",
    largestFiles: "Archivos más grandes",
  },
};
