import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Agent",
  tags: {
    models: "Modelos",
  },

  get: {
    title: "Catálogo modelo Scan",
    titleShort: "Escáner de catálogo",
    description:
      "Última exploración de la lista de modelos de cada proveedor: nuevos modelos de aguas arriba que no sirven todavía, precio deriva, borrado de los ids y cancelaciones anunciadas. Sólo lectura.",
    success: {
      title: "Escáner cargado",
      description: "Última exploración del catálogo del modelo cargada.",
    },
  },

  post: {
    title: "Escáner de catálogo modelo de ejecución",
    titleShort: "Corre Escáner",
    description:
      "Obtenga la lista de modelos de cada proveedor y los precios en vivo ahora, difundirlos contra nuestras definiciones, almacenar el informe y enviarlo a las buzones de operaciones. Nunca edita el código.",
    fields: {
      force: {
        label: "Ejecute incluso si es reciente",
        description:
          "Omita al guardia de 5 días. Sin ella, un escaneo menor de 5 días es devuelto como es.",
      },
      sendEmail: {
        label: "Envíe el informe",
        description: "Enviar el informe a hi@ y thea@unbottled.ai.",
      },
    },
    success: {
      title: "Escáner acabado",
      description: "Catálogo modelo almacenado.",
    },
  },

  response: {
    scan: "Scan",
    report: "Informe",
    history: "Escaneos anteriores",
    skipped: "Salteado (escaneo de recreo)",
    reportText: "Informe",
  },

  widget: {
    back: "Atrás",
    runNow: "Ejecutar el escaneo ahora",
    running: "Escaneando...",
    empty: {
      title: "Todavía no hay escaneo",
      message:
        "El primer escaneo se ejecuta en su horario diario. Ejecute una ahora para ver qué cambió de corriente.",
    },
    skipped:
      'Ya existe un escaneo de los últimos 5 días, así que nada nuevo fue pillado. Tick "Run incluso si es reciente" para forzar uno.',
    scannedAt: "Escaneada",
    newSince: "Nuevo desde",
    emailedTo: "Correo electrónico",
    notEmailed: "No emails",
    emailError: "Correo electrónico falló",
    metrics: {
      newModels: "Nuevos modelos",
      uncensored: "Posiblemente sin censura",
      priceChanges: "Cambios de precios",
      missing: "Retirados por los proveedores",
      deprecations: "Desplazamientos anunciados",
      sourceErrors: "Fuentes fallidas",
    },
    sections: {
      newModels: "Nuevos modelos de corriente",
      priceChanges: "Cambios de precio y contexto",
      missing: "Retirados por los proveedores",
      deprecations: "Cierres pronunciados",
      sources: "Fuentes",
      history: "Escaneos anteriores",
    },
    legacy: "legado",
    suspect: "Posible anomalía. Revisa el conector.",
    uncensored: "sin censura",
    ok: "ok",
    failed: "falló.",
    models: "modelos",
    perMillion: "por cada 1 M",
    context: "ctx",
    nothing: "Aquí no hay nada.",
  },

  task: {
    name: "Revisión del catálogo de modelos",
    description:
      "Cada 5 días compara los modelos y precios de los proveedores con el catálogo, guarda el informe y lo envía por correo.",
  },

  errors: {
    scanFailed: "El escaneo del catálogo modelo falló: {{error}}",
    loadFailed: "No se pudo cargar el escaneo del catálogo modelo: {{error}}",
    server: {
      title: "Error del servidor",
      description:
        "El escaneo no pudo completarse. Comprueba los registros del servidor.",
    },
    network: {
      title: "Error de red",
      description: "No podía llegar al servidor.",
    },
    unknown: {
      title: "Error desconocido",
      description: "Algo inesperado salió mal.",
    },
    validation: {
      title: "Entrada inválida",
      description: "Revisa las opciones de exploración.",
    },
    unauthorized: {
      title: "No está firmado",
      description:
        "Inicie sesión como administrador para ver los escaneos del catálogo.",
    },
    forbidden: {
      title: "Admins only",
      description:
        "Sólo los administradores pueden ver o ejecutar escaneos de catálogo.",
    },
    notFound: {
      title: "Cuenta o sesión no encontradas",
      description: "No hay escaneo de catálogo encontrado.",
    },
    conflict: {
      title: "Conflicto",
      description: "Otro escaneo está corriendo. Inténtalo de nuevo en breve.",
    },
    unsavedChanges: {
      title: "Cambios sin guardar",
      description: "Guardar o descartar sus cambios primero.",
    },
  },
};
