import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Pagos",
  tags: {
    payment: "payment",
    admin: "admin",
  },
  post: {
    title: "Asegurar los precios de Stripe",
    titleShort: "Stripe Precios",
    description:
      "Crea en la cuenta de Stripe vinculada los precios de los planes y paquetes de créditos para cada moneda e idioma. Busca los precios por clave. Puedes repetir la operación sin duplicar precios ni guardar sus ID en el archivo .env. La simulación enumera los precios que existen y los que faltan.",
    fields: {
      dryRun: {
        label: "Simulación",
        description: "Lista precios sin crear nada",
      },
    },
    response: {
      dryRun: "Simulación",
      stripeMode: "Modo Stripe",
      existing: "Ya está allí.",
      created: "Creado ahora",
      missing: "Faltando",
      prices: "Precios",
      lookupKey: "Clave de búsqueda",
      priceId: "Precio ID",
      productId: "Producto ID",
      amount: "Monto",
      status: "Situación",
    },
    widget: {
      hint: "Ejecutar una vez por cuenta Stripe después del cambio de precios. El checkout también crea un precio perdido en el primer uso.",
      submit: "Asegurar los precios",
      summary:
        "Stripe {{mode}} : {{existing}} existente, {{created}} creado, {{missing}} desaparecido",
    },
  },
  errors: {
    validation: {
      title: "Entrada inválida",
      description: "Consultar la solicitud",
    },
    unauthorized: {
      title: "No está firmado",
      description: "Inicie sesión como administrador",
    },
    forbidden: {
      title: "Admins only",
      description:
        "Sólo los administradores pueden gestionar los precios de Stripe",
    },
    notFound: {
      title: "Cuenta o sesión no encontradas",
      description: "No se encontró el recurso",
    },
    conflict: {
      title: "Conflicto",
      description: "Stripe cambió mientras tanto, corre de nuevo",
    },
    server: {
      title: "Error del servidor",
      description: "Los precios de Stripe no se pueden garantizar",
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
    notConfigured:
      "Stripe no está configurado (STRIPE_SECRET_KEY desaparecido)",
  },
  success: {
    title: "Listo",
    description: "Precios de Stripe comprobados",
  },
};
