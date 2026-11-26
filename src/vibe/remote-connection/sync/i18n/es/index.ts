import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Sistema",
  tags: {
    remoteSync: "Remote Sync",
  },
  taskSync: {
    post: {
      title: "Remote Sync",
      titleShort: "Sincronización",
      description:
        "Sincronización bidireccional basada en el cursor entre casos. Envía cursores locales, recibe sólo nuevos registros.",
      instanceId: {
        label: "Nombre de la instancia",
        description: "El identificador de la instancia de llamada",
      },
      syncCursors: {
        label: "Sincronistas",
        description:
          "Los cursores de perdominio indican la última posición sincronizada",
      },
      capabilitiesVersion: {
        label: "Versión de capacidades",
        description:
          "Versión de la capacidad de la instancia receptora instantánea el callador sostiene",
      },
      senderCapabilitiesVersion: {
        label: "Versión de capacidades del remitente",
        description:
          "Versión de la propia capacidad de la instancia de llamada instantánea",
      },
      capabilitiesJson: {
        label: "Capacidades JSON",
        description:
          "La instantánea de la herramienta manifiesta para registrarse en este caso",
      },
      pushPayloads: {
        label: "Empuje cargas de pago",
        description:
          "Los registros de Caller más nuevos que sus cursores de empuje - aplicados aquí antes de que la respuesta sea serializada (bidirectional push-pull)",
      },
      syncPayloads: {
        label: "Sync Payloads",
        description:
          "Registros más nuevos que los cursores proporcionados, por dominio",
      },
      syncCounts: {
        label: "Cuentas sincronistas",
        description: "Número de registros devueltos por dominio",
      },
      remoteCursors: {
        label: "Cursors remotos",
        description:
          "Los cursores actuales de este caso: avancen los cursores locales a estos",
      },
      remoteCapabilitiesVersion: {
        label: "Versión de Capacidades Remotas",
        description: "Versión de las capacidades actuales de este caso",
      },
      capabilities: {
        label: "Capacidades",
        description: "La herramienta manifiesta instantánea de esta instancia",
      },
      serverTime: {
        label: "Tiempo de servidor",
        description: "Tiempos de servidor actuales",
      },
      errors: {
        validation: {
          title: "Error de validación",
          description: "Solicitud de sincronización inválida",
        },
        unauthorized: {
          title: "Se requiere autenticación",
          description: "Inicia sesión para continuar",
        },
        internal: {
          title: "Error de sincronización",
          description: "Se produjo un error durante la sincronización",
        },
        forbidden: {
          title: "Acceso denegado",
          description: "Usted no tiene permiso para sincronizar",
        },
        notFound: {
          title: "No encontrado",
          description: "Objetivo sincronizado no encontrado",
        },
        network: {
          title: "Error de red",
          description: "No podía alcanzar el punto final de sincronización",
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
          description: "Conflicto sincronizado detectado",
        },
      },
      success: {
        title: "Sincronizado",
        description: "Sincronización completada con éxito",
      },
    },
  },
};
