import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Contabilidad, CRM e IA en tu propio servidor | {{appName}}",
    description:
      "Contabilidad de partida doble, facturación, compras, inventario, punto de venta, CRM y newsletters en una sola app de código abierto. En tu servidor. Cada función es una herramienta que tu IA puede usar.",
    category: "Empresas",
    imageAlt: "{{appName}} autoalojado: contabilidad, CRM e IA",
    keywords:
      "software de contabilidad autoalojado, ERP de código abierto, contabilidad open source, partida doble, software de facturación, contabilidad con IA, CRM autoalojado, {{appName}}",
  },
  hero: {
    badge: "Suite empresarial de código abierto",
    title: "Tus cuentas. Tu servidor.",
    titleHighlight: "Con IA dentro.",
    subtitle:
      "Contabilidad de partida doble, facturación, compras, inventario, punto de venta, CRM y newsletters en una sola app de código abierto. Funciona en tu servidor. Cada función es una herramienta que tu IA sabe usar.",
    ctaStart: "Instálalo tú mismo",
    ctaGithub: "Ver en GitHub",
    shotAlt:
      "Balance de sumas y saldos de una empresa demo: Debe igual a Haber",
    stats: {
      actions: "acciones que tu IA puede ejecutar",
      reports: "informes en directo del libro mayor",
      charts: "planes contables: SKR03, ÖKR, SK, IFRS",
      languages: "idiomas incluidos",
    },
  },
  ledger: {
    eyebrow: "Las cuentas",
    title: "Partida doble. Sin excepciones.",
    intro:
      "Facturas emitidas y recibidas, pagos y ventas en caja llegan solos al libro mayor, incluidos asientos multidivisa con tipos diarios del BCE, diferencias de cambio realizadas y revalorización de cierre. El Debe tiene que igualar al Haber, o no se contabiliza nada.",
    points: {
      balanced: {
        title: "Cuadrado o rechazado",
        body: "Cada asiento necesita al menos dos líneas y cuadrar al céntimo. Se comprueba al crear, contabilizar y revertir.",
      },
      final: {
        title: "Contabilizado es definitivo",
        body: "Nada de cambios silenciosos. Un error se corrige con un asiento de reversión que replica el original y enlaza con él.",
      },
      periods: {
        title: "Periodos que se cierran",
        body: "Los asientos deben caer en un periodo abierto. No se cierra mientras queden borradores, y queda registrado quién cerró.",
      },
      templates: {
        title: "Empieza con tu país",
        body: "Alemania (SKR03), Austria (ÖKR) o Eslovaquia (SK): tipos de IVA, caja y cuenta bancaria incluidos. En otros países: un plan contable IFRS genérico, los tipos los añades tú.",
      },
    },
    reportsLabel: "Informes en directo desde el libro mayor",
    reports: {
      balanceSheet: "Balance de situación",
      profitLoss: "Cuenta de resultados",
      trialBalance: "Balance de sumas y saldos",
      aging: "Antigüedad de cobros",
      vat: "Informe de IVA",
      payablesAging: "Antigüedad de pagos",
      journalExport: "Exportación CSV del diario",
      taxFilings:
        "Declaraciones fiscales por país (DE UStVA/EÜR, AT UVA, SK DPH/KV, IVA genérico)",
    },
    shotAlt:
      "Facturas de proveedores con estado e importes en el panel de {{appName}}",
  },
  flows: {
    eyebrow: "Entra dinero, sale dinero",
    title: "Del presupuesto al libro mayor sin teclear dos veces.",
    intro:
      "Cada documento pasa al siguiente con una acción. La contabilidad se hace por el camino.",
    posted: "Contabilizado",
    sales: {
      title: "Ventas",
      steps: {
        estimate: "Presupuesto",
        invoice: "Factura",
        payment: "Cobro registrado",
      },
      note: "Facturas rectificativas, PDFs con tu marca, ZUGFeRD y códigos QR de pago, envío por email con registro de entregas, facturas recurrentes y enlaces de pago con Stripe.",
    },
    purchasing: {
      title: "Compras",
      steps: {
        order: "Pedido de compra",
        receipt: "Mercancía recibida",
        bill: "Factura de proveedor",
        payment: "Pagada",
      },
      note: "Proveedores con tipo de IVA por defecto. Entregas parciales controladas línea a línea. La recepción da entrada al stock del almacén.",
    },
    pos: {
      title: "Punto de venta",
      steps: {
        session: "Abrir caja",
        order: "Cobrar",
        payment: "Efectivo, tarjeta o transferencia",
      },
      note: "Las ventas y devoluciones mueven el stock del almacén de la caja y contabilizan el coste de ventas (COGS) con reglas configurables para stock negativo. Al cerrar se cuadra el efectivo.",
    },
    inventory: {
      title: "Inventario",
      body: "Almacenes, entradas, salidas y ajustes, traspasos entre ubicaciones. Cada movimiento queda en un registro inalterable, con quién lo hizo.",
    },
  },
  suite: {
    eyebrow: "Alrededor de las cuentas",
    title: "El resto de la empresa, en la misma app.",
    intro:
      "Un inicio de sesión, una base de datos, un panel. Nada de sincronizar cinco suscripciones.",
    aiLabel: "Cualquier modelo",
    toolCount: "{{count}} acciones",
    cards: {
      crm: {
        title: "CRM y leads",
        body: "Importa contactos desde CSV, sigue oportunidades y prospección, exporta cuando quieras.",
      },
      newsletter: {
        title: "Newsletter y campañas",
        body: "Doble opt-in, baja con un clic, gestión de rebotes, secuencias de email.",
      },
      messaging: {
        title: "Bandeja de entrada y mensajería",
        body: "Tu correo por IMAP y SMTP, más SMS, Telegram y WhatsApp Business.",
      },
      payments: {
        title: "Cobro de suscripciones",
        body: "Cobros con Stripe y cripto, webhooks y reembolsos para planes de suscripción.",
      },
      team: {
        title: "Empresas y roles",
        body: "Varias empresas en una instancia. Invita a tu equipo como propietario, admin, contable, miembro o lector.",
      },
      ai: {
        title: "Agentes programados",
        body: "Los agentes ejecutan informes y controles según un calendario. Con tu cuenta de {{appName}} o tu propia clave de proveedor.",
      },
    },
  },
  ai: {
    eyebrow: "IA que trabaja",
    title: "Pregunta a tus cuentas. Respuestas, no gráficos.",
    intro:
      "Cada operación contable es una herramienta tipada. Tu IA llama al mismo código que los botones del panel, con los mismos controles.",
    points: {
      chat: "Pregunta con tus palabras. El modelo ejecuta el informe y te lo explica.",
      cli: "Automatiza el cierre de mes desde la terminal. Cada herramienta es un comando CLI.",
      mcp: "Claude Code, Cursor y Codex llegan a las mismas herramientas por MCP.",
      permissions:
        "Un agente actúa como el usuario que lo lanza. Mismo rol en la empresa, mismos controles.",
    },
    demo: {
      label: "Ejemplo",
      question: "¿Quién nos debe dinero y con cuánto retraso?",
      tool: "Antigüedad de cobros",
      answer:
        "Tres clientes van con retraso, 4.180 EUR en total. El saldo mayor, 2.380 EUR, lleva 47 días vencido. ¿Te paso los números de factura?",
    },
    tabs: {
      cli: "CLI",
      mcp: "MCP",
    },
  },
  compare: {
    eyebrow: "La diferencia",
    title: "El típico software contable SaaS frente a tu propio servidor.",
    intro:
      "Las herramientas en la nube son cómodas. Esto es lo que cedes a cambio, y donde todavía ganan.",
    colSaas: "Software contable SaaS típico",
    colUs: "{{appName}}, autoalojado",
    colSaasShort: "SaaS",
    colUsShort: "Autoalojado",
    rows: {
      data: {
        label: "Dónde viven tus cuentas",
        saas: "En su nube, con sus condiciones",
        us: "En tu servidor, en tu Postgres",
      },
      seats: {
        label: "Precio por usuario",
        saas: "Cuota mensual por puesto",
        us: "Sin cuotas por puesto. Pagas el hosting y la IA que uses.",
      },
      ai: {
        label: "IA",
        saas: "Como extra, o nada",
        us: "Cada función es una herramienta de IA, con cualquier modelo",
      },
      code: {
        label: "Código fuente",
        saas: "Cerrado",
        us: "Abierto en GitHub",
      },
      missing: {
        label: "Te falta una función",
        saas: "Esperar a su hoja de ruta",
        us: "Constrúyela: un archivo de definición",
      },
      exit: {
        label: "Irte",
        saas: "Exportar lo que te dejen",
        us: "Ya es tu base de datos",
      },
      filings: {
        label: "Conexión bancaria y declaraciones",
        saas: "Muchas veces incluidas",
        us: "Incluidas: conexión Enable Banking, importación de extractos (CAMT.053, MT940, CSV) y conciliación, más exportaciones DE UStVA/EÜR, AT UVA, SK DPH/KV e IVA genérico.",
      },
      hosting: {
        label: "Mantenimiento",
        saas: "Lo hacen por ti",
        us: "Lo gestionas tú. Te ayudamos si lo pides.",
      },
    },
  },
  start: {
    eyebrow: "Instalación",
    title: "Tres comandos. Después, crea tu empresa.",
    intro:
      "Clona, instala, arranca. El asistente configura el acceso de admin y la IA. Luego añades tu empresa en el panel. Alemania, Austria o Eslovaquia: plan contable, tipos de IVA, caja y cuenta bancaria en un paso. En otros países: un plan IFRS genérico como base.",
    terminalTitle: "Arranca tu instancia",
    guide: "Guía completa de autoalojamiento",
    developers: "Crea tus propios módulos",
  },
  code: {
    copy: "Copiar",
    copied: "Copiado",
    wrap: "Ajustar líneas",
  },
  help: {
    title: "¿Vas a mudar una empresa aquí?",
    description:
      "Ayuda con la instalación, migración de datos, módulos a medida. Cada mensaje lo lee una persona.",
  },
};
