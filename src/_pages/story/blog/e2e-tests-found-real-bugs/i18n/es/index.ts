import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title:
      "Un robot pulsó todos los botones. Encontró ocho fallos de seguridad.",
    description:
      "Construimos un marco de prueba de extremo a extremo que conduce las páginas reales en un navegador real - y cubrió cada punto final orientado al cliente. Esto es lo que pilló.",
    category: "Ingeniería",
    imageAlt:
      "Pruebas de extremo a extremo conduciendo {{appName}} en un navegador real",
    keywords:
      "E2E testing, Playwright, security, SSRF, open redirect, next-vibe, {{appName}}",
  },
  hero: {
    backToBlog: "Volver al Blog",
    category: "Ingeniería",
    readTime: "7 min leer",
    title:
      "Un robot pulsó todos los botones. Encontró ocho fallos de seguridad.",
    subtitle:
      "Detuvimos las pruebas y empezamos las páginas de prueba. Navegador real, servidor real, clics reales - en cada punto final un cliente puede tocar.",
  },
  intro: {
    lead: "Nuestro código pasó cheques de tipo, lint y pruebas de unidad. Todavía envió bichos. No los exóticos - un formulario de reseteo que ignoró la contraseña de confirmación, enlaces de facturas que no fueron a ninguna parte, un pienso que mostró hilos borrados.",
    p1: "Cada uno de ellos vivía en la brecha entre las piezas. La función estaba bien. La página alrededor no lo era. Así que construimos un marco de prueba que sólo se preocupa por una cosa: lo que un cliente realmente ve y envía.",
  },
  why: {
    title: "¿Por qué probar la página real?",
    intro:
      "Cada capa de pruebas atrapa una clase diferente de bicho. Sólo el último ve lo que sus usuarios ven.",
    unit: {
      label: "Prueba de unidad",
      title: "Comprueba una función",
      body: "Rápido y barato. Cierre a cableado: URL equivocado, nombre de campo incorrecto, un botón que nunca envía.",
    },
    api: {
      label: "Prueba API",
      title: "Chequea una solicitud",
      body: "Muestra las respuestas del servidor. Nunca prueba que la página envía esa solicitud - o hace la respuesta.",
    },
    e2e: {
      label: "Fin a fin",
      title: "Revisa todo el viaje",
      body: "Abre la página en Chromium, tipos como una persona, clics enviar, lee la respuesta del cable. Si funciona aquí, funciona para clientes.",
    },
  },
  how: {
    title: "Cómo funciona el arnés",
    intro:
      "Playwright impulsado de la prueba de bun, construido sobre las definiciones de punto final de next-vibe. La definición ya conoce todos los campos, así que la prueba no necesita.",
    step1: {
      title: "Abrir la página real",
      body: "La prueba abre la página del cliente - /user/login, /story/framework - no un problema de prueba. Espera hasta que React sea dueña de la forma antes de escribir.",
    },
    step2: {
      title: "Llenar con valores tipo",
      body: "Pasa valores, no selectores. Los controladores de campo leen la definición y operan el tipo UI visible, elige una opción por su etiqueta, adjunta un archivo.",
    },
    step3: {
      title: "Captura la llamada del cable",
      body: "Presentar devuelve la verdad: el órgano de solicitud, estado y respuesta. El arnés afirma que la solicitud llevó exactamente lo que se escribió.",
    },
    step4: {
      title: "Recordad una vez, repetid para siempre",
      body: "Los proveedores de pagos - AI modelos, imagen, música, vídeo - se registran por prueba en la primera carrera y se reproducen después. No hay factura sorpresa, carreras deterministas.",
    },
    step5: {
      title: "Cobertura de los informes",
      body: "Un informe de cobertura cuenta cada punto final público: un éxito y un rechazo cada uno. Los gaps son visibles, no adivinados.",
    },
    codeCaption: "Una especie completa. Sin selectores, sin medias.",
  },
  numbers: {
    title: "El marcador",
    suites: "test suites",
    covered: "público endpoints fully covered",
    security: "agujeros de seguridad cerrados",
    note: "Los puntos finales restantes necesitan claves de proveedores pagados para buscar, raspar y hablar antes de que puedan ser registrados.",
  },
  security: {
    title: "Los agujeros de seguridad que encontró",
    intro:
      "Ninguno de ellos apareció en cheques de tipo o pruebas de unidad. Todos ellos aparecieron en el momento en que un verdadero navegador caminó el flujo real.",
    openRedirect: {
      title: "Open redirect on /track",
      body: "Cualquiera podría crear un enlace que rebotó a través de nuestro dominio a cualquier sitio. Los objetivos externos necesitan ahora una firma HMAC.",
    },
    ssrf: {
      title: "SSRF a través de URLs suministradas por el usuario",
      body: "URLs que entrega el AI podría apuntar a direcciones internas. Un guardia ahora resuelve DNS y comprueba cada hop redireccionado.",
    },
    ssrCache: {
      title: "Caché de servidor compartido entre solicitudes",
      body: "El caché de consulta servidor-render puede llevar los datos de un usuario a otro renderizado de página. Ahora está aislado por petición.",
    },
    systemPrompt: {
      title: "Debug de sistema-prompt leer cualquier hilo",
      body: "Un punto final de depuración no comprobó la propiedad del hilo. Ahora sí.",
    },
    publicFeed: {
      title: "Alimentación pública lista de hilos ocultos",
      body: "Los hilos ocultos y eliminados aparecieron en la alimentación pública. Están filtrados.",
    },
    loginOptions: {
      title: "Opciones de inicio cuentas filtradas",
      body: "La respuesta de las opciones de inicio de sesión reveló si un correo electrónico tenía una cuenta. Ya no lo hace.",
    },
    resetPassword: {
      title: "Reset ignora la confirmación",
      body: "El reajuste-password confirma paso ignorado el campo de confirmación. Ahora se rechazan los errores.",
    },
    privateFiles: {
      title: "Archivos privados caché públicamente",
      body: "Los archivos privados fueron servidos con Cache-Control: público, por lo que los caches compartidos podrían mantenerlos. Ahora son privados.",
    },
  },
  broken: {
    title: "Y las cosas que acaban de romperse",
    intro:
      "No es peligroso - simplemente fallando silenciosamente para la gente real:",
    items: {
      attachments:
        "URLs de archivos adjuntos de chat e informes de error del cliente devueltos 404.",
      permissions:
        "Los permisos de raíz nunca fueron incubados - los clientes no pudieron publicar en Shared.",
      embed: "El montura de widget embedido estaba muerto.",
      invoices:
        "Los enlaces de correo electrónico de facturación devueltos 404.",
      models: "La página de modelos era inutilizable.",
      music: "La generación de música en OpenRouter falló.",
      fixtures:
        "Alcance de fijación de pruebas filtrado llamadas en vivo pagadas.",
      pglite:
        "Las bases de datos locales PGlite devolvieron las filas equivocadas de INSERT... RETURNING.",
      pagination: "La paginación del visitante en /herramientas se rompió.",
    },
    footer:
      "Además de una larga cola de cuerdas no traducidas y correcciones de widget.",
  },
  closing: {
    title: "¿Qué significa esto para ti?",
    p1: "Cada página que utiliza para registrarse, iniciar sesión, pagar, chatear, generar o suscribirse ahora tiene una prueba que la abre en un navegador real y hace lo que usted hace. Cuando cambiamos algo, el robot vuelve a caminar antes de hacerlo.",
    p2: "Los barcos marco con next-vibe. Si lo construyes, tus puntos finales obtienen el mismo arnés gratis.",
  },
  cta: {
    title: "Lee el arnés. Úsalo en tu propio código.",
    subtitle:
      "El marco E2E es fuente abierta y parte de next-vibe. Un archivo de espectro por característica, colocado con la definición.",
    github: "Ver en GitHub",
    framework: "Explora next-vibe",
  },
};
