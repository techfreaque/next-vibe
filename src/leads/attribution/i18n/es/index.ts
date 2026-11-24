import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Contactos",
  tag: "IP Match Link",
  task: {
    description:
      "Vincula los prospectos anónimos que comparten una dirección IP como una sola persona.",
  },
  post: {
    title: "Vinculación de prospectos por IP",
    titleShort: "IP Linking",
    description:
      "Enlace de cables anónimos que comparten la misma dirección IP",
    container: {
      title: "IP Match Link",
      description:
        "Encuentra cables anónimos con IPs compatibles creados dentro de la ventana del tiempo y los vincula",
    },
    fields: {
      dryRun: {
        label: "Dry Run",
        description: "Corre sin hacer cambios",
      },
      windowDays: {
        label: "Ventana (días)",
        description:
          "Sólo las pistas de coincidencia creadas dentro de estos muchos días.",
      },
    },
    response: {
      pairsFound: "Pares encontrados",
      pairsLinked: "Parejas vinculadas",
    },
    errors: {
      unauthorized: {
        title: "Se requiere autenticación",
        description: "Inicia sesión para continuar",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "No tienes acceso",
      },
      server: {
        title: "Error del servidor",
        description: "Se produjo un error al ejecutar el enlace de IP",
      },
      unknown: {
        title: "Error desconocido",
        description: "Ocurrió un error desconocido",
      },
      validation: {
        title: "Error de validación",
        description: "Parámetros de solicitud no válidos",
      },
    },
    success: {
      title: "IP Enlace de partido completado",
      description: "IP -maquetas conectadas con éxito",
    },
  },
};
