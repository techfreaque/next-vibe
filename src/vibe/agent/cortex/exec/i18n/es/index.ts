import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  post: {
    title: "Ejecutar el Comando",
    titleShort: "Corre el mando.",
    description:
      "Ejecute un comando de shell en una máquina. Sólo funciona en /ssh/ caminos. Terminal persistente. cwd lleva a cabo entre llamadas. Las nuevas sesiones comienzan en el directorio de montaje predeterminado si están configuradas.",
    dynamicTitle: "{{path}}: {{command}}",
    status: {
      loading: "Corriendo...",
      done: "Listo",
    },
    tags: {
      cortex: "Cortex",
    },
    fields: {
      path: {
        label: "Máquina",
        description:
          'Carril de máquina SSH Debe comenzar con /ssh/. Use cortex-list(path="/ssh) para encontrar máquinas y sus montajes.',
      },
      command: {
        label: "Comando",
        description: "Shell ordena ejecutar",
        placeholder: "eco hola",
      },
      workingDir: {
        label: "Working Directory",
        description:
          "Override cwd para este comando. Si se omite, utiliza el directorio actual del terminal.",
        placeholder: "/home/user/project",
      },
      terminalId: {
        label: "Terminal ID",
        description:
          "Reutilizar una sesión terminal específica. Si se omite, utiliza el terminal predeterminado para esta conexión.",
      },
      timeoutMs: {
        label: "Hora de salida (ms)",
        description: "Hora de ejecución máxima. Default 30000ms. Max 300000ms.",
        placeholder: "30000",
      },
    },
    submitButton: {
      label: "Corre",
      loadingText: "Corriendo...",
    },
    response: {
      output: { content: "Producto" },
      exitCode: { title: "Código de salida" },
      cwd: { content: "Working Directory" },
      terminalId: { content: "Terminal ID" },
      backend: { title: "Backend" },
      truncated: { title: "Truncado" },
    },
    errors: {
      validation: {
        title: "Mala entrada",
        description: "Compruebe el camino y el comando",
      },
      network: {
        title: "Sin conexión",
        description: "No puede llegar al servidor",
      },
      unauthorized: {
        title: "No está atrapado.",
        description: "Inicia sesión primero",
      },
      forbidden: {
        title: "No hay acceso",
        description: "No hay permiso para esta máquina",
      },
      notFound: {
        title: "Máquina no encontrada",
        description: "Sin conexión SSH o instancia remota en este camino",
      },
      server: {
        title: "Exec Failed",
        description: "La ejecución del comando falló",
      },
      unknown: { title: "Error", description: "Algo salió mal" },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Guardar o descartar primero",
      },
      conflict: {
        title: "Conflicto",
        description: "La sesión terminal está ocupada",
      },
    },
    success: {
      title: "Comando completo",
      description: "Comando ejecutado",
    },
  },
  errors: {
    invalidWorkingDir:
      "El directorio de trabajo debe ser un camino absoluto sin '.",
    commandTimedOut: "El comando timed out",
    invalidPath: "El camino debe comenzar con /ssh/",
    noConnection: "No hay conexión encontrada en este camino",
    connectionNotFound: "Conexión no encontrada",
    encryptionFailed: "Fallo de cifrado - JWT_SECRET_KEY puede ser inválido",
    connectTimeout: "Conexion timed out",
    sshAuthFailed: "La autenticación SSH falló",
    sshConnectionFailed: "La conexión SSH falló",
    fingerprintMismatch:
      "La huella dactilar cambia - posible riesgo de seguridad. Eliminar y re-add la conexión.",
    remoteNotSupported:
      "El ejecutivo de conexión remota aún no está soportado. Utilice una conexión SSH directa.",
  },
  log: {
    execComplete: "Comando ejecutado",
    openedLocal: "Terminal local abierta",
    failedLocal: "Failed to open local terminal",
    openedSsh: "Terminal SSH abierta",
    failedFingerprint: "Fallado para salvar huellas digitales",
    failedPty: "Failed to open SSH PTY",
    escalated: "Rendimiento de larga duración a la tarea de fondo",
  },
  widget: {
    title: "Terminal",
    back: "Atrás",
    machineLabel: "Máquina",
    machinePlaceholder: "/ssh/local-machine",
    placeholder: "Escribe un comando...",
    runButton: "Corre",
    running: "Corriendo...",
    clearButton: "Limpiar",
    ctrlEnterHint: "Ctrl+Intro para correr",
    exitCodeLabel: "Código de salida",
    backendLabel: "Backend",
    cwdLabel: "Working Directory",
    terminalLabel: "Terminal",
    truncatedWarning: "Producto truncado",
    emptyOutput: "No hay salida",
    outputLabel: "La salida aparece aquí.",
    outputTitle: "Producto",
    historyTitle: "Historia",
    noHistory: "Aún no hay órdenes.",
    manageConnections: "Conexiones",
    viewTerminals: "Terminales",
    successStatus: "Operación completada",
    failedStatus: "Failed",
    picker: {
      browse: "Navega",
      cancel: "Cancelar",
      machinesTitle: "Escoge una máquina",
      machines: "Máquinas",
      loading: "Cargando...",
      noMachines: "No hay máquinas configuradas",
      defaultBadge: "Predeterminado",
      useDir: "Utilice este directorio",
      emptyDir: "Directorio vacío",
    },
  },
};
