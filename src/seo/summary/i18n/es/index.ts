import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  errors: {
    validation: {
      title: "Solicitud no válida",
      description: "Revise la solicitud.",
    },
    unauthorized: {
      title: "Inicia sesión para continuar",
      description: "Inicie sesión para ver el resumen de publicaciones.",
    },
    forbidden: {
      title: "Solo para administradores",
      description: "Se requiere el rol de administrador.",
    },
    notFound: {
      title: "No hay datos",
      description: "Esta instancia no contiene datos de publicaciones.",
    },
    server: {
      title: "Resumen de publicaciones",
      description: "No se pudo cargar el resumen de publicaciones.",
    },
    network: {
      title: "Error de red",
      description: "No podía llegar al servidor",
    },
    unknown: {
      title: "Resumen de publicaciones",
      description: "No se pudo cargar el resumen de publicaciones.",
    },
    unsavedChanges: {
      title: "Cambios sin guardar",
      description: "Tienes cambios sin guardar",
    },
    conflict: {
      title: "Conflicto",
      description: "La solicitud entra en conflicto con los datos actuales",
    },
  },
  title: "Resumen de publicaciones",
  description: "Foro público y envíos guardados en IndexNow.",
  threads: "Hilos públicos del foro",
  savedUrls: "URL guardadas en IndexNow",
  snapshotOn: "Estado a {{date}} (UTC)",
  newestThread: "Último hilo público",
  indexingSnapshot: "Estado de IndexNow",
  newestOn: "Último hilo público del {{date}}.",
  noThreads: "El foro aún no tiene hilos públicos.",
  indexingSavedOn:
    "Último registro de IndexNow el {{date}}. Los buscadores informan del estado de indexación por separado.",
  noIndexingSnapshot: "Esta instancia no registra envíos a IndexNow.",
  noIndexingRecordsYet: "Aún no hay registros",
  loading: "Cargando el resumen de publicaciones…",
};
