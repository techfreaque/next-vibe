import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Condiciones del servicio | {{appName}}",
    category: "Información legal",
    description: "Consulta las condiciones de uso de {{appName}}",
    imageAlt: "Condiciones del servicio",
    keywords:
      "condiciones del servicio, términos y condiciones, acuerdo de usuario, condiciones de {{appName}}",
    ogTitle: "Condiciones del servicio | {{appName}}",
    ogDescription: "Consulta las condiciones de uso de {{appName}}",
    twitterTitle: "Condiciones del servicio | {{appName}}",
    twitterDescription: "Consulta las condiciones de uso de {{appName}}",
  },
  printAriaLabel: "Imprimir las condiciones del servicio",
  onThisPage: "En esta página",
  printButton: "Imprimir",
  title: "Condiciones del servicio",
  lastUpdated: "Última actualización: 24 de noviembre de 2026",
  bindingVersionNotice:
    "Esta traducción se facilita a título informativo. La versión en alemán es la jurídicamente vinculante.",
  introduction:
    "Te damos la bienvenida a {{appName}}. Al usar nuestra plataforma de chat con IA sin censura, aceptas estas condiciones del servicio. Léelas con atención. El operador de {{appName}} es {{operator}}, Alemania.",
  sections: {
    agreement: {
      title: "Aceptación de las condiciones",
      content:
        "Al acceder a {{appName}} o usarlo, te comprometes a cumplir estas condiciones del servicio y todas las leyes y reglamentos aplicables. Si no aceptas alguna de estas condiciones, no puedes usar el servicio.",
    },
    description: {
      title: "Descripción del servicio",
      content:
        "{{appName}} da acceso a modelos de chat con IA sin censura de varios proveedores. Ofrecemos planes gratuitos y de pago con distintas funciones y límites de uso. El servicio se presta tal como está, sin garantías de ningún tipo.",
    },
    subscriptions: {
      title: "Suscripciones y facturación",
      plans: {
        title: "Planes de suscripción",
        content:
          "Ofrecemos un plan de suscripción y paquetes de créditos. Los paquetes de créditos nunca vencen, ni siquiera cuando termina la suscripción.",
      },
      billing: {
        title: "Facturación",
        content:
          "Las suscripciones se facturan cada mes o cada año. Los planes anuales reciben sus créditos mensuales cada mes. Los paquetes de créditos son recargas puntuales para quienes tienen una suscripción activa y nunca vencen. Aceptamos tarjetas, PayPal, Apple Pay y Google Pay mediante Stripe, y criptomonedas mediante NowPayments.",
      },
      cancellation: {
        title: "Cancelación",
        content:
          "Puedes cancelar tu suscripción en cualquier momento. La cancelación se hace efectiva al final del período de facturación en curso. Los paquetes de créditos no son reembolsables, salvo si se aplica el derecho legal de desistimiento (consulta la sección Derecho de desistimiento de los consumidores).",
      },
    },
    withdrawal: {
      title: "Derecho de desistimiento de los consumidores",
      intro:
        "Si eres consumidor conforme al artículo 13 del Código Civil alemán (BGB), tienes derecho legal a desistir de los contratos de compra de paquetes de créditos y de suscripción que celebres con nosotros mediante {{appName}}, según se indica en el siguiente aviso.",
      notice: {
        title: "Aviso sobre el derecho de desistimiento",
        right:
          "Tienes derecho a desistir de este contrato en un plazo de catorce días sin indicar el motivo. El plazo de desistimiento es de catorce días desde el día en que se celebra el contrato.",
        exercise:
          "Para ejercer tu derecho de desistimiento, debes comunicarnos ({{operator}}, {{address}}, correo electrónico: {{email}}) tu decisión de desistir del contrato mediante una declaración inequívoca, por ejemplo una carta enviada por correo postal o un correo electrónico. Puedes usar el formulario modelo que figura más abajo, aunque no es obligatorio. Basta con un correo electrónico.",
        deadline:
          "Para cumplir el plazo, basta con enviar la comunicación relativa al ejercicio del derecho de desistimiento antes de que venza dicho plazo.",
      },
      effects: {
        title: "Efectos del desistimiento",
        refund:
          "Si desistes del contrato, te reembolsaremos todos los pagos que hayamos recibido de ti sin demora indebida y, a más tardar, en un plazo de catorce días desde que recibamos tu notificación de desistimiento. Usaremos el mismo medio de pago que utilizaste en la transacción original, salvo que acordemos expresamente otro contigo. En ningún caso te cobraremos gastos por el reembolso.",
        compensation:
          "Si solicitaste que la prestación de los servicios empezara durante el plazo de desistimiento, deberás pagarnos un importe razonable proporcional a los servicios ya prestados hasta el momento en que nos comuniques que ejerces el derecho de desistimiento de este contrato, en relación con el total de servicios previstos en el contrato.",
        end: "Fin del aviso sobre el derecho de desistimiento",
      },
      expiry: {
        title: "Extinción anticipada del derecho de desistimiento",
        digitalContent:
          "En un contrato de suministro de contenido digital sin soporte material, el derecho de desistimiento se extingue conforme al artículo 356, apartado 5, del BGB si hemos empezado a ejecutar el contrato después de que hayas consentido expresamente que se inicie su ejecución antes de que termine el plazo de desistimiento, hayas confirmado que sabes que con tu consentimiento pierdes el derecho de desistimiento al iniciarse la ejecución y te hayamos entregado una confirmación del contrato.",
        services:
          "En un contrato de prestación de servicios, el derecho de desistimiento se extingue conforme al artículo 356, apartado 4, del BGB si hemos prestado el servicio íntegramente y solo empezamos a prestarlo después de que hayas dado tu consentimiento expreso y confirmado al mismo tiempo que sabes que pierdes el derecho de desistimiento una vez que hayamos ejecutado el contrato por completo.",
        credits:
          "Si tu derecho de desistimiento no se ha extinguido conforme a estas disposiciones, se aplica lo siguiente a los créditos. Reembolsamos íntegramente la parte del precio que corresponde a los créditos no utilizados del contrato del que desistes y retiramos esos créditos de tu cuenta al desistir. Por los créditos ya utilizados cobramos un importe proporcional, en la medida permitida por la ley, según la proporción entre los créditos usados y los adquiridos en virtud del contrato. Si desistes de una suscripción, esta también termina.",
      },
      form: {
        title: "Formulario modelo de desistimiento",
        intro:
          "(Si quieres desistir del contrato, completa y envía este formulario.)",
        recipient:
          "A la atención de {{operator}}, {{address}}, correo electrónico: {{email}}",
        statement:
          "Por la presente comunico/comunicamos (*) que desisto/desistimos (*) de mi/nuestro (*) contrato de suministro del siguiente contenido digital (*)/prestación del siguiente servicio (*):",
        orderedOn: "Pedido el (*)/recibido el (*)",
        name: "Nombre del consumidor o de los consumidores",
        address: "Dirección del consumidor o de los consumidores",
        signature:
          "Firma del consumidor o de los consumidores (solo si el formulario se envía en papel)",
        date: "Fecha",
        footnote: "(*) Tacha lo que no corresponda.",
        accountHint:
          "Para que podamos identificar tu compra con rapidez, indica la dirección de correo electrónico de tu cuenta. Este dato no es un requisito para que el desistimiento sea válido.",
      },
    },
    userAccounts: {
      title: "Cuentas de usuario",
      creation: {
        title: "Creación de cuenta",
        content:
          "Debes facilitar información exacta al crear una cuenta. Eres responsable de proteger tus credenciales de acceso.",
      },
      responsibilities: {
        title: "Responsabilidades del usuario",
        content:
          "Eres responsable de toda la actividad que se realice con tu cuenta. No puedes compartir tu cuenta con otras personas ni usar el servicio para fines ilegales.",
      },
    },
    userContent: {
      title: "Contenido de los usuarios",
      ownership: {
        title: "Titularidad del contenido",
        content:
          "Conservas todos los derechos sobre tus conversaciones y tus datos. No reclamamos la titularidad de tu contenido. Solo tú puedes acceder a tus carpetas privadas.",
      },
      guidelines: {
        title: "Reglas sobre el contenido",
        intro:
          "Ofrecemos acceso a IA sin censura. Se prohíbe usar el servicio para:",
        items: {
          item1: "Realizar actividades ilegales",
          item2: "Acosar, amenazar o causar daño a otras personas",
          item3: "Infringir derechos de propiedad intelectual",
          item4:
            "Intentar acceder a la plataforma sin autorización o comprometer su funcionamiento",
        },
      },
    },
    aiOutput: {
      title: "Resultados generados por IA",
      ownership:
        "No reclamamos la titularidad de los textos, imágenes, vídeos, audios u otros resultados que generes en {{appName}}. Los derechos que existan sobre esos resultados te pertenecen.",
      licenses:
        "Los resultados los producen modelos de terceros. Además de estos términos, se aplican la licencia de cada modelo y las condiciones de su proveedor. Algunos modelos solo permiten el uso no comercial o limitan ciertos usos. Señalamos estos modelos en la aplicación.",
      copyright:
        "Es posible que los resultados de IA no estén protegidos por derechos de autor y que se parezcan a obras existentes o a resultados generados para otros usuarios. Eres responsable de revisar la licencia del modelo que utilizas antes de usar sus resultados, en particular con fines comerciales.",
    },
    intellectualProperty: {
      title: "Propiedad intelectual",
      content:
        "La legislación sobre propiedad intelectual protege la plataforma {{appName}}, incluidos su diseño, sus funciones y su código. No puedes copiar, modificar ni distribuir nuestra plataforma sin autorización.",
    },
    limitation: {
      title: "Limitación de responsabilidad",
      content:
        "{{appName}} no será responsable de los daños indirectos, incidentales, especiales o consecuentes derivados del uso que hagas del servicio.",
    },
    indemnification: {
      title: "Indemnización",
      content:
        "Aceptas indemnizar y mantener indemne a {{appName}} frente a reclamaciones, daños o gastos que se deriven de tu uso del servicio o de la infracción de estas condiciones.",
    },
    termination: {
      title: "Cierre de cuenta",
      content:
        "Nos reservamos el derecho de cerrar o suspender tu cuenta si incumples estas condiciones. Puedes cerrar tu cuenta en cualquier momento.",
    },
    changes: {
      title: "Cambios en las condiciones",
      content:
        "Podemos actualizar estas condiciones del servicio periódicamente. Si sigues usando el servicio después de los cambios, aceptas las nuevas condiciones.",
    },
    governingLaw: {
      title: "Ley aplicable",
      content:
        "Estas condiciones del servicio se rigen por las leyes de la República Federal de Alemania. Si eres consumidor, esta elección de ley no te priva de la protección de las normas imperativas del país donde resides habitualmente. Si eres comerciante, una persona jurídica de derecho público o un fondo especial de derecho público, el foro competente para cualquier controversia derivada de estas condiciones será el de la sede del operador en Simbach am Inn, Alemania. En todos los demás casos se aplica el foro previsto por la ley.",
    },
  },
  post: {
    title: "Condiciones del servicio",
    description: "Endpoint de las condiciones del servicio",
    form: {
      title: "Configuración de las condiciones del servicio",
      description: "Configura los parámetros de las condiciones del servicio",
    },
    response: {
      title: "Respuesta",
      description: "Datos devueltos por las condiciones del servicio",
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
