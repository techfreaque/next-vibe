import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  // Main user profile routes
  get: {
    title: "Obtener perfil de usuario",
    titleShort: "Mi perfil",
    description: "Recuperar la información actual del perfil de usuario",
    response: {
      title: "Respuesta del perfil de usuario",
      description: "Datos actuales del perfil de usuario",
      id: "Usuario ID",
      leadId: "ID del contacto",
      isPublic: "Perfil público",
      email: "Dirección de correo electrónico",
      privateName: "Nombre privado",
      publicName: "Nombre público",
      locale: "Locale",
      isActive: "Situación activa",
      emailVerified: "Email Verificado",
      pendingEmail: "Correo electrónico pendiente",
      requireTwoFactor: "Autenticación de dos factores requerido",
      marketingConsent: "Consentimiento de comercialización",
      userRoles: "Roles de usuario",
      roles: "Funciones",
      createdAt: "Creado en",
      updatedAt: "Actualizado en",
      stripeCustomerId: "Stripe Cliente ID",
      bio: "Bio",
      websiteUrl: "Sitio web",
      twitterUrl: "X / Twitter",
      youtubeUrl: "YouTube",
      instagramUrl: "Instagram",
      tiktokUrl: "TikTok",
      githubUrl: "GitHub",
      facebookUrl: "Facebook",
      discordUrl: "Discord",
      tribeUrl: "Tribe",
      rumbleUrl: "Rumble",
      odyseeUrl: "Odysee",
      nostrUrl: "Nostr",
      gabUrl: "Gab",
      creatorSlug: "Perfil Slug",
      creatorAccentColor: "Color de Accent",
      creatorHeaderImageUrl: "Imagen de encabezado",
      avatarUrl: "Avatar",
      user: {
        title: "Información del usuario",
        description: "Detalles del perfil de usuario",
      },
    },
    errors: {
      validation: {
        title: "Error de validación",
        description: "Parámetros de solicitud no válidos",
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
        description: "Perfil de usuario no encontrado",
        detail: "No pudimos encontrar su perfil (user {{userId}})",
      },
      conflict: {
        title: "Conflicto",
        description: "Hay un conflicto entre los datos",
      },
      network: {
        title: "Error de red",
        description: "Ocurrió un error de red",
      },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Hay cambios sin salvar",
      },
      internal: {
        title: "Error interno",
        description: "Ocurrió un error interno del servidor",
        detail: "No se puede cargar su perfil: {{error}} (user {{userId}})",
      },
      unknown: {
        title: "Error desconocido",
        description: "Ocurrió un error desconocido",
      },
    },
    success: {
      title: "Operación completada",
      description: "Perfil recuperado con éxito",
    },
  },
  update: {
    title: "Actualizar el perfil de usuario",
    titleShort: "Perfil de actualización",
    description: "Actualizar la información actual del perfil de usuario",
    groups: {
      basicInfo: {
        title: "Información básica",
        description: "Actualice su información de perfil básico",
      },
      profileDetails: {
        title: "Detalles del perfil",
        description: "Administrar los detalles y ajustes de su perfil",
      },
      privacySettings: {
        title: "Configuración de privacidad",
        description: "Control que puede ver su información de perfil",
      },
      profileInfo: {
        title: "Perfil de Creador",
        description:
          "Bio, enlaces sociales y marcación para tus páginas de habilidad",
      },
    },
    fields: {
      email: {
        label: "Dirección de correo electrónico",
        description:
          "Tu dirección de inicio. Un nuevo solo se hace cargo después de hacer clic en el enlace que le enviamos.",
        placeholder: "Introduzca su dirección de correo electrónico",
        help: "Su dirección de correo electrónico se utilizará para notificaciones de cuenta y comunicación",
        validation: {
          invalid:
            "Por favor, introduzca una dirección de correo electrónico válida",
        },
      },
      privateName: {
        label: "Nombre privado",
        description: "Su nombre interno/privado",
        placeholder: "Introduzca su nombre privado",
        help: "Su nombre privado se utiliza internamente y para comunicaciones privadas",
        validation: {
          minLength:
            "Nombre privado debe ser por lo menos 2 caracteres de largo",
          maxLength: "Nombre privado no puede exceder 50 caracteres",
        },
      },
      publicName: {
        label: "Nombre público",
        description: "Su nombre de pantalla pública",
        placeholder: "Introduzca su nombre público",
        help: "Su nombre público será visible para otros usuarios",
        validation: {
          minLength:
            "El nombre público debe tener al menos 2 caracteres de largo",
          maxLength: "El nombre público no puede exceder de 50 caracteres",
        },
      },
      imageUrl: {
        label: "Imagen del perfil",
        description: "URL a su imagen de perfil",
        placeholder: "Introduzca la imagen URL",
        help: "Proporcionar un URL a una imagen que se mostrará como su imagen de perfil",
        validation: {
          invalid: "Proporcione una imagen válida URL",
        },
      },
      company: {
        label: "Company",
        description: "Su nombre de empresa",
        placeholder: "Entra en tu empresa",
        help: "Su nombre de empresa se mostrará en su perfil",
        validation: {
          maxLength: "Nombre de la empresa no puede exceder 100 caracteres",
        },
      },
      visibility: {
        label: "Visibilidad",
        description: "¿Quién puede ver tu perfil?",
        placeholder: "Seleccionar configuración de visibilidad",
        help: "Elija quién puede ver su perfil: público (todos), privado (sólo usted), o sólo contactos",
      },
      marketingConsent: {
        label: "Suscríbete al Newsletter",
        description:
          "Actualizaciones ocasionales sobre nuevos modelos y características. Sin spam, lo que importa.",
        placeholder: "Permitir emails de marketing",
        help: "Elija si recibir correos electrónicos de marketing y comunicaciones promocionales",
      },
      bio: {
        label: "Bio",
        description: "Una breve descripción sobre ti mismo",
        placeholder: "Cuéntanos sobre ti mismo...",
        help: "Comparte una breve descripción sobre ti mismo que será visible en tu perfil",
        validation: {
          maxLength: "Bio no puede exceder 500 caracteres",
        },
      },
      websiteUrl: {
        label: "Sitio web",
        description: "Su sitio web personal o de negocios",
        placeholder: "https://yoursite.com",
      },
      twitterUrl: {
        label: "X / Twitter",
        description: "Tu perfil X (Twitter) URL",
        placeholder: "https://x.com/yourhandle",
      },
      youtubeUrl: {
        label: "YouTube",
        description: "Su YouTube canal URL",
        placeholder: "https://youtube.com/@yourchannel",
      },
      instagramUrl: {
        label: "Instagram",
        description: "Tu perfil de Instagram URL",
        placeholder: "https://instagram.com/yourhandle",
      },
      tiktokUrl: {
        label: "TikTok",
        description: "Su perfil de TikTok URL",
        placeholder: "https://tiktok.com/@yourhandle",
      },
      githubUrl: {
        label: "GitHub",
        description: "Su perfil GitHub URL",
        placeholder: "https://github.com/yourusername",
      },
      facebookUrl: {
        label: "Facebook",
        description: "Su página de Facebook o perfil URL",
        placeholder: "https://facebook.com/yourpage",
      },
      discordUrl: {
        label: "Discord",
        description: "Su servidor Discord o enlace de perfil",
        placeholder: "https://discord.gg/yourserver",
      },
      tribeUrl: {
        label: "Tribe",
        description: "Su comunidad de tribus URL",
        placeholder: "https://yourcommunity.tribe.so",
      },
      rumbleUrl: {
        label: "Rumble",
        description: "Tu canal de Rumble URL",
        placeholder: "https://rumble.com/c/yourchannel",
      },
      odyseeUrl: {
        label: "Odysee",
        description: "Tu canal Odysee URL",
        placeholder: "https://odysee.com/@yourchannel",
      },
      nostrUrl: {
        label: "Nostr",
        description: "Su perfil de Nostr o dirección npub",
        placeholder: "https://primal.net/p/npub1...",
      },
      gabUrl: {
        label: "Gab",
        description: "Su perfil de Gab URL",
        placeholder: "https://gab.com/yourhandle",
      },
      creatorSlug: {
        label: "Perfil URL",
        description: "Su perfil personalizado - aparece en su enlace público",
        placeholder: "Jane-doe",
        validation: {
          invalid: "Sólo se permiten letras minúsculas, números e hisofens",
        },
      },
      creatorAccentColor: {
        label: "Color de Accent",
        description:
          "Color hex para su marca de página de habilidad (opcional)",
        placeholder: "#7c3aed",
      },
      creatorHeaderImageUrl: {
        label: "Imagen de encabezado",
        description:
          "Imagen de Banner URL para su héroe de página de habilidad",
        placeholder: "https://yoursite.com/banner.jpg",
      },
    },
    response: {
      title: "Perfil actualizado",
      description: "Su información de perfil actualizado",
      success: "Actualización exitosa",
      message: "Su perfil ha sido actualizado con éxito",
      id: "Usuario ID",
      leadId: "ID del contacto",
      isPublic: "Perfil público",
      email: "Dirección de correo electrónico",
      privateName: "Nombre privado",
      publicName: "Nombre público",
      locale: "Locale",
      isActive: "Situación activa",
      emailVerified: "Email Verificado",
      pendingEmail: "Correo electrónico pendiente",
      emailChangePending:
        "Casi terminada. Haga clic en el enlace que hemos enviado a {{email}} para cambiar. Hasta entonces sigues iniciando sesión con {{current}}.",
      requireTwoFactor: "Autenticación de dos factores requerido",
      marketingConsent: "Consentimiento de comercialización",
      userRoles: "Roles de usuario",
      createdAt: "Creado en",
      updatedAt: "Actualizado en",
      stripeCustomerId: "Stripe Cliente ID",
      bio: "Bio",
      websiteUrl: "Sitio web",
      twitterUrl: "X / Twitter",
      youtubeUrl: "YouTube",
      instagramUrl: "Instagram",
      tiktokUrl: "TikTok",
      githubUrl: "GitHub",
      facebookUrl: "Facebook",
      discordUrl: "Discord",
      tribeUrl: "Tribe",
      rumbleUrl: "Rumble",
      odyseeUrl: "Odysee",
      nostrUrl: "Nostr",
      gabUrl: "Gab",
      creatorSlug: "Perfil Slug",
      creatorAccentColor: "Color de Accent",
      creatorHeaderImageUrl: "Imagen de encabezado",
      user: "Información actualizada sobre el usuario",
      changesSummary: {
        title: "Cambios Resumen",
        description: "Resumen de los cambios realizados en su perfil",
        totalChanges: "Cambios totales",
        changedFields: "Cambio de campos",
        verificationRequired: "Verificación requerida",
        lastUpdated: "Última actualización",
      },
      nextSteps: "Siguientes pasos",
    },
    errors: {
      validation: {
        title: "Error de validación",
        description: "Parámetros de solicitud no válidos",
        emailTaken:
          "Esa dirección de correo electrónico ya pertenece a otra cuenta",
        disposableEmail:
          "Las cajas de desecho no están permitidas. Utilice una dirección de correo electrónico permanente.",
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
        description: "Perfil de usuario no encontrado",
        detail:
          "No pudimos encontrar su perfil para actualizar (user {{userId}})",
      },
      conflict: {
        title: "Conflicto",
        description: "Hay un conflicto entre los datos",
        creatorSlugTaken: "Ese mango creador ya está tomado - elegir otro",
      },
      network: {
        title: "Error de red",
        description: "Ocurrió un error de red",
      },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Hay cambios sin salvar",
      },
      internal: {
        title: "Error interno",
        description: "Ocurrió un error interno del servidor",
        detail: "No se puede guardar su perfil: {{error}} (user {{userId}})",
      },
      unknown: {
        title: "Error desconocido",
        description: "Ocurrió un error desconocido",
      },
    },
    success: {
      title: "Operación completada",
      description: "Perfil actualizado con éxito",
      nextSteps: "Próximos pasos recomendados después de actualizar su perfil",
    },
  },
  delete: {
    title: "Eliminar la Cuenta de Usuario",
    titleShort: "Suprímase la Cuenta",
    description: "Eliminar permanentemente su cuenta de usuario",
    response: {
      title: "Estado de eliminación",
      description: "Confirmación de la supresión de la cuenta",
    },
    errors: {
      validation: {
        title: "Error de validación",
        description: "Parámetros de solicitud no válidos",
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
        description: "Cuenta de usuario no encontrada",
        detail:
          "No pudimos encontrar su cuenta para eliminar (user {{userId}})",
      },
      conflict: {
        title: "Conflicto",
        description: "Hay un conflicto entre los datos",
      },
      network: {
        title: "Error de red",
        description: "Ocurrió un error de red",
      },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Hay cambios sin salvar",
      },
      billingCancelFailed:
        "No podíamos cancelar su suscripción, así que su cuenta fue eliminada NOT - de lo contrario seguiría siendo facturado. Intente de nuevo, o cancele la facturación bajo suscripción primero.",
      internal: {
        title: "Error interno",
        description: "Ocurrió un error interno del servidor",
        detail: "No se puede borrar su cuenta: {{error}} (user {{userId}})",
        retry:
          "No podría borrar su cuenta. Intente de nuevo - si sigue fallando, el soporte de contacto.",
      },
      unknown: {
        title: "Error desconocido",
        description: "Ocurrió un error desconocido",
      },
    },
    success: {
      title: "Operación completada",
      description: "Cuenta eliminada con éxito",
    },
  },
  put: {
    response: {
      changedFields: {
        item: "Cambio de campo",
      },
    },
  },
  category: "Perfil de usuario",
  tag: "Perfil de usuario",
  tags: {
    profile: "perfil",
    user: "usuario",
    account: "cuenta",
  },

  widget: {
    newsletter: {
      title: "Boletín",
      subtitle:
        "Actualizaciones en su buzón de entrada, más créditos extras {{bonusCredits}} al mes",
      subtitleNeutral:
        "Nuevos modelos y gotas de producto, en su buzón de entrada",
    },
    loadState: {
      loading: "Cargando...",
      profileFailed: "Tu perfil no cargaba.",
      creditsFailed:
        "No pudimos cargar tu saldo. Toca para volver a intentarlo.",
      retry: "Volver a intentar",
    },
    save: "Guardar el perfil",
    saving: "Salvando...",
    editProfile: "Editar el perfil",
    changePhoto: "Cambiar foto",
    cancelEdit: "Cancelar",
    memberSince: "Miembro desde",
    stats: {
      plan: "Plan",
      credits: "Créditos",
      member: "Miembro desde",
    },
    profileCard: {
      title: "Perfil de Creador",
      description: "Su identidad pública en toda la plataforma",
    },
    socialCard: {
      title: "Enlaces sociales",
      description: "Conecta tus plataformas",
    },
    emailCard: {
      title: "Tus direcciones de correo",
      description:
        "Recoge suscriptores de tus habilidades y perfil. Tu lista, sin intermediario.",
      manage: "Gestionar",
    },
    previewCard: {
      title: "Su perfil público",
      description: "¿Cómo te ven otros?",
    },
    noPreview: "Rellene su perfil para ver una vista previa",
    noSocials: "Aún no se han añadido vínculos sociales",
    viewPublicProfile: "Ver perfil público",
    profileUrl: "Tu enlace",
    verifyNudge: {
      title: "Confirma tu correo",
      description:
        "Enviamos un enlace a {{email}}. El chat funciona de cualquier manera. Confirmar mantiene su cuenta recuperable.",
      action: "Reenviar enlace",
    },
    pendingEmail: {
      title: "Cambio de correo pendiente de confirmación",
      description:
        "Abre el enlace que enviamos a {{email}}. Hasta entonces, inicia sesión con {{current}}. Guarda de nuevo para recibir otro enlace o guarda tu dirección actual para cancelar el cambio.",
    },
    slugWarning:
      "Cambiar este URL romperá cualquier enlace existente a su perfil.",
    bioPreview: "Vista previa",
    bioEdit: "Editar",
    skills: {
      title: "Mis habilidades",
      chat: "Chat ahora",
      add: "Añadir a tu colección",
      public: "Comunidad",
      showLess: "Mostrar menos",
      hubSubtitle: "{{count}} publicado",
    },
    appearance: {
      title: "Apariencia",
      sectionHint: "Cómo se ve y lee la aplicación.",
      theme: "Tema",
      themeHint:
        "Ligera, oscura o coincide con tu dispositivo. Se aplica en todas partes.",
      light: "Luz",
      dark: "Oscuro",
      system: "Sistema",
      language: "Idioma",
      languageHint: "Lenguaje de interfaz y contenido.",
    },
    chatPrefs: {
      title: "Chat",
      sectionHint: "Sostén cómo funciona el asistente.",
      searchProvider: "Búsqueda web",
      searchProviderHint: "Que motor responde a tus búsquedas.",
      automation: "Automatización de los fondos",
      automationHint: "Deje que el AI trabaje mientras esté fuera.",
      on: "Activados",
      off: "Desactivados",
    },
    nav: {
      logoutHint: "Inicie sesión en este dispositivo",
      logout: "A ver.",
      back: "Atrás",
    },
    sections: {
      account: "Cuenta",
      accountHint: "Plan, facturación, seguridad y sus datos.",
      billingHint: "Plan, créditos y direcciones guardadas.",
      security: "Seguridad",
      securityHint: "Mantén tu cuenta cerrada.",
      data: "Datos &quot; privacidad",
      dataHint: "Tus datos, tu llamada.",
      creatorHint: "Crece su público y sus ingresos.",
      basics: "Básicos",
      basicsHint:
        "Su nombre, el email de inicio de sesión y las actualizaciones.",
      subscription: "Suscripción",
      subscriptionHint: "Suscríbete para créditos mensuales.",
      manageSubscription: "Gestionar",
      noSubscription: "Plano libre",
      upgrade: "Actualización",
      addresses: "Dirección de facturación",
      addressCount: "{{count}} salvado",
      addAddress: "Agregar dirección",
      manageAddresses: "Gestionar",
      noAddresses: "Ninguno salvo",
      billing: "Facturación",
      delivery: "Entrega",
      edit: "Editar",
      credits: "Créditos",
      creditsAvailable: "disponible",
      password: "Contraseña",
      passwordHint: "Cambia tu contraseña",
      sessions: "Sesiones activas",
      emailVerification: "Verificación de correo electrónico",
      emailVerifiedHint: "Su dirección está confirmada",
      emailUnverifiedHint:
        "Confirme su dirección. Pulse para reenviar el enlace",
      verified: "Verificado",
      unverified: "Unverified",
      twoFactor: "autenticación de dos factores",
      twoFactorHint: "Requiere un código de aplicación en el registro",
      on: "Activados",
      off: "Desactivados",
      sessionsHint: "Ver todos los dispositivos y firmarlos",
      apiKeys: "Llaves API",
      apiKeysHint: "Modelos {{modelCount}} en su código, Codex o Claude",
      exportData: "Exportar mis datos",
      exportDataHint: "Descargue una copia de todo lo que tenemos sobre usted",
      creator: "Creador",
      referral: "Programa de referencia",
      referralHint: "Ganar de cada pago que traes",
    },
    deleteAccount: {
      dangerZone: "Zona peligrosa",
      dangerDescription:
        "Se ha ido para siempre: perfil, chats, habilidades, archivos, créditos.",
      button: "Suprímase la Cuenta",
      confirmTitle: "Eliminar su cuenta de forma permanente",
      confirmDescription:
        "Esto elimina permanentemente su cuenta y todos los datos asociados. No hay recuperación. Sin deshacer.",
      confirmLabel: 'Tipo " DELETE" para confirmar',
      confirmPlaceholder: "DELETE",
      confirmButton: "Suprimir mi cuenta para siempre",
      cancelButton: "Cancelar",
      whatGetsDeleted: "Lo que se elimina:",
      items: {
        profile: "Su perfil y todos los ajustes",
        chats: "Toda la historia de chat e hilos",
        skills: "Todas las habilidades y configuraciones personalizadas",
        files: "Todos los archivos y recuerdos de Cortex",
        subscriptions: "Suscripciones activas",
        credits: "Todo crédito restante",
      },
      deleting: "Eliminar...",
      success: "Se suprimió la cuenta. Redirección...",
    },
  },

  // Sub-routes
  avatar: {
    category: "Perfil de usuario",

    tag: "avatar",
    errors: {
      user_not_found: "Usuario no encontrado",
      failed_to_upload_avatar: "Failed to upload avatar",
      failed_to_delete_avatar: "Failed to delete avatar",
      invalid_file_type: "Tipo de archivo inválido",
      file_too_large: "Archivo demasiado grande",
    },
    debug: {
      uploadingUserAvatar: "Subir el avatar del usuario",
      errorUploadingUserAvatar: "Error cargando avatar usuario",
      deletingUserAvatar: "Eliminación de avatar usuario",
      errorDeletingUserAvatar: "Error de eliminación del usuario avatar",
    },
    success: {
      uploaded: "Avatar subió con éxito",
      deleted: "Avatar borrado con éxito",
      nextSteps: {
        visible: "Su avatar ahora es visible en su perfil",
        update:
          "Puede actualizarlo en cualquier momento desde la configuración de su perfil",
        default: "Su perfil ahora muestra el avatar predeterminado",
        uploadNew:
          "Puede subir un nuevo avatar en cualquier momento desde la configuración de su perfil",
      },
    },
    upload: {
      title: "Subir Avatar",
      description: "Subir una imagen avatar perfil",
      groups: {
        fileUpload: {
          title: "Cargo de archivos",
          description: "Seleccione y cargue su imagen avatar",
        },
      },
      fields: {
        file: {
          label: "Imagen de Avatar",
          description: "Seleccione un archivo de imagen para su perfil avatar",
          placeholder: "Elija un archivo de imagen...",
          help: "Subir un archivo de imagen (JPG, PNG, GIF) hasta 5MB",
          validation: {
            maxSize: "El tamaño de archivo debe ser inferior a 5MB",
            imageOnly: "Sólo se admiten archivos de imagen",
            unsupportedFormat:
              "Formato de imagen sin soporte. Utilice JPEG, PNG, WebP o GIF.",
          },
        },
      },
      response: {
        title: "Subir la respuesta",
        label: "Subir Resultado",
        description: "Respuesta a la subida de Avatar",
        success: "Subir Exitoso",
        message: "Tu avatar ha sido subido con éxito",
        avatarUrl: "Avatar URL",
        uploadTime: "Tiempo de carga",
        nextSteps: {
          item: "Siguiente paso",
        },
      },
      errors: {
        validation: {
          title: "Error de validación",
          description: "El archivo subido es inválido o corrupto",
        },
        unauthorized: {
          title: "Se requiere autenticación",
          description: "Debes estar conectado para subir un avatar",
        },
        server: {
          title: "Error del servidor",
          description: "Failed to process avatar upload",
        },
        internal: {
          title: "Error interno",
          description: "Se produjo un error de servidor interno",
        },
        unknown: {
          title: "Error desconocido",
          description: "Un error inesperado ocurrió durante la subida",
        },
        network: {
          title: "Error de red",
          description: "Se produjo un error de red durante la subida",
        },
        forbidden: {
          title: "Acceso denegado",
          description: "No tienes permiso para subir un avatar",
        },
        notFound: {
          title: "No encontrado",
          description: "No se encontró el recurso solicitado",
        },
        unsaved: {
          title: "Cambios sin guardar",
          description: "Hay cambios sin salvar",
        },
        conflict: {
          title: "Conflicto",
          description: "Un conflicto ocurrió durante la subida",
        },
      },
      success: {
        title: "Avatar Uploaded",
        description: "Su perfil avatar ha sido subido con éxito",
      },
    },
    delete: {
      title: "Eliminar Avatar",
      description: "Eliminar el perfil actual avatar",
      response: {
        title: "Suprímase la respuesta",
        label: "Suprímase el resultado",
        description: "Respuesta a la eliminación de Avatar",
        success: "Eliminación exitosa",
        message: "Su avatar ha sido borrado con éxito",
        nextSteps: {
          item: "Siguiente paso",
        },
      },
      errors: {
        validation: {
          title: "Error de validación",
          description: "La solicitud de eliminación de avatar es nula",
        },
        unauthorized: {
          title: "Se requiere autenticación",
          description: "Usted debe estar conectado para eliminar su avatar",
        },
        server: {
          title: "Error del servidor",
          description: "Failed to delete avatar",
        },
        internal: {
          title: "Error interno",
          description: "Se produjo un error de servidor interno",
        },
        unknown: {
          title: "Error desconocido",
          description: "Un error inesperado ocurrió durante la eliminación",
        },
        network: {
          title: "Error de red",
          description: "Se produjo un error de red durante la eliminación",
        },
        forbidden: {
          title: "Acceso denegado",
          description: "Usted no tiene permiso para borrar este avatar",
        },
        notFound: {
          title: "No encontrado",
          description: "No se encontró el avatar para eliminar",
        },
        unsaved: {
          title: "Cambios sin guardar",
          description: "Hay cambios sin salvar",
        },
        conflict: {
          title: "Conflicto",
          description: "Se produjo un conflicto durante la eliminación",
        },
      },
      success: {
        title: "Avatar Eliminado",
        description: "Su perfil avatar ha sido eliminado con éxito",
      },
    },
  },
  password: {
    category: "Perfil de usuario",

    title: "Cambiar contraseña",
    description: "Actualice su contraseña de cuenta de forma segura",
    tag: "cambio de contraseña",
    debug: {
      updatingPassword: "Actualizar contraseña",
      errorUpdatingPassword: "Actualización de contraseña",
      settingPassword: "Configuración de contraseña",
      errorSettingPassword: "Configuración de errores",
    },
    groups: {
      currentCredentials: {
        title: "Contraseña actual",
        description: "Verifique su contraseña actual para proceder",
      },
      newCredentials: {
        title: "Nueva contraseña",
        description: "Elige una nueva contraseña fuerte para tu cuenta",
      },
    },
    currentPassword: {
      label: "Contraseña actual",
      description: "Introduzca su contraseña actual",
      placeholder: "Introduzca la contraseña actual",
      help: "Introduzca su contraseña actual para verificar su identidad antes de cambiarla",
    },
    newPassword: {
      label: "Nueva contraseña",
      description: "Introduzca su nueva contraseña (mínimo 8 caracteres)",
      placeholder: "Ingrese nueva contraseña",
      help: "Elija una contraseña fuerte con al menos 8 caracteres incluyendo letras, números y símbolos",
    },
    confirmPassword: {
      label: "Confirmar contraseña",
      description: "Confirme su nueva contraseña",
      placeholder: "Confirme nueva contraseña",
      help: "Reintroducir su nueva contraseña para asegurarse de que fue escrito correctamente",
    },
    twoFactorCode: {
      label: "Código de dos factores",
      description:
        "Introduzca su código de autenticación de dos factores si está habilitado",
      placeholder: "Ingrese el código 2FA",
    },
    response: {
      title: "Respuesta del cambio de contraseña",
      description: "Respuesta a la operación de cambio de contraseña",
      success: "Password Changed",
      message: "Mensaje de Estado",
      securityTip: "Tip de seguridad",
      nextSteps: {
        item: "Siguientes pasos",
      },
    },
    validation: {
      currentPassword: {
        minLength: "La contraseña actual debe ser por lo menos 8 caracteres",
      },
      newPassword: {
        minLength: "Nueva contraseña debe ser por lo menos 8 caracteres",
      },
      confirmPassword: {
        minLength:
          "La confirmación de la contraseña debe ser por lo menos 8 caracteres",
      },
      passwords: {
        mismatch: "Las contraseñas no coinciden",
      },
    },
    errors: {
      passwords_do_not_match: "Las contraseñas no coinciden",
      user_not_found: "Usuario no encontrado",
      incorrect_password: "Contraseña incorrecta",
      update_failed: "No actualizado la contraseña",
      token_creation_failed: "Fallado para crear ficha de contraseña",
      two_factor_code_required:
        "Código de autenticación de dos factores requerido",
      invalid_two_factor_code:
        "Código de autenticación inválido de dos factores",
      invalid_request: {
        title: "Solicitud inválida",
        description: "La solicitud de cambio de contraseña es nula",
      },
      validation: {
        title: "Error de validación",
        description: "Por favor, compruebe su entrada e inténtelo de nuevo",
      },
      unauthorized: {
        title: "Se requiere autenticación",
        description: "Debes iniciar sesión para cambiar tu contraseña",
      },
      server: {
        title: "Error del servidor",
        description:
          "Fallado para actualizar la contraseña debido al error del servidor",
      },
      unknown: {
        title: "Error desconocido",
        description:
          "Se produjo un error inesperado al actualizar la contraseña",
      },
      network: {
        title: "Error de red",
        description: "La conexión de red falló",
      },
      forbidden: {
        title: "Access Forbidden",
        description: "Usted no tiene permiso para realizar esta acción",
      },
      notFound: {
        title: "Usuario No encontrado",
        description: "No se pudo encontrar la cuenta de usuario",
      },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Tienes cambios sin salvar que se perderán",
      },
      conflict: {
        title: "Conflicto de datos",
        description: "Se produjo un conflicto al actualizar la contraseña",
      },
    },
    success: {
      updated: "Contraseña actualizada con éxito",
      securityTip:
        "Para mejorar la seguridad, permita la autenticación de dos factores",
      nextSteps: {
        logoutOther:
          "Todas las demás sesiones han sido registradas para la seguridad",
        enable2fa:
          "Considere la posibilidad de habilitar la autenticación de dos factores para una mejor seguridad",
      },
      title: "Contraseña Actualizada",
      description: "Su contraseña ha sido actualizada con éxito",
    },
    update: {
      success: {
        title: "Contraseña Actualizada",
        description: "Su contraseña ha sido actualizada con éxito",
      },
      errors: {
        unknown: {
          title: "Error desconocido",
          description:
            "Se produjo un error inesperado al actualizar la contraseña",
        },
      },
    },
  },
  addresses: {
    category: "Direcciones de usuario",
    tag: "direcciones",

    list: {
      title: "Mis discursos",
      description: "Lista tus direcciones guardadas",
      response: {
        addresses: "Direcciones",
      },
      widget: {
        addAddress: "Agregar dirección",
        edit: "Editar",
        delete: "Eliminar",
        billing: "Facturación",
        delivery: "Entrega",
        empty: "Sin direcciones guardadas",
      },
      errors: {
        validation: {
          title: "Error de validación",
          description: "Solicitud inválida",
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
          description: "No hay direcciones encontradas",
        },
        conflict: { title: "Conflicto", description: "Conflicto de datos" },
        network: {
          title: "Error de red",
          description: "Ocurrió un error de red",
        },
        unsavedChanges: {
          title: "Cambios sin guardar",
          description: "Hay cambios sin salvar",
        },
        internal: {
          title: "Error del servidor",
          description: "Error del servidor interno",
        },
        unknown: {
          title: "Error desconocido",
          description: "Ocurrió un error desconocido",
        },
      },
      success: {
        title: "Operación completada",
        description: "Direcciones recuperadas",
      },
    },

    create: {
      title: "Agregar dirección",
      description: "Guardar una nueva dirección en su cuenta",
      fields: {
        label: {
          label: "Label",
          description: "Nombre esta dirección (por ejemplo. Home, Office)",
          placeholder: "Home",
        },
        fullName: {
          label: "Nombre completo",
          description: "Nombre de contacto para esta dirección",
          placeholder: "Jane Doe",
        },
        company: {
          label: "Company",
          description: "Nombre de la empresa (opcional)",
          placeholder: "Acme Corp",
        },
        phone: {
          label: "Teléfono",
          description: "Número de teléfono",
          placeholder: "+1 555 000 0000",
        },
        vatNumber: {
          label: "Número de VAT",
          description: "Número de registro EU VAT",
          placeholder: "DE123456789",
        },
        taxId: {
          label: "Impuesto ID",
          description: "Identificador de impuestos nacionales",
          placeholder: "123-45-6789",
        },
        addressLine1: {
          label: "Línea de dirección 1",
          description: "Calle y número",
          placeholder: "123 Main St",
        },
        addressLine2: {
          label: "Línea de dirección 2",
          description: "Apartamento, suite, unidad (opcional)",
          placeholder: "Suite 4B",
        },
        city: { label: "Ciudad", description: "Ciudad", placeholder: "Berlín" },
        region: {
          label: "Estado/región",
          description: "Estado o región (opcional)",
          placeholder: "Bayern",
        },
        postalCode: {
          label: "Código postal",
          description: "ZIP o postal",
          placeholder: "10115",
        },
        country: {
          label: "País",
          description: "ISO 3166 -1 código de país alfa-2",
          placeholder: "DE",
        },
        isDefaultBilling: {
          label: "Facturación por defecto",
          description: "Utilice como dirección de facturación predeterminada",
        },
        isDefaultDelivery: {
          label: "Entrega por defecto",
          description: "Utilice como dirección de entrega predeterminada",
        },
      },
      response: {
        id: "Dirección ID",
        label: "Label",
      },
      errors: {
        validation: {
          title: "Error de validación",
          description: "Comprobación de campos necesarios",
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
          description: "Usuario no encontrado",
        },
        conflict: { title: "Conflicto", description: "Conflicto de datos" },
        network: {
          title: "Error de red",
          description: "Ocurrió un error de red",
        },
        unsavedChanges: {
          title: "Cambios sin guardar",
          description: "Hay cambios sin salvar",
        },
        internal: {
          title: "Error del servidor",
          description: "Error del servidor interno",
        },
        unknown: {
          title: "Error desconocido",
          description: "Ocurrió un error desconocido",
        },
      },
      success: {
        title: "Address Saved",
        description: "Dirección añadida a su cuenta",
      },
      widget: {
        saved: "Dirección salvada.",
        backToAddresses: "Volver a direcciones",
      },
    },
  },
  emailChange: {
    subject: "Confirma tu nuevo correo para {{appName}}",
    title: "Confirma tu nuevo correo",
    previewText: "Con un clic, {{appName}} empieza a usar esta dirección.",
    greeting: "Hola, {{name}}:",
    body: "Pediste usar esta dirección para iniciar sesión en {{appName}}. Usa el botón de abajo para confirmar. Hasta entonces, tu cuenta seguirá usando {{current}}.",
    button: "Confirmar nuevo correo",
    expiry:
      "El enlace es válido por {{days}} días. Si no pediste el cambio, ignora este correo y tu dirección seguirá siendo la misma.",
    signoff: "El equipo de {{appName}}",
    errors: {
      failed: "No podía construir el correo electrónico de confirmación.",
    },
    template: {
      name: "Confirmación de cambio de correo",
      description:
        "Se envía a la nueva dirección cuando un usuario cambia su correo",
      category: "Cuenta",
    },
  },
};
