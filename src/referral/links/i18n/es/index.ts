import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Referidos",
  tags: {
    referral: "remisión de referencia",
    links: "Enlaces",
  },
  get: {
    title: "Mis enlaces con seguimiento",
    titleShort: "Enlaces con seguimiento",
    description:
      "Tus enlaces de referido, uno por publicación, con sus visitas, registros y ganancias.",
    response: {
      links: "Enlaces",
    },
    widget: {
      title: "Enlaces con seguimiento",
      subtitle:
        "Usa un enlace por publicación. Mira qué videos, publicaciones o boletines generan ganancias.",
      create: "Nuevo enlace",
      refresh: "Actualizar",
      loading: "Cargando tus enlaces…",
      copy: "Copiar",
      copied: "Copiado",
      visits: "Visitas",
      signups: "Registros",
      paid: "Pagar",
      earned: "Ganado",
      pending: "{{amount}} pendientes",
      code: "Code {{code}}",
      landsOn: "Destino: {{path}}",
      empty: {
        title: "Aún no tienes enlaces con seguimiento",
        hint: "Crea un enlace por video, publicación o edición del boletín. Cada enlace registra sus visitas, registros y pagos.",
        cta: "Crea tu primer enlace",
      },
      cli: {
        header: "{{count}} enlaces con seguimiento",
        funnel:
          "{{visits}} visitas, {{signups}} registros, {{paid}} usuarios que pagan, {{earned}} en ganancias ({{pending}} pendientes)",
      },
    },
  },
  post: {
    title: "Crear enlace con seguimiento",
    titleShort: "Nuevo enlace",
    description:
      "Crea un enlace de referido para una publicación. Incluye tu código de referido y etiquetas UTM para contar las visitas, los registros y los pagos de ese enlace.",
    submit: "Crear enlace",
    fields: {
      name: {
        label: "Nombre",
        description: "Sólo tú ves esto. Nombra la colocación.",
        placeholder: "YouTube review, November",
      },
      source: {
        label: "Donde lo publiques",
        description:
          "La plataforma o sitio, por ejemplo youtube, newsletter, x",
        placeholder: "youtube",
      },
      campaign: {
        label: "Campaña",
        description:
          "Enlaces de grupos, por ejemplo un vídeo o una cuestión. Opcional.",
        placeholder: "uncensored-ai-review",
      },
      medium: {
        label: "Mediana",
        description: "Tipo de colocación. Defaults to referral.",
        placeholder: "video",
      },
      destinationPath: {
        label: "Página de aterrizaje",
        description: "Sendero en este sitio donde los visitantes aterrizan",
        placeholder: "/",
      },
      code: {
        label: "Código de referido",
        description:
          "Uno de tus códigos. Empty utiliza su primer código activo.",
        placeholder: "MYCODE",
      },
    },
    response: {
      id: "Enlace ID",
      url: "Enlace",
      code: "Código de referido",
    },
    widget: {
      back: "Atrás",
      hint: "Usa un enlace por publicación. Así sabes cuál atrae usuarios que pagan.",
      presets: "¿Dónde lo compartirás?",
      created: "Tu enlace está listo",
      copy: "Copiar",
      copied: "Copiado",
    },
  },
  errors: {
    validation: {
      title: "Entrada inválida",
      description: "Revise los campos marcados",
    },
    unauthorized: {
      title: "No está firmado",
      description: "Inicie sesión para gestionar sus enlaces",
    },
    forbidden: {
      title: "Operación no permitida",
      description: "Usted no puede manejar estos enlaces",
    },
    notFound: {
      title: "Cuenta o sesión no encontradas",
      description: "Ese vínculo no existe",
    },
    conflict: {
      title: "Conflicto",
      description: "Algo cambió mientras tanto, recargar y reiniciar",
    },
    server: {
      title: "Error del servidor",
      description: "No se puede completar la solicitud",
    },
    network: {
      title: "Error de red",
      description: "La solicitud no llegó al servidor",
    },
    unknown: {
      title: "Error desconocido",
      description: "Algo inesperado falló",
    },
    unsavedChanges: {
      title: "Cambios sin guardar",
      description: "Guardar o descartar sus cambios primero",
    },
    noCode:
      "Crea primero tu código de referido. Tus enlaces con seguimiento usan ese código.",
    notYourCode: "Code {{code}} no es uno de sus códigos de referencia activos",
    invalidDestination:
      "El camino de aterrizaje debe comenzar con / y permanecer en este sitio",
  },
  success: {
    title: "Listo",
    description: "Enlace listo",
  },
};
