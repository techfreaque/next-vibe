import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    maintenance: "Mantenimiento",
  },
  post: {
    title: "Stale Run Reaper",
    titleShort: "Stale Runs",
    description:
      "Libera los hilos de chat atrapados en 'streaming' después del proceso de escritura de la respuesta murió. Mantiene la respuesta parcial, marca que interrumpió, y comienza cualquier mensaje apagado. Las carreras en vivo en cualquier nodo nunca se tocan.",
    container: {
      title: "Stale Run Reaper",
      description: "Vista previa o hilos pegados libres",
    },
    fields: {
      localThresholdMinutes: {
        label: "Umbral local (min)",
        description:
          "Reemplazar una carrera local una vez que su dueño no ha enviado un latido de corazón por tanto tiempo",
      },
      remoteThresholdMinutes: {
        label: "umbral remoto (min)",
        description: "Una vez que nada llegó por tanto tiempo",
      },
      batchSize: {
        label: "Hilos máximos",
        description: "Límite superior de los hilos liberados por carrera",
      },
      dryRun: {
        label: "Simulación",
        description: "Listar los hilos atorados, no cambiar nada",
      },
    },
    response: {
      candidates: "Hilos atornillados encontrados",
      reaped: "Los panes liberados",
      lost: "Skipped: Regresó a la vida",
      failed: "Failed",
      queuedStarted: "Mensajes solicitados comenzados",
      threadIds: "ID de pan",
      executionTimeMs: "Hora de ejecución (ms)",
    },
    success: {
      title: "Sweep do",
      description: "Hilos de arañazo liberados",
    },
  },
  interrupted: {
    content:
      "El servidor reiniciaba mientras se estaba escribiendo esta respuesta. La respuesta parcial es salvada. Retira para continuar.",
  },
  errors: {
    failed: "El barrido de la correa no pudo: {{error}}",
    server: {
      title: "Error del sudor",
      description: "El barrido de la carrera no funcionó.",
    },
  },
  task: {
    name: "Cierre de ejecuciones bloqueadas",
    description:
      "Cada 5 minutos: libera los hilos de chat dejados por un proceso que murió a mitad de respuesta",
  },
};
