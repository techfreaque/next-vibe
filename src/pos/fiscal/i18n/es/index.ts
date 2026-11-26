import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: { pos: "Caja", fiscal: "Tiques fiscales" },
  enums: {
    adapter: {
      sandbox: "Sandbox (solo pruebas, sin certificar)",
    },
    deviceKind: {
      orp: "ORP (caja con memoria física)",
      sorp: "SORP (caja por software, memoria en el fabricante)",
      vrp: "VRP (caja virtual gratuita de la Finančná správa)",
    },
    receiptStatus: {
      pending: "Pendiente de registro",
      registered: "Registrado",
      offline: "Emitido sin conexión",
      failed: "Fallido",
    },
  },
  block: {
    ekasaRequired:
      "La ley eslovaca exige registrar en eKasa cada venta en efectivo o con tarjeta. Antes de vender, conecte una caja eKasa certificada en los ajustes fiscales de la caja.",
  },
  title: "Tiques fiscales",
  description:
    "Compruebe si su país exige tiques fiscales en línea y qué caja registra sus ventas.",
  saveTitle: "Caja fiscal",
  saveDescription:
    "Conecte la caja que registra sus ventas ante la administración tributaria.",
  company: "Empresa",
  adapter: "Proveedor",
  adapterPlaceholder: "Elija un proveedor",
  adapterDescription:
    "Solo los proveedores certificados registran ventas reales. El sandbox es para pruebas y nunca desbloquea la venta.",
  deviceKind: "Tipo de caja",
  deviceKindDescription:
    "ORP guarda los tiques en un CHDÚ físico. SORP mantiene la memoria protegida en los servidores del fabricante. VRP es el servicio gratuito de la Finančná správa.",
  cashRegisterCode: "Código de caja",
  cashRegisterCodeDescription:
    "El código que la administración tributaria asignó a esta caja (kód pokladnice).",
  cashRegisterCodePlaceholder: "p. ej. 88812345678900001",
  isEnabled: "Registrar las ventas con este proveedor",
  isEnabledDescription:
    "Si está activo, cada venta completada entra en la cola de registro.",
  certifiedUntil: "Certificado válido hasta",
  certifiedUntilDescription:
    "Último día de validez del certificado de la caja. Después, las ventas quedan bloqueadas.",
  credentialRef: "Referencia de credenciales",
  credentialRefDescription:
    "Nombre de la clave o el certificado guardado. Nunca pegue aquí una clave privada ni una contraseña.",
  offlineDeadlineHours: "Plazo de envío sin conexión (horas)",
  offlineDeadlineHoursDescription:
    "Los tiques emitidos sin conexión deben llegar a la administración tributaria en este plazo.",
  response: {
    required: "Tiques fiscales obligatorios",
    blocked: "Ventas bloqueadas",
    provider: "Caja",
    counts: "Cola de tiques",
    adapters: "Proveedores disponibles",
    companyName: "Empresa",
    country: "País",
    saved: "Guardado",
  },
  widget: {
    requiredTitle: "eKasa es obligatoria para esta empresa",
    requiredMessage:
      "Cada venta en efectivo o con tarjeta debe registrarse en línea en eKasa (zákon 384/2025 Z. z.). Los tiques sin confirmar en 5 segundos se guardan sin conexión y deben enviarse en 96 horas.",
    notRequiredTitle: "No se exigen tiques fiscales en línea",
    notRequiredMessage:
      "Nuestra biblioteca no prevé un sistema fiscal en línea para el país de esta empresa. Las ventas en caja funcionan como siempre.",
    blockedTitle: "Las ventas en caja están bloqueadas",
    blockedMessage:
      "Conecte y active una caja eKasa certificada. Hasta entonces, la caja no puede completar ventas.",
    readyTitle: "Las ventas se registran",
    readyMessage:
      "Las ventas completadas entran en la cola y se registran con la caja conectada.",
    noCertifiedProvider:
      "Esta instalación aún no tiene ningún proveedor eKasa certificado.",
    noProvider: "No hay ninguna caja conectada",
    configure: "Conectar caja",
    edit: "Cambiar caja",
    certified: "Certificada",
    notCertified: "Sin certificar",
    enabled: "Activa",
    disabled: "Inactiva",
    certifiedUntilValue: "Certificado válido hasta el {{date}}",
    pending: "Pendientes",
    offline: "Sin conexión",
    failed: "Fallidos",
    overdue: "Fuera de plazo",
    queueHint: "Tiques que la administración tributaria aún no ha confirmado.",
    disclaimer: "Ofrecemos herramientas, no asesoramiento fiscal.",
    pickCompany: {
      title: "Elija una empresa",
      message: "Las reglas fiscales dependen del país de la empresa.",
    },
    savedTitle: "Caja guardada",
    savedBlocked:
      "Las ventas siguen bloqueadas: este proveedor no está certificado para eKasa.",
    savedReady: "Las ventas completadas se registrarán con esta caja.",
    back: "Volver",
    save: "Guardar caja",
    sectionProvider: "Proveedor",
    sectionDevice: "Caja",
  },
  errors: {
    validation: {
      title: "Revise los datos de la caja",
      description: "Faltan valores o no son válidos.",
    },
    unauthorized: {
      title: "Debe iniciar sesión",
      description: "Inicie sesión para gestionar los tiques fiscales.",
    },
    forbidden: {
      title: "Sin acceso",
      description:
        "Solo los propietarios y administradores de la empresa pueden cambiar los ajustes fiscales.",
    },
    notFound: {
      title: "Empresa no encontrada",
      description: "La empresa no existe o usted no es miembro.",
    },
    conflict: {
      title: "Los ajustes han cambiado",
      description: "Recargue la página e inténtelo de nuevo.",
    },
    server: {
      title: "Ajustes fiscales no disponibles",
      description: "Inténtelo de nuevo en un momento.",
    },
    network: {
      title: "Sin conexión",
      description: "Revise su conexión e inténtelo de nuevo.",
    },
    unknown: {
      title: "Algo salió mal",
      description: "Inténtelo de nuevo en un momento.",
    },
    unsavedChanges: {
      title: "Cambios sin guardar",
      description: "Guarde o descarte primero sus cambios.",
    },
    deviceKindUnsupported: "Este proveedor no admite el tipo de caja elegido.",
    adapterUnknown: "Este proveedor no existe.",
    sandboxProduction:
      "El sandbox no se permite en producción. Elija un proveedor certificado.",
  },
  success: {
    title: "Ajustes fiscales cargados",
    description: "Estado de los tiques fiscales de la empresa.",
    savedTitle: "Caja guardada",
    savedDescription: "Los ajustes de la caja fiscal están guardados.",
  },
};
