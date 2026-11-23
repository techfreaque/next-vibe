import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Sobre nosotros: {{appName}}",
    category: "Acerca de",
    description:
      "Aprender acerca de la misión de {{appName}} para proporcionar conversaciones AI sin censura",
    imageAlt: "Acerca de {{appName}}",
    keywords: "sobre {{appName}}, AI sin censura, Misión AI, Valores AI",
    ogTitle: "Acerca de {{appName}}: Plataforma AI sin censura",
    ogDescription:
      "Descubra nuestra misión de democratización del acceso a AI sin censura",
    twitterTitle: "Acerca de {{appName}}",
    twitterDescription:
      "Aprender acerca de nuestra misión para conversaciones AI sin censura",
  },
  hero: {
    eyebrow: "Acerca de {{appName}}",
    title: "Una IA que te responde a ti.",
    subtitle:
      "{{modelCount}} modelos, {{skillCount}} habilidades y unas {{toolCount}} herramientas. SSH, correo, automatización del navegador y tareas programadas. Pruébalo gratis en {{appName}} o ejecútalo en tu equipo.",
    ctaPrimary: "Iniciar chat",
    ctaSecondary: "Lee la bitácora",
  },
  stats: {
    models: "Modelos AI",
    skills: "habilidades",
    tools: "herramientas",
    founded: "Fundada",
  },
  backToHome: "Volver a casa",
  title: "Acerca de {{appName}}",
  subtitle: "Conversaciones AI sin censura",
  description:
    "Desde {{foundedYear}}, {{appName}} te da acceso a los mejores modelos de IA. Tú eliges el modelo y decides qué filtros quieres aplicar.",
  values: {
    title: "Nuestros principios",
    description: "Cuatro reglas para cada función de {{appName}}.",
    excellence: {
      title: "Usted elige el filtro",
      description:
        "Modelos convencionales, abiertos o sin censura. Elige el nivel de filtrado en cada conversación.",
    },
    innovation: {
      title: "Fuente abierta, todo.",
      description:
        "{{appName}} funciona con next-vibe, de código abierto en GitHub. Lee el código, crea un fork y ejecútalo en tu equipo.",
    },
    integrity: {
      title: "Privado por defecto",
      description:
        "El modo incógnito mantiene las conversaciones en tu dispositivo. Guardamos temporalmente los archivos generados por razones técnicas. Tus datos siguen siendo tuyos.",
    },
    collaboration: {
      title: "Desarrollamos en público",
      description:
        "En el blog publicamos la hoja de ruta, las decisiones de arquitectura y los caminos sin salida. Tus sugerencias nos ayudan a decidir qué añadir.",
    },
  },
  mission: {
    title: "Tu AI. Tus reglas.",
    subtitle: "Democratizar el acceso a AI no censurado",
    description:
      "Los grandes proveedores de IA filtran las preguntas y no muestran sus reglas. Creemos que los adultos pueden decidir por sí mismos. Por eso {{appName}} reúne modelos y niveles de filtrado y te deja elegir.",
    vision: {
      title: "La visión",
      description:
        "Un lugar para los mejores modelos de IA, convencionales, abiertos y sin censura. Tú decides los límites.",
    },
    approach: {
      title: "El enfoque",
      description:
        "Incorporamos rápido los mejores modelos y les damos herramientas de búsqueda, memoria y automatización. La privacidad viene de serie.",
    },
    commitment: {
      title: "El compromiso",
      description:
        "Precios transparentes, sin trucos. Puedes dejar la plataforma en cualquier momento y alojar el mismo código en tu equipo.",
    },
  },
  contact: {
    title: "¿Preguntas? Habla con nosotros.",
    description:
      "Sugerencias, colaboraciones, prensa o fallos. Una persona lee cada mensaje.",
    cta: "Contacta con nosotros",
    selfHost: "Instálalo en tu equipo.",
  },
  post: {
    title: "Sobre nosotros",
    description: "Sobre nosotros punto final",
    form: {
      title: "Sobre nosotros Configuración",
      description: "Configure sobre nosotros parámetros",
    },
    response: {
      title: "Respuesta",
      description: "Sobre Nosotros datos de respuesta",
    },
    errors: {
      unauthorized: {
        title: "Se requiere autenticación",
        description: "Inicia sesión para continuar",
      },
      validation: {
        title: "Error de validación",
        description: "Parámetros de solicitud no válidos",
      },
      server: {
        title: "Error del servidor",
        description: "Ocurrió un error interno del servidor",
      },
      unknown: {
        title: "Error desconocido",
        description: "Ocurrió un error desconocido",
      },
      network: {
        title: "Error de red",
        description: "Ocurrió un error de red",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "No tienes acceso",
      },
      notFound: {
        title: "No encontrado",
        description: "No se encontró el recurso",
      },
      conflict: {
        title: "Conflicto",
        description: "Hay un conflicto entre los datos",
      },
    },
    success: {
      title: "Operación completada",
      description: "La operación se completó correctamente",
    },
  },
};
