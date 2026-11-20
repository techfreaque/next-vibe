import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  post: {
    title: "Escriba el archivo",
    titleShort: "Escriba el archivo",
    description: "Guarda un archivo. Dale un camino y contenido - hecho.",
    dynamicTitle: "Guardado: {{path}}",
    status: {
      loading: "Escribir...",
      done: "Guardado",
    },
    tags: {
      cortex: "Cortex",
    },
    fields: {
      path: {
        label: "Camino",
        description:
          "Donde salvar. Use la raíz de su local (por ejemplo /dokumente/ para DE, /dokumenty/ para PL). Ejemplo: /documentos/notas/ideas.md",
      },
      content: {
        label: "Contenido",
        description: "Qué escribir (marcar)",
      },
      createParents: {
        label: "Crear carpetas",
        description: "Hacer carpetas perdidas a lo largo del camino",
      },
    },
    submitButton: {
      label: "Guardar",
      loadingText: "Salvando...",
    },
    response: {
      path: { content: "Camino" },
      size: { text: "Tamaño" },
      created: { text: "Nuevo archivo" },
      updated: { text: "Actualizado" },
      updatedAt: { content: "Actualizado" },
      content: { content: "Contenido" },
    },
    errors: {
      validation: {
        title: "Mala entrada",
        description: "Ver ruta y contenido",
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
        title: "Solo lectura",
        description: "Este camino es sólo leído",
      },
      notFound: {
        title: "Carpeta perdida",
        description: "Carpeta de pariente no existe",
      },
      server: { title: "Error del servidor", description: "Algo rompió." },
      unknown: { title: "Error", description: "Algo salió mal" },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Guardar o descartar primero",
      },
      conflict: {
        title: "Ya existe.",
        description: "Algo ya está ahí.",
      },
    },
    success: {
      title: "Guardado",
      description: "Archivo guardado",
    },
  },
};
