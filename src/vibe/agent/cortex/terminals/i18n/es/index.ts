import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  widget: {
    title: "Terminales activos",
    back: "Atrás",
    lastCommand: "Último comando",
    noTerminals: "No hay terminales activos",
    noTerminalsHint:
      "Ejecute un comando con el Comando Ejecutivo para iniciar una sesión terminal.",
    openExec: "Ejecutar el Comando",
    terminalCount: "terminales",
    machineLabel: "Máquina",
    cwdLabel: "cwd",
    statusLabel: "Situación",
    openedLabel: "Abierto",
    openTerminal: "Abierto",
    manageConnections: "Conexiones",
    activeStatus: "Activa",
  },
  get: {
    title: "Lista Terminales",
    titleShort: "Terminales",
    description:
      "List active terminal sessions with current working directories.",
    dynamicTitle: "Terminales: {{path}}",
    status: {
      loading: "Cargando...",
      done: "Cargado",
    },
    tags: {
      cortex: "Cortex",
    },
    fields: {
      path: {
        label: "Máquina",
        description:
          "Filtrar a una máquina específica, por ejemplo /ssh/local-machine. Omitir a listar todo.",
      },
    },
    response: {
      terminals: {
        terminalId: { content: "Terminal ID" },
        connectionSlug: { content: "Máquina" },
        cwd: { content: "Working Directory" },
        name: { content: "Nombre" },
        openedAt: { content: "Abierto" },
        lastCommandAt: { content: "Último Comando" },
        status: { content: "Situación" },
      },
      total: { text: "Total" },
    },
    errors: {
      validation: {
        title: "Mala entrada",
        description: "Compruebe el camino",
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
        description: "Operación no permitida",
      },
      notFound: {
        title: "No encontrado",
        description: "No hay terminales encontrados",
      },
      server: { title: "Error del servidor", description: "Algo rompió." },
      unknown: { title: "Error", description: "Algo salió mal" },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Guardar o descartar primero",
      },
      conflict: {
        title: "Conflicto",
        description: "Operación en conflicto",
      },
    },
    success: {
      title: "Terminales Listados",
      description: "Terminales activos cargados",
    },
  },
};
