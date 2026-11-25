import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  post: {
    title: "Envío a IndexNow",
    titleShort: "IndexNow",
    description:
      "Avisa a Bing, Yandex, Seznam, Naver y Yep de cada URL nueva o cambiada del sitemap. Solo en producción, omite las URL ya enviadas.",
    tag: "SEO",
    container: {
      title: "Ejecución de IndexNow",
      description: "Lo que se envió a los buscadores",
    },
    fields: {
      force: {
        label: "Reenviar todo",
        description:
          "Enviar de nuevo todas las URL del sitemap, no solo las nuevas o cambiadas.",
      },
      dryRun: {
        label: "Simulación",
        description: "Contar las URL pendientes sin enviarlas.",
      },
    },
    response: {
      status: "Estado",
      host: "Host",
      totalUrls: "URL del sitemap",
      pendingUrls: "URL pendientes",
      submittedUrls: "URL enviadas",
      requests: "Solicitudes enviadas",
    },
    errors: {
      unauthorized: {
        title: "Sin sesión",
        description: "Inicia sesión como admin para enviar URL.",
      },
      forbidden: {
        title: "Solo admins",
        description: "Solo los admins pueden enviar URL a IndexNow.",
      },
      server: {
        title: "Envío fallido",
        description:
          "IndexNow rechazó el envío o no se pudo generar el sitemap. Revisa el log del servidor.",
      },
      unknown: {
        title: "Error inesperado",
        description: "Algo salió mal al enviar las URL.",
      },
      validation: {
        title: "Datos no válidos",
        description: "Revisa las opciones.",
      },
      keyUnreachable: {
        title: "Archivo de clave inaccesible",
        description:
          "El archivo de clave de IndexNow en la raíz del sitio no respondió 200 con la clave, así que no se envió nada. Revisa el log del servidor.",
      },
      network: {
        title: "IndexNow no responde",
        description:
          "La API de IndexNow no respondió. La próxima ejecución reenvía las URL pendientes.",
      },
    },
    success: {
      title: "Listo",
      description: "Ejecución de IndexNow terminada.",
    },
  },
  enums: {
    status: {
      submitted: "Enviado",
      unchanged: "Nada nuevo",
      dryRun: "Simulación",
      notProduction: "Omitido (no es producción)",
    },
  },
  task: {
    description:
      "Cada hora: envía a IndexNow las URL nuevas o cambiadas del sitemap (Bing, Yandex y socios).",
  },
};
