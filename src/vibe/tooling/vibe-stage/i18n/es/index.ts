import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Vibe Stage",
  titleShort: "Vibe Stage",
  description:
    "Archivos de calderas en estadio automático (route.ts, i18n/*/index.ts) que pasan cheques de patrón. También establece cambios de importación solo en cualquier archivo, o en etapas parciales sólo las piezas de importación de los archivos de cambio mixto.",

  fields: {
    dryRun: {
      label: "Dry Run",
      description:
        "Previsualizar qué archivos serían escenificados sin realmente ejecutar git add",
    },
    paths: {
      label: "Límite a los caminos",
      description:
        "Sólo considerar candidatos bajo estos caminos. Deja vacío para escanear todos los cambios no apilados.",
      placeholder: "e.g. src",
    },
  },

  response: {
    staged: "Estacionada",
    partiallyStaged: "Partially staged (imports only)",
    skipped: "Saltar (violaciones)",
    renamed: "Renamed (moves)",
    deleted: "Suprimidos (generados/fixturas)",
    noChanges:
      "No hay archivos escenificables encontrados en el árbol de trabajo",
    dryRunNote: "Correción seca - no hay archivos fueron en realidad escenario",
  },

  errors: {
    validation: {
      title: "Parámetros inválidos",
      description: "Los parámetros de fase vibe son inválidos",
    },
    internal: {
      title: "Error interno",
      description: "Se produjo un error mientras se ejecutó la etapa vibe",
    },
    unauthorized: {
      title: "Se requiere autenticación",
      description: "Debes estar conectado para correr el escenario vibe",
    },
    forbidden: {
      title: "Acceso denegado",
      description: "Se prohíbe el acceso a la etapa vibe",
    },
    notFound: {
      title: "No encontrado",
      description: "No hay depósito de git encontrado",
    },
    server: {
      title: "Error del servidor",
      description: "Un error de servidor ocurrió durante la etapa vibe",
    },
    unknown: {
      title: "Error desconocido",
      description: "Se produjo un error desconocido durante la etapa vibe",
    },
    unsaved: {
      title: "Cambios sin guardar",
      description: "Se detectaron cambios no observados",
    },
    conflict: {
      title: "Conflicto",
      description: "Se produjo un conflicto durante la etapa vibe",
    },
  },

  success: {
    title: "Etapa completa",
    description: "Boilerplate files staged successfully",
  },

  widget: {
    title: "Vibe Stage",
    subtitle:
      "Archivos de calderas en estadio automático que pasan cheques de patrón",
    submit: "Corre Stage",
    dryRun: "Dry Run",
    staged: "Estacionada",
    partiallyStaged: "Etapa parcial",
    skipped: "Saltó.",
    renamed: "Renombrado",
    deleted: "Suprimidos",
    stagedCount: "ficheros escenificados",
    partiallyStaged_count:
      "ficheros parcialmente escenificados (importa únicamente)",
    skippedCount: "archivos saltados (violaciones)",
    renamedCount: "movidas en estadio",
    deletedCount: "supresiones escalonadas",
    renameFile: "movido",
    deleteFile: "Retirada",
    noChanges: "No se encuentran archivos escenificables",
    noChangesHint:
      "Los archivos de boilerplate, los cambios sólo importados o los archivos con los cascos de importación aparecerán aquí",
    dryRunBadge: "Dry Run",
    dryRunNote: "Vista previa solamente. no se han realizado archivos",
    cleanFile: "limpio",
    partialFile: "importaciones solamente",
    violationsFile: "violaciones",
    loading: "Escaneando árbol de trabajo...",
  },
};
