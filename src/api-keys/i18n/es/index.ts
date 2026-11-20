import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Cuenta",

  widget: {
    upgradeTitle:
      "El acceso API viene con cada plan, desde {{subPrice}} al mes",
    upgradeBody:
      "Cualquier plan desbloquea las teclas API. Los créditos gratis y extras no.",
    upgradeCta: "Desbloquear el API",
    createInactiveHint: "Escoge un plan para crear claves.",
    docsLink: "Lea los documentos API",
    back: "Atrás",
    loading: "Cargando teclas API...",
    intro:
      "Llame a los modelos {{modelCount}} de su código y su agente de codificación. Formatos OpenAI y Anthropic. Billed contra tus créditos al mismo precio que chat.",
    baseUrlTitle: "Base URL",
    baseUrlHint: "OpenAI SDKs, Codex, OpenCode, Continuar, Aider, Cline.",
    anthropicBaseUrlTitle: "Anthropic base URL",
    anthropicBaseUrlHint:
      "Código Claude y SDKs Anthropic. Mismo URL sin /v1: añaden /v1/messages ellos mismos.",
    setupTitle: "Conecte una herramienta",
    setupKeyFilled:
      "Tu nueva llave ya está en cada bloque. Copiado, pega, corre. Después de desestimarlo, los bloques vuelven al marcador de posición.",
    setupKeyMissing:
      "Los bloques muestran {{placeholder}}. Cree una llave y se llenan con ella.",
    copy: "Copiar",
    copied: "Copiado",
    keysTitle: "Tus llaves",
    empty: "Sin llaves API todavía",
    emptyHint: "Crea uno para empezar a llamar al API.",
    nameLabel: "Nombre clave",
    namePlaceholder: "Por ejemplo. Claude Código portátil",
    create: "Crear clave",
    creating: "Creando...",
    createFailed: "No podía crear la llave. Inténtalo de nuevo.",
    newKeyTitle: "Copia tu llave ahora",
    newKeyHint:
      "Esta es la única vez que se muestra la llave completa. Almacenamos un hachís, no la llave. Pérdelo y tienes que crear uno nuevo.",
    dismiss: "Lo salvé.",
    lastUsed: "Último usado",
    neverUsed: "Nunca se usó",
    created: "Creado",
    revoke: "Revocación",
    revoking: "Revocando...",
    revokeFailed: "No pude revocar esa llave. Inténtalo de nuevo.",
    maskedKey: "{{prefix}}…",
    meta: "{{lastUsed}} · Creado {{created}} · {{rate}}",
    rateLimit: "{{n}} req/min",
    uncensoredLabel: "Permitir modelos sin censura con mis claves",
    uncensoredHint:
      "Soy 18+ y acepto que los modelos no censurados pueden producir contenido ofensivo, falso, peligroso, ilegal o malicioso, sin filtrar. Soy responsable de cómo lo uso. Sin esto, los ids modelo sin censura regresan HTTP 403.",
    uncensoredFailed: "No se pudo guardar. Inténtalo de nuevo.",
    billingNote:
      "De los créditos devuelve HTTP 402. Streaming funciona en cada punto final.",
  },

  codingTools: {
    blocks: {
      oneCommand: "Un comando",
      config: "Configuración permanente",
      run: "Entonces empieza.",
      fields: "Configuración",
      check: "Comprueba tu llave",
      request: "Primera solicitud",
    },
    tested: "Probada con {{name}} {{version}}",
    anyModel:
      "Trae {{model}} para cualquier id de GET /v1/models, como {{examples}}.",
    tools: {
      codex: {
        hint: "Pruebe el comando y Codex se ejecuta en unbottled.ai. Para mantenerlo, anexa el bloque a ~/.codex/config.toml y comienza Codex con --profile sin embotellar.",
      },
      claudeCode: {
        hint: "Pruebe el comando y el código Claude se ejecuta en unbottled.ai. Para mantenerlo, ponga los mismos valores en el bloque env de ~/.claude/settings.json, junto a lo que ya está allí. Dejar las líneas modelo y el código Claude se ejecuta en nuestros modelos Claude bajo los nombres que ya sabe.",
      },
      opencode: {
        hint: "Guardar como opencode.json en tu proyecto, o como ~/.config/opencode/opencode.json para cada proyecto. Añadir cualquier modelo id al mapa de modelos.",
      },
      continue: {
        hint: "Ejecuta el Continúa CLI. La extensión IDE lee ~/.continue/config.yaml: añadir el mismo modelo de entrada allí.",
      },
      aider: {
        hint: "Un comando. Aider quiere openai/ delante del modelo id. Nombra los archivos para editar después del comando, como siempre.",
      },
      cline: {
        hint: "Dos comandos con el Cline CLI : guardar el proveedor una vez, luego ejecutar cline.",
      },
      openaiCompatible: {
        hint: "Cualquier herramienta o SDK con un campo base URL. OpenAI - herramientas de estilo tomar el /v1 URL. Anthropic - herramientas de estilo toman el URL sin /v1. La misma llave, los mismos modelos.",
      },
      curl: {
        hint: "Probar las obras clave y listar cada modelo id que puedas llamar. Entonces envía una primera solicitud.",
      },
    },
  },

  list: {
    title: "Llaves API",
    titleShort: "Llaves API",
    description:
      "Crear y revocar las teclas API. Muestra las URL base, configuraciones listas para herramientas de codificación y tus claves.",
    tag: "API",
    response: {
      baseUrl: "Base URL",
      isPaid: "Plan de pago",
      keys: "Claves",
    },
    success: {
      title: "Llaves API cargadas",
      description: "Tus teclas API han sido recuperadas",
    },
  },

  create: {
    title: "Crear clave API",
    titleShort: "Nueva clave",
    description:
      "Crear una llave para el API. Funciona con clientes OpenAI y Anthropic. La llave completa es devuelta una vez.",
    tag: "API",
    form: {
      name: "Nombre clave",
      namePlaceholder: "¿Para qué es esta llave?",
    },
    response: {
      key: "Llave API (mostrada una vez)",
      id: "Key ID",
      keyPrefix: "Prefijo clave",
    },
    success: {
      title: "Key created",
      description: "Copia la llave ahora. No se mostrará de nuevo.",
    },
    errors: {
      limit: "Ya tienes las teclas activas {{max}}. Revoque uno primero.",
      paidRequired:
        "Las teclas API necesitan una cuenta pagada: cualquier plan, desde {{subPrice}} al mes. Añadir uno en {{url}}.",
    },
  },

  revoke: {
    title: "Revoke API clave",
    titleShort: "Revocación",
    description:
      "Desactivar permanentemente una llave API. Las llamadas que lo usan fallan inmediatamente.",
    tag: "API",
    response: {
      message: "Llave revocada. Las llamadas que lo usan ahora fallan.",
    },
    success: {
      title: "Key revoked",
      description: "La llave API ya no se puede utilizar",
    },
    errors: {
      notFound: {
        detail: "No hay clave activa con ese ID en su cuenta.",
      },
    },
  },

  errors: {
    validation: {
      title: "Error de validación",
      description: "Solicitud inválida",
    },
    unauthorized: {
      title: "Se requiere autenticación",
      description: "Inicia sesión para continuar",
    },
    server: {
      title: "Error del servidor",
      description: "Error del servidor interno",
      detail: "La solicitud clave API falló: {{error}}",
    },
    unknown: {
      title: "Error desconocido",
      description: "Ocurrió un error desconocido",
    },
    network: { title: "Error de red", description: "Ocurrió un error de red" },
    forbidden: { title: "Acceso denegado", description: "Acceso denegado" },
    notFound: {
      title: "Cuenta o sesión no encontradas",
      description: "API clave no encontrada",
    },
    conflict: {
      title: "Conflicto",
      description: "Solicite conflictos con el Estado",
    },
  },
};
