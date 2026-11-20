import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Usuarios",

  post: {
    title: "Recordatorio de correo electrónico",
    titleShort: "Verificar el recordatorio",
    description:
      "Envía un recordatorio a las cuentas que no confirmaron su correo en las 24 horas posteriores al registro. Para recibir los créditos gratis, deben confirmar la dirección.",
    tag: "Verificar el recordatorio",
    container: {
      title: "Recordatorio de correo electrónico",
      description:
        "Cuentas creadas hace entre 24 y 25 horas que aún no confirmaron su correo",
    },
    fields: {
      batchSize: {
        label: "Tamaño del lote",
        description: "Máximo recordatorio por carrera",
      },
      dryRun: {
        label: "Dry Run",
        description: "Conde quién recibirá un recordatorio sin enviar",
      },
    },
    response: {
      candidates: "Cuentas no verificadas en la ventana",
      sent: "Recordads sent",
      skipped: "Saltó.",
      failed: "Failed",
    },
    errors: {
      unauthorized: {
        title: "Se requiere autenticación",
        description:
          "Usted debe ser un administrador para enviar recordatorios de verificación",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "No tienes acceso",
      },
      server: {
        title: "Error del servidor",
        description: "Enviar recordatorios de verificación falló",
      },
      unknown: {
        title: "Error desconocido",
        description: "Ocurrió un error desconocido",
      },
      validation: {
        title: "Error de validación",
        description: "Ajustes de recordatorio inválidos",
      },
    },
    success: {
      title: "Reminders Processed",
      description: "Recordatorios de correo electrónico procesados",
    },
  },
  task: {
    name: "verify-email-reminder",
    description:
      "Cada hora envía un recordatorio a las cuentas que siguen sin confirmar su correo 24 horas después del registro",
  },
};
