import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Aviso legal | {{appName}}",
    category: "Información legal",
    description: "Aviso legal y datos del operador de {{appName}}",
    imageAlt: "Aviso legal",
    keywords:
      "aviso legal, información del operador, datos del proveedor, {{appName}}",
    ogTitle: "Aviso legal | {{appName}}",
    ogDescription: "Aviso legal y datos del operador de {{appName}}",
    twitterTitle: "Aviso legal | {{appName}}",
    twitterDescription: "Aviso legal y datos del operador de {{appName}}",
  },
  printAriaLabel: "Imprimir aviso legal",
  onThisPage: "En esta página",
  printButton: "Imprimir",
  title: "Aviso legal",
  lastUpdated: "Última actualización: noviembre de 2026",
  bindingVersionNotice:
    "Esta traducción se facilita a título informativo. La versión en alemán es la jurídicamente vinculante.",
  introduction:
    "Este aviso recoge la información sobre {{appName}} que exige la legislación aplicable.",
  sections: {
    companyInfo: {
      title: "Operador",
      description: "El operador de {{appName}} es:",
      vat: "IVA: no se cobra IVA por aplicación del régimen para pequeñas empresas del artículo 19 de la ley alemana del IVA (UStG).",
    },
    responsiblePerson: {
      title: "Responsable",
      description:
        "Información sobre la persona responsable del contenido de este sitio web.",
    },
    contactInfo: {
      title: "Datos de contacto",
      description: "Cómo contactarnos para consultas legales y comerciales.",
    },
    disclaimer: {
      title: "Exención de responsabilidad",
      copyright: {
        title: "Derechos de autor",
        content:
          "Todos los contenidos de este sitio están protegidos por derechos de autor. Se prohíbe su uso sin autorización.",
      },
      liability: {
        title: "Responsabilidad",
        content:
          "No ofrecemos declaraciones ni garantías sobre la exhaustividad, la exactitud o la fiabilidad de la información de este sitio.",
      },
      links: {
        title: "Enlaces externos",
        content:
          "Nuestro sitio puede contener enlaces a sitios externos. No somos responsables de su contenido.",
      },
    },
    disputeResolution: {
      title: "Resolución de controversias",
      description:
        "Información sobre cómo se tramitan y resuelven las controversias.",
      content:
        "No tenemos la obligación ni la intención de participar en procedimientos de resolución de controversias ante un órgano de arbitraje de consumo.",
    },
  },
  post: {
    title: "Aviso legal",
    description: "Endpoint del aviso legal",
    form: {
      title: "Configuración del aviso legal",
      description: "Configura los parámetros del aviso legal",
    },
    response: {
      title: "Respuesta",
      description: "Datos devueltos por el aviso legal",
    },
    errors: {
      unauthorized: {
        title: "Sin autorización",
        description: "Debes autenticarte",
      },
      validation: {
        title: "Error de validación",
        description: "Parámetros de solicitud no válidos",
      },
      server: {
        title: "Error del servidor",
        description: "Se produjo un error interno en el servidor",
      },
      unknown: {
        title: "Error desconocido",
        description: "Se produjo un error desconocido",
      },
      network: {
        title: "Error de red",
        description: "Se produjo un error de red",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "No tienes permiso para acceder",
      },
      notFound: {
        title: "Recurso no encontrado",
        description: "El recurso solicitado no existe",
      },
      conflict: {
        title: "Conflicto",
        description: "Se produjo un conflicto de datos",
      },
    },
    success: {
      title: "Operación exitosa",
      description: "Operación completada",
    },
  },
};
