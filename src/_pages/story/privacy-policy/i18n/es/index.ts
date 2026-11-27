import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Política de privacidad | {{appName}}",
    category: "Información legal",
    description:
      "Conoce cómo {{appName}} protege tu privacidad y trata tus datos",
    imageAlt: "Política de privacidad",
    keywords:
      "política de privacidad, protección de datos, privacidad de usuarios, privacidad de {{appName}}",
    ogTitle: "Política de privacidad | {{appName}}",
    ogDescription:
      "Conoce cómo {{appName}} protege tu privacidad y trata tus datos",
    twitterTitle: "Política de privacidad | {{appName}}",
    twitterDescription:
      "Conoce cómo {{appName}} protege tu privacidad y trata tus datos",
  },
  printAriaLabel: "Imprimir la política de privacidad",
  onThisPage: "En esta página",
  printButton: "Imprimir",
  title: "Política de privacidad",
  lastUpdated: "Última actualización: noviembre de 2026",
  bindingVersionNotice:
    "Esta traducción se facilita a título informativo. La versión en alemán es la jurídicamente vinculante.",
  introduction:
    "{{appName}} protege tu privacidad. Esta política explica cómo recopilamos, usamos y protegemos tus datos personales cuando usas nuestra plataforma de chat con IA sin censura.",
  sections: {
    informationCollect: {
      title: "Datos que recopilamos",
      description:
        "Recopilamos los datos que nos proporcionas directamente y los que se recogen de forma automática cuando usas el servicio.",
    },
    personalData: {
      title: "Datos personales",
      description: "Podemos recopilar los siguientes datos personales:",
      items: {
        name: "Nombre y datos de contacto",
        email: "Dirección de correo electrónico",
        phone: "Número de teléfono (opcional)",
        company: "Nombre de la empresa (opcional)",
        billing: "Datos de facturación y pago",
        payment: "Método de pago y detalles de las transacciones",
      },
    },
    socialMediaData: {
      title: "Datos de redes sociales",
      description:
        "Si conectas cuentas de redes sociales, podemos recopilar información de tu perfil y datos relacionados en la medida que lo permitan esas plataformas.",
    },
    derivativeData: {
      title: "Datos derivados",
      description:
        "Podemos generar datos anonimizados y agregados a partir de tu uso para mejorar nuestros servicios.",
    },
    useOfInformation: {
      title: "Cómo usamos tus datos",
      description:
        "Usamos los datos que recopilamos para varios fines, entre ellos:",
      items: {
        provide: "Prestar y mantener nuestros servicios de chat con IA",
        process: "Procesar tus transacciones y administrar tu cuenta",
        send: "Enviarte novedades, boletines y comunicaciones comerciales",
        respond: "Responder a tus consultas y darte asistencia",
        monitor:
          "Supervisar y analizar los patrones de uso para mejorar nuestra plataforma",
        personalize:
          "Personalizar tu experiencia y ofrecerte contenido relevante",
      },
    },
    disclosure: {
      title: "Divulgación de datos",
      description:
        "Podemos divulgar tus datos cuando lo exija la ley o para proteger nuestros derechos y nuestra seguridad.",
    },
    businessTransfers: {
      title: "Cambio de operador",
      description:
        "Si un nuevo operador se hace cargo del servicio, podemos transferirle tus datos.",
    },
    thirdParty: {
      title: "Servicios de terceros",
      description:
        "Solo compartimos datos personales con los proveedores que aparecen abajo, y solo en la medida en que cada uno los necesita para su trabajo. Tu cuenta, tus chats y tus archivos se guardan en nuestros propios servidores en Alemania.",
      aiNotice:
        "Cuando chateas o generas contenido multimedia, la solicitud va al proveedor del modelo que elegiste. Contiene lo que el modelo necesita para responder: tu mensaje, los mensajes anteriores de la conversación, los adjuntos, las instrucciones y recuerdos que usa la IA y el nombre visible de tu perfil. No enviamos tu dirección de correo. Intermediarios como OpenRouter, NanoGPT y Venice pasan la solicitud a la empresa que ejecuta el modelo, por ejemplo OpenAI, Anthropic, Google, xAI, DeepSeek o Mistral. Cuánto tiempo guarda un proveedor una solicitud y qué puede hacer con ella lo deciden sus propias condiciones. No entrenamos modelos de IA con tus chats.",
      transfers:
        "Varios proveedores tienen su sede fuera de la UE. Cuando un proveedor ofrece las cláusulas contractuales tipo de la Comisión Europea, como Stripe y OpenRouter, la transferencia se basa en ellas. En los demás casos, los datos se transfieren según las condiciones del proveedor.",
      labels: {
        purpose: "Finalidad",
        data: "Datos compartidos",
        privacyPolicy: "Política de privacidad",
      },
      groups: {
        hosting: "Alojamiento y almacenamiento",
        email: "Correo electrónico",
        payments: "Pagos",
        ai: "Modelos de IA",
        web: "Búsqueda web y carga de páginas",
      },
      providers: {
        hostinger: {
          purpose:
            "Nos alquila los dos servidores virtuales en los que funciona la plataforma. La base de datos, el almacenamiento de archivos (MinIO) y la caché (Redis) los operamos nosotros en esos servidores. No interviene ningún servicio de almacenamiento en la nube aparte.",
          data: "Todo lo que se guarda en la plataforma: datos de la cuenta, chats, recuerdos, archivos subidos y generados, registros de pago.",
          location: "Servidores en Alemania, empresa en Lituania (UE)",
        },
        hosttech: {
          purpose:
            "Servidor de correo de nuestras direcciones. Envía códigos de registro, recibos y boletines, y recibe los correos que nos escribes.",
          data: "Dirección de correo, nombre, contenido de los correos.",
          location: "Suiza (decisión de adecuación de la UE)",
        },
        stripe: {
          purpose: "Pagos con tarjeta, suscripciones y facturas.",
          data: "Nombre, dirección de correo, dirección de facturación, datos de pago, importes, el ID de tu cuenta. Nunca vemos el número completo de tu tarjeta.",
          location:
            "Stripe Payments Europe, Ltd., Irlanda (UE); empresa matriz en EE. UU.",
        },
        paypal: {
          purpose: "Solo si eliges PayPal en el pago de Stripe.",
          data: "Nombre, dirección de correo, datos de pago, importes.",
          location: "PayPal (Europe) S.à r.l. et Cie, S.C.A., Luxemburgo (UE)",
        },
        nowpayments: {
          purpose: "Pagos con criptomonedas.",
          data: "El ID de tu cuenta en el número de pedido, producto e importe, datos de la billetera y de la transacción. En pagos cripto recurrentes, también tu dirección de correo.",
          location: "San Vicente y las Granadinas",
        },
        openrouter: {
          purpose:
            "Lleva la mayoría de los modelos de chat (por ejemplo de OpenAI, Anthropic, Google, xAI, DeepSeek, Mistral y Qwen) y algunos modelos de imagen y video a la empresa que los ejecuta.",
          data: "Contenido de la solicitud a la IA, como se describe arriba. La empresa que ejecuta el modelo recibe el mismo contenido.",
          location: "EE. UU.",
        },
        nanogpt: {
          purpose: "Modelos de chat, imagen y video, texto a voz.",
          data: "Contenido de la solicitud a la IA, texto que quieres escuchar.",
          location: "EE. UU.",
        },
        venice: {
          purpose: "Modelos de chat, imagen y video sin censura.",
          data: "Contenido de la solicitud a la IA.",
          location: "EE. UU.",
        },
        uncensoredAi: {
          purpose: "Modelo de chat UncensoredLM.",
          data: "Contenido de la solicitud a la IA.",
          location: "EE. UU.",
        },
        freedomgpt: {
          purpose: "Modelos de chat de FreedomGPT.",
          data: "Contenido de la solicitud a la IA.",
          location: "EE. UU.",
        },
        gabAi: {
          purpose: "Modelos de chat de Gab AI.",
          data: "Contenido de la solicitud a la IA.",
          location: "EE. UU.",
        },
        modelslab: {
          purpose: "Modelos de imagen, video y música.",
          data: "Tu prompt y las imágenes que adjuntes.",
          location: "India",
        },
        edenAi: {
          purpose:
            "Voz a texto y texto a voz. Pasa el audio o el texto al motor de voz que utiliza.",
          data: "Grabaciones de voz que transcribes, texto que quieres escuchar.",
          location: "Francia (UE)",
        },
        braveSearch: {
          purpose: "Búsqueda web cuando la IA busca en internet.",
          data: "La consulta que escribe la IA. Sin datos de la cuenta.",
          location: "EE. UU.",
        },
        kagi: {
          purpose:
            "Búsqueda web y respuestas web breves cuando la IA busca en internet.",
          data: "La consulta que escribe la IA. Sin datos de la cuenta.",
          location: "EE. UU.",
        },
        scrappey: {
          purpose: "Carga una página web cuando la IA lee un enlace.",
          data: "La dirección de la página. Sin datos de la cuenta.",
          location: "UE",
        },
      },
    },
    legal: {
      title: "Base jurídica del tratamiento",
      description:
        "Tratamos tus datos personales basándonos en tu consentimiento, la necesidad de ejecutar el contrato, nuestras obligaciones legales y nuestros intereses legítimos en prestar y mejorar los servicios.",
    },
    security: {
      title: "Medidas de seguridad",
      description:
        "Aplicamos medidas técnicas y organizativas adecuadas para proteger tus datos personales frente al acceso no autorizado, la modificación, la divulgación o la destrucción. Ningún método de transmisión por internet es totalmente seguro.",
    },
    rights: {
      title: "Tus derechos de protección de datos",
      description:
        "La legislación sobre protección de datos te reconoce ciertos derechos respecto de tus datos personales:",
      items: {
        access: "Derecho de acceso a tus datos personales",
        correction: "Derecho de rectificación de datos inexactos o incompletos",
        deletion:
          "Derecho de supresión: elimina tu cuenta desde Configuración para que se borren tus datos personales",
        objection: "Derecho de oposición al tratamiento de tus datos",
        portability:
          "Derecho a la portabilidad: exporta todos tus datos en formato JSON desde Configuración",
      },
    },
    cookies: {
      title: "Cookies y seguimiento",
      description:
        "No usamos rastreadores de terceros, píxeles publicitarios ni técnicas de huella digital del navegador. Una sola cookie propia nos permite reconocer tu navegador. Para saber qué canales atraen a personas que siguen usando el servicio, registramos cómo llegaste la primera vez y cómo llegaste la última vez a través de un enlace etiquetado: las etiquetas de campaña del enlace (utm_source, utm_medium, utm_campaign, utm_content, utm_term), el dominio del sitio de origen (nunca su dirección completa), la página de destino (sin su cadena de consulta) y cualquier código de referido. También registramos cuándo empezaste a chatear, te registraste, confirmaste tu suscripción al boletín, pagaste y renovaste. Vinculamos esos datos con tu cuenta cuando te registras. Solo los usamos de forma agregada para evaluar los canales de marketing. Nunca los vendemos ni compartimos y los borramos al eliminar tu cuenta.",
    },
    guestMedia: {
      title: "Archivos multimedia creados sin cuenta",
      description:
        "Guardamos en nuestros servidores las imágenes, los audios y los videos que generas sin cuenta, incluso en modo incógnito, para que puedas verlos y descargarlos. Si nunca creas una cuenta, eliminamos automáticamente esos archivos después de 4 meses.",
    },
    thirdPartySites: {
      title: "Sitios web de terceros",
      description:
        "Nuestro servicio puede contener enlaces a sitios de terceros. No somos responsables de las prácticas de privacidad de esos sitios. Te recomendamos consultar sus políticas de privacidad.",
    },
    children: {
      title: "Privacidad de menores",
      description:
        "Nuestro servicio no está dirigido a menores de 13 años. No recopilamos deliberadamente datos de menores.",
    },
    changes: {
      title: "Cambios en esta política",
      description:
        "Podemos actualizar esta política de privacidad periódicamente. Te informaremos de cualquier cambio significativo.",
    },
    controller: {
      description:
        "El responsable del tratamiento de tus datos conforme al RGPD es {{operator}}, {{address}}.",
    },
    gdpr: {
      title: "Cumplimiento del RGPD",
      description:
        "Si usas el servicio desde la Unión Europea, respetamos tus derechos conforme al RGPD. Puedes exportar tus datos en cualquier momento desde Configuración. Al eliminar tu cuenta borramos tu perfil, tus chats, tus recuerdos, tus direcciones, tu suscripción al boletín y tus datos de contacto, y quitamos los datos personales de los registros de visitas vinculados. Conservamos las estadísticas agregadas anónimas y el registro de movimientos de créditos, que ya no está vinculado contigo. Contáctanos para cualquier trámite que no puedas realizar desde Configuración.",
    },
  },
  post: {
    title: "Política de privacidad",
    description: "Endpoint de la política de privacidad",
    form: {
      title: "Configuración de la política de privacidad",
      description: "Configura los parámetros de la política de privacidad",
    },
    response: {
      title: "Respuesta",
      description: "Datos devueltos por la política de privacidad",
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
