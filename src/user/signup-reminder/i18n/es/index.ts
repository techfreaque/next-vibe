import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Usuarios",

  post: {
    title: "Recordatorio de registro",
    titleShort: "Recordatorio de registro",
    description:
      "Envía un recordatorio a quienes empezaron a registrarse y nunca confirmaron su correo. El recordatorio lleva un código nuevo y un enlace válido durante 24 horas.",
    tag: "Recordatorio de registro",
    container: {
      title: "Recordatorio de registro",
      description:
        "Registros pendientes, último correo hace 2 a 24 horas, nunca confirmados",
    },
    fields: {
      batchSize: {
        label: "Tamaño del lote",
        description: "Máximo de recordatorios por ejecución",
      },
      dryRun: {
        label: "Simulación",
        description: "Contar quién recibiría un recordatorio sin enviar",
      },
    },
    response: {
      candidates: "Registros sin confirmar en la ventana",
      sent: "Recordatorios enviados",
      skipped: "Omitidos",
      failed: "Fallidos",
    },
    errors: {
      unauthorized: {
        title: "No autorizado",
        description: "Solo un admin puede enviar recordatorios de registro",
      },
      forbidden: {
        title: "Prohibido",
        description: "Acceso denegado",
      },
      server: {
        title: "Error del servidor",
        description: "Falló el envío de recordatorios de registro",
      },
      unknown: {
        title: "Error desconocido",
        description: "Ocurrió un error desconocido",
      },
      validation: {
        title: "Error de validación",
        description: "Ajustes no válidos",
      },
    },
    success: {
      title: "Recordatorios procesados",
      description: "Recordatorios de registro procesados",
    },
  },
  task: {
    name: "signup-reminder",
    description:
      "Cada 30 minutos: un recordatorio a los registros aún sin confirmar 2 horas después del último correo",
  },
};
