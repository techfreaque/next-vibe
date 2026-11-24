import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Vibe Sense",
  tags: { vibeSense: "vibe-sense" },
  cleanup: {
    name: "Limpieza de Vibe Sense",
    description:
      "Elimina los datos antiguos y las instantáneas caducadas de la caché.",
  },
  graphRunner: {
    name: "Ejecución de grafos de Vibe Sense",
    description:
      "Ejecuta los grafos de procesamiento programados mediante cron.",
  },
  post: {
    title: "Vibe Sense Cleanup",
    titleShort: "Limpieza del sentido",
    description:
      "Ejecutar la limpieza de retención para puntos de datos y caducar instantáneas",
    response: {
      nodesProcessed: "Nodos procesados",
      totalDeleted: "Filas eliminadas",
      snapshotsDeleted: "Capturas eliminadas",
      graphsChecked: "Gráficos comprobados",
      graphsExecuted: "Gráficos ejecutados",
    },
    success: {
      title: "Limpieza completa",
      description: "Retención de limpieza terminada",
    },
    errors: {
      unauthorized: {
        title: "Se requiere autenticación",
        description: "Inicia sesión para continuar",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "Acceso de los administradores necesario",
      },
      server: {
        title: "Error del servidor",
        description: "La limpieza falló",
      },
      unknown: {
        title: "Error desconocido",
        description: "Ocurrió un error inesperado",
      },
      validation: {
        title: "Falló la validación",
        description: "Solicitud inválida",
      },
      notFound: {
        title: "Cuenta o sesión no encontradas",
        description: "Cuenta o sesión no encontradas",
      },
      conflict: { title: "Conflicto", description: "Conflicto" },
      network: {
        title: "Error de red",
        description: "Solicitud de red falló",
      },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Guardar los cambios primero",
      },
    },
  },
};
