import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  post: {
    title: "Embeddings de relleno",
    titleShort: "Relleno",
    description:
      "Generar incrustaciones para todos los ganglios cortezales que les faltan.",
    status: {
      loading: "Embedding...",
      done: "Listo",
    },
    tags: {
      cortex: "Cortex",
    },
    widget: {
      hint: "Generar incrustaciones para todos los nodos de corteza que les faltan. Esto puede tardar un tiempo.",
    },
    fields: {
      force: {
        label: "Reembolso de la fuerza",
        description:
          "Limpiar todas las embeddings existentes primero y regenerar desde cero (formato solo con contenido). Usar cuando el formato de la incrustación ha cambiado.",
      },
    },
    submitButton: {
      label: "Start Backfill",
      loadingText: "Procesando…",
    },
    response: {
      materialized: { text: "Materializado" },
      processed: { text: "Embedded" },
      failed: { text: "Failed" },
      skipped: { text: "Saltó." },
    },
    errors: {
      validation: {
        title: "Mala entrada",
        description: "Solicitud inválida",
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
        title: "Admin Only",
        description: "Requiere acceso de administración",
      },
      notFound: {
        title: "No encontrado",
        description: "No se encontró el recurso",
      },
      server: {
        title: "Error del servidor",
        description: "Servicio de incrustación falló",
      },
      unknown: {
        title: "Error",
        description: "Algo salió mal",
      },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Guardar o descartar primero",
      },
      conflict: {
        title: "Ya corren",
        description: "Ya está en marcha un backfill.",
      },
    },
    success: {
      title: "Relleno completo",
      description: "Todas las incrustaciones procesadas",
    },
  },
};
