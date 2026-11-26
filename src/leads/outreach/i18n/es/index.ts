import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Contacto inicial",
  tags: {
    outreach: "divulgación",
    crm: "crm",
    deals: "acuerdos",
    import: "import",
  },
  enums: {
    currency: { eur: "EUR", usd: "USD", pln: "PLN" },
    contactStatus: {
      sent: "Sent",
      replied: "Replido",
      interested: "Interesados",
      deal: "Trato hecho",
      declined: "Declind",
      optOut: "Optado.",
      bounced: "Bounced",
    },
    contactKind: {
      creator: "Creador",
      newsletter: "Boletín",
      directory: "Directorio",
      other: "Otro",
    },
    direction: {
      out: "Enviado por nosotros",
      in: "Respuesta de ellos",
    },
    dealStatus: {
      proposed: "Propuestas",
      committed: "Compromisos",
      paid: "Pagado",
      canceled: "Cancelado",
    },
    angleGroup: {
      affiliate: "A · Afiliado",
      audienceFit: "B · Adaptado de Audiencia",
      mission: "C · Discurso libre / privacidad",
      tryIt: "D · Pruébalo / Anúnciate",
      video: "De investigación",
      infoFirst: "Tasas primero",
      negotiation: "Negociación",
      other: "Otro",
    },
    attributionBasis: {
      tracked: "Enlace rastreado / código de referencia",
      channel: "Canales en todo el mundo",
      none: "No rastreado",
    },
  },
  crm: {
    get: {
      title: "Extensión CRM",
      titleShort: "Contacto inicial",
      description:
        "Cada contacto lanzó, donde cada uno se encuentra, y lo que las ofertas pagadas trajeron de nuevo en los registros e ingresos.",
      fields: {
        status: {
          label: "Situación",
          description: "Sólo contactos en este estado",
        },
        kind: {
          label: "Tipo",
          description: "Creador, newsletter, directorio u otro",
        },
        angle: {
          label: "Angle",
          description:
            "Prefijo de ángulo de pitch, por ejemplo. A, B-audience-fit, VIDEO",
          placeholder: "B-audience-fit",
        },
        search: {
          label: "Buscar",
          description: "Nombre, correo electrónico, sujeto o notas",
          placeholder: "Nombre de búsqueda, correo electrónico, asunto...",
        },
        page: { label: "Página", description: "Número de página" },
        limit: { label: "Por página", description: "Contactos por página" },
      },
      response: {
        summary: "Resumen",
        angles: "Angles",
        contacts: "Contactos",
        deals: "Tratos",
        dealTotals: "Totales del trato",
      },
      widget: {
        title: "Contacto inicial",
        subtitle: "A quien lanzamos, que respondió, lo que el dinero compró.",
        refresh: "Actualizar",
        addContact: "Contacto de registro",
        addDeal: "Agregar acuerdo",
        import: "Registro de importación",
        loading: "Carga de extensión...",
        allStatuses: "Todos",
        clearFilters: "Filtros claros",
        kpi: {
          contacts: "Contactos",
          replyRate: "Tasa de respuesta",
          replyRateHint: "{{replied}} de {{total}} respondió",
          deals: "Tratos pagados",
          spent: "Gasto",
          spentHint: "{{committed}} comprometido, no pagado aún",
        },
        angles: {
          title: "Angles",
          hint: "Reply rate por ángulo de lanzamiento. Gira hacia qué respuestas.",
          row: "{{contacts}} lanzado · {{replied}} contestó",
        },
        contacts: {
          title: "Contactos",
          columns: {
            contact: "Contacto",
            status: "Situación",
            angle: "Angle",
            last: "Último contacto",
            touches: "Emails",
          },
          showing: "{{start}} – {{end}} de {{total}}",
          never:
            "nunca jamás nunca jamás nunca jamás nunca jamás nunca jamás nunca jamás nunca jamás nunca jamás nunca jamás nunca jamás nunca jamás nunca jamás nunca jamás nunca jamás nunca jamás nunca jamás nunca jamás nunca jamás jamás jamás jamás nunca jamás nunca jamás jamás jamás jamás jamás nunca jamás nunca jamás jamás jamás jamás jamás jamás jamás jamás jamás jamás jamás jamás jamás jamás jamás jamás jamás jamás jamás jamás jamás jamás",
          replied: "respondió {{date}}",
        },
        deals: {
          prepareBill: "Preparar factura de proveedor",
          title: "Tratos pagados",
          hint: "Pasar contra las visitas, registros e ingresos que cada acuerdo rastreó el enlace o código de referencia traído.",
          columns: {
            deal: "Trato hecho",
            status: "Situación",
            spend: "Spend",
            visits: "Visitas",
            signups: "Registros",
            paying: "Pagar",
            revenue: "Ingresos generados",
            costPerSignup: "Costo / registro",
          },
          live: "vivo {{date}}",
          basisChannel: "canal-wide, not deal-specific",
          basisNone: "no enlace, campaña o código de referencia para igualar",
          empty: {
            title: "Todavía no se han pagado las ofertas",
            hint: "Conecte un acuerdo en el momento en que un creador está de acuerdo con un precio. Adjunte el enlace rastreado o código de referencia para que los resultados de la tierra aquí.",
          },
        },
        empty: {
          title: "No se ha registrado ningún tipo de divulgación",
          hint: "Importar el registro enviado, o registrar cada correo electrónico mientras sale.",
          cta: "Importación del registro enviado",
          filtered: "No hay contactos con estos filtros",
        },
        text: {
          header:
            "Contactos {{total}} · {{replied}} respondió ({{rate}}) · {{deals}} pagó ofertas",
          statusLine: "Estado: {{counts}}",
          anglesTitle: "Angles (pitado / contestó):",
          contactsTitle: "Contactos {{start}} - {{end}} de {{total}} :",
          dealsTitle: "Tratos pagados:",
          dealLine:
            "{{name}} · {{deliverable}} · {{amount}} {{status}} · visitas {{visits}} · suscripciones {{signups}} · pago de {{paying}} · ingresos {{revenue}} · costo/significación {{cps}}",
          pageHint:
            "Página {{page}} / {{pages}} - use --page= {{next}} para más",
          noContacts: "No hay contactos.",
          noDeals: "No hay ofertas pagadas registradas.",
        },
      },
    },
  },
  contact: {
    post: {
      title: "Contacto de salida",
      titleShort: "Contacto",
      description:
        "Crear o actualizar un contacto por correo electrónico. Pase un sujeto para registrar el email que acaba de enviar (o recibido).",
      fields: {
        email: {
          label: "Correo electrónico",
          description: "E-mail de contacto. Caso emparejado insensiblemente",
          placeholder: "hello@creator.com",
        },
        name: {
          label: "Nombre",
          description: "Creador, salida o persona",
          placeholder: "AI Anytime (Sonu)",
        },
        kind: {
          label: "Tipo",
          description: "Creador, newsletter, directorio u otro",
        },
        url: {
          label: "URL",
          description: "Canal, sitio o página de newsletter",
          placeholder: "https://youtube.com/@creator",
        },
        angle: {
          label: "Angle",
          description: "Pitch angle, por ejemplo. Afiliado, B-audience-fit",
          placeholder: "B-audience-fit",
        },
        status: {
          label: "Situación",
          description:
            "Avances sólo hacia adelante (sentido → respondió → interesado → trato). Siempre se aplican salidas",
        },
        forceStatus: {
          label: "Estado de la fuerza",
          description:
            "Establecer el estado exactamente, incluso si se mueve hacia atrás",
        },
        notes: {
          label: "Notas",
          description: "Reemplaza las notas de contacto",
          placeholder: "Tarjeta de tarifas 550 integración, 20-150K vistas",
        },
        refCode: {
          label: "Código Ref",
          description: "Código de referencia dado a este contacto",
          placeholder: "moemoe",
        },
        channel: {
          label: "Canal",
          description:
            "Clave del canal de crecimiento, por ejemplo youtube, newsletter",
          placeholder: "youtube",
        },
        campaignLinkId: {
          label: "Enlace de campaña ID",
          description:
            "utm_id de su enlace rastreado. Se eliminan identificaciones desconocidas",
        },
        subject: {
          label: "Asunto de correo electrónico",
          description:
            "Establecer para registrar un toque para este correo electrónico",
          placeholder: "Tus espectadores ya quieren esto",
        },
        direction: {
          label: "Dirección",
          description:
            "Enviado por nosotros (por defecto) o una respuesta de ellos",
        },
        at: {
          label: "Enviado",
          description: "Cuando salió el correo electrónico. Defaults to now",
        },
        touchNote: {
          label: "Nota de correo electrónico",
          description: "¿Qué dijo o preguntó el correo electrónico?",
          placeholder: "Pedido para tarjeta de tarifa",
        },
      },
      response: {
        id: "Contacto ID",
        created: "Creado",
        status: "Situación",
        previousStatus: "Estado anterior",
        touchLogged: "Correo electrónico registrado",
        contactCount: "Correos electrónicos enviados",
        warning: "Advertencia",
      },
      widget: {
        back: "Atrás",
        hint: "Una llamada por correo electrónico enviado. El mismo email actualiza el mismo contacto.",
        touchSection: "Este correo electrónico",
        contactSection: "Contacto",
        submit: "Guardar contacto",
        warnOptOut:
          "Este contacto optó por salir. No vuelvas a enviarlos por correo electrónico.",
        warnBounced:
          "Esta dirección rebotó antes. Compruébalo antes de enviar.",
        saved: "{{status}} · emails enviados: {{count}}",
      },
    },
  },
  deal: {
    post: {
      title: "Guardar el acuerdo de extensión",
      titleShort: "Guardar el trato",
      description:
        "Cree un acuerdo pagado por un contacto, o actualice uno por ID. Adjunte el enlace de campaña, utm_campaign o código de referencia para medirlo.",
      fields: {
        id: {
          label: "Deal ID",
          description: "Conjunto para actualizar un acuerdo existente",
        },
        contactEmail: {
          label: "Correo electrónico",
          description:
            "Se requiere para un nuevo acuerdo. Crea el contacto si es nuevo",
          placeholder: "youtube@creator.com",
        },
        contactName: {
          label: "Nombre de contacto",
          description: "Usado sólo cuando el contacto no existe aún",
          placeholder: "MoeMoe",
        },
        deliverable: {
          label: "Entrega",
          description: "¿Qué compra el dinero?",
          placeholder: "Integración YouTube",
        },
        amount: {
          label: "Monto",
          description: "Precio total en unidades monetarias",
        },
        currency: {
          label: "Moneda",
          description: "Moneda de la cantidad",
        },
        status: {
          label: "Situación",
          description: "Propuestos, comprometidos, pagados o cancelados",
        },
        channel: {
          label: "Canal",
          description:
            "Clave del canal de crecimiento, igual que el gasto del canal",
          placeholder: "youtube",
        },
        campaignLinkId: {
          label: "Enlace de campaña ID",
          description:
            "utm_id del enlace rastreado. Se quedó vacío si el enlace no está en este caso",
        },
        utmCampaign: {
          label: "utm_campaign",
          description: "Valor de la campaña en el enlace rastreado",
          placeholder: "moemoe-2026-11-14",
        },
        refCode: {
          label: "Código Ref",
          description: "Código de referencia que el creador comparte",
          placeholder: "moemoe",
        },
        liveAt: {
          label: "Goes live",
          description: "Fecha de publicación. Cuentas de ingresos desde aquí",
        },
        paidAt: {
          label: "Pagado",
          description: "Defaults to now when status becomes paid",
        },
        notes: {
          label: "Notas",
          description: "Método de pago, factura, términos",
          placeholder: "Payoneer, ref 1059964703",
        },
      },
      response: {
        id: "Deal ID",
        created: "Creado",
        status: "Situación",
        linkFound: "Enlace de campaña encontrado",
      },
      widget: {
        back: "Atrás",
        hint: "Las ofertas prometidas o pagadas mueven el contacto al trato.",
        submit: "Ahorra el trato.",
      },
    },
  },
  import: {
    post: {
      title: "Log de alcance de importación",
      titleShort: "Importar Log",
      description:
        "Pase un registro enviado (líneas separadas o tablas de marcado) en contactos y toques. Segura de volver a ejecutar: los correos electrónicos ya almacenados se saltan.",
      fields: {
        content: {
          label: "Contenido de la sesión",
          description:
            "Pegue las líneas de envío o tablas de nómina.md. Funciona contra casos remotos",
          placeholder:
            "2026-11-10\tModelFit\tpartnerships@modelfit.io\tA-affiliate\tA recurring cut\tSENT",
        },
        filePaths: {
          label: "Archivos de servidor",
          description:
            "Sendas separadas por comma bajo.tmp/ en el servidor, por ejemplo.tmp/outreach/sent-log",
          placeholder: ".tmp/outreach/sent-log.md,.tmp/outreach/sent-log",
        },
        ignoreEmails: {
          label: "Ignorar correos electrónicos",
          description:
            "Direcciones separadas por el sistema que no son actividades de divulgación",
          placeholder: "max@example.com",
        },
        dryRun: {
          label: "Corrección seca",
          description: "Parse y contar, no escriba nada",
        },
      },
      response: {
        rowsParsed: "Filas acolchadas",
        contactsCreated: "Contactos creados",
        contactsUpdated: "Contactos actualizados",
        touchesAdded: "Emails añadidos",
        touchesDuplicate: "Ya se sabe",
        statusChanges: "Cambios en la situación",
        skipped: "Líneas saltarinas",
        skippedLines: "Detalle eliminado",
      },
      widget: {
        back: "Atrás",
        hint: "Pruebe el registro o punto en los archivos del servidor. Cada correo electrónico se almacena una vez, sin embargo a menudo importa.",
        submit: "Importación",
        line: "{{source}}:{{line}} {{reason}}",
      },
    },
  },
  skip: {
    noEmail: "no válido email",
    noDate: "no válida fecha",
    skippedStatus: "marcado SKIPPED",
    ignored: "dirección ignorada",
    columns: "muy pocas columnas",
    unreadable: "archivo no legible",
    outsideTmp: "camino fuera.tmp/",
  },
  errors: {
    validation: {
      title: "Entrada inválida",
      description: "Revise los campos marcados",
    },
    unauthorized: {
      title: "No está firmado",
      description: "Inicie sesión como administrador",
    },
    forbidden: {
      title: "Admins only",
      description:
        "Las herramientas de extensión necesitan el papel del administrador",
    },
    notFound: {
      title: "Cuenta o sesión no encontradas",
      description: "Esa entrada no existe",
    },
    conflict: {
      title: "Conflicto",
      description: "La entrada cambió mientras tanto, recargar y reiniciar",
    },
    server: {
      title: "Error del servidor",
      description: "No se puede completar la solicitud",
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
    dealNotFound: "No hay trato con ID {{id}}",
    dealNeedsContact:
      "Un nuevo acuerdo necesita un correo electrónico de contacto",
    dealNeedsFields: "Un nuevo acuerdo necesita una entrega y una cantidad",
    importEmpty:
      "Pase el contenido del registro o al menos un archivo servidor",
  },
  success: {
    title: "Listo",
    description: "Guardado",
  },
};
