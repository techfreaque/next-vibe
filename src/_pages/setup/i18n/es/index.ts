import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Configura {{appName}}",
    description: "Primera configuración de tu instancia autoalojada.",
  },
  stepOf: "Paso {{current}} de {{total}}",
  steps: {
    admin: "Acceso admin",
    ai: "Conectar IA",
    extras: "Extras",
    done: "Listo",
  },
  back: "Atrás",
  continue: "Continuar",
  getKey: "Conseguir una clave",
  secretSaved: "Guardada. Déjalo vacío para conservarla.",
  errors: {
    saveFailed:
      "No se pudo guardar. Revisa la terminal donde corre vibe dev y vuelve a intentarlo.",
  },
  restart: {
    title: "Aplicando tus ajustes",
    body: "Tu instancia se reinicia para cargarlos. La página se recarga sola en unos segundos.",
    slow: "¿Tarda más de lo normal?",
    reload: "Recargar la página",
    manualTitle: "Guardado",
    manualBody:
      "Reinicia el servidor para aplicar los nuevos ajustes. Mientras tanto puedes seguir.",
    continue: "Continuar",
  },
  welcome: {
    title: "Tu instancia está en marcha.",
    body: "Protégela con tu propio acceso admin, conecta una IA y a chatear. Son dos minutos.",
    inProgress:
      "La configuración de esta instancia ya empezó. Inicia sesión como admin para terminarla.",
    failed:
      "El acceso admin por defecto no funcionó. Si ya lo cambiaste, inicia sesión con el tuyo.",
    start: "Empezar la configuración",
    starting: "Empezando",
    signIn: "Iniciar sesión como admin",
  },
  readOnly: {
    title: "Aquí los ajustes son de solo lectura",
    body: "Esta instancia toma sus ajustes del entorno de despliegue, así que esta página no puede guardarlos. Configúralos donde despliegas y reinicia.",
  },
  admin: {
    title: "Crea tu acceso admin",
    body: "Sustituye el acceso por defecto. Lo usas para entrar aquí y en la CLI de vibe.",
    email: "Correo",
    emailHelp: "Tu nombre de acceso. No se le envía nada.",
    emailPlaceholder: "tu@ejemplo.com",
    password: "Contraseña",
    passwordHelp: "Mínimo 8 caracteres. Se guarda cifrada en este equipo.",
    confirm: "Repite la contraseña",
    save: "Guardar y continuar",
    errors: {
      email: "Escribe un correo válido.",
      passwordShort: "Usa al menos 8 caracteres.",
      passwordDefault: "Elige tu propia contraseña, no la de por defecto.",
      mismatch: "Las contraseñas no coinciden.",
    },
  },
  ai: {
    title: "Conectar IA",
    body: "Elige de dónde vienen los modelos. Con una opción basta. Puedes añadir más cuando quieras.",
    byo: "O usa tus propias claves",
    moreProviders: "Más proveedores",
    skip: "Saltar por ahora",
    unbottled: {
      title: "Tu cuenta de unbottled.ai",
      recommended: "Recomendado",
      body: "Un solo inicio de sesión desbloquea todos los modelos de unbottled.ai: populares, abiertos y sin censura. El uso se paga con tus créditos de unbottled.ai. Sin claves de proveedores que gestionar.",
      email: "Correo de unbottled.ai",
      password: "Contraseña de unbottled.ai",
      advanced: "Avanzado",
      serverUrl: "URL del servidor",
      serverUrlHelp: "Cámbiala solo para conectar otra instancia de next-vibe.",
      failed: "No se pudo iniciar sesión. Revisa el correo y la contraseña.",
      connect: "Conectar cuenta",
      connecting: "Conectando",
      connected: "Conectado a {{url}}",
      unhealthy: "Conexión guardada, pero el servidor no responde ahora mismo.",
      disconnect: "Desconectar",
      noAccount: "¿Aún no tienes cuenta?",
      createAccount: "Crea una",
    },
    claude: {
      title: "Claude Code",
      detectedBadge: "Detectado",
      missingBadge: "No instalado",
      detected:
        "Encontrado en este equipo. Los modelos de Claude usan tu suscripción de Claude. Nada que escribir.",
      missing:
        "Instala la CLI claude e inicia sesión para usar tu suscripción de Claude. Después reinicia vibe dev.",
    },
  },
  fields: {
    openRouter: {
      label: "Clave API de OpenRouter",
      help: "Cientos de modelos con una sola clave.",
    },
    venice: {
      label: "Clave API de Venice AI",
      help: "Modelos privados y sin censura.",
    },
    nanoGpt: {
      label: "Clave API de NanoGPT",
      help: "Modelos sin censura y abliterados. Pago con cripto.",
    },
    openAi: {
      label: "Clave API de OpenAI",
      help: "Generación de imágenes con los modelos gpt-image.",
    },
    smtpHost: {
      label: "Servidor SMTP",
      help: "Tu servidor de correo, por ejemplo smtp.example.com.",
    },
    smtpPort: { label: "Puerto", help: "Normalmente 587, o 465 con TLS." },
    smtpSecure: {
      label: "Usar TLS",
      help: "Actívalo para el puerto 465.",
    },
    smtpUser: {
      label: "Usuario",
      help: "Normalmente tu dirección de correo completa.",
    },
    smtpPass: {
      label: "Contraseña",
      help: "Gmail y la mayoría de los grandes proveedores piden aquí una contraseña de aplicación.",
    },
    smtpFromEmail: {
      label: "Dirección del remitente",
      help: "Los correos salen desde esta dirección.",
    },
    smtpFromName: {
      label: "Nombre del remitente",
      help: "Se muestra como remitente, por ejemplo el nombre de tu instancia.",
    },
    stripeSecret: {
      label: "Clave secreta",
      help: "Empieza por sk_. Las claves de prueba también sirven.",
    },
    stripePublishable: {
      label: "Clave publicable",
      help: "Empieza por pk_.",
    },
    stripeWebhook: {
      label: "Secreto de firma del webhook",
      help: "Empieza por whsec_. Confirma que los pagos llegan a tu instancia.",
    },
    storageType: {
      label: "Dónde guardar los archivos",
      help: "Subidas, imágenes y audio de tus chats.",
      optionFilesystem: "Este equipo",
      optionS3: "Almacenamiento compatible con S3",
    },
    s3Endpoint: {
      label: "URL del endpoint",
      help: "El endpoint S3 de tu proveedor, por ejemplo https://s3.amazonaws.com.",
    },
    s3Region: {
      label: "Región",
      help: "Por ejemplo us-east-1. Algunos proveedores aceptan auto.",
    },
    s3Bucket: { label: "Bucket", help: "El bucket tiene que existir ya." },
    s3AccessKey: {
      label: "Access key ID",
      help: "En la página de claves de acceso de tu proveedor de almacenamiento.",
    },
    s3SecretKey: {
      label: "Secret access key",
      help: "Se muestra una sola vez, al crear la clave.",
    },
    s3PublicUrl: {
      label: "URL pública",
      help: "Opcional. Un CDN o la dirección pública del bucket para los enlaces a archivos.",
    },
  },
  extras: {
    title: "Extras opcionales",
    body: "Nada de esto hace falta para chatear. Sáltalo y vuelve cuando lo necesites.",
    configured: "Configurado",
    finish: "Terminar la configuración",
    skipFinish: "Saltar y terminar",
    errors: {
      s3Incomplete:
        "El almacenamiento S3 necesita endpoint, región, bucket y las dos claves.",
    },
    sections: {
      email: {
        title: "Correo",
        body: "Confirmaciones de registro y restablecimientos de contraseña a través de tu servidor SMTP.",
      },
      payments: {
        title: "Pagos",
        body: "Vende créditos y suscripciones con Stripe.",
      },
      storage: {
        title: "Almacenamiento de archivos",
        body: "Los archivos de los chats se quedan en este equipo, salvo que elijas S3.",
      },
    },
  },
  done: {
    title: "Todo listo.",
    body: "Tu instancia está configurada y es tuya.",
    admin: "Acceso admin: {{email}}",
    aiUnbottled: "IA: tu cuenta de unbottled.ai",
    aiKeys: "IA: tus propias claves de proveedores",
    aiClaude: "IA: Claude Code en este equipo",
    aiNone:
      "Todavía no hay ninguna IA conectada. Para chatear hace falta un proveedor. Añádelo cuando quieras en los ajustes de admin.",
    start: "Empezar a chatear",
    later: "Todo esto se puede cambiar después en los ajustes de admin.",
  },
};
