import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  patch: {
    title: "Editar archivo",
    titleShort: "Editar archivo",
    description:
      "Cambiar parte de un archivo. Busque texto y reemplacelo, o edite líneas específicas.",
    dynamicTitle: "Editado {{path}}",
    status: {
      loading: "Editando...",
      done: "Editado",
    },
    tags: {
      cortex: "Cortex",
    },
    fields: {
      path: {
        label: "Camino",
        description: "Que archivo para editar",
      },
      find: {
        label: "Encontrar",
        description: "Texto para encontrar",
      },
      replace: {
        label: "Reemplazamiento",
        description: "Reemplazarlo con esto",
      },
      startLine: {
        label: "Desde la línea",
        description: "Empieza en este número de línea",
      },
      endLine: {
        label: "To Line",
        description: "Fin en este número de línea",
      },
      newContent: {
        label: "Nuevo contenido",
        description: "Pon esto en lugar de esas líneas",
      },
    },
    submitButton: {
      label: "Aplicar",
      loadingText: "Aplicando...",
    },
    response: {
      path: { content: "Camino" },
      size: { text: "Tamaño" },
      replacements: { text: "Cambios" },
      updatedAt: { content: "Actualizado" },
    },
    errors: {
      validation: {
        title: "Mala entrada",
        description: "Compruebe la ruta y encontrar / reemplazar",
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
        description: "No puedo editar esto.",
      },
      notFound: { title: "No encontrado", description: "El archivo no existe" },
      findNotFound:
        'Texto no encontrado: " {{snippet}}" en {{path}}. Lea el archivo con corteza-read, y luego vuelva a entrar con el texto exacto.',
      lineRangeOutOfBounds:
        "Gama de línea {{startLine}} - {{endLine}} está fuera de límites. El archivo tiene líneas {{lineCount}}.",
      missingEditStrategy:
        "Proporcione encontrar + reemplazar, o startLine + endLine + newContent. Recibido: {{provided}}.",
      noParamsProvided: "nada",
      server: { title: "Error del servidor", description: "Algo rompió." },
      unknown: { title: "Error", description: "Algo salió mal" },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Guardar o descartar primero",
      },
      conflict: {
        title: "Conflicto",
        description: "El archivo cambió mientras se editaba",
      },
    },
    success: {
      title: "Editado",
      description: "Cambios salvados",
    },
  },
};
