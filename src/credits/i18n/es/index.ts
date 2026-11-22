/**
 * English translations for credits endpoints
 */

import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Créditos",
  tags: {
    credits: "Créditos",
    balance: "saldo",
  },
  repository: {
    bonusCreditsAdded: "Créditos adicionales de bono {{amount}}",
    tts: "Texto a texto",
    stt: "Discurso a texto",
    search: "Buscar",
    sttHotkey: "Speech-to-Text (Hotkey)",
  },
  enums: {
    freeStatus: {
      active: "Créditos gratuitos activos",
      verifyEmail:
        "Verifique su correo electrónico para desbloquear los créditos de la cuenta",
      subnetLimit: "Créditos gratuitos para esta red",
    },
    creditType: {
      userSubscription: "Créditos de suscripción al usuario",
      leadFree: "Lead Free Tier Credits",
    },
    creditFeature: {
      textToSpeech: "Texto a voz",
      speechToText: "Voz a texto",
      memoryWrite: "Escribir en memoria",
      memoryEdit: "Editar memoria",
      memorySearch: "Buscar en memoria",
      memoryEmbedding: "Embedding de memoria",
    },
    transactionType: {
      purchase: "Compra",
      subscription: "Suscripción",
      usage: "Usage",
      expiry: "Gastos",
      freeTier: "Plan gratuito",
      monthlyReset: "Renovación mensual",
      freeGrant: "Asignación gratuita",
      freeReset: "Renovación de créditos gratis",
      refund: "Reembolso",
      transfer: "Transferencia",
      otherDevices: "Usados en otro dispositivo",
      referralEarning: "Ganancia por referido",
      referralPayout: "Retiro de ganancias por referidos",
    },
    fundingType: {
      freeAllowance: "Cupo gratuito mensual",
      freeBonus: "Bono de cuenta / boletín",
      referral: "Créditos de referidos",
      purchased: "Paquete comprado",
      subscription: "Créditos de suscripción",
      adminGrant: "Asignación de admin",
      freeUnknown: "Gratis, nivel no registrado",
      packUnknown: "Paquete, origen no registrado",
    },
    packType: {
      subscription: "Suscripción",
      permanent: "Permanent",
      bonus: "Bonus",
      earned: "Ganado",
    },
  },
  historyLabels: {
    signupCarryover: "Usados sin cuenta antes del registro",
    sharedLimit: "Los dispositivos vinculados comparten un límite mensual",
    monthly: "Créditos gratis mensuales",
    monthlyGuest: "Créditos gratis mensuales (sin cuenta)",
    monthlyAccount: "Créditos gratis mensuales (cuenta gratis)",
    monthlyAccountNewsletter: "Créditos gratis mensuales (cuenta y boletín)",
    freeGuest: "Créditos gratis (sin cuenta)",
    accountUpgrade: "Bono de la cuenta gratis",
    newsletterBonus: "Bono del boletín",
    otherDevices: "Usados en otro dispositivo",
    linkedAccount: "Usados por la cuenta vinculada",
  },
  expire: {
    post: {
      title: "Créditos de los gastos",
      titleShort: "Créditos de los gastos",
      description:
        "Expire créditos de suscripción antiguos (llamados por cron)",
      tag: "expiración",
      container: {
        title: "Créditos de los gastos",
        description: "Resultados de caducidad de créditos",
      },
      response: {
        expiredCount: "Conde caro",
      },
      success: {
        title: "Créditos gastados",
        description: "Créditos antiguos de suscripción expirados con éxito",
      },
      errors: {
        unauthorized: {
          title: "Se requiere autenticación",
          description: "Inicia sesión para continuar",
        },
        forbidden: {
          title: "Acceso denegado",
          description: "Acceso denegado",
        },
        server: {
          title: "Error del servidor",
          description: "Fallado para expirar los créditos",
        },
        unknown: {
          title: "Error desconocido",
          description: "Ocurrió un error inesperado",
        },
        validation: {
          title: "Error de validación",
          description: "Parámetros de solicitud no válidos",
        },
      },
    },
    task: {
      description: "Expires antiguos créditos de suscripción diario",
      error: "Fallado para expirar los créditos",
    },
  },
  cleanup: {
    task: {
      description:
        "Elimina cada semana las billeteras de prospectos sin vincular",
      error: "Failed to cleanup huérfanos billeteras",
    },
  },
  errors: {
    getBalanceFailed: "No pudimos cargar el saldo de créditos",
    getLeadBalanceFailed:
      "No pudimos cargar el saldo de créditos del prospecto",
    getOrCreateLeadFailed: "No pudimos encontrar ni crear el prospecto",
    addCreditsFailed: "Fallado para añadir créditos",
    deductCreditsFailed: "Fallado para deducir créditos",
    insufficientCredits:
      "Créditos insuficientes. Necesita créditos {{cost}} para usar esta función.",
    deductionFailed:
      "No deducir créditos {{cost}}. Por favor, inténtalo de nuevo.",
    getTransactionsFailed: "Fallado para obtener transacciones de crédito",
    invalidIdentifier: "ID de usuario o prospecto no válido",
    userNotFound: "Usuario no encontrado",
    noLeadFound: "No se ha encontrado ninguna pista para el usuario",
    getCreditIdentifierFailed: "Failed to get credit identifier",
    noCreditSource: "No hay fuente de crédito disponible",
    stripeCustomerFailed: "Failed to create Stripe customer",
    checkoutFailed: "No se pudo crear la sesión de pago",
    mergeFailed: "No pudimos combinar los créditos de los prospectos",
    mergeLeadWalletsFailed:
      "No pudimos transferir los créditos de los prospectos a la cuenta del usuario",
    cleanupOrphanedFailed:
      "No pudimos limpiar las billeteras de prospectos sin vincular",
    monthlyResetFailed: "Fallado para reasentar créditos mensuales",
    noLeadsToMerge: "No hay pistas proporcionadas para fusionarse",
    oldestLeadNotFound:
      "No pudimos encontrar al prospecto más antiguo del grupo",
    transactionFailed: "Fallado para crear un registro de transacciones",
    not_implemented_on_native:
      "{{method}} no se implementa en plataforma nativa. Por favor, utilice la versión web para esta operación.",
    expireCreditsFailed: "Fallado para expirar los créditos",
    invalidAmount: "La cantidad de crédito debe ser un número positivo",
    walletNotFound: "Wallet no encontrado",
    walletCreationFailed: "Failed para crear la cartera",
    addEarnedCreditsFailed: "Fallado para añadir créditos ganados",
    getEarnedBalanceFailed: "No pudimos cargar el saldo de créditos ganados",
    insufficientEarnedCredits:
      "Créditos insuficientes obtenidos para esta operación",
    deductEarnedCreditsFailed: "Fallado para deducir los créditos ganados",
    getReferralTransactionsFailed:
      "Fallado para obtener transacciones de remisión",
  },
  get: {
    title: "Consultar saldo de créditos",
    titleShort: "Saldo",
    description: "Consulta el saldo de créditos del usuario y su desglose",
    response: {
      title: "Saldo de créditos",
      description: "Tu saldo actual de créditos y su desglose",
    },
    balance: {
      subscribe: "Ver planes",
      freePlanHint:
        "{{count}} créditos gratis al mes, {{max}} con el boletín. Planes desde {{planPrice}} por {{subCredits}} créditos al mes.",
      lowBalance: {
        title: "Te quedan {{count}} créditos",
        emptyTitle: "Te quedaste sin créditos",
        hint: "Recarga aquí. {{packCredits}} créditos sin vencimiento por {{packPrice}}.",
        hintPlans:
          "Elige un plan aquí abajo. Recibe tus créditos en cuanto pagues.",
        offersHint:
          "Recarga y sigue en segundos. Los créditos de los paquetes nunca vencen.",
        offersHintPlans: "Elige un plan y sigue en segundos.",
      },
      freePlan: "Tienes el plan gratuito",
      guestPlan: "Saldo sin cuenta",
      signUp: "Regístrate gratis",
      loadFailed: "No pudimos cargar tu saldo.",
      retry: "Volver a intentar",
      title: "Tus créditos",
      adminTitle: "Límite de gasto",
      description: "Un solo saldo para los {{modelCount}} modelos.",
      adminDescription:
        "Los créditos fijan el límite de gasto. Decide cuánto pueden usar la IA todos los usuarios.",
      credit: "{{count}} crédito",
      credits: "{{count}} créditos",
      expiring: {
        title: "Créditos con vencimiento",
        description:
          "Los créditos del plan se renuevan en cada ciclo de facturación",
        adminDescription:
          "Créditos válidos hasta el final del ciclo de suscripción",
      },
      permanent: {
        title: "Créditos sin vencimiento",
        description: "Son tuyos. Nunca vencen.",
        adminDescription: "Créditos permanentes, sin vencimiento",
      },
      free: {
        title: "Créditos gratis",
        description: "{{count}} gratis cada mes, {{max}} con el boletín",
        descriptionGuest:
          "{{guest}} gratis cada mes. Regístrate para recibir {{signedIn}}, o {{max}} con el boletín.",
        adminDescription:
          "Límite mensual gratis compartido entre dispositivos. {{guest}} sin cuenta, {{signedIn}} con cuenta y {{max}} con cuenta y boletín.",
      },
      earned: {
        title: "Créditos ganados",
        description:
          "Los ganas por referidos. Selecciona para invitar a tus amigos.",
      },
      spending: {
        title: "Tus créditos ganados",
        adminDescription:
          "Ganancias por referidos de tu cuenta, separadas de las de la instancia",
      },
    },
    total: {
      content: "Créditos totales",
    },
    expiring: {
      content: "Créditos con vencimiento (suscripción)",
    },
    permanent: {
      content: "Créditos sin vencimiento (paquetes)",
    },
    free: {
      content: "Créditos del plan gratuito",
    },
    earned: {
      content: "Créditos ganados por referidos",
    },
    expiresAt: {
      content: "Vence el",
    },
    capacity: {
      content: "Capacidad total",
    },
    freeStatus: {
      content: "Estado de los créditos gratis",
      subnetLimit:
        "Este mes se crearon demasiadas cuentas gratis desde tu red. Tu cuenta queda temporalmente sin créditos gratis. Puedes desbloquearlos comprando créditos o esperar al mes que viene, cuando vuelva a haber cupo en la red.",
    },
    success: {
      title: "Saldo cargado",
      description: "Cargamos el saldo de créditos",
    },
    errors: {
      validation: {
        title: "Error de validación",
        description: "Parámetros de solicitud no válidos",
      },
      network: {
        title: "Error de red",
        description: "La conexión de red falló",
      },
      unauthorized: {
        title: "Se requiere autenticación",
        description: "Inicia sesión para ver tu saldo de créditos",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "Usted no tiene permiso para acceder a este recurso",
      },
      notFound: {
        title: "No encontrado",
        description: "No se encontró el recurso",
      },
      server: {
        title: "Error del servidor",
        description: "No pudimos cargar el saldo de créditos",
      },
      unknown: {
        title: "Error desconocido",
        description: "Ocurrió un error inesperado",
      },
      noActiveSubscription: {
        title: "Necesitas una suscripción activa",
        description: "Activa una suscripción para comprar paquetes de créditos",
      },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Tienes cambios sin guardar",
      },
      conflict: {
        title: "Conflicto",
        description: "Conflicto de recursos",
      },
      no_active_subscription: {
        title: "Necesitas una suscripción activa",
        description: "Activa una suscripción para comprar paquetes de créditos",
      },
    },
  },
  history: {
    get: {
      guestGrantsHidden: "Concesiones gratis de invitados ocultas",
      recent: "Actividad reciente",
      payment: "Pago",
      recentTitle: "Actividad reciente del registro",
      guestDevice: "Dispositivo invitado",
      kindAccount: "Cuenta",
      kindLead: "Lead sin cuenta",
      openPayment: "Abrir pago",
      currentBalance: "Saldo actual",
      currentBalanceHint: "{{paid}} pagados · {{free}} gratis",
      showingRange: "Del {{from}} al {{to}} de {{total}}",
      from: "Desde",
      to: "Hasta",
      totals: "Totales",
      allTypes: "Todos los tipos",
      filteredBy: "Filtrado por",
      clearFilters: "Quitar todos",
      removeFilter: "Quitar filtro",
      spent: "Créditos gastados",
      granted: "Créditos concedidos",
      entries: "Entradas",
      periodHint: "En el periodo filtrado",
      emptyFiltered: "Ninguna entrada coincide con estos filtros.",
      typeFilter: {
        label: "Tipo",
      },
      target: {
        label: "Cliente",
        description: "E-mail de la cuenta, ID de usuario o ID de lead",
        placeholder: "cliente@example.com o un ID",
      },
      resolvedTarget: "Registro de",
      detail: "Modelo o función",
      targetNotFound: "Ninguna cuenta ni lead coincide con {{target}}.",
      lookupTitle: "Registro del cliente",
      lookupHint:
        "Busca una cuenta o un lead por e-mail, ID de usuario o ID de lead para ver cada movimiento de créditos.",
      openLedger: "Abrir registro",
      changeTarget: "Buscar otro",
      colDate: "Fecha",
      colType: "Tipo",
      colDetail: "Modelo o función",
      colAmount: "Importe",
      colBalance: "Saldo después",
      showing: "Registro de {{who}}",
      bonusGrant: "Asignación de créditos extra",
      relatedRecords: "Registros relacionados",
      account: "Cliente",
      lead: "Prospecto",
      openAccount: "Abrir ficha del cliente",
      openLead: "Abrir ficha del prospecto",
      openPayouts: "Ver retiros del colaborador",
      loading: "Cargando historial de créditos…",
      delta: "{{amount}} créditos",
      entryBalance: "Saldo después del movimiento: {{count}} créditos",
      emptyHint: "Aquí verás todos los créditos que recibas o gastes.",
      title: "Consultar historial de créditos",
      titleShort: "Historial de créditos",
      description:
        "Consulta por páginas el historial de movimientos de créditos",
      container: {
        title: "Historial de créditos",
        description: "Consulta el historial de tus movimientos de créditos",
      },
      emptyState: "Aún no hay movimientos",
      balance: "Saldo después del movimiento: {{count}}",
      limit: {
        label: "Limitación",
        description: "Máximo de movimientos que se mostrarán (1-100)",
      },
      offset: {
        label: "Offset",
        description: "Número de movimientos que se omiten al paginar",
      },
      targetUserId: {
        label: "ID del usuario",
      },
      targetLeadId: {
        label: "ID del prospecto",
      },
      id: "ID del movimiento",
      amount: "Monto",
      type: "Tipo",
      modelId: "Modelo",
      messageId: "Mensaje ID",
      createdAt: "Fecha",
      transactions: {
        title: "Transacciones",
        description: "Lista de movimientos de créditos",
      },
      paginationInfo: {
        total: "Total de movimientos",
        totalPages: "Total de páginas",
      },
      totalCount: {
        content: "Total Conde",
      },
      transaction: {
        id: {
          content: "ID del movimiento",
        },
        amount: {
          content: "Monto",
        },
        balanceAfter: {
          content: "Saldo después del movimiento",
        },
        type: {
          content: "Tipo",
        },
        modelId: {
          content: "Modelo",
        },
        messageId: {
          content: "Mensaje ID",
        },
        createdAt: {
          content: "Fecha",
        },
      },
      success: {
        title: "Historial cargado",
        description: "Cargamos el historial de créditos",
      },
      errors: {
        validation: {
          title: "Error de validación",
          description: "Parámetros de solicitud no válidos",
        },
        network: {
          title: "Error de red",
          description: "La conexión de red falló",
        },
        unauthorized: {
          title: "Se requiere autenticación",
          description: "Inicia sesión para ver tu historial de créditos",
        },
        forbidden: {
          title: "Acceso denegado",
          description: "Usted no tiene permiso para acceder a este recurso",
        },
        notFound: {
          title: "No encontrado",
          description: "No se encontró el recurso",
        },
        server: {
          title: "Error del servidor",
          description: "No pudimos cargar el historial de créditos",
        },
        unknown: {
          title: "Error desconocido",
          description: "Ocurrió un error inesperado",
        },
        unsavedChanges: {
          title: "Cambios sin guardar",
          description: "Tienes cambios sin guardar",
        },
        conflict: {
          title: "Conflicto",
          description: "Conflicto de recursos",
        },
      },
    },
  },
  purchase: {
    post: {
      title: "Comprar créditos",
      description:
        "Crea una sesión de pago de Stripe para comprar un paquete de créditos",
      container: {
        title: "Comprar créditos",
        description:
          "Compra paquetes de créditos para usar las funciones de IA",
      },
      quantity: {
        label: "Cantidad",
        description: "Número de paquetes de crédito para comprar (1-10)",
        placeholder: "Introduzca la cantidad (1-10)",
      },
      provider: {
        label: "Proveedor de pagos",
        description: "Elige cómo pagar",
        placeholder: "Selecciona el proveedor de pagos",
      },
      checkoutUrl: {
        content: "URL de la página de pago",
      },
      sessionId: {
        content: "Período de sesiones ID",
      },
      totalAmount: {
        content: "Importe total (en centavos)",
      },
      totalCredits: {
        content: "Créditos totales",
      },
      success: {
        title: "Se creó la sesión de pago",
        description: "Se creó la sesión de pago de Stripe",
      },
      errors: {
        validation: {
          title: "Error de validación",
          description: "Cantidad de compra inválida",
        },
        network: {
          title: "Error de red",
          description: "La conexión de red falló",
        },
        unauthorized: {
          title: "Se requiere autenticación",
          description: "Inicia sesión para comprar créditos",
        },
        forbidden: {
          title: "Acceso denegado",
          description: "Usted no tiene permiso para comprar créditos",
        },
        notFound: {
          title: "No encontrado",
          description: "No se encontró el recurso",
        },
        server: {
          title: "Error del servidor",
          description: "No se pudo crear la sesión de pago",
        },
        unknown: {
          title: "Error desconocido",
          description: "Ocurrió un error inesperado",
        },
        unsavedChanges: {
          title: "Cambios sin guardar",
          description: "Tienes cambios sin salvar",
        },
        conflict: {
          title: "Conflicto",
          description: "Conflicto de recursos",
        },
        noActiveSubscription: {
          title: "Necesitas una suscripción activa",
          description:
            "Activa una suscripción para comprar paquetes de créditos",
        },
      },
    },
  },
  adminAdd: {
    recipient: {
      renewsOn: "Se renueva el {{date}}",
      endsOn: "Termina el {{date}}",
      freeBalance: "Créditos gratis",
      balanceSplit: "{{total}} en total · {{paid}} pagados · {{free}} gratis",
      stepHint: "Paso 1: verifica el destinatario. Paso 2: elige la cantidad.",
      verified: "Destinatario verificado",
      kind: "Tipo de destinatario",
      kindAccount: "Cuenta · dispositivos vinculados: {{count}}",
      subscription: "Suscripción",
      noSubscription: "Sin suscripción",
      linkedDevices: "Dispositivos vinculados",
      recentGrants: "Últimas bonificaciones",
      noGrants: "Aún sin bonificaciones",
      grantLine: "{{count}} créditos el {{date}}",
      nextStep: "Siguiente: conceder créditos a esta cuenta",
      grant: "Conceder créditos",
      openLedger: "Abrir registro",
      name: "Nombre",
      balance: "Saldo actual",
      joinedAt: "Alta",
      noName: "Sin nombre",
      credits: "{{count}} créditos",
      balanceLine: "Saldo {{count}} créditos",
      joinedLine: "Alta {{date}}",
      title: "Verificar el beneficiario",
      description:
        "Encuentre la cuenta elegible para recibir los créditos de bonificación.",
      accountId: "Cuenta ID",
      email: "Correo electrónico destinatario",
      noLinkedDevice: "Esta cuenta no tiene ningún dispositivo conectado.",
      loadFailed: "Incapaz de verificar al destinatario.",
      loading: "Recibido verificador...",
      retry: "Volver a intentar",
      openAccount: "Abrir ficha del cliente",
      change: "Elija otro destinatario",
      verify: "Verificar",
    },
    post: {
      stepTwo: "Paso 2 de 2: cantidad",
      testerPreset: "3.000 (tester)",
      preview: "Saldo {{before}} → {{after}} (+{{amount}})",
      title: "Agregar créditos",
      titleShort: "Agregar créditos",
      description:
        "Agregue paquetes de crédito a una cuenta de usuario (sólo administrador)",
      tag: "admin",
      container: {
        title: "Conceder créditos extra",
        description:
          "Elija un destinatario e ingrese la cantidad exacta para otorgar a su cartera.",
        selfTitle: "Añadir créditos a su cuenta",
        selfDescription: "Concédete créditos extras",
      },
      targetUserId: {
        label: "Recipiente",
        description: "Elija un cliente del directorio de la cuenta.",
      },
      amount: {
        label: "Cuantía de los créditos",
        description: "Introduzca un número entero de créditos de bonificación.",
        placeholder: "137",
      },
      packType: {
        label: "Tipo de paquete",
        description: "Tipo de paquete de crédito para añadir",
      },
      response: {
        message: {
          content: "Resultado",
        },
      },
      backButton: {
        label: "Atrás",
      },
      submitButton: {
        label: "Créditos de prima de la concesión",
        loadingText: "Concediendo créditos...",
      },
      success: {
        title: "Créditos añadidos",
        description: "Se han añadido créditos a la cuenta de usuario",
      },
      errors: {
        validation: {
          title: "Error de validación",
          description: "Parámetros de solicitud no válidos",
        },
        network: {
          title: "Error de red",
          description: "La conexión de red falló",
        },
        unauthorized: {
          title: "Se requiere autenticación",
          description: "Inicia sesión para continuar",
        },
        forbidden: {
          title: "Acceso denegado",
          description: "Acceso de los administradores necesario",
        },
        notFound: {
          title: "No encontrado",
          description: "Usuario no encontrado",
        },
        server: {
          title: "Error del servidor",
          description: "Fallado para añadir créditos",
        },
        unknown: {
          title: "Error desconocido",
          description: "Ocurrió un error inesperado",
        },
        unsavedChanges: {
          title: "Cambios sin guardar",
          description: "Tienes cambios sin guardar",
        },
        conflict: {
          title: "Conflicto",
          description: "Conflicto de recursos",
        },
      },
    },
  },
  email: {
    creditPack: {
      user: {
        subject: "Tu paquete de créditos en {{appName}} está listo",
        title: "Agregamos créditos a tu cuenta",
        previewText: "Agregamos {{credits}} créditos a tu cuenta",
        greeting: "Hola, {{privateName}}:",
        body: "Compra completada. Ya tienes {{credits}} créditos en tu cuenta. Puedes usarlos cuando quieras, porque nunca vencen.",
        cta: "Usar mis créditos",
        signoff: "¡Gracias por tu compra!\n\nEl equipo de {{appName}}",
      },
      admin: {
        subject: "[{{appName}}] Paquete comprado: {{credits}} créditos",
        title: "Compra de paquete de créditos",
        preview: "Un usuario compró un paquete de créditos",
        body: "Un usuario compró un paquete de créditos.",
        labelUser: "Usuario",
        labelCredits: "Créditos",
        footer: "Notificación automática de {{appName}}",
      },
    },
  },
};
