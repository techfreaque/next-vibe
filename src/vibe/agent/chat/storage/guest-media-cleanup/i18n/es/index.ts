import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    maintenance: "Mantenimiento",
  },
  post: {
    title: "Guest Media Cleanup",
    titleShort: "Guest Media Cleanup",
    description:
      "Eliminar los medios que los huéspedes generaron en chats incógnitos y la herramienta independiente funciona una vez que pasa la ventana de retención. Sólo invitados que nunca se inscribieron o se inscribieron. Los hilos guardados y los archivos de cuenta nunca se tocan.",
    container: {
      title: "Guest Media Cleanup",
      description: "Ejecutar o prever la limpieza",
    },
    fields: {
      retentionDays: {
        label: "Retención (días)",
        description:
          "Eliminar los medios de interés más antiguos que estos muchos días",
      },
      batchSize: {
        label: "Supresiones máximas",
        description:
          "Límite superior de los archivos eliminados por ejecución. El resto espera para la próxima carrera.",
      },
      dryRun: {
        label: "Simulación",
        description:
          "Contar y registrar lo que se eliminaría, no eliminar nada",
      },
    },
    response: {
      cutoff: "Cutoff",
      namespacesScanned: "Espacios de nombre escaneados",
      storedThreadNamespaces: "Hilos guardados saltados",
      filesScanned: "Archivos escaneados",
      filesDeleted: "Archivos borrados",
      bytesDeleted: "Bytes eliminados",
      skippedTooNew: "Kept: retención interna",
      skippedUserOwned: "Kept: Account-owned",
      skippedUnowned: "Kept: no owner",
      skippedAccountLead: "Kept: plomo vinculado a una cuenta",
      deferred: "Diferido a la próxima carrera",
      failed: "Failed",
      executionTimeMs: "Hora de ejecución (ms)",
    },
    success: {
      title: "Limpieza hecha",
      description: "Extraído de los medios de comunicación",
    },
  },
  errors: {
    failed: "La limpieza de los medios de interés no fue posible: {{error}}",
    server: {
      title: "Error de limpieza",
      description: "La limpieza de los medios de invitados falló",
    },
  },
  task: {
    name: "Guest Media Cleanup",
    description:
      "Eliminación diaria de los medios de invitados expirados de chats incognito y de herramientas independientes",
  },
};
