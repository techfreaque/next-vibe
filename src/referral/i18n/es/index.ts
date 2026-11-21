import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  // Main referral domain
  category: "Referidos",

  // Tags
  tags: {
    referral: "remisión de referencia",
    codes: "codes",
    earnings: "Ganancias",
    get: "¡Vamos!",
    create: "crear",
    list: "lista",
  },

  // GET endpoint (get referral code)
  get: {
    title: "Consultar código de referido",
    titleShort: "Consultar código",
    description: "Consulta los detalles del código de referido",
    form: {
      title: "Detalles del Código de Remisión",
      description: "Ver información sobre el código de referencia",
      limit: {
        label: "Limitación",
        description: "Número máximo de resultados a la vuelta",
      },
      offset: {
        label: "Offset",
        description: "Número de resultados para saltar",
      },
    },
    response: {
      earnings: {
        id: "ID",
        earnerUserId: "Earner Usuario ID",
        sourceUserId: "Fuente Usuario ID",
        transactionId: "ID del movimiento",
        level: "Nivel",
        amountCents: "Cantidad (Cents)",
        currency: "Moneda",
        status: "Situación",
        createdAt: "Creado en",
      },
      totalCount: "Total Conde",
    },
  },

  // POST endpoint (create referral code)
  post: {
    title: "Crear código de referido",
    titleShort: "Crear código",
    description: "Crea un código de referido",
    form: {
      title: "Nuevo código de referido",
      description:
        "Usa un código por público. Discord, tu blog, tus amigos. Cada código tiene sus propias estadísticas.",
    },
    submit: {
      label: "Crear código",
      loading: "Creando…",
    },
  },

  // PUT endpoint (update referral code)
  put: {
    title: "Editar código de referido",
    description: "Configuración de referencia de actualización del código",
    form: {
      title: "Editar código de referido",
      description: "Modificar las propiedades del código de referencia",
    },
  },

  // DELETE endpoint (deactivate referral code)
  delete: {
    title: "Desactivar código de referido",
    description: "Desactivar un código de referencia",
    form: {
      title: "Desactivar código de referido",
      description: "Desactivar este código de referencia",
    },
  },

  // Link to Lead endpoint
  linkToLead: {
    post: {
      title: "Vínculo de referencia al contacto",
      titleShort: "Enlace",
      description:
        "Vincular un código de remisión a un contacto antes de registrarse",
      form: {
        title: "Link Referral Code",
        description: "Código de referencia asociado con su sesión",
      },
    },
    success: {
      title: "Referral Linked",
      description: "Código de referencia conectado con éxito a su sesión",
    },
  },

  // Codes List endpoint
  codes: {
    list: {
      get: {
        title: "Lista de códigos de referido",
        titleShort: "Mis códigos",
        description:
          "Consigue todos tus códigos de referencia con estadísticas",
        form: {
          title: "Tus códigos de referido",
          description: "Consulta y administra tus códigos de referido",
        },
        response: {
          codes: {
            id: "ID",
            code: "Código",
            label: "Label",
            currentVisitors: "Visitantes actuales",
            isActive: "Activa",
            createdAt: "Creado en",
            totalSignups: "Total de registros",
            totalRevenueCents: "Ingresos totales (Cents)",
            totalEarningsCents: "Total Earnings (Centes)",
          },
        },
      },
      success: {
        title: "Codes Retrieved",
        description: "Recuperó exitosamente sus códigos de referencia",
      },
      widget: {
        loading: "Cargando tus códigos…",
        empty: "Aún no tienes códigos de referido",
        emptyHint:
          "Crea tu primer código aquí abajo. Tu enlace estará listo al instante.",
        copied: "Copiado",
        copy: "Copiar enlace",
        visitors: "Visitantes",
        signups: "Registros",
        revenue: "Ingresos generados",
        earnings: "Ganancias",
        inactive: "Este código de referido está inactivo",
        conversionHint:
          "Por cada suscripción de {{examplePrice}} al mes, ganas {{exampleEarning}} cada mes.",
        linkGen: "Enlace personalizado",
        linkGenPlaceholder: "Pega la URL de una página…",
        linkGenHint:
          "Pega la URL de una página de unbottled para crear un enlace de referido con seguimiento",
        linkGenCopy: "Copiar",
        linkGenCopied: "Copiado",
      },
    },
  },

  // Stats endpoint
  stats: {
    get: {
      title: "Estadísticas de referidos",
      titleShort: "Stats",
      description: "Obtenga sus estadísticas del programa de remisión",
      form: {
        title: "Tus estadísticas de referidos",
        description: "Vea sus métricas de rendimiento de referencia",
      },
    },
    success: {
      title: "Stats Retrieved",
      description: "Recuperado exitosamente sus estadísticas de referencia",
    },
    widget: {
      adminNotice:
        "Estas son tus cifras personales de referidos. El programa completo está en el resumen de referidos.",
      openOverview: "Abrir resumen de referidos",
      emptyMessage:
        "Aún no hay actividad. Comparte tu enlace de referido para empezar a ganar.",
    },
    fields: {
      totalSignups: "Total de registros",
      totalSignupsDescription:
        "Número de personas que se registraron con tu código de referido",
      totalRevenue: "Ingresos generados",
      totalRevenueDescription: "Ingresos totales generados por tus referidos",
      totalEarned: "Ganancias totales",
      totalEarnedDescription: "Comisiones totales que ganaste por referidos",
      availableBalance: "Saldo disponible",
      availableBalanceDescription: "Saldo disponible para retirar",
      availableBalanceDescriptionLow:
        "Usa tus ganancias para chatear con IA. Primero se gastan tus otros créditos. Llega a {{minPayout}} para poder retirar tus ganancias.",
      totalRevenueCredits: "Ingresos generados (créditos)",
      totalEarnedCredits: "Ganancias totales (créditos)",
      totalPaidOutCredits: "Total retirado (créditos)",
      availableCredits: "Créditos disponibles",
    },
  },

  // Earnings List endpoint
  earnings: {
    confirm: {
      post: {
        title: "Confirmación de los anillos de referencia",
        titleShort: "Confirme los Ganancias",
        description:
          "Desbloquear los ingresos de referencia cuya ventana de reembolso ha pasado. Corre diariamente.",
        container: {
          title: "Confirmación de las ganancias",
          description:
            "Ganancias pendientes después de la ventana de reembolso",
        },
        response: {
          confirmedCount: "Confirmado",
          failedCount: "Failed",
        },
        success: {
          title: "Earnings Confirmado",
          description: "Los ingresos por remisión matizada ahora son gastables",
        },
      },
      task: {
        description:
          "Convierte los ingresos de remisión mayores que la ventana de reembolso en créditos ganados",
      },
    },
    list: {
      get: {
        title: "Historial de ganancias por referidos",
        titleShort: "Ganancias",
        description: "Consulta tu historial de ganancias por referidos",
        form: {
          title: "Tus ganancias por referidos",
          description: "Consulta tus ganancias por referidos",
        },
        response: {
          earnings: {
            id: "ID",
            earnerUserId: "Earner Usuario ID",
            sourceUserId: "Fuente Usuario ID",
            transactionId: "ID del movimiento",
            level: "Nivel",
            amountCents: "Cantidad (Cents)",
            currency: "Moneda",
            status: "Situación",
            createdAt: "Creado en",
          },
        },
      },
      success: {
        title: "Ganancias cargadas",
        description: "Cargamos tus ganancias por referidos",
      },
    },
  },

  // Form fields
  form: {
    fields: {
      code: {
        label: "Código",
        description:
          "Lo que la gente escribe o ve en su enlace. 3-50 caracteres.",
        placeholder: "Por ejemplo. ALEX10",
      },
      label: {
        label: "Label (sólo lo ves)",
        description: "Donde lo compartirás.",
        placeholder: "Por ejemplo. YouTube bio",
      },
      description: {
        label: "Descripción",
        description: "Opcional descripción",
        placeholder: "Escriba descripción",
      },
      maxUses: {
        label: "Usos máximos",
        description: "Número máximo de veces este código se puede utilizar",
        placeholder: "Vacío para ilimitadas",
      },
      expiresAt: {
        label: "Fecha de expedición",
        description: "Cuando este código expira",
        placeholder: "Selecciona una fecha",
      },
      isActive: {
        label: "Activa",
        description: "Ya sea que este código esté activo",
      },
    },
  },

  // Response fields
  response: {
    id: "ID",
    code: "Código",
    label: "Label",
    description: "Descripción",
    ownerUserId: "Propietario Usuario ID",
    maxUses: "Usos máximos",
    currentUses: "Usos actuales",
    expiresAt: "Vence el",
    isActive: "Activa",
    createdAt: "Creado en",
    updatedAt: "Actualizado en",
    referralCode: "Código de referido",
    success:
      "🎉 ¡Tu código de referido está listo! Copia el enlace y gana una comisión del {{directPct}} por cada suscripción, más bonos por los referidos de quienes se registren contigo.",
    message: "Mensaje",
  },

  // Admin payout management
  admin: {
    payouts: {
      get: {
        title: "Solicitudes de pago",
        titleShort: "Solicitudes",
        description: "Administrar las solicitudes de pago de remisión",
      },
      post: {
        title: "Pagado del proceso",
        titleShort: "Pagado del proceso",
        description: "Aprobar, rechazar o completar una solicitud de pago",
      },
      fields: {
        search: {
          label: "Email de socio",
          description: "Buscar por correo electrónico completo o parcial.",
        },
        userId: {
          label: "Cuenta de socios",
        },
        page: {
          label: "Página",
        },
        limit: {
          label: "Resultados por página",
        },
        status: {
          all: "Todos los estados",
          label: "Filtro de estado",
          description: "Filtro por estado de pago",
        },
        currency: {
          label: "Método de pago",
          description: "Filtrar por método de pago",
          all: "Todos los métodos",
        },
        requestId: {
          label: "Solicitud ID",
          description: "Nombre de solicitud de pago",
        },
        action: {
          label: "Medida",
          description: "Medidas para realizar en la solicitud de pago",
        },
        adminNotes: {
          label: "Admin Notes",
          description: "Notas opcionales para esta acción",
        },
        rejectionReason: {
          label: "Rechazo de rechazo",
          description: "Motivo para rechazar la solicitud de pago",
        },
      },
      widget: {
        empty: "No se han encontrado solicitudes de pago",
        emptyHint: "Pruebe un correo electrónico o estado diferente.",
        results: "Solicitudes de pago de {{count}}",
        apply: "Aplicar filtros",
        clear: "Filtros claros",
        refresh: "Actualizar",
        loading: "Cargando solicitudes de pago...",
        amount: "{{credits}} obtuvo créditos · {{value}} USD valor",
        payoutSummary: "{{amount}} · Destino: {{currency}}",
        requestedAt: "Solicitud de {{date}}",
        processedAt: "Actualizado {{date}}",
        rejectionReason: "Razón: {{reason}}",
        adminNotes: "Notas: {{notes}}",
        openPartner: "Socio abierto",
        openPartnerFor: "Cuenta de socio abierto para {{email}}",
        actionFor: "{{action}} pago para {{email}}",
        previous: "Página anterior",
        next: "Página siguiente",
        page: "Página {{page}} de {{total}}",
        confirmAction: "Confirmación de la acción",
        lookupFailed: "Incapaz de cargar la solicitud de pago.",
        state: "Situación",
        valueLabel: "Valor solicitado",
        destinationLabel: "Destino",
        actionSaved: "Acción de pago salvada.",
        approveDetail:
          "La aprobación mantiene los créditos ganados reservados para este pago.",
        rejectDetail:
          "Rechazo libera los créditos ganados reservados para este pago.",
        completeDetail:
          "Marcar el pago completo después de enviar la transferencia. Esto deduce los créditos correspondientes obtenidos.",
        approve: "Aprobar",
        reject: "Rechazo",
        complete: "Completado",
        credits: "Créditos",
        partnerContext:
          "Ganado {{confirmed}} confirmado, {{pending}} en espera · pagado {{paid}}",
        creditsLine: "{{credits}} créditos ganados",
        freeLine: "Libre tras solicitudes abiertas: {{free}}",
        overBalanceSingle:
          "Esta solicitud es de {{amount}}, pero solo {{available}} está confirmado y sin pagar. No la apruebes.",
        partnerCodes: "Códigos: {{codes}} · usuarios referidos: {{referred}}",
        partnerNoCodes: "Sin código propio · usuarios referidos: {{referred}}",
        overBalance:
          "{{count}} solicitudes abiertas por {{open}}, pero solo {{available}} está confirmado y sin pagar. No las apruebes todas.",
        possibleDuplicate:
          "Posible duplicado: {{count}} solicitud(es) abierta(s) más con el mismo importe y monedero.",
        headline: "{{value}} en {{currency}}",
        overBalanceShort:
          "Por encima del saldo confirmado (ver la primera solicitud de este socio).",
        approveOverBalance: "Aprobar igualmente",
        nextStep: {
          failed:
            "La transferencia falló y no se descontaron créditos. El socio puede enviar una nueva solicitud.",
          processing:
            "Transferencia en curso. Se completa o falla sola, no hace falta hacer nada.",
          credits:
            "Los pagos en créditos se convierten automáticamente. No hace falta hacer nada.",
        },
        codeReport: "Informe del código",
      },
    },
  },

  // Payout endpoint + errors
  payout: {
    get: {
      title: "Tus ganancias",
      titleShort: "Mis ganancias",
      description: "Consulta tu historial de ganancias por referidos y retiros",
    },
    post: {
      title: "Solicitar retiro",
      titleShort: "Solicitar retiro",
      description: "Retira tus ganancias por referidos",
    },
    fields: {
      amountCents: {
        label: "Importe (créditos)",
        description: "Importe que quieres retirar en créditos",
        placeholder: "por ejemplo 5000",
      },
      currency: {
        label: "Método de retiro",
        description: "Elige cómo recibir tus ganancias",
      },
      walletAddress: {
        label: "Dirección de la billetera",
        description: "Obligatoria para retiros en BTC o USDC",
        placeholder: "La dirección de tu billetera",
      },
    },
    widget: {
      totalEarned: "Ganancias totales",
      available: "Disponible",
      locked: "Bloqueados",
      credits:
        "Los pagos en créditos se convierten al solicitarlos, así que uno pendiente está atascado. Recházalo para liberar las ganancias; el socio puede volver a solicitar.",
      readyForPayout: "disponibles para retirar",
      moreToUnlock: "para habilitar el retiro",
      pendingConfirmation: "pendientes de confirmación",
      requestPayout: "Solicitar retiro",
      payoutHistory: "Historial de retiros",
      noPayout: "Aún no hay solicitudes de retiro",
      howItWorksTitle: "Cómo funciona",
      step1Title: "Crea códigos de referido",
      step1Body:
        "Crea un código distinto para cada público. Por ejemplo, amistades, redes sociales o campañas.",
      step2Title: "Comparte tu enlace o el de una habilidad",
      step2Body:
        "Enlace de referido: ganas el {{directPct}} de cada pago de la persona que invitaste, para siempre. Si alguien comparte una habilidad tuya, ganas el {{skillBonusPct}} de cada pago de quienes lleguen por esos enlaces.",
      step3Title: "Cobra tus ganancias",
      step3Body:
        "Tus ganancias se desbloquean {{holdDays}} días después de cada pago, al terminar el plazo de reembolso. Después puedes usarlas como créditos de chat o retirarlas en criptomonedas.",
      withdrawTitle: "Retira tus ganancias",
      withdrawDescription: "Elige cómo usar tus ganancias por referidos",
      useAsCredits: "Usar como créditos de chat",
      useAsCreditsDesc:
        "Convierte tus ganancias al instante en créditos para chatear con IA.",
      cryptoPayout: "Retirar en criptomonedas",
      cryptoPayoutDesc: "Solicita un retiro en BTC o USDC a tu billetera.",
      minimumNote:
        "Retiro mínimo: {{minPayout}}. Procesamos los retiros en criptomonedas en un máximo de {{cryptoPayoutHours}} horas después de aprobarlos.",
      progressLabel: "Progreso para habilitar el retiro",
      unlockedOf: "disponibles de",
      viewHistory: "Ver historial",
      historyEmpty: "Aquí aparecerán tus retiros",
      pendingTitle: "{{amount}} pendientes",
      pendingNote:
        "Las ganancias se desbloquean {{holdDays}} días después de cada pago, al terminar el plazo de reembolso. Si se reembolsa un pago, se cancelan las ganancias de ese pago.",
    },
    email: {
      user: {
        subjectCrypto: "Recibimos tu solicitud de retiro",
        subjectCredits: "Créditos convertidos",
        titleCrypto: "Tu solicitud de retiro",
        titleCredits: "Créditos convertidos",
        previewCrypto: "Estamos procesando tu solicitud de retiro",
        previewCredits: "Convertimos tus créditos",
        bodyCrypto:
          "Recibimos tu solicitud de retiro. Procesamos los retiros en criptomonedas en un máximo de {{cryptoPayoutHours}} horas desde que los aprueba un administrador.",
        bodyCredits:
          "Convertimos al instante tus ganancias por referidos en créditos de chat y los agregamos a tu cuenta.",
        followUpCrypto:
          "Te enviaremos otro correo cuando hayamos procesado tu retiro.",
        labelAmount: "Monto",
        labelMethod: "Método",
        labelWallet: "Wallet",
        credits: "Créditos",
      },
      admin: {
        subject: "Nueva solicitud de retiro",
        title: "Nueva solicitud de retiro",
        preview: "Solicitud de retiro enviada",
        body: "Un usuario envió una solicitud de retiro.",
        footer: "Revisa y procesa la solicitud en el panel de administración.",
        labelUser: "Usuario",
        labelAmount: "Monto",
        labelCurrency: "Moneda",
        labelWallet: "Wallet",
        credits: "Créditos",
      },
    },
    errors: {
      minimumAmount: "El retiro mínimo es de {{minPayout}}",
      walletRequired:
        "Para retirar en criptomonedas necesitas una dirección de billetera",
      insufficientBalance: "Saldo insuficiente para el retiro",
      conversionFailed:
        "No pudimos convertir tus ganancias. Siguen disponibles. Vuelve a intentarlo en un minuto.",
      notFound: "No se encontró la solicitud de retiro",
      invalidStatus: "Estado de solicitud de pago inválido para esta operación",
    },
    success: {
      creditsConverted: "Créditos convertidos",
      payoutRequested:
        "Enviamos tu solicitud de retiro. La procesaremos en un máximo de {{hours}} horas.",
    },
  },

  // Error types
  errors: {
    validation: {
      title: "Error de validación",
      description: "Parámetros de código de referencia inválidos",
    },
    network: {
      title: "Error de red",
      description: "Error de conexión de red",
    },
    unauthorized: {
      title: "Se requiere autenticación",
      description: "Inicia sesión para continuar",
    },
    forbidden: {
      title: "Acceso denegado",
      description: "No tienes acceso",
    },
    notFound: {
      title: "No encontrado",
      description: "Código de referencia no encontrado",
    },
    not_found: "Código de referencia no encontrado",
    server: {
      title: "Error del servidor",
      description: "Ocurrió un error interno del servidor",
    },
    serverError: {
      title: "Error del servidor",
      description: "Ocurrió un error interno del servidor",
      detail: "Algo estalló en nuestro extremo: {{error}}",
    },
    unknown: {
      title: "Error desconocido",
      description: "Ocurrió un error desconocido",
    },
    unsavedChanges: {
      title: "Cambios sin guardar",
      description: "Tienes cambios sin guardar",
    },
    conflict: {
      title: "Conflicto",
      description: "Código de referencia ya existe",
    },
    code_exists: "Este código de referencia ya existe",
    code_expired: "Este código de remisión ha expirado",
    code_inactive: "Este código de referencia no está activo",
    max_uses_reached: "Este código de referencia ha alcanzado su máximo uso",
    invalid_code: "Código de referencia inválido",
  },

  // Success types
  success: {
    title: "Operación completada",
    description: "La operación se completó correctamente",
    code_created: "Código de referencia creado con éxito",
    code_updated: "Código de referencia actualizado con éxito",
    code_deactivated: "Código de referencia desactivado con éxito",
  },

  // Enum translations
  enums: {
    sourceType: {
      subscription: "Suscripción",
      creditPack: "Paquete de créditos",
    },
    earningStatus: {
      pending: "Pendiente",
      confirmed: "Confirmado",
      canceled: "Cancelado",
    },
    payoutCurrency: {
      usdc: "USDC",
      btc: "Bitcoin",
      credits: "Créditos",
    },
    payoutStatus: {
      pending: "Pendiente",
      processing: "Procesamiento",
      completed: "Completado",
      failed: "Failed",
      rejected: "Rechazado",
      approved: "Aprobados",
    },
  },
};
