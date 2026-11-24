import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tag: "Boletín",
  post: {
    title: "Envío del boletín",
    titleShort: "Blast",
    description:
      "Envía un boletín puntual solo a quienes confirmaron su suscripción. La simulación muestra cuántas personas lo recibirían en cada idioma. La opción de envío lo distribuye de inmediato.",
    container: {
      title: "Boletín de noticias",
      description: "Confirmado opt-ins solamente. Conde, cola, envía.",
    },
    fields: {
      dryRun: {
        label: "Corrección seca",
        description:
          "Cuenta el público consensuado por local. No escribe nada, no envía nada.",
      },
      send: {
        label: "Envía ahora.",
        description:
          "Envíe este boletín a la audiencia consensuada inmediatamente. Otras campañas pendientes quedan solas.",
      },
    },
    response: {
      audience: "Consentido público",
      byLocale: "Recipientes por locale",
      scheduled: "Nuevamente encubrida",
      alreadyPending: "Ya se desconcertó.",
      cancelled: "Cancelado (sin consentimiento)",
      alreadySent: "Saltar (ya lo tengo)",
      duplicates: "Renglones duplicados cancelados",
      errors: "Errores",
      sent: "Sent",
      sendSkipped: "Saltar en el envío (ya lo tengo)",
      sendFailed: "Enviar falló",
    },
    success: {
      title: "Boletín de noticias enqueued",
      description:
        "Los destinatarios consentidos son desconfiados. Con Send ahora, se envían por correo en esta carrera.",
    },
  },
  errors: {
    unauthorized: {
      title: "No está firmado",
      description:
        "Inicie sesión para ejecutar la explosión del boletín informativo.",
    },
    forbidden: {
      title: "Operación no permitida",
      description:
        "Sólo los administradores pueden ejecutar la explosión del boletín de noticias.",
    },
    server: {
      title: "Algo salió mal",
      description:
        "La explosión del boletín no pudo correr. Inténtalo de nuevo.",
    },
    unknown: {
      title: "Error desconocido",
      description: "Se produjo un error inesperado.",
    },
    validation: {
      title: "Entrada inválida",
      description: "Revise la solicitud e inténtelo de nuevo.",
    },
    notFound: {
      title: "Cuenta o sesión no encontradas",
      description: "No se encontró el recurso solicitado.",
    },
    conflict: {
      title: "Conflicto",
      description: "Esta acción contradice el estado actual.",
    },
    network: {
      title: "Error de red",
      description: "Se produjo un error de red. Inténtalo de nuevo.",
    },
    unsavedChanges: {
      title: "Cambios sin guardar",
      description: "Tienes cambios sin salvar.",
    },
  },
};
