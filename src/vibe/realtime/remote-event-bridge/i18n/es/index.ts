import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Sistema",
  tags: {
    remoteSync: "Remote Sync",
  },
  remoteEventBridge: {
    post: {
      title: "Puente de eventos remotos",
      titleShort: "Puente del evento",
      description:
        "Recibir y enviar eventos remotos entre pares al manejador onRemoteEvent de la ruta diana. Llamado a través de HTTP por pares directos-http o vía inversa- WS onRemoteEvent.",
      eventName: {
        label: "Nombre del evento",
        description: "El tipo de evento de alambre para procesar",
      },
      leadId: {
        label: "ID del contacto",
        description: "Identidad de la posición cruzada del par que envía",
      },
      originInstanceId: {
        label: "Instance de origen",
        description: "Instance that emitted this event (for echo prevention)",
      },
      payload: {
        label: "Carga de pago",
        description:
          "Carga de pago de eventos brutos enviada desde la instancia remota",
      },
      received: {
        label: "Recibidos",
        description: "Si el evento fue aceptado y procesado",
      },
      errors: {
        validation: {
          title: "Error de validación",
          description: "Carga de pago del evento inválido",
        },
        unauthorized: {
          title: "Se requiere autenticación",
          description: "Inicia sesión para continuar",
        },
        internal: {
          title: "Error de procesamiento",
          description: "Se produjo un error al procesar el evento",
        },
        forbidden: {
          title: "Acceso denegado",
          description: "Usted no tiene permiso para enviar eventos",
        },
        notFound: {
          title: "No encontrado",
          description: "Meta no encontrada",
        },
        network: {
          title: "Error de red",
          description: "No podía alcanzar el punto final del puente de eventos",
        },
        unknown: {
          title: "Error desconocido",
          description: "Ocurrió un error inesperado",
        },
        unsaved: {
          title: "Cambios sin guardar",
          description: "Hay cambios sin salvar",
        },
        conflict: {
          title: "Conflicto",
          description: "Conflicto detectado",
        },
      },
      success: {
        title: "Evento recibido",
        description: "Evento remoto procesado con éxito",
      },
    },
  },
};
