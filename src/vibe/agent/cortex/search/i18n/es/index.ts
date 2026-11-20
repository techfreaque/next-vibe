import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  get: {
    title: "Buscar",
    titleShort: "Buscar archivos",
    description: "Encontrar archivos por nombre o contenido. Lo busca todo.",
    dynamicTitle: "Buscar: {{query}}",
    status: {
      loading: "Buscando...",
      done: "Found",
    },
    tags: {
      cortex: "Cortex",
    },
    fields: {
      query: {
        label: "Buscar",
        description: "Qué buscar",
      },
      path: {
        label: "En Carpeta",
        description: "Sólo busque aquí (por defecto: en todas partes)",
      },
      maxResults: {
        label: "Limitación",
        description: "¿Cuántos resultados (predeterminado: 20)",
      },
    },
    submitButton: {
      label: "Buscar",
      loadingText: "Buscando...",
    },
    noResults: "No se encontraron resultados",
    response: {
      query: { content: "Búsquedas" },
      results: {
        path: { content: "Camino" },
        name: { content: "Nombre" },
        nodeType: { text: "Tipo" },
        excerpt: { content: "Partido" },
        score: { text: "Puntuación" },
        updatedAt: { content: "Actualizado" },
      },
      total: { text: "Found" },
      searchMode: { text: "Modo" },
    },
    errors: {
      validation: {
        title: "Mala entrada",
        description: "Revisar texto de búsqueda",
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
        description: "No puedo buscar aquí.",
      },
      notFound: { title: "No encontrado", description: "La carpeta no existe" },
      server: { title: "Error del servidor", description: "Algo rompió." },
      unknown: { title: "Error", description: "Algo salió mal" },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Guardar o descartar primero",
      },
      conflict: { title: "Conflicto", description: "Volver a intentar" },
    },
    success: {
      title: "Listo",
      description: "Búsqueda completa",
    },
  },
};
