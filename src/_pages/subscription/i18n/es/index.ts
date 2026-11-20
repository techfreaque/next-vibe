import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  subscription: {
    title: "Créditos y suscripción",
    description: "Administra tus créditos y tu suscripción mensual",
    backToChat: "Volver al chat",
    billingInterval: "Frecuencia de facturación",
    currentPeriodStart: "Inicio del período actual",
    nextBillingDate: "Próxima fecha de facturación",
    endsOn: "La suscripción termina el",
    canceledOn: "Cancelada el",
    endedOn: "Finalizada el",
    cancellation: {
      title: "Cancelación programada",
      description:
        "Tu suscripción terminará el {{date}}. Mantendrás el acceso hasta ese día.",
    },
    canceled: {
      title: "Suscripción cancelada",
      description:
        "Cancelaste tu suscripción. Puedes volver a suscribirte cuando quieras para recibir créditos mensuales de nuevo.",
    },
    manage: {
      stripe: {
        button: "Administrar suscripción",
      },
      nowpayments: {
        button: "Ver detalles de la suscripción",
        info: "Tu suscripción se gestiona por correo electrónico. Revisa tu bandeja de entrada para ver los enlaces de pago y los detalles que te envió NOWPayments.",
      },
      portal: {
        error: "No se pudo abrir el portal de facturación. Inténtalo de nuevo.",
      },
    },
    balance: {
      title: "Saldo de créditos",
      description:
        "Créditos disponibles para conversar con {{modelCount}} modelos de IA",
      credit: "{{count}} crédito",
      credits: "{{count}} créditos",
      nextExpiration: "Próximo vencimiento",
      expiring: {
        title: "Créditos de la suscripción",
        description: "Incluidos en tu plan mensual",
      },
      permanent: {
        title: "Créditos sin vencimiento",
        description: "Los créditos que compras en paquetes nunca vencen",
      },
      free: {
        title: "Créditos mensuales gratis",
        description:
          "Sin cuenta: {{guest}} créditos gratis al mes. Cuenta gratis: {{signedIn}} al mes. Cuenta y boletín: {{max}} al mes.",
      },
      earned: {
        title: "Créditos ganados",
        description: "Gana créditos invitando a tus amigos →",
      },
    },
    overview: {
      howItWorks: {
        title: "Cómo funcionan los créditos",
        description:
          "Los mismos créditos sirven para todos los modelos. Elige un plan, recarga o empieza gratis.",
        expiring: {
          title: "Planes mensuales",
          description:
            "Planes desde {{minPrice}} hasta {{maxPrice}} al mes, con hasta {{maxCredits}} créditos. Incluyen los {{modelCount}} modelos.",
        },
        permanent: {
          title: "Paquetes de créditos",
          description:
            "Recarga cualquier plan: {{packPrice}} por {{packCredits}} créditos. Compra los paquetes que necesites. Nunca vencen.",
        },
        free: {
          title: "Créditos gratis",
          description:
            "Sin cuenta: {{guest}} al mes. Cuenta gratis: {{signedIn}} al mes. Cuenta y boletín: {{max}} al mes. Sin tarjeta.",
        },
      },
      costs: {
        title: "Cuánto cuesta cada acción",
        description:
          "Paga en créditos por mensaje, imagen, clip o llamada a una herramienta. Los precios por mensaje son estimados: con los modelos de OpenRouter pagas el costo real del proveedor más nuestro margen.",
        models: {
          title: "Modelos de IA (por mensaje)",
          gpt4: "GPT-4",
          claude: "Claude Sonnet",
          gpt35: "GPT-3.5",
          llama: "Llama 3",
          cost: "{{count}} créditos",
          showLegacy: "Mostrar modelos anteriores",
          hideLegacy: "Ocultar modelos anteriores",
          free: "Gratis",
          approxCost: "~créditos",
          legacyBadge: "Anterior",
          types: {
            text: "Chat",
            tts: "Texto a voz",
            stt: "Voz a texto",
            image: "Generación de imágenes",
            audio: "Generación de música",
            video: "Generación de video",
          },
        },
        features: {
          title: "Funciones",
          braveSearchLabel: "Brave Search (por búsqueda)",
          kagiSearchLabel: "Kagi Search (por búsqueda)",
          fetchUrlLabel: "Obtener el texto de una página web (por solicitud)",
          costFormat: "{{value}} {{unit}}",
          creditsUnit: "créditos",
        },
      },
      cta: {
        title: "Accede a todos los modelos",
        description:
          "Créditos mensuales para los {{modelCount}} modelos. Recarga con paquetes cuando quieras.",
        button: "Suscribirme",
      },
    },
    buy: {
      signInRequired: {
        title: "Inicia sesión",
        description:
          "Inicia sesión o crea una cuenta para comprar créditos o suscribirte.",
      },
      provider: {
        stripe: {
          description: "Tarjetas de crédito y débito",
        },
        nowpayments: {
          description: "Criptomonedas",
        },
        cryptoMinimumPacks:
          "Para pagar con criptomonedas necesitas comprar al menos {{minPacks}} paquetes de créditos ({{minValue}}) para alcanzar el importe mínimo de la transacción.",
      },
      subscription: {
        badge: "Mejor precio",
        title: "Suscripción mensual",
        description:
          "{{subPrice}} al mes por {{subCredits}} créditos mensuales para los {{modelCount}} modelos de IA",
        perMonth: "/mes",
        perYear: "/año",
        yearlyEquivalent: "Solo {{monthlyPrice}} al mes con facturación anual",
        features: {
          credits: "{{count}} créditos al mes",
          expiry: "Acceso a los {{modelCount}} modelos de IA",
          bestFor: "Para quienes usan IA a menudo",
        },
        button: "Suscribirme ahora",
        buttonAlreadySubscribed: "Suscripción activa",
      },
      pack: {
        title: "Paquetes de créditos extra",
        description: "Recarga tu plan. Los créditos nunca vencen.",
        badge: "Recarga",
        perPack: "/paquete",
        quantity: "Cantidad",
        total: "{{count}} créditos",
        features: {
          credits: "{{count}} créditos por paquete",
          permanent: "Sin vencimiento",
          expiry: "Sin vencimiento",
          bestFor:
            "Para quienes usan IA con frecuencia y necesitan más créditos",
        },
        button: {
          submit: "Comprar paquete de créditos",
        },
        totalPrice: "Total: {{price}}",
        pack: "Paquete",
        packs: "Paquetes",
      },
    },
    history: {
      title: "Historial de transacciones",
      description: "Tus transacciones recientes de créditos",
      empty: {
        title: "Aún no hay transacciones",
        description: "Aquí verás el historial de tus transacciones de créditos",
      },
      balance: "Saldo: {{count}}",
      loadMore: "Cargar más",
      types: {
        purchase: "Compra",
        subscription: "Suscripción",
        usage: "Consumo",
        expiry: "Vencimiento",
        free_tier: "Plan gratis",
        monthly_reset: "Renovación mensual",
        free_grant: "Asignación de créditos gratis",
        free_reset: "Renovación de créditos gratis",
        refund: "Reembolso",
        transfer: "Transferencia",
        other_devices: "Consumo desde otros dispositivos",
        referral_earning: "Ganancia por referidos",
        referral_payout: "Pago de ganancias por referidos",
      },
    },
    tabs: {
      overview: "Resumen",
      buy: "Comprar créditos",
      adminBuy: "Administrar créditos",
      billing: "Facturación",
      history: "Historial",
      plans: "Planes",
      remote: "Sincronización en la nube",
    },
    admin: {
      title: "Créditos y límites",
      description:
        "Administra la asignación de créditos y los límites de uso de esta instancia",
      allocate: {
        title: "Asignar créditos",
        description:
          "Agrega créditos a cualquier cuenta. Los créditos limitan el gasto en IA. Si administras tu propia instancia, fija aquí el presupuesto que quieres permitir.",
        howItWorks: {
          title: "Cómo funcionan los límites de créditos",
          freePool: {
            title: "Créditos gratis compartidos",
            description:
              "Todos los usuarios comparten una reserva de créditos gratis que se renueva cada mes. Define el importe en la configuración del entorno.",
          },
          bonus: {
            title: "Créditos extra por usuario",
            description:
              "Los créditos extra nunca vencen y se suman a los créditos gratis compartidos. Úsalos para ampliar el límite de usuarios específicos.",
          },
          apiKeys: {
            title: "Quitar todos los límites",
            description:
              "Configura tus propias claves de API para los modelos de lenguaje y usa la IA sin gastar créditos. Cada usuario también puede usar su propia clave de API.",
          },
        },
      },
    },
    payment: {
      success: {
        title: "Pago realizado",
        subscription:
          "Tu suscripción está activa. Los créditos estarán disponibles en breve.",
        credits:
          "Compraste el paquete de créditos. Los créditos estarán disponibles en breve.",
      },
      canceled: {
        title: "Pago cancelado",
        subscription:
          "Se canceló el pago de tu suscripción. Puedes volver a intentarlo cuando quieras.",
        credits:
          "Se canceló el pago del paquete de créditos. Puedes volver a intentarlo cuando quieras.",
      },
    },
  },
  meta: {
    category: "Precios",
    imageAlt: "Precios de {{appName}}: créditos para todos los modelos de IA",
    keywords:
      "precios de chat con IA, precios de IA sin censura, IA con pago por mensaje, créditos de IA, {{appName}}",
    overview: {
      title: "Precios: paga por mensaje, sin ataduras | {{appName}}",
      description:
        "Hasta {{freeCredits}} créditos gratis al mes. Planes desde {{subPrice}} por {{subCredits}} créditos mensuales, hasta {{maxCredits}}. Un solo saldo para {{modelCount}} modelos, desde los convencionales hasta los que vienen sin censura.",
    },
    buyCredits: {
      title: "Planes y paquetes de créditos | {{appName}}",
      description:
        "Planes desde {{subPrice}} por {{subCredits}} créditos al mes, hasta {{maxCredits}}. Recarga cualquier plan con paquetes que nunca vencen. Paga con tarjeta, PayPal o criptomonedas. {{modelCount}} modelos de IA.",
    },
    history: {
      title: "Historial de créditos | {{appName}}",
      description:
        "Todos tus movimientos de créditos: compras, asignaciones mensuales, ganancias por referidos y el costo de cada chat.",
    },
  },
  payment: {
    success: {
      title: "Pago realizado",
      subscription:
        "Tu suscripción mensual está activa. Ahora tienes {{subCredits}} créditos al mes para todos los {{modelCount}} modelos.",
      credits: "Compraste el paquete de créditos. Los créditos nunca vencen.",
    },
    canceled: {
      title: "Pago cancelado",
      subscription:
        "Se canceló el pago de tu suscripción. Puedes volver a intentarlo cuando quieras.",
      credits:
        "Se canceló el pago del paquete de créditos. Puedes volver a intentarlo cuando quieras.",
    },
  },
};
