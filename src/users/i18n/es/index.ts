import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Usuarios",
  tags: {
    create: "Crear",
    admin: "Administrador",
    user: "Usuario",
    view: "Vista",
    stats: "Estadísticas",
  },
  create: {
    category: "Usuarios",
    tags: {
      create: "Crear",
      admin: "Administrador",
    },
    post: {
      title: "Crear usuario",
      description: "Crear una nueva cuenta de usuario",
      form: {
        title: "Formulario de creación de usuario",
        description: "Rellene los detalles para crear un nuevo usuario",
      },
      email: {
        label: "Dirección de correo electrónico",
        description:
          "Dirección de correo electrónico del usuario para iniciar sesión y comunicación",
      },
      password: {
        label: "Contraseña",
        description: "contraseña segura para la cuenta de usuario",
      },
      privateName: {
        label: "Nombre privado",
        description:
          "Nombre legal completo del usuario (visible solamente a los administradores)",
      },
      publicName: {
        label: "Nombre público",
        description:
          "Nombre de visualización del usuario (visible para todos los usuarios)",
      },
      firstName: {
        label: "Nombre",
        description: "Nombre del usuario",
      },
      lastName: {
        label: "Apellido",
        description: "Nombre del usuario",
      },
      company: {
        label: "Company",
        description: "Empresa u organización del usuario",
      },
      phone: {
        label: "Número de teléfono",
        description: "Número de teléfono de contacto del usuario",
      },
      preferredContactMethod: {
        label: "Método de contacto preferido",
        description: "Cómo el usuario prefiere ser contactado",
      },
      roles: {
        label: "Roles de usuario",
        description: "Asignar funciones al usuario",
      },
      imageUrl: {
        label: "Imagen de perfil URL",
        description: "URL a la imagen del perfil del usuario",
      },
      bio: {
        label: "Biografía",
        description: "Breve descripción sobre el usuario",
      },
      website: {
        label: "Sitio web",
        description: "Sitio web personal o de empresa",
      },
      jobTitle: {
        label: "Título de trabajo",
        description: "Título de trabajo o posición del usuario",
      },
      emailVerified: {
        label: "Email Verificado",
        description: "Si el correo electrónico del usuario es verificado",
      },
      isActive: {
        label: "Situación activa",
        description: "Ya sea que la cuenta de usuario esté activa",
      },
      leadId: {
        label: "ID del contacto",
        description: "identificador de contacto asociado",
      },
      country: {
        label: "País",
        description: "País de residencia del usuario",
      },
      language: {
        label: "Idioma",
        description: "Idioma preferido del usuario",
      },
      response: {
        title: "Usuario Creado",
        description: "Detalles del usuario recién creado",
        id: {
          content: "Usuario ID",
        },
        leadId: {
          content: "ID del prospecto asociado",
        },
        country: {
          label: "País",
          description: "País de residencia del usuario",
        },
        language: {
          label: "Idioma",
          description: "Idioma preferido del usuario",
        },
        email: {
          content: "Dirección de correo electrónico",
        },
        privateName: {
          content: "Nombre privado",
        },
        publicName: {
          content: "Nombre público",
        },
        firstName: {
          content: "Nombre",
        },
        lastName: {
          content: "Apellido",
        },
        company: {
          content: "Company",
        },
        phone: {
          content: "Número de teléfono",
        },
        preferredContactMethod: {
          content: "Método de contacto preferido",
        },
        imageUrl: {
          content: "Imagen del perfil",
        },
        bio: {
          content: "Biografía",
        },
        website: {
          content: "Sitio web",
        },
        jobTitle: {
          content: "Título de trabajo",
        },
        emailVerified: {
          content: "Email Verificado",
        },
        isActive: {
          content: "Situación activa",
        },
        stripeCustomerId: {
          content: "Stripe Cliente ID",
        },
        userRoles: {
          content: "Roles de usuario",
          id: {
            content: "Función ID",
          },
          role: {
            content: "Función",
          },
        },
        createdAt: {
          content: "Creado en",
        },
        updatedAt: {
          content: "Actualizado en",
        },
      },
      errors: {
        unauthorized: {
          title: "Acceso no autorizado",
          description: "Debes estar conectado para crear usuarios",
        },
        validation: {
          title: "Validación fallida",
          description:
            "Por favor, compruebe los datos del formulario e inténtelo de nuevo",
        },
        server: {
          title: "Error del servidor",
          description: "Incapaz de crear usuario debido al error del servidor",
        },
        unknown: {
          title: "Error desconocido",
          description: "Se produjo un error inesperado al crear usuario",
        },
        network: {
          title: "Error de red",
          description:
            "La conexión de red falló durante la creación del usuario",
        },
        forbidden: {
          title: "Access Forbidden",
          description: "No tienes permiso para crear usuarios",
        },
        notFound: {
          title: "Recursos no encontrados",
          description:
            "Recursos necesarios no encontrados para la creación del usuario",
        },
        conflict: {
          title: "Ya existe el usuario",
          description: "Un usuario con este email ya existe",
        },
        unsavedChanges: {
          title: "Cambios sin guardar",
          description: "Tienes cambios sin salvar que se perderán",
        },
        internal: {
          title: "Error interno",
          description: "Se produjo un error interno al crear el usuario",
        },
      },
      sms: {
        errors: {
          welcome_failed: {
            title: "SMS Bienvenido Failed",
            description: "Failed to send welcome SMS to the user",
          },
          verification_failed: {
            title: "SMS Verification Failed",
            description: "Fallado para enviar verificación SMS al usuario",
          },
        },
      },
      success: {
        title: "Usuario Creado con éxito",
        description: "La nueva cuenta de usuario ha sido creada",
        message: {
          content: "Usuario creado con éxito",
        },
        created: {
          content: "Creado",
        },
      },
    },
    widget: {
      headerCreated: "Usuario Creado",
      headerCreate: "Crear usuario",
      headerSubtitle:
        "Crear una nueva cuenta de cliente o usuario administrador",
      activeBadge: "Activa",
      verifiedBadge: "Verificado",
      copiedTooltip: "Copiado",
      copyUserIdTooltip: "Copiar usuario ID",
      copyIdButton: "Copiar ID",
      copiedButton: "Copiado",
      viewUserButton: "Ver Usuario",
      fullProfileButton: "Perfil completo",
      creditHistoryButton: "Historial de créditos",
      createAnotherButton: "Crear otro usuario",
      createdPrefix: "Creado",
    },
    email: {
      users: {
        welcome: {
          greeting: "¡Bienvenido a nuestra plataforma, {{firstName}}!",
          preview: "Su cuenta ha sido creada con éxito",
          subject: "Bienvenido a {{companyName}} - Su cuenta está lista!",
          introduction:
            "Hola {{firstName}}, ¡estamos emocionados de tenerte a bordo! Su cuenta ha sido creada con éxito y ahora puede acceder a todas nuestras características.",
          accountDetails: "Detalles de la cuenta",
          email: "Correo electrónico",
          name: "Nombre",
          publicName: "Nombre de pantalla",
          company: "Company",
          phone: "Teléfono",
          nextSteps: "Siguientes pasos",
          loginButton: "Inicie sesión en su cuenta",
          support:
            "Si tiene alguna pregunta, nuestro equipo de apoyo está aquí para ayudar. ¡Contáctanos en cualquier momento!",
        },
        admin: {
          newUser: "Nuevo usuario creado",
          preview: "Se ha creado un nuevo usuario {{firstName}} {{lastName}}",
          subject:
            "Nueva cuenta de usuario creada - {{firstName}} {{lastName}}",
          notification:
            "Se ha creado una nueva cuenta de usuario en el sistema. Aquí están los detalles:",
          userDetails: "Detalles del usuario",
          viewUser: "Ver perfil de usuario",
        },
        errors: {
          missing_data:
            "Faltan datos de usuario requeridos para la plantilla de correo electrónico",
        },
        error: {
          general: {
            internal_server_error: "Se produjo un error de servidor interno",
          },
        },
        labels: {
          id: "ID:",
          email: "Correo electrónico:",
          name: "Nombre:",
          privateName: "Nombre completo:",
          publicName: "Nombre de la pantalla:",
          company: "Compañía:",
          created: "Creado:",
          leadId: "ID de prospecto:",
        },
      },
    },
    sms: {
      welcome: {
        message:
          "¡Bienvenido {{firstName}}! Su cuenta ha sido creada con éxito. Visitanos en {{appUrl}}",
      },
      verification: {
        message:
          "{{firstName}}, su código de verificación es: {{code}}. Introduzca el código dentro de 10 minutos.",
      },
      errors: {
        welcome_failed: {
          title: "SMS Bienvenido Failed",
          description: "Failed to send welcome SMS to the user",
        },
        verification_failed: {
          title: "SMS Verification Failed",
          description: "Fallado para enviar verificación SMS al usuario",
        },
      },
    },
  },
  list: {
    get: {
      title: "Lista de usuarios",
      description: "Usuarios de búsqueda y filtro",
      form: {
        title: "Gestión de usuarios",
        description: "Administrar y filtrar usuarios",
      },
      actions: {
        refresh: "Actualizar",
        refreshing: "Refrescante...",
      },
      // Search & Filters section
      searchFilters: {
        title: "Búsqueda &quot; Filtros",
        description: "Buscar y filtrar usuarios por criterios",
      },
      search: {
        label: "Buscar",
        description: "Buscar usuarios por nombre o correo electrónico",
        placeholder: "Usuarios de búsqueda...",
      },
      status: {
        label: "Situación",
        description: "Usuarios filtrantes por estado",
        placeholder: "Seleccione el estado...",
      },
      role: {
        label: "Función",
        description: "Filtrar a los usuarios por función",
        placeholder: "Seleccionar el papel...",
      },
      subscription: {
        label: "Suscripción",
        description: "Filtro por estado de suscripción",
        placeholder: "Cualquier estado de suscripción",
      },
      creditActivity: {
        label: "Actividad de crédito",
        description: "Filtro por compra de crédito o actividad de gasto",
        placeholder: "Cualquier actividad crediticia",
      },
      threads: {
        label: "Conversaciones",
        description: "Filtrar por si el usuario tiene algún hilo de chat",
        placeholder: "Cualquier estado del hilo",
      },
      referralActivity: {
        label: "Actividad de referencia",
        description:
          "Filtrar por enlace de referencia, clics, registros o suscriptores de pago",
        placeholder: "Cualquier actividad de remisión",
      },
      // Sorting section
      sortingOptions: {
        title: "Clasificación",
        description: "Configurar la clasificación de resultados",
      },
      sortBy: {
        label: "Ordenar por",
        description: "Campo para ordenar",
        placeholder: "Seleccione el campo de clase...",
      },
      sortOrder: {
        label: "Ordenar orden",
        description: "Dirección",
        placeholder: "Seleccione el orden de tipo...",
      },
      // Response section
      response: {
        title: "Usuarios",
        description: "Lista de usuarios que coinciden con criterios",
        users: {
          id: "Usuario ID",
          email: "Correo electrónico",
          privateName: "Nombre privado",
          publicName: "Nombre público",
          isActive: "Activa",
          emailVerified: "Verificado",
          createdAt: "Creado",
          updatedAt: "Actualizado",
          referralCode: "Código de referencia usado",
          referredByUserId: "Referido por",
          totalReferrals: "Referencias hechas",
        },
        totalCount: "Total Users",
        pageCount: "Total de páginas",
      },
      // Pagination section
      page: {
        label: "Página",
      },
      limit: {
        label: "Por página",
      },
      // Error messages
      errors: {
        unauthorized: {
          title: "Se requiere autenticación",
          description: "Debes estar conectado para ver usuarios",
        },
        validation: {
          title: "Error de validación",
          description: "Parámetros inválidos",
        },
        forbidden: {
          title: "Access Forbidden",
          description: "Usted no tiene permiso para ver usuarios",
        },
        server: {
          title: "Error del servidor",
          description: "Incapaz de recuperar usuarios",
        },
        unknown: {
          title: "Error desconocido",
          description: "Ocurrió un error inesperado",
        },
        conflict: {
          title: "Conflicto de error",
          description: "Incapacidad de listar usuarios debido a conflictos",
        },
        network: {
          title: "Error de red",
          description: "Incapaz de conectarse al servidor",
        },
        notFound: {
          title: "No encontrado",
          description: "No se encontraron usuarios",
        },
        unsavedChanges: {
          title: "Cambios sin guardar",
          description: "Tienes cambios sin guardar",
        },
      },
      success: {
        title: "Operación completada",
        description: "Usuarios recuperados con éxito",
      },
    },
    // Legacy keys for backward compatibility
    title: "Lista de Usuarios",
    description: "Usuarios de lista y búsqueda con filtrado",
    category: "Usuarios",
    tag: "Lista",
    container: {
      title: "Lista de usuarios",
      description: "Usuarios de búsqueda y filtro",
    },
    response: {
      summary: {
        title: "Resumen del usuario",
        description: "Estadísticas resumidas de la lista de usuarios",
      },
      users: {
        title: "Usuarios",
      },
      user: {
        title: "Usuario",
        id: "Usuario ID",
        email: "Correo electrónico",
        privateName: "Nombre privado",
        publicName: "Nombre público",
        firstName: "Nombre",
        lastName: "Apellido",
        company: "Company",
        phone: "Teléfono",
        isActive: "Activa",
        emailVerified: "Email Verificado",
        role: "Función",
        createdAt: "Creado en",
        updatedAt: "Actualizado en",
      },
      total: {
        content: "Total Users",
      },
      page: {
        content: "Página actual",
      },
      limit: {
        content: "Usuarios Por Página",
      },
      totalPages: {
        content: "Total de páginas",
      },
    },
    errors: {
      unauthorized: {
        title: "Acceso no autorizado",
        description: "Debes estar conectado para ver usuarios",
      },
      validation: {
        title: "Validación fallida",
        description:
          "Parámetros inválidos proporcionados para la lista de usuarios",
      },
      forbidden: {
        title: "Access Forbidden",
        description: "Usted no tiene permiso para ver usuarios",
      },
      server: {
        title: "Error del servidor",
        description:
          "Incapaz de recuperar usuarios debido al error del servidor",
      },
      unknown: {
        title: "Error desconocido",
        description:
          "Se produjo un error inesperado mientras los usuarios de la lista",
      },
      conflict: {
        title: "Conflicto de error",
        description:
          "Incapacidad de listar usuarios debido a conflictos existentes",
      },
      network: {
        title: "Error de red",
        description: "Incapaz de conectarse al servidor",
      },
      notFound: {
        title: "Usuarios No encontrados",
        description:
          "No se encontró ningún usuario que coincida con sus criterios",
      },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Tienes cambios sin salvar que se perderán",
      },
      internal: {
        title: "Error interno",
        description:
          "Se produjo un error interno mientras se enumeran los usuarios",
      },
    },
    post: {
      title: "Lista",
      description: "Punto final de lista",
      form: {
        title: "Configuración de Lista",
        description: "Configurar los parámetros de lista",
      },
      response: {
        title: "Respuesta",
        description: "Datos de respuesta de la lista",
      },
      errors: {
        unauthorized: {
          title: "Se requiere autenticación",
          description: "Inicia sesión para continuar",
        },
        validation: {
          title: "Error de validación",
          description: "Parámetros de solicitud no válidos",
        },
        server: {
          title: "Error del servidor",
          description: "Ocurrió un error interno del servidor",
        },
        unknown: {
          title: "Error desconocido",
          description: "Ocurrió un error desconocido",
        },
        network: {
          title: "Error de red",
          description: "Ocurrió un error de red",
        },
        forbidden: {
          title: "Acceso denegado",
          description: "No tienes acceso",
        },
        notFound: {
          title: "No encontrado",
          description: "No se encontró el recurso",
        },
        conflict: {
          title: "Conflicto",
          description: "Hay un conflicto entre los datos",
        },
      },
      success: {
        title: "Operación completada",
        description: "La operación se completó correctamente",
      },
    },
    widget: {
      statusActive: "Activa",
      statusInactive: "Inactivo",
      statusUnverified: "Unverified",
      joined: "Únete",
      creditHistory: "Historial de créditos",
      view: "Vista",
      edit: "Editar",
      delete: "Eliminar",
      stats: "Stats",
      graphs: "Gráficos",
      newUser: "Nuevo Usuario",
      searchPlaceholder: "Búsqueda por nombre o correo electrónico... (Ctrl+F)",
      roleFilterLabel: "Función",
      sortLabel: "Clasificar:",
      clearFilters: "Filtros claros",
      noUsersMatchFilters: "Ningún usuario coincide con sus filtros.",
      noUsersFound: "No hay usuarios encontrados.",
      userStatistics: "Estadísticas de usuario",
      refresh: "Actualizar",
      roleAll: "Todos",
      roleAdmin: "Administrador",
      roleCustomer: "Cliente",
      rolePartnerAdmin: "Administrador del socio",
      rolePartnerEmployee: "Empleado del socio",
      statusAll: "Todos",
      sortNewest: "Más reciente",
      sortOldest: "Más viejo",
      sortNameAZ: "Nombre A-Z",
      sortNameZA: "Nombre Z-A",
      sortEmailAZ: "Email A-Z",
      of: "de",
      usersShown: "usuarios mostrados",
      paginationPage: "Página",
      paginationOf: "de",
      paginationSeparator: "·",
      paginationUsers: "usuarios",
    },
    enums: {
      userSortField: {
        createdAt: "Creado en",
        updatedAt: "Actualizado en",
        email: "Correo electrónico",
        privateName: "Nombre privado",
        publicName: "Nombre público",
        firstName: "Nombre",
        lastName: "Apellido",
        company: "Company",
        lastLogin: "Último acceso",
      },
      sortOrder: {
        asc: "Ascendencia",
        desc: "Descendiente",
      },
      userStatusFilter: {
        all: "Todos",
        active: "Activa",
        inactive: "Inactivo",
        pending: "Pendiente",
        suspended: "Suspended",
        emailVerified: "Email Verificado",
        emailUnverified: "Email Unverified",
      },
      userStatus: {
        active: "Activa",
        inactive: "Inactivo",
        pending: "Pendiente",
        suspended: "Suspended",
      },
      userRoleFilter: {
        all: "Todos",
        user: "Usuario",
        public: "Público",
        customer: "Cliente",
        moderator: "Moderador",
        partnerAdmin: "Administrador del socio",
        partnerEmployee: "Empleado del socio",
        admin: "Administrador",
        superAdmin: "Super Admin",
      },
      subscriptionPresenceFilter: {
        any: "Cualquiera",
        hasActive: "Tiene suscripción activa",
        hadAny: "Tenía una suscripción (toda)",
        never: "Nunca se suscribió",
      },
      creditActivityFilter: {
        any: "Cualquiera",
        boughtPack: "Paquete de crédito comprado",
        spentCredits: "Créditos gastados",
        neverSpent: "Nunca gastó créditos",
      },
      threadsFilter: {
        any: "Cualquiera",
        hasThreads: "Tiene hilos",
        noThreads: "Sin hilos",
      },
      referralActivityFilter: {
        any: "Cualquiera",
        hasCode: "Tiene referencia al enlace",
        hasClicks: "Tiene clics de referencia",
        hasSignups: "Tiene registros de remisión",
        hasSubscribers: "Ha pagado las referencias",
      },
    },
  },
  stats: {
    title: "Estadísticas de usuario",
    description: "Análisis y estadísticas completos del usuario",
    category: "Usuarios",
    tag: "Estadísticas",
    container: {
      title: "Panel de estadísticas del usuario",
      description: "Ver análisis y estadísticas completos de los usuarios",
    },
    actions: {
      refresh: "Actualizar",
      refreshing: "Refrescante...",
    },
    basicFilters: {
      title: "Filtros básicos",
      description: "Filtrar a los usuarios por estado y función",
    },
    subscriptionFilters: {
      title: "Filtros de suscripción",
      description: "Filtro por suscripción y pago",
    },
    locationFilters: {
      title: "Filtros de ubicación",
      description: "Filtro por país e idioma",
    },
    timePeriodOptions: {
      title: "Opciones del período de tiempo",
      description:
        "Configurar el período de tiempo y la configuración de gráficos",
    },
    sections: {
      filterOptions: {
        title: "Opciones de filtro",
        description: "Configurar filtros para estadísticas de usuario",
      },
    },
    fields: {
      status: {
        label: "Filtro de estado",
        description: "Estadísticas de filtro por estado de usuario",
      },
      role: {
        label: "Filtro de papel",
        description: "Estadísticas de filtro por función del usuario",
      },
      country: {
        label: "Filtro del país",
        description: "Estadísticas de filtro por país",
        placeholder: "Seleccionar país...",
      },
      language: {
        label: "Filtro de idioma",
        description: "Estadísticas de filtro por idioma",
        placeholder: "Seleccione el idioma...",
      },
      search: {
        label: "Buscar",
        description: "Usuarios de búsqueda para estadísticas",
        placeholder: "Ingrese el término de búsqueda...",
      },
      chartType: {
        label: "Tipo de carga",
        description: "Seleccione el tipo de gráfico para mostrar",
      },
      dateRangePreset: {
        label: "Date Range Preset",
        description: "Seleccione un rango de fecha predefinido",
      },
      includeComparison: {
        label: "Incluir la comparación",
        description: "Comparación con el período anterior",
      },
      timePeriod: {
        label: "Período de tiempo",
        description: "Seleccione el plazo para las estadísticas",
      },
      subscriptionStatus: {
        label: "Estado de la suscripción",
        description: "Filtro por estado de suscripción",
      },
      paymentMethod: {
        label: "Método de pago",
        description: "Filtro por método de pago",
      },
    },
    response: {
      overviewStats: {
        title: "Resumen de las estadísticas",
        description: "Panorama general de las estadísticas de los usuarios",
        totalUsers: {
          label: "Total Users",
        },
        activeUsers: {
          label: "Usuarios activos",
        },
        inactiveUsers: {
          label: "Usuarios inactivos",
        },
        newUsers: {
          label: "Nuevos Usuarios",
        },
      },
      emailStats: {
        title: "Estadísticas de correo electrónico",
        description:
          "Estadísticas de verificación de correo electrónico de usuario",
        emailVerifiedUsers: {
          label: "Correos electrónicos verificados",
        },
        emailUnverifiedUsers: {
          label: "Correos electrónicos no verificados",
        },
        verificationRate: {
          label: "Tasa de verificación",
        },
      },
      profileStats: {
        title: "Profile Statistics",
        description: "Estadísticas de terminación del perfil de usuario",
        complete: {
          title: "Completación del perfil",
          description: "métricas detalladas de terminación del perfil",
          usersWithPhone: {
            content: "Usuarios con Teléfono",
          },
          usersWithBio: {
            content: "Usuarios con Biografía",
          },
          usersWithWebsite: {
            content: "Usuarios con Sitio Web",
          },
          usersWithJobTitle: {
            content: "Usuarios con Título de Trabajo",
          },
          usersWithImage: {
            content: "Usuarios con imagen de perfil",
          },
          completionRate: {
            content: "Tasa de terminación del perfil",
          },
        },
      },
      subscriptionStats: {
        title: "Estadísticas de suscripción",
        description: "Estadísticas de distribución de suscripción de usuarios",
        activeSubscriptions: {
          label: "Activa",
        },
        canceledSubscriptions: {
          label: "Cancelado",
        },
        expiredSubscriptions: {
          label: "Gastos",
        },
        noSubscription: {
          label: "No subscripción",
        },
        subscriptionChart: {
          label: "Distribución de la subscripción",
          description: "Desglose visual de los estados de suscripción",
        },
      },
      paymentStats: {
        title: "Estadísticas de pago",
        description: "Estadísticas de ingresos y transacciones",
        totalRevenue: {
          label: "Ingresos generados",
        },
        transactionCount: {
          label: "Transacciones",
        },
        averageOrderValue: {
          label: "Avg. Valor de la orden",
        },
        refundRate: {
          label: "Tasa de reembolso",
        },
      },
      roleStats: {
        title: "Función estadística",
        description: "Estadísticas de distribución del papel de usuario",
        publicUsers: {
          label: "Público",
        },
        customerUsers: {
          label: "Clientes",
        },
        partnerAdminUsers: {
          label: "Administradores asociados",
        },
        partnerEmployeeUsers: {
          label: "Partner Staff",
        },
        adminUsers: {
          label: "Admins",
        },
        roleChart: {
          label: "Distribución del papel",
          description: "Desglose visual de los usuarios por función",
        },
      },
      timeStats: {
        title: "Estadísticas basadas en el tiempo",
        description:
          "Estadísticas de creación y crecimiento del usuario con el tiempo",
        usersCreatedToday: {
          label: "Hoy",
        },
        usersCreatedThisWeek: {
          label: "Esta semana",
        },
        usersCreatedThisMonth: {
          label: "Este mes",
        },
        usersCreatedLastMonth: {
          label: "El último mes",
        },
        growthRate: {
          label: "Tasa de crecimiento",
        },
      },
      companyStats: {
        title: "Estadísticas de la empresa",
        description: "Estadísticas de usuario relacionadas con la empresa",
        uniqueCompanies: {
          content: "Empresas únicas",
        },
      },
      // Keep the flat structure for backward compatibility
      totalUsers: {
        content: "Total Users",
      },
      activeUsers: {
        content: "Usuarios activos",
      },
      inactiveUsers: {
        content: "Usuarios inactivos",
      },
      newUsers: {
        content: "Nuevos Usuarios",
      },
      emailVerifiedUsers: {
        content: "Usuarios verificados por correo electrónico",
      },
      emailUnverifiedUsers: {
        content: "Correo electrónico Usuarios no verificados",
      },
      verificationRate: {
        content: "Tasa de verificación del email",
      },
      usersWithPhone: {
        content: "Usuarios con Teléfono",
      },
      usersWithBio: {
        content: "Usuarios con Biografía",
      },
      usersWithWebsite: {
        content: "Usuarios con Sitio Web",
      },
      usersWithJobTitle: {
        content: "Usuarios con Título de Trabajo",
      },
      usersWithImage: {
        content: "Usuarios con imagen de perfil",
      },
      usersWithStripeId: {
        content: "Usuarios con Stripe ID",
      },
      usersWithoutStripeId: {
        content: "Usuarios sin Stripe ID",
      },
      stripeIntegrationRate: {
        content: "Tasa de integración de Stripe",
      },
      usersWithLeadId: {
        content: "Usuarios con Lead ID",
      },
      usersWithoutLeadId: {
        content: "Usuarios sin contacto ID",
      },
      leadAssociationRate: {
        content: "Lead Association Rate",
      },
      publicUsers: {
        content: "Usuarios públicos",
      },
      customerUsers: {
        content: "Usuarios de clientes",
      },
      partnerAdminUsers: {
        content: "Usuarios de Administradores de Socios",
      },
      partnerEmployeeUsers: {
        content: "Usuarios de empleados asociados",
      },
      adminUsers: {
        content: "Usuarios de Admin",
      },
      uniqueCompanies: {
        content: "Empresas únicas",
      },
      usersCreatedToday: {
        content: "Usuarios Creados hoy",
      },
      usersCreatedThisWeek: {
        content: "Usuarios Creados Esta Semana",
      },
      usersCreatedThisMonth: {
        content: "Usuarios Creados Este Mes",
      },
      usersCreatedLastMonth: {
        content: "Usuarios Creados el Mes pasado",
      },
      growthRate: {
        content: "Tasa de crecimiento",
      },
      leadToUserConversionRate: {
        content: "Lead to User Conversion Rate",
      },
      retentionRate: {
        content: "Tasa de retención del usuario",
      },
      generatedAt: {
        content: "Estadísticas generadas en",
      },
      growthMetrics: {
        title: "Metrices de crecimiento",
        description: "Crecimiento del usuario y métricas de conversión",
        growthChart: {
          label: "Crecimiento del usuario con el tiempo",
          description:
            "Representación visual de las tendencias de creación de usuarios",
        },
      },
      performanceRates: {
        title: "Tasas de rendimiento",
        description: "métricas de rendimiento y conversión del usuario",
        growthRate: {
          label: "Tasa de crecimiento",
        },
        leadToUserConversionRate: {
          label: "Conversión de contactos",
        },
        retentionRate: {
          label: "Tasa de retención",
        },
      },
      businessInsights: {
        title: "Business Insights",
        description: "Inteligencia empresarial y análisis",
        uniqueCompanies: {
          label: "Empresas únicas",
        },
        generatedAt: {
          label: "Generado en",
        },
      },
    },
    errors: {
      validation: {
        title: "Validación fallida",
        description: "Parámetros estadísticos inválidos proporcionados",
      },
      unauthorized: {
        title: "Acceso no autorizado",
        description: "Debes estar conectado para ver estadísticas",
      },
      forbidden: {
        title: "Access Forbidden",
        description: "No tiene permiso para ver estadísticas",
      },
      notFound: {
        title: "Estadísticas No encontradas",
        description: "No se pueden encontrar las estadísticas solicitadas",
      },
      conflict: {
        title: "Conflicto de error",
        description:
          "Incapaz de generar estadísticas debido a los conflictos existentes",
      },
      network: {
        title: "Error de red",
        description: "Incapaz de conectarse al servidor",
      },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Tienes cambios sin salvar que se perderán",
      },
      server: {
        title: "Error del servidor",
        description:
          "Incapaz de generar estadísticas debido al error del servidor",
      },
      unknown: {
        title: "Error desconocido",
        description:
          "Se produjo un error inesperado mientras se generan estadísticas",
      },
    },
    enums: {
      subscriptionStatusFilter: {
        all: "Todos",
        active: "Activa",
        trialing: "Juicio",
        pastDue: "Puestos atrasados",
        canceled: "Cancelado",
        unpaid: "No pagados",
        paused: "Pausa",
        noSubscription: "No subscripción",
      },
      paymentMethodFilter: {
        all: "Todos",
        card: "Tarjeta",
        bankTransfer: "Transferencia bancaria",
        paypal: "PayPal",
        applePay: "Apple Pay",
        googlePay: "Google Pay",
        sepaDebit: "SEPA Debit",
        crypto: "Criptomonedas",
        noPaymentMethod: "No Formas de pago",
      },
    },
    success: {
      title: "Estadísticas generadas con éxito",
      description: "Las estadísticas de usuario se han generado con éxito",
    },
    widget: {
      headerTitle: "Estadísticas de usuarios",
      refresh: "Actualizar",
      labelTotalUsers: "Total Users",
      labelActiveUsers: "Usuarios activos",
      labelNewToday: "Hoy",
      labelNewThisWeek: "Esta semana",
      labelNewThisMonth: "Nuevo este mes",
      labelTotalRevenue: "Ingresos generados",
      labelAvgRevenuePerUser: "Avg Revenue / Usuario",
      labelEmailVerified: "Email Verificado",
      labelVerificationRate: "Tasa de verificación",
      labelEmailUnverified: "Email Unverified",
      labelGrowthRate: "Tasa de crecimiento",
      labelLeadUserCvr: "Lead → Usuario CVR",
      labelRetentionRate: "Tasa de retención",
      chartByRole: "Por función",
      chartBySubscriptionStatus: "Estado de la suscripción",
      chartGrowthOverTime: "Crecimiento con el tiempo",
      recentSignupsSummary: "Resumen de las recientes firmas",
      rowToday: "Hoy",
      rowThisWeek: "Esta semana",
      rowThisMonth: "Este mes",
      rowLastMonth: "El último mes",
      generatedAt: "Generado en:",
      filters: "Filtros",
      filtersTitle: "Opciones de filtro",
      applyFilters: "Aplicar filtros",
      viewUsers: "Ver Usuarios",
      createUser: "Crear usuario",
    },
  },
  user: {
    category: "Usuarios",
    tag: "Gestión de usuarios",
    errors: {
      not_found: {
        title: "Usuario No encontrado",
        description: "No se pudo encontrar al usuario solicitado",
      },
      internal: {
        title: "Error interno",
        description:
          "Se produjo un error interno al procesar la solicitud del usuario",
      },
    },
    id: {
      category: "Usuarios",
      tag: "Gestión de usuarios",

      id: {
        roles: {
          post: {
            title: "Agregar el papel de usuario",
            description: "Dar un papel a una cuenta de usuario específica",
            container: {
              title: "Add Role",
              description: "Seleccione un papel para otorgar a este usuario",
            },
            id: {
              label: "Usuario ID",
              description:
                "Un identificador único del usuario para otorgar el papel a",
              placeholder: "Introduzca el usuario ID...",
            },
            role: {
              label: "Función",
              description: "Función de otorgar al usuario",
              placeholder: "Seleccione un papel...",
            },
            submit: {
              label: "Add Role",
            },
            response: {
              roleId: {
                content: "Función de asignación ID",
              },
              userId: {
                content: "Usuario ID",
              },
              assignedRole: {
                content: "Función asignada",
              },
            },
            errors: {
              unauthorized: {
                title: "Se requiere autenticación",
                description:
                  "Debes iniciar sesión para administrar los roles de usuario",
              },
              validation: {
                title: "Validación fallida",
                description: "Proporcione un usuario válido ID y el papel",
              },
              forbidden: {
                title: "Access Forbidden",
                description:
                  "Sólo los administradores pueden gestionar funciones de usuario",
              },
              notFound: {
                title: "Usuario No encontrado",
                description: "El usuario especificado no pudo ser encontrado",
              },
              conflict: {
                title: "Función ya asignada",
                description: "Este usuario ya tiene el papel especificado",
              },
              network: {
                title: "Error de red",
                description: "Incapaz de conectarse al servidor",
              },
              unsavedChanges: {
                title: "Cambios sin guardar",
                description: "Tienes cambios sin salvar que se perderán",
              },
              server: {
                title: "Error del servidor",
                description:
                  "Incapaz de añadir el papel debido al error del servidor",
              },
              unknown: {
                title: "Error desconocido",
                description:
                  "Se produjo un error inesperado al agregar el papel",
              },
            },
            success: {
              title: "Papel añadido",
              description: "El papel ha sido otorgado con éxito al usuario",
            },
          },
          delete: {
            title: "Eliminar el papel de usuario",
            description:
              "Rechazar un papel de una cuenta de usuario específica",
            container: {
              title: "Eliminar el papel",
              description: "Seleccione un papel para revocar de este usuario",
            },
            id: {
              label: "Usuario ID",
              description:
                "Un identificador único del usuario para revocar el papel de",
              placeholder: "Introduzca el usuario ID...",
            },
            role: {
              label: "Función",
              description: "El papel de revocación del usuario",
              placeholder: "Seleccione un papel...",
            },
            submit: {
              label: "Eliminar el papel",
            },
            response: {
              success: {
                content: "Papel eliminado",
              },
            },
            errors: {
              unauthorized: {
                title: "Se requiere autenticación",
                description:
                  "Debes iniciar sesión para administrar los roles de usuario",
              },
              validation: {
                title: "Validación fallida",
                description: "Proporcione un usuario válido ID y el papel",
              },
              forbidden: {
                title: "Access Forbidden",
                description:
                  "Sólo los administradores pueden gestionar funciones de usuario",
              },
              notFound: {
                title: "Usuario No encontrado",
                description: "El usuario especificado no pudo ser encontrado",
              },
              conflict: {
                title: "Conflicto de error",
                description:
                  "Incapaz de eliminar la función debida a las dependencias existentes",
              },
              network: {
                title: "Error de red",
                description: "Incapaz de conectarse al servidor",
              },
              unsavedChanges: {
                title: "Cambios sin guardar",
                description: "Tienes cambios sin salvar que se perderán",
              },
              server: {
                title: "Error del servidor",
                description:
                  "Incapaz de eliminar el papel debido al error del servidor",
              },
              unknown: {
                title: "Error desconocido",
                description:
                  "Se produjo un error inesperado al eliminar el papel",
              },
            },
            success: {
              title: "Papel eliminado",
              description: "El papel ha sido revocado con éxito por el usuario",
            },
          },
        },
        get: {
          title: "Obtener usuario",
          description:
            "Recuperar información detallada sobre un usuario específico",
          container: {
            title: "Detalles del usuario",
            description: "Ver información detallada del usuario",
          },
          id: {
            label: "Usuario ID",
            description: "Identificador único para el usuario",
            placeholder: "Introduzca el usuario ID...",
          },
          response: {
            userProfile: {
              title: "Perfil de usuario",
              description: "Información detallada del perfil de usuario",
              basicInfo: {
                title: "Información básica",
                description: "Información básica del usuario",
                id: {
                  content: "Usuario ID",
                },
                email: {
                  content: "Dirección de correo electrónico",
                },
                privateName: {
                  content: "Nombre privado",
                },
                publicName: {
                  content: "Nombre público",
                },
                firstName: {
                  content: "Nombre",
                },
                lastName: {
                  content: "Apellido",
                },
                company: {
                  content: "Company",
                },
              },
              contactDetails: {
                title: "Datos de contacto",
                description: "Información de contacto del usuario",
                phone: {
                  content: "Número de teléfono",
                },
                preferredContactMethod: {
                  content: "Método de contacto preferido",
                },
                website: {
                  content: "Sitio web",
                },
              },
            },
            profileDetails: {
              title: "Detalles del perfil",
              description: "Información adicional sobre el perfil",
              imageUrl: {
                content: "Imagen del perfil",
              },
              bio: {
                content: "Biografía",
              },
              jobTitle: {
                content: "Título de trabajo",
              },
              leadId: {
                content: "ID del prospecto asociado",
              },
            },
            accountStatus: {
              title: "Situación de la contabilidad",
              description:
                "Información sobre el estado de la cuenta de usuario",
              isActive: {
                content: "Situación activa",
              },
              emailVerified: {
                content: "Email Verificado",
              },
              stripeCustomerId: {
                content: "Stripe Cliente ID",
              },
              userRoles: {
                content: "Roles de usuario",
              },
            },
            timestamps: {
              title: "Timestamps",
              description: "Creación y actualización de timetamps",
              createdAt: {
                content: "Creado en",
              },
              updatedAt: {
                content: "Actualizado en",
              },
            },
            referralInfo: {
              title: "Información de referencia",
              description: "Cadena de referencia y ganancias",
              referredByUserId: {
                content: "Referido por (User ID)",
              },
              referredByCode: {
                content: "Código de referencia utilizado",
              },
              totalReferrals: {
                content: "Usuarios remitidos",
              },
              totalEarnedCents: {
                content: "Total Ganado (centros)",
              },
            },
            leadId: {
              content: "ID del prospecto asociado",
            },
            email: {
              content: "Dirección de correo electrónico",
            },
            privateName: {
              content: "Nombre privado",
            },
            publicName: {
              content: "Nombre público",
            },
            firstName: {
              content: "Nombre",
            },
            lastName: {
              content: "Apellido",
            },
            company: {
              content: "Company",
            },
            phone: {
              content: "Número de teléfono",
            },
            preferredContactMethod: {
              content: "Método de contacto preferido",
            },
            imageUrl: {
              content: "Imagen del perfil",
            },
            bio: {
              content: "Biografía",
            },
            website: {
              content: "Sitio web",
            },
            jobTitle: {
              content: "Título de trabajo",
            },
            emailVerified: {
              content: "Email Verificado",
            },
            isActive: {
              content: "Situación activa",
            },
            stripeCustomerId: {
              content: "Stripe Cliente ID",
            },
            userRoles: {
              content: "Roles de usuario",
            },
            createdAt: {
              content: "Creado en",
            },
            updatedAt: {
              content: "Actualizado en",
            },
          },
          errors: {
            unauthorized: {
              title: "Acceso no autorizado",
              description:
                "Debes iniciar sesión para ver los detalles del usuario",
            },
            validation: {
              title: "Validación fallida",
              description: "Usuario inválido ID proporcionado",
            },
            forbidden: {
              title: "Access Forbidden",
              description: "Usted no tiene permiso para ver este usuario",
            },
            notFound: {
              title: "Usuario No encontrado",
              description: "No se pudo encontrar al usuario solicitado",
            },
            conflict: {
              title: "Conflicto de error",
              description:
                "Incapaz de recuperar usuario debido a los conflictos existentes",
            },
            network: {
              title: "Error de red",
              description: "Incapaz de conectarse al servidor",
            },
            unsavedChanges: {
              title: "Cambios sin guardar",
              description: "Tienes cambios sin salvar que se perderán",
            },
            server: {
              title: "Error del servidor",
              description:
                "Incapaz de recuperar usuario debido al error del servidor",
            },
            unknown: {
              title: "Error desconocido",
              description:
                "Se produjo un error inesperado mientras se recupera el usuario",
            },
          },
          success: {
            title: "El usuario se ha comprometido con éxito",
            description: "Los datos del usuario se han recuperado con éxito",
          },
        },
        put: {
          title: "Actualizar usuario",
          description:
            "Actualizar información de usuario y detalles del perfil",
          container: {
            title: "Actualizar usuario",
            description: "Modificar la información y configuración del usuario",
          },
          id: {
            label: "Usuario ID",
            description: "Unico identificador para que el usuario actualice",
            placeholder: "Introduzca el usuario ID...",
          },
          sections: {
            basicInfo: {
              title: "Información básica",
              description: "Actualizar la información básica del usuario",
            },
            contactInfo: {
              title: "Información de contacto",
              description: "Actualizar datos de contacto",
            },
            profileDetails: {
              title: "Detalles del perfil",
              description: "Actualizar información adicional sobre el perfil",
            },
            adminSettings: {
              title: "Ajustes administrativos",
              description: "Actualizar los ajustes administrativos",
            },
          },
          email: {
            label: "Dirección de correo electrónico",
            description:
              "Dirección de correo electrónico del usuario para iniciar sesión y comunicación",
            placeholder: "Introduzca la dirección de correo electrónico...",
          },
          privateName: {
            label: "Nombre privado",
            description:
              "Nombre legal completo del usuario (visible solamente a los administradores)",
          },
          publicName: {
            label: "Nombre público",
            description:
              "Nombre de visualización del usuario (visible para todos los usuarios)",
          },
          firstName: {
            label: "Nombre",
            description: "Nombre del usuario",
            placeholder: "Ingrese el nombre de pila...",
          },
          lastName: {
            label: "Apellido",
            description: "Nombre del usuario",
            placeholder: "Ingrese el apellido...",
          },
          company: {
            label: "Company",
            description: "Empresa u organización del usuario",
            placeholder: "Ingrese el nombre de la compañía...",
          },
          phone: {
            label: "Número de teléfono",
            description: "Número de teléfono de contacto del usuario",
            placeholder: "Introduzca el número de teléfono...",
          },
          preferredContactMethod: {
            label: "Método de contacto preferido",
            description: "Cómo el usuario prefiere ser contactado",
          },
          bio: {
            label: "Biografía",
            description: "Breve descripción sobre el usuario",
            placeholder: "Entrar en biografía...",
          },
          website: {
            label: "Sitio web",
            description: "Sitio web personal o de empresa",
            placeholder: "Ingrese el sitio web URL...",
          },
          jobTitle: {
            label: "Título de trabajo",
            description: "Título de trabajo o posición del usuario",
            placeholder: "Ingrese el título de trabajo...",
          },
          emailVerified: {
            label: "Email Verificado",
            description: "Si el correo electrónico del usuario es verificado",
          },
          isActive: {
            label: "Situación activa",
            description: "Ya sea que la cuenta de usuario esté activa",
          },
          leadId: {
            label: "ID del contacto",
            description: "identificador de contacto asociado",
            placeholder: "Ingrese el contacto ID...",
          },
          isBanned: {
            label: "Banned",
            description: "Si el usuario está prohibido en la plataforma",
          },
          bannedReason: {
            label: "Ban Reason",
            description: "Razón para prohibir el usuario",
          },
          response: {
            leadId: {
              content: "ID del prospecto asociado",
            },
            email: {
              content: "Dirección de correo electrónico",
            },
            privateName: {
              content: "Nombre privado",
            },
            publicName: {
              content: "Nombre público",
            },
            firstName: {
              content: "Nombre",
            },
            lastName: {
              content: "Apellido",
            },
            company: {
              content: "Company",
            },
            phone: {
              content: "Número de teléfono",
            },
            preferredContactMethod: {
              content: "Método de contacto preferido",
            },
            imageUrl: {
              content: "Imagen del perfil",
            },
            bio: {
              content: "Biografía",
            },
            website: {
              content: "Sitio web",
            },
            jobTitle: {
              content: "Título de trabajo",
            },
            emailVerified: {
              content: "Email Verificado",
            },
            isActive: {
              content: "Situación activa",
            },
            stripeCustomerId: {
              content: "Stripe Cliente ID",
            },
            userRoles: {
              content: "Roles de usuario",
            },
            createdAt: {
              content: "Creado en",
            },
            updatedAt: {
              content: "Actualizado en",
            },
          },
          errors: {
            unauthorized: {
              title: "Acceso no autorizado",
              description: "Debes estar conectado para actualizar los usuarios",
            },
            validation: {
              title: "Validación fallida",
              description:
                "Por favor, compruebe los datos del formulario e inténtelo de nuevo",
            },
            forbidden: {
              title: "Access Forbidden",
              description: "No tienes permiso para actualizar este usuario",
            },
            notFound: {
              title: "Usuario No encontrado",
              description: "No se pudo encontrar el usuario para actualizar",
            },
            conflict: {
              title: "Actualización de conflictos",
              description:
                "Los datos del usuario entran en conflicto con los registros existentes",
            },
            server: {
              title: "Error del servidor",
              description:
                "Incapaz de actualizar el usuario debido al error del servidor",
            },
            unknown: {
              title: "Error desconocido",
              description:
                "Se produjo un error inesperado al actualizar el usuario",
            },
            network: {
              title: "Error de red",
              description: "Incapaz de conectarse al servidor",
            },
            unsavedChanges: {
              title: "Cambios sin guardar",
              description: "Tienes cambios sin salvar que se perderán",
            },
          },
          success: {
            title: "Actualizado con éxito",
            description:
              "Se ha actualizado con éxito la información de los usuarios",
          },
        },
        delete: {
          title: "Eliminar el usuario",
          description: "Eliminar permanentemente una cuenta de usuario",
          container: {
            title: "Eliminar el usuario",
            description: "Eliminar permanentemente al usuario del sistema",
          },
          id: {
            label: "Usuario ID",
            description: "Identificador único para el usuario para eliminar",
            placeholder: "Introduzca el usuario ID...",
            helpText: "WARNING : Esta acción no puede ser deshecha",
          },
          submitButton: {
            label: "Eliminar el usuario",
            loadingText: "Eliminar...",
          },
          response: {
            deletionResult: {
              title: "Resultado de la eliminación",
              description: "Resultado de la operación de eliminación",
              success: {
                content: "Supresión del éxito",
              },
              message: {
                content: "Mensaje de eliminación",
              },
              deletedAt: {
                content: "Suprimidos",
              },
            },
            success: {
              content: "Supresión del éxito",
            },
            message: {
              content: "Mensaje de eliminación",
            },
          },
          errors: {
            unauthorized: {
              title: "Acceso no autorizado",
              description: "Usted debe estar conectado para eliminar usuarios",
            },
            validation: {
              title: "Validación fallida",
              description:
                "Usuario inválido ID proporcionado para la eliminación",
            },
            forbidden: {
              title: "Access Forbidden",
              description: "Usted no tiene permiso para borrar usuarios",
            },
            notFound: {
              title: "Usuario No encontrado",
              description: "No se pudo encontrar el usuario que eliminara",
            },
            server: {
              title: "Error del servidor",
              description:
                "Incapaz de borrar usuario debido al error del servidor",
            },
            unknown: {
              title: "Error desconocido",
              description:
                "Se produjo un error inesperado mientras se elimina el usuario",
            },
            conflict: {
              title: "Conflicto de error",
              description:
                "Incapaz de eliminar al usuario debido a las dependencias existentes",
            },
            network: {
              title: "Error de red",
              description: "Incapaz de conectarse al servidor",
            },
            unsavedChanges: {
              title: "Cambios sin guardar",
              description: "Tienes cambios sin salvar que se perderán",
            },
          },
          success: {
            title: "Usuario eliminado con éxito",
            description: "El usuario ha sido eliminado con éxito",
          },
        },
        widget: {
          userProfile: "Perfil de usuario",
          active: "Activa",
          inactive: "Inactivo",
          leadId: "ID de prospecto:",
          viewLead: "Ver contacto",
          created: "Creado",
          lastUpdated: "Última actualización",
          fullProfile: "Perfil completo",
          referrals: "Remisiones",
          subscription: "Suscripción",
          creditHistory: "Historial de créditos",
          deleteUser: "Eliminar el usuario",
          userDeletedSuccessfully: "Usuario eliminado con éxito",
          deletedAt: "Suprimidos",
          confirmDeletion: "Confirmación de eliminación",
          confirmDeletionMessage:
            "Esto eliminará permanentemente al usuario y todos los datos asociados. Esta acción no se puede deshacer.",
          titleReferralCodes: "Ver códigos de referencia y estadísticas",
          titleSubscription: "Ver suscripción",
          titleCopyUserId: "Copiar usuario ID",
        },
      },
    },
  },
  view: {
    category: "Usuarios",
    tags: {
      user: "Usuario",
      view: "Vista",
    },

    badge: "Detalles del usuario",
    get: {
      title: "Ver Usuario",
      description: "Ver información detallada sobre un usuario",
      userId: {
        label: "Usuario ID",
      },
    },
    errors: {
      validation: {
        title: "Solicitud inválida",
        description: "Por favor, compruebe el usuario ID e inténtelo de nuevo",
      },
      network: {
        title: "Error de conexión",
        description:
          "Incapaz de conectarse. Por favor, compruebe su conexión a Internet",
      },
      unauthorized: {
        title: "Inicia sesión para continuar",
        description: "Por favor, inicie sesión para ver detalles del usuario",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "Usted no tiene permiso para ver este usuario",
      },
      notFound: {
        title: "Usuario No encontrado",
        description: "No pudimos encontrar a este usuario.",
      },
      serverError: {
        title: "Algo que estaba mal.",
        description:
          "No podíamos cargar los datos del usuario. Por favor, inténtelo de nuevo.",
      },
      unknown: {
        title: "Error inesperado",
        description: "Algo inesperado sucedió. Por favor, inténtelo de nuevo.",
      },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Tienes cambios que no han sido salvados",
      },
      conflict: {
        title: "Conflicto de datos",
        description:
          "Los datos del usuario han cambiado. Por favor, refresca y prueba de nuevo",
      },
    },
    success: {
      title: "Usuario cargado",
      description: "Datos de usuario cargados con éxito",
    },
    empty: "No se han encontrado datos de usuario",
    sections: {
      basicInfo: "Información básica",
      chatActivity: "Actividad de Chat",
      credits: "Créditos",
      payments: "Pagos",
      newsletter: "Boletín",
      referrals: "Remisiones",
      recentActivity: "Actividad reciente",
    },
    status: {
      active: "Activa",
      banned: "Banned",
      inactive: "Inactivo",
      verified: "Verificado",
    },
    fields: {
      userId: "Usuario ID",
      locale: "Locale",
      twoFactor: "Two-Factor Auth",
      enabled: "Enabled",
      disabled: "Discapacitados",
      marketing: "Marketing",
      optedIn: "Optado en",
      optedOut: "Ocultado",
      created: "Creado",
      lastUpdated: "Última actualización",
      banReason: "Ban Reason",
      roles: "Funciones",
    },
    credits: {
      currentBalance: "Saldo actual",
      availableCredits: "Créditos disponibles",
      packBreakdown: "Desglose del paquete de crédito",
      subscription: "Suscripción",
      permanent: "Permanente",
      bonus: "Bonus",
      earned: "Ganado",
      expires: "Expires",
    },
    payment: {
      stripeCustomerId: "Stripe Cliente ID",
      activeSubscription: "Suscripción activa",
      subscriptionPlan: "Plan",
      subscriptionStatus: "Estado de la suscripción",
      nextBilling: "Siguiente Billing",
    },
    common: {
      yes: "Sí.",
      no: "No.",
    },
    newsletter: {
      status: "Situación",
      subscribed: "Suscrito",
      notSubscribed: "No está suscrito",
      subscribedAt: "Suscritos en",
      confirmedAt: "Confirmado en",
      lastEmailSent: "Último mensaje enviado",
    },
    referrals: {
      totalReferrals: "Total de referencias",
      activeCodes: "Códigos activos",
      revenue: "Ingresos generados",
      earnings: "Ganancias",
    },
    activity: {
      lastLogin: "Último acceso",
      lastThread: "Última conversación",
      lastMessage: "Último mensaje",
      lastPayment: "Último pago",
    },
    tabs: {
      overview: "Sinopsis",
      credits: "Créditos",
      referrals: "Remisiones",
      earnings: "Ganancias",
      connections: "Conexiones",
      favorites: "Favoritos",
      skills: "Skills",
    },
    modelUsage: {
      title: "Uso del modelo",
      model: "Modelo",
      spent: "Créditos gastados",
      messages: "Mensajes",
      noUsage: "No hay datos de uso de modelos",
    },
    connections: {
      title: "Conexiones",
      leadsTitle: "Conexion Leads",
      usersTitle: "Usuarios conectados",
      noLeads: "No hay cables conectados",
      noUsers: "No hay usuarios conectados",
      leadEmail: "Correo electrónico",
      leadBusiness: "Negocios",
      leadStatus: "Situación",
      ipAddress: "Dirección de IP",
      device: "Dispositivo",
      linkReason: "Razón de enlace",
      linkedAt: "Enlaces a",
      userId: "Usuario ID",
      userEmail: "Correo electrónico",
      userPublicName: "Nombre de usuario",
      viewLead: "Ver contacto",
      viewUser: "Ver Usuario",
    },
    ban: {
      banUser: "Ban User",
      unbanUser: "Unban User",
    },
    widget: {
      actions: {
        edit: "Editar",
        delete: "Eliminar",
        viewCreditHistory: "Ver historial de crédito",
        viewSubscription: "Ver suscripción",
        viewReferralCodes: "Ver Códigos de referencia",
        viewReferralEarnings: "Ver Ganancias de referencia",
        addCredits: "Agregar créditos",
        viewLead: "Ver contacto",
        copyUserId: "Copiar usuario ID",
        copied: "Copiado",
      },
      sections: {
        quickActions: "Medidas rápidas",
      },
      stats: {
        totalThreads: "Total de hilos",
        totalMessages: "Total de mensajes",
        userMessages: "Mensajes de usuario",
        lastActivity: "Última actividad",
        never: "Nunca.",
        freeCredits: "Créditos gratis",
        freePeriod: "Período",
        totalSpent: "Total gastado",
        totalPurchased: "Total adquirido",
        totalRevenue: "Ingresos generados",
        payments: "Pagos",
        successful: "Éxito",
        failed: "Failed",
        totalRefunds: "Total de reembolsos",
        lastPayment: "Último pago",
      },
    },
  },
};
