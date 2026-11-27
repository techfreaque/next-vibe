import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Pagos",
  tags: {
    payment: "payment",
    admin: "admin",
  },
  post: {
    title: "Sincronizar catálogo de Whop",
    titleShort: "Catálogo de Whop",
    description:
      "Crea cada plan y paquete de créditos en la cuenta de Whop conectada: un producto por plan, una variante por intervalo, moneda y precio, localizada por nuestra clave en los metadatos. Idempotente. La prueba en seco muestra lo que existe y lo que falta.",
    fields: {
      dryRun: {
        label: "Prueba en seco",
        description: "Solo listar variantes, sin crear nada",
      },
    },
    response: {
      dryRun: "Prueba en seco",
      environment: "Entorno de Whop",
      accountId: "Cuenta de Whop",
      existing: "Ya existen",
      created: "Creadas ahora",
      missing: "Faltan",
      variants: "Variantes",
      key: "Clave",
      variantId: "ID de variante",
      productId: "Producto de Whop",
      amount: "Importe",
      status: "Estado",
      purchaseUrl: "Enlace de compra",
    },
    widget: {
      hint: "Ejecútalo una vez por cuenta de Whop tras cambiar precios. El checkout también crea la variante que falte en la primera compra.",
      submit: "Sincronizar catálogo",
      summary:
        "Whop {{environment}} ({{accountId}}): {{existing}} existentes, {{created}} creadas, {{missing}} faltan",
    },
  },
  errors: {
    validation: {
      title: "Datos no válidos",
      description: "Revisa la solicitud",
    },
    unauthorized: {
      title: "Sin sesión",
      description: "Inicia sesión como admin",
    },
    forbidden: {
      title: "Solo admins",
      description: "Solo los admins sincronizan el catálogo de Whop",
    },
    notFound: { title: "No encontrado", description: "Recurso no encontrado" },
    conflict: {
      title: "Conflicto",
      description: "Whop cambió entretanto. Vuelve a ejecutarlo.",
    },
    server: {
      title: "Error del servidor",
      description: "No se pudo sincronizar el catálogo de Whop",
    },
    network: {
      title: "Error de red",
      description: "La solicitud no llegó al servidor",
    },
    unknown: {
      title: "Error desconocido",
      description: "Algo falló de forma inesperada",
    },
    unsavedChanges: {
      title: "Cambios sin guardar",
      description: "Guarda o descarta tus cambios primero",
    },
    notConfigured:
      "Whop no está configurado (falta la clave API del WHOP_ENVIRONMENT activo)",
    syncFailed: "Falló la sincronización del catálogo de Whop: {{error}}",
  },
  success: {
    title: "Listo",
    description: "Catálogo de Whop revisado",
  },
};
