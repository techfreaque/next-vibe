import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Usuarios",
  auth: {
    category: "Autenticación",
    search: {
      tag: "Auth",
    },
    authClient: {
      errors: {
        status_save_failed: "Fallado para salvar el estado de autenticación",
        status_remove_failed:
          "Fallado para eliminar el estado de autenticación",
        status_check_failed:
          "Fallado para comprobar el estado de autenticación",
        token_save_failed: "Fallado para salvar el token de autenticación",
        token_get_failed: "Fallado para recuperar ficha de autenticación",
        token_remove_failed: "Fallado para eliminar el token de autenticación",
      },
    },
    debug: {
      getAuthMinimalUserNext: {
        start: "getAuthMinimalUserNext : - Revisando la autenticación primero",
        result: "getAuthMinimalUserNext : Resultado de getCurrentUserNext",
        authenticated:
          "getAuthMinimalUserNext : El usuario es autenticado, obteniendo leadId",
        returningAuth: "getAuthMinimalUserNext : Devolver usuario autenticado",
        notAuthenticated:
          "getAuthMinimalUserNext : Usuario no autenticado, usuario público que regresa",
      },
      signingJwt: "Firmando JWT",
      jwtSignedSuccessfully: "JWT firmó con éxito",
      errorSigningJwt: "Firma de error JWT",
      verifyingJwt: "Verificar JWT",
      invalidTokenPayload: "Carga de pago con token inválida",
      jwtVerifiedSuccessfully: "JWT verificado con éxito",
      errorVerifyingJwt: "Verificación de errores JWT",
      userIdNotExistsInDb: "El usuario ID no existe en la base de datos",
      sessionNotFound: "Período de sesiones no encontrado",
      sessionExpired: "Período de sesiones expirado",
      errorValidatingUserSession: "Sesion de usuario validada por error",
      errorGettingUserRoles: "Error obteniendo roles de usuario",
      errorCheckingUserAuth:
        "Verificación de errores de autenticación del usuario",
      authenticatingCliUserWithPayload:
        "Authenticating CLI usuario con carga útil",
      errorAuthenticatingCliUserWithPayload:
        "autenticador de errores CLI usuario con carga útil",
      creatingCliToken: "Creación de token CLI",
      errorCreatingCliToken: "Error creando token CLI",
      validatingCliToken: "Validación de token CLI",
      errorValidatingCliToken: "Error de validación CLI token",
      gettingCurrentUserFromNextjs: "Obtener el usuario actual de Next.js",
      errorGettingAuthUserForNextjs:
        "Error obteniendo el usuario de auth para Next.js",
      settingNextjsAuthCookies: "Configuración Siguiente.js auth cookies",
      clearingNextjsAuthCookies: "Clearing Next.js auth cookies",
      gettingCurrentUserFromToken: "Obtener el usuario actual de token",
      errorGettingCurrentUserFromCli:
        "Error obteniendo el usuario actual de CLI",
      errorGettingAuthUserForCli:
        "Error de obtener el usuario de auth para CLI",
      errorGettingUserRolesForCli: "Error obteniendo roles de usuario para CLI",
      tokenFromAuthHeader: "Token from auth header",
      tokenFromCookie: "Token de cookie",
      noTokenFound: "No hay token encontrada",
      errorExtractingToken: "Extracción de errores token",
      errorParsingCookies: "Errores que analizan las cookies",
    },
    errors: {
      token_generation_failed: "Fallado para generar la autenticación token",
      invalid_session: "El período de sesiones es nulo o expirado",
      missing_request_context: "Falta el contexto de solicitud",
      missing_locale: "Locale no está bajo petición",
      unsupported_platform: "La plataforma no está respaldada",
      session_retrieval_failed: "Fallado para recuperar la sesión",
      missing_token: "Authentication token está desaparecido",
      invalid_token_signature: "La firma token es nula",
      jwt_payload_missing_id: "JWT payload is missing user ID",
      cookie_set_failed: "Fallado para establecer la cookie de autenticación",
      cookie_clear_failed: "No se puede limpiar la cookie de autenticación",
      publicPayloadNotSupported:
        "La carga de pago JWT pública no es compatible con la autenticación CLI",
      jwt_signing_failed: "Fallado para firmar el token JWT",
      authentication_failed: "Falló la autenticación",
      user_not_authenticated: "El usuario no es autenticado",
      publicUserNotAllowed:
        "El usuario público no está permitido para este punto final",
      validation_failed: "Falló la validación",
      failed_to_create_lead: "Failed to create lead",
      native: {
        unsupported:
          "Este método de autenticación no es compatible con React Native",
        storage_failed: "No almacenar datos de autenticación",
        clear_failed: "No se puede limpiar los datos de autenticación",
      },
      not_implemented_native:
        "Esta característica todavía no se implementa para React Native",
      unknownError: "Un error desconocido ocurrió durante la autenticación",
    },
    post: {
      title: "Auth",
      description: "Auth endpoint",
      form: {
        title: "Configuración de Auth",
        description: "Configurar parámetros de austeridad",
      },
      response: {
        title: "Respuesta",
        description: "Datos de respuesta de Auth",
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
        missing_locale: {
          title: "Missing Locale",
          description: "Parámetro local es necesario",
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
        token_generation_failed: {
          title: "Token Generation Failed",
          description: "Fallado para generar la autenticación token",
        },
        invalid_session: {
          title: "Período de sesiones inválido",
          description: "El período de sesiones es nulo o expirado",
        },
        missing_request_context: {
          title: "Solicitud de desaparición Contexto",
          description: "Falta el contexto de solicitud",
        },
        unsupported_platform: {
          title: "Plataforma no apoyada",
          description: "La plataforma no está respaldada",
        },
        session_retrieval_failed: {
          title: "Sesión de recuperación fracasada",
          description: "Fallado para recuperar la sesión",
        },
        missing_token: {
          title: "Perdido Token",
          description: "Authentication token está desaparecido",
        },
        invalid_token_signature: {
          title: "Inválido Token Signature",
          description: "La firma token es nula",
        },
        jwt_payload_missing_id: {
          title: "JWT Payload Missing ID",
          description: "JWT payload is missing user ID",
        },
        cookie_set_failed: {
          title: "Juego de cookies Failed",
          description: "Fallado para establecer la cookie de autenticación",
        },
        cookie_clear_failed: {
          title: "Cookie Clear Failed",
          description: "No se puede limpiar la cookie de autenticación",
        },
      },
      success: {
        title: "Operación completada",
        description: "La operación se completó correctamente",
      },
    },
    check: {
      get: {
        title: "Revisar Authentication",
        description: "Compruebe el estado de autenticación actual",
        response: {
          title: "Estado de autenticación",
          description: "Estado de autenticación actual",
          authenticated: "Authenticated",
          tokenValid: "Token Valid",
        },
      },
    },
    enums: {
      webSocketErrorCode: {
        unauthorized: "Se requiere autenticación",
        forbidden: "Acceso denegado",
        invalidToken: "Token inválido",
        tokenExpired: "Token Expired",
        serverError: "Error del servidor",
      },
    },
  },
  private: {
    logout: {
      title: "User Logout",
      description: "Lograr que el usuario actual e invalide su sesión",
      category: "Gestión de usuarios",
      tag: "logout",
      logoutButton: "Cerrar sesión",
      loggingOut: "Saliendo de aquí...",
      response: {
        title: "Respuesta de la sesión",
        description: "Response indicating successful logout",
        success: "Operación completada",
        message: "Mensaje",
        sessionsCleaned: "Sesiones limpiadas",
        nextSteps: "Próximos pasos recomendados después del logout",
      },
      errors: {
        validation: {
          title: "Error de validación",
          description: "La solicitud del logotipo contiene datos inválidos",
        },
        unauthorized: {
          title: "Se requiere autenticación",
          description: "Debe estar conectado a la página web",
        },
        internal: {
          title: "Error de servidor interno",
          description: "Se produjo un error interno mientras se registra",
        },
        unknown: {
          title: "Error desconocido",
          description: "Un error inesperado ocurrió durante el logout",
        },
        session_deletion_failed: {
          title: "Eliminación de la sesión fracasada",
          description: "No se ha eliminado la sesión de usuario",
        },
        conflict: {
          title: "Conflicto de fugas",
          description: "Un conflicto ocurrió durante el logout",
        },
        forbidden: {
          title: "Acceso denegado",
          description: "La acción de registro está prohibida",
        },
        network_error: {
          title: "Error de red",
          description: "Error de red durante el logout",
        },
        not_found: {
          title: "No encontrado",
          description: "Período de sesiones no encontrado",
        },
        server_error: {
          title: "Error del servidor",
          description: "Error del servidor interno durante el logout",
        },
        unsaved_changes: {
          title: "Cambios sin guardar",
          description: "Hay cambios sin salvar",
        },
        invalid_user: {
          title: "Usuario inválido",
          description: "El usuario no es válido o no existe",
        },
      },
      success: {
        title: "Logout Successfulful",
        description: "Usted ha sido identificado con éxito",
        message: "Usuario conectado con éxito",
      },
    },
    me: {
      // Main user profile routes
      get: {
        title: "Obtener perfil de usuario",
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
            description: "Su dirección de correo electrónico",
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
            description:
              "Su perfil personalizado - aparece en su enlace público",
            placeholder: "jane-doe",
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
          },
          unknown: {
            title: "Error desconocido",
            description: "Ocurrió un error desconocido",
          },
        },
        success: {
          title: "Operación completada",
          description: "Perfil actualizado con éxito",
          nextSteps:
            "Próximos pasos recomendados después de actualizar su perfil",
        },
      },
      delete: {
        title: "Eliminar la Cuenta de Usuario",
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
        save: "Guardar el perfil",
        saving: "Salvando...",
        editProfile: "Editar el perfil",
        cancelEdit: "Cancelar",
        memberSince: "Miembro desde",
        profileCard: {
          title: "Perfil de Creador",
          description: "Su identidad pública en toda la plataforma",
        },
        socialCard: {
          title: "Enlaces sociales",
          description: "Conecta tus plataformas",
        },
        emailCard: {
          title: "Su lista de correo electrónico",
          description:
            "Los visitantes en su página de habilidad y perfil creador pueden suscribirse. Usted posee la lista - ninguna plataforma en el medio.",
        },
        previewCard: {
          title: "Su perfil público",
          description: "¿Cómo te ven otros?",
        },
        noPreview: "Rellene su perfil para ver una vista previa",
        noSocials: "Aún no se han añadido vínculos sociales",
        viewPublicProfile: "Ver perfil público",
        profileUrl: "Tu enlace",
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
        },
        deleteAccount: {
          dangerZone: "Zona peligrosa",
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
              description:
                "Seleccione un archivo de imagen para su perfil avatar",
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
            minLength:
              "La contraseña actual debe ser por lo menos 8 caracteres",
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
            city: {
              label: "Ciudad",
              description: "Ciudad",
              placeholder: "Berlín",
            },
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
              description:
                "Utilice como dirección de facturación predeterminada",
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
    },
    session: {
      enums: {
        sessionErrorReason: {
          noTokenInCookies: "No hay ningún token en las cookies",
        },
      },
      errors: {
        session_not_found: "Período de sesiones no encontrado",
        session_lookup_failed: "Failed to lookup session",
        expired_sessions_delete_failed:
          "No se pudieron eliminar las sesiones vencidas",
        session_creation_failed: "Failed to create session",
        session_creation_database_error:
          "Error de base de datos al crear sesión",
        user_sessions_delete_failed: "Failed to delete user sessions",
        expired: "El período de sesiones ha expirado",
      },
      post: {
        title: "Sesión",
        description: "Endpoint de sesión",
        form: {
          title: "Configuración de la sesión",
          description: "Configura los parámetros de la sesión",
        },
        response: {
          title: "Respuesta",
          description: "Datos de respuesta de la sesión",
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
    },
    sessions: {
      category: "Usuarios",

      list: {
        title: "Mis sesiones",
        description: "Listar todas las sesiones activas para su cuenta",
        tag: "Sesiones",
        response: {
          sessions: "Sesiones",
        },
        success: {
          title: "Sesiones recuperadas",
          description: "Sus sesiones activas han sido recuperadas",
        },
        errors: {
          unauthorized: {
            title: "Se requiere autenticación",
            description: "Inicia sesión para continuar",
          },
          validation: {
            title: "Error de validación",
            description: "Solicitud inválida",
          },
          server: {
            title: "Error del servidor",
            description: "Error del servidor interno",
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
          conflict: { title: "Conflicto", description: "Conflicto de datos" },
        },
      },
      create: {
        title: "Crear token de sesión",
        description: "Crear una señal de sesión para el acceso programático",
        tag: "Sesiones",
        form: {
          name: "Nombre del token",
          namePlaceholder: "Por ejemplo. Mi agente bot",
        },
        response: {
          token: "Token",
          id: "Período de sesiones ID",
          name: "Nombre",
          message: "Copia el token ahora. No volverá a mostrarse.",
        },
        success: {
          title: "Período de sesiones creado",
          description: "Tu token de sesión ha sido creado",
        },
        errors: {
          unauthorized: {
            title: "Se requiere autenticación",
            description: "Inicia sesión para continuar",
          },
          validation: {
            title: "Error de validación",
            description: "Solicitud inválida",
          },
          server: {
            title: "Error del servidor",
            description: "Error del servidor interno",
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
          conflict: { title: "Conflicto", description: "Conflicto de datos" },
        },
      },
      revoke: {
        title: "Sesión de revocación",
        description: "Revoque una sesión token por ID",
        tag: "Sesiones",
        response: {
          message: "Período de sesiones revocado",
        },
        success: {
          title: "Período de sesiones revocado",
          description: "El período de sesiones ha sido revocado",
        },
        errors: {
          unauthorized: {
            title: "Se requiere autenticación",
            description: "Inicia sesión para continuar",
          },
          validation: {
            title: "Error de validación",
            description: "Solicitud inválida",
          },
          server: {
            title: "Error del servidor",
            description: "Error del servidor interno",
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
            description: "Período de sesiones no encontrado",
          },
          conflict: { title: "Conflicto", description: "Conflicto de datos" },
        },
      },
    },
  },
  public: {
    login: {
      category: "Usuarios",
      title: "Bienvenido.",
      description:
        "Acceda a modelos AI sin censura y su historia de conversación.",
      tag: "Autenticación",
      options: {
        category: "Usuarios",

        title: "Opciones de acceso",
        description: "Opciones de configuración",
        tag: "inicio de sesión-opciones",
        container: {
          title: "Configuración de inicio",
          description: "Configurar la configuración y las opciones de login",
        },
        fields: {
          email: {
            label: "Dirección de correo electrónico",
            description: "Introduzca su dirección de correo electrónico",
            placeholder: "your@email.com",
          },
          allowPasswordAuth: {
            label: "Permitir autenticación de contraseña",
            description: "Permitir la autentificación basada en contraseña",
          },
          allowSocialAuth: {
            label: "Permitir la autenticación social",
            description: "Activar la autenticación del proveedor social",
          },
          maxAttempts: {
            label: "Maximum Login Attempts",
            description:
              "Número máximo de intentos de inicio de sesión permitido",
          },
          requireTwoFactor: {
            label: "Requiere Autenticación de dos factores",
            description: "Consultar 2FA para el login del usuario",
          },
          socialProviders: {
            label: "Proveedores sociales",
            description: "Proveedores de autenticación social disponibles",
          },
          socialProvider: {
            title: "Proveedor social",
            description: "Configuración del proveedor de autenticación social",
            enabled: {
              label: "Enabled",
              description: "Si este proveedor está habilitado",
            },
            name: {
              label: "Nombre del proveedor",
              description: "Nombre del proveedor social",
            },
            providers: {
              label: "Opciones de proveedor",
              description: "Opciones de proveedores sociales disponibles",
            },
          },
        },
        response: {
          title: "Iniciar sesión Respuesta de opciones",
          description: "Opciones de configuración de acceso disponibles",
          success: {
            badge: "Operación completada",
          },
          message: {
            content: "Mensaje de Estado",
          },
          forUser: {
            content: "Dirección de correo electrónico",
          },
          loginMethods: {
            title: "Métodos de inicio de sesión",
            description: "Métodos de autenticación disponibles",
            password: {
              title: "Contraseña",
              description: "autenticación de contraseña estándar",
              enabled: {
                badge: "Enabled",
              },
            },
            social: {
              title: "Social Login",
              description: "Opciones de autenticación de redes sociales",
              enabled: {
                badge: "Enabled",
              },
              providers: {
                item: {
                  title: "Proveedor social",
                  description: "Proveedor de autenticación social",
                },
                name: {
                  content: "Nombre del proveedor",
                },
                id: {
                  content: "Proveedor ID",
                },
                enabled: {
                  badge: "Disponible",
                },
                description: "Proveedor Descripción",
              },
            },
          },
          security: {
            title: "Ajustes de seguridad",
            description: "Necesidades de seguridad de autenticación",
            maxAttempts: {
              content: "Maximum Login Attempts",
            },
            requireTwoFactor: {
              badge: "2FA requerida",
            },
          },
          recommendations: {
            item: "Opción de inicio de sesión recomendada",
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
          unsavedChanges: {
            title: "Cambios sin guardar",
            description: "Los cambios no se salvaron",
          },
        },
        success: {
          title: "Operación completada",
          description: "Opciones de acceso recuperadas con éxito",
        },
        post: {
          title: "Opciones de acceso",
          description: "Obtenga opciones de acceso disponibles",
          response: {
            title: "Iniciar sesión Respuesta de opciones",
            description: "Opciones de configuración de acceso disponibles",
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
            server: {
              title: "Error del servidor",
              description: "Ocurrió un error interno del servidor",
            },
            unknown: {
              title: "Error desconocido",
              description: "Ocurrió un error desconocido",
            },
          },
          success: {
            description: "Opciones de acceso recuperadas con éxito",
          },
        },
        enums: {
          socialProviders: {
            google: "Google",
            github: "GitHub",
            facebook: "Facebook",
          },
        },
        messages: {
          successMessage: "Opciones de acceso recuperadas con éxito",
          passwordAuthDescription:
            "Inicia sesión con tu correo electrónico y contraseña",
          socialAuthDescription:
            "Inicie sesión con sus cuentas de redes sociales",
          continueWithProvider: "Continuar con {{provider}}",
          twoFactorRequired: "Mayor seguridad: 2FA requerida",
          standardSecurity: "Necesidades de seguridad estándar",
          tryPasswordFirst: "Pruebe la contraseña primero",
          useSocialLogin: "Usar acceso social",
          socialLoginFaster: "Acceso social es más rápido para nuevos usuarios",
        },
      },
      actions: {
        submit: "Iniciar sesión",
        submitting: "Inicie sesión...",
      },
      fields: {
        email: {
          label: "Su correo electrónico",
          description: "El correo electrónico con el que se inscribió.",
          placeholder: "Ingresa tu correo",
          validation: {
            required: "El correo electrónico es necesario",
            invalid:
              "Por favor, introduzca una dirección de correo electrónico válida",
          },
        },
        password: {
          label: "Su contraseña",
          description:
            "Introduzca la contraseña que establezca durante el registro.",
          placeholder: "Introduzca su contraseña",
          help: "Introduzca su contraseña de cuenta",
          validation: {
            required: "Se requiere contraseña",
            minLength:
              "La contraseña debe tener al menos 8 caracteres de largo",
          },
        },
        rememberMe: {
          label: "Mantenme conectado.",
        },
      },
      groups: {
        credentials: {
          title: "Login Credenciales",
          description: "Introduzca su información de inicio de sesión",
        },
        options: {
          title: "Opciones de acceso",
          description: "Preferencias y ajustes adicionales de login",
        },
        preferences: {
          title: "Preferencias",
          description: "Opciones de acceso adicionales",
        },
        advanced: {
          title: "Opciones avanzadas",
          description: "Ajustes de acceso avanzados",
        },
      },
      footer: {
        forgotPassword: "¿Olvidaste tu contraseña?",
        createAccount: "¿No tienes cuenta? Regístrate",
      },
      response: {
        title: "Iniciar sesión Respuesta",
        description: "Datos de respuesta",
        success: "Iniciaste sesión",
        message: "Mensaje de Estado",
        user: {
          title: "Detalles del usuario",
          description: "Logged en información de usuario",
          id: "Usuario ID",
          email: "Dirección de correo electrónico",
          firstName: "Nombre",
          lastName: "Apellido",
          privateName: "Nombre privado",
          publicName: "Nombre público",
          imageUrl: "Imagen del perfil",
        },
        sessionInfo: {
          title: "Sesión de información",
          description: "Detalles de la sesión de usuario",
          expiresAt: "Vencimiento de la sesión",
          rememberMeActive: "Estado de la opción para mantener la sesión",
          loginLocation: "Ubicación del inicio de sesión",
        },
        nextSteps: {
          title: "Siguientes pasos",
          item: "Siguientes pasos",
        },
      },
      errors: {
        title: "Iniciar sesión Error",
        account_locked: "Cuenta bloqueada",
        accountLocked: "Cuenta bloqueada",
        accountLockedDescription:
          "Tu cuenta está bloqueada. Contacta a soporte.",
        invalid_credentials: "Correo electrónico o contraseña inválido",
        two_factor_required: "Se requiere autenticación de dos factores",
        auth_error: "Error de autenticación ocurrido",
        user_not_found: "Usuario no encontrado",
        session_creation_failed: "Failed to create session",
        token_save_failed: "Fallado para salvar el token de autenticación",
        validation: {
          title: "Validación fallida",
          description: "Por favor, compruebe su entrada",
        },
        unauthorized: {
          title: "No pudimos iniciar sesión",
          description: "Credenciales inválidos",
        },
        unknown: {
          title: "Iniciar sesión Error",
          description: "Se produjo un error durante la sesión",
        },
        network: {
          title: "Error de red",
          description: "La conexión falló",
        },
        forbidden: {
          title: "Acceso denegado",
          description: "No se permite el acceso",
        },
        notFound: {
          title: "Usuario No encontrado",
          description: "Cuenta de usuario no encontrada",
        },
        unsaved: {
          title: "Cambios sin guardar",
          description: "Los cambios no se salvaron",
        },
        conflict: {
          title: "Conflicto",
          description: "Ingreso detectado",
        },
        server: {
          title: "Error del servidor",
          description: "Ocurrió un error interno del servidor",
        },
      },
      success: {
        title: "Iniciaste sesión",
        description: "Has estado conectado.",
        message: "¡Bienvenido! Has entrado con éxito.",
      },
      token: {
        save: {
          failed: "Fallado para salvar el token de autenticación",
          success: "Authentication token guardado con éxito",
        },
      },
      process: {
        failed: "El proceso de inicio de sesión falló",
      },
      enums: {
        socialProviders: {
          google: "Google",
          github: "GitHub",
          facebook: "Facebook",
        },
      },
      dev: {
        quickLogin: "Dev Quick Login",
      },
    },
    resetPassword: {
      confirm: {
        category: "Usuarios",

        title: "Confirma el cambio de contraseña",
        description:
          "Confirme el restablecimiento de su contraseña con una nueva contraseña",
        tag: "Restablecimiento de contraseña",
        email: {
          title: "Contraseña restablecida",
          subject: "Contraseña restablecida en {{appName}}",
          previewText:
            "Restableciste tu contraseña de {{appName}}. Inicia sesión para chatear con {{modelCount}} modelos de IA.",
          greeting: "Hola, {{name}}:",
          successMessage:
            "Ya puedes iniciar sesión con tu nueva contraseña y seguir donde lo dejaste.",
          loginButton: "Iniciar sesión en {{appName}}",
          promoText: "{{modelCount}} modelos de IA. Sin filtros. Sin sermones.",
          securityWarning:
            "¿No pediste cambiar tu contraseña? Contacta a soporte de inmediato. Tu cuenta podría estar en riesgo.",
        },
        groups: {
          verification: {
            title: "Verificación",
            description:
              "Verifique su solicitud de restablecimiento de contraseña",
          },
          newPassword: {
            title: "Nueva contraseña",
            description: "Configura tu nueva contraseña",
          },
        },
        fields: {
          token: {
            label: "Reset Token",
            description:
              "El token de la contraseña se reinicia desde su correo electrónico",
            placeholder: "Introducir reinicio token",
            help: "Compruebe su correo electrónico para la contraseña reiniciar ficha e ingrese aquí",
            validation: {
              required: "Reiniciar ficha es necesario",
            },
          },
          email: {
            label: "Dirección de correo electrónico",
            description: "Su dirección de correo electrónico",
            placeholder: "Introduzca su dirección de correo electrónico",
            validation: {
              invalid:
                "Por favor, introduzca una dirección de correo electrónico válida",
            },
          },
          password: {
            label: "Nueva contraseña",
            description: "Su nueva contraseña",
            placeholder: "Ingrese nueva contraseña",
            help: "Elija una contraseña fuerte con al menos 8 caracteres incluyendo letras, números y símbolos",
            validation: {
              minLength:
                "La contraseña debe tener al menos 8 caracteres de largo",
            },
          },
          confirmPassword: {
            label: "Confirmar contraseña",
            description: "Confirme su nueva contraseña",
            placeholder: "Confirme nueva contraseña",
            validation: {
              minLength:
                "La contraseña debe tener al menos 8 caracteres de largo",
            },
          },
        },
        validation: {
          passwords: {
            mismatch: "Las contraseñas no coinciden",
          },
        },
        response: {
          title: "Respuesta del restablecimiento de contraseñas",
          description: "Contraseña reajuste de confirmación respuesta",
          message: {
            label: "Mensaje",
            description: "Mensaje de respuesta",
          },
          securityTip:
            "Considere la posibilidad de habilitar la autenticación de dos factores para una mejor seguridad",
          nextSteps: [
            "Inicia sesión con tu nueva contraseña",
            "Actualizar contraseñas guardadas en su navegador",
            "Considerar la posibilidad de habilitar 2FA para una mayor seguridad",
          ],
        },
        errors: {
          title: "Error de reiniciamiento de contraseña",
          no_email:
            "No se encontró ninguna cuenta con esa dirección de correo electrónico",
          validation: {
            title: "Error de validación",
            description: "Por favor, compruebe su entrada e inténtelo de nuevo",
            passwordsDoNotMatch: "Las contraseñas no coinciden",
          },
          unauthorized: {
            title: "Se requiere autenticación",
            description: "Token de reajuste inválido o vencido",
          },
          internal: {
            title: "Error del servidor",
            description: "Se produjo un error de servidor interno",
          },
          unknown: {
            title: "Error desconocido",
            description: "Ocurrió un error desconocido",
          },
          network: {
            title: "Error de red",
            description: "Error de conexión de red",
          },
          forbidden: {
            title: "Acceso denegado",
            description: "Usted no tiene permiso para realizar esta acción",
          },
          notFound: {
            title: "No encontrado",
            description: "Reiniciar la ficha no encontrada o caducada",
          },
          unsaved: {
            title: "Cambios sin guardar",
            description: "Hay cambios sin salvar",
          },
          conflict: {
            title: "Conflicto",
            description: "Un conflicto ocurrió mientras procesaba su solicitud",
          },
        },
        success: {
          title: "Contraseña restablecida",
          description: "Su contraseña ha sido restaurada con éxito",
          message: "La contraseña se ha restaurado con éxito",
          password_reset: "Su contraseña ha sido restaurada con éxito",
        },
        actions: {
          requestNewLink: "Solicitar un nuevo vínculo de reiniciamiento",
        },
        emailTemplates: {
          confirm: {
            name: "Correo de confirmación de cambio de contraseña",
            description:
              "Correo electrónico enviado a los usuarios después de que su contraseña se haya restaurado con éxito",
            category: "Autenticación",
            preview: {
              publicName: {
                label: "Nombre público",
                description: "Nombre de la pantalla pública del usuario",
              },
              userId: {
                label: "Usuario ID",
                description: "El identificador único del usuario",
              },
            },
          },
        },
      },
      request: {
        category: "Usuarios",
        title: "Reset Password Request",
        description: "Solicitar contraseña reset",
        tag: "Restablecimiento de contraseña",
        ui: {
          title: "Restablecer su contraseña",
          subtitle:
            "Introduzca su dirección de correo electrónico y le enviaremos un enlace para restablecer su contraseña",
          sendResetLink: "Enviar enlace de reiniciamiento",
          alreadyHaveAccount: "¿Ya tienes una cuenta? Inicia sesión",
        },
        actions: {
          submitting: "Enviando…",
        },
        email: {
          title: "Restablece tu contraseña de {{appName}}",
          subject: "Solicitud para restablecer tu contraseña de {{appName}}",
          previewText:
            "Restablece tu contraseña de {{appName}}. El enlace es válido por {{hours}} horas.",
          greeting: "Hola, {{name}}:",
          requestInfo:
            "Recibimos una solicitud para restablecer la contraseña de tu cuenta de {{appName}}. Si la enviaste tú, usa el botón de abajo.",
          buttonText: "Restablecer mi contraseña",
          expirationInfo:
            "El enlace vence en {{hours}} horas. Si no hiciste la solicitud, ignora este correo. Tu contraseña sigue siendo la misma.",
          signoff: "El equipo de {{appName}}",
          promoText: "{{modelCount}} modelos de IA. Sin filtros. Sin sermones.",
        },
        groups: {
          emailInput: {
            title: "Entrada por correo electrónico",
            description:
              "Introduzca su dirección de correo electrónico para recibir instrucciones de reseteo",
          },
        },
        fields: {
          email: {
            label: "Dirección de correo electrónico",
            description: "Introduzca su dirección de correo electrónico",
            placeholder: "your@email.com",
            help: "Introduzca la dirección de correo electrónico asociada a su cuenta",
            validation: {
              invalid:
                "Por favor, introduzca una dirección de correo electrónico válida",
            },
          },
        },
        response: {
          title: "Reiniciar solicitud de respuesta",
          description: "Respuesta de solicitud de reajuste de contraseña",
          success: {
            message: "Enlace de restablecimiento enviado",
          },
          deliveryInfo: {
            estimatedTime: "dentro de 5 minutos",
            expiresAt: "4 horas desde ahora",
          },
          nextSteps: {
            checkEmail:
              "Compruebe su correo electrónico de la bandeja de entrada y la carpeta de spam",
            clickLink:
              "Haga clic en el enlace de reseteo en el correo electrónico",
            createPassword: "Crear una nueva contraseña segura",
          },
        },
        errors: {
          title: "Error",
          validation: {
            title: "Error de validación",
            description: "Invalide input provided",
          },
          unauthorized: {
            title: "Se requiere autenticación",
            description: "Solicitud no autorizada",
          },
          internal: {
            title: "Error interno",
            description: "Error del servidor interno",
          },
          unknown: {
            title: "Error desconocido",
            description: "Ocurrió un error desconocido",
          },
          network: {
            title: "Error de red",
            description: "Error de conexión de red",
          },
          forbidden: {
            title: "Acceso denegado",
            description: "No tienes acceso",
          },
          notFound: {
            title: "No encontrado",
            description: "No se encontró el recurso",
          },
          unsaved: {
            title: "Cambios sin guardar",
            description: "Los cambios no se salvaron",
          },
          conflict: {
            title: "Conflicto",
            description: "Hay un conflicto entre los datos",
          },
          no_email:
            "No se encontró ninguna cuenta con esa dirección de correo electrónico",
          email_generation_failed: "Failed para generar correo electrónico",
        },
        success: {
          title: "Solicitud enviada",
          description: "Enviamos la solicitud para restablecer tu contraseña",
        },
        post: {
          title: "Solicitud",
          description: "Solicitud de punto final",
          form: {
            title: "Solicitud de configuración",
            description: "Configurar los parámetros de solicitud",
          },
          response: {
            title: "Respuesta",
            description: "Solicitar datos de respuesta",
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
        emailTemplates: {
          request: {
            name: "Correo para restablecer la contraseña",
            description:
              "Correo electrónico enviado a los usuarios con un enlace para restablecer su contraseña",
            category: "Autenticación",
            preview: {
              publicName: {
                label: "Nombre público",
                description: "Nombre de la pantalla pública del usuario",
              },
              userId: {
                label: "Usuario ID",
                description: "El identificador único del usuario",
              },
              passwordResetUrl: {
                label: "Password Reset URL",
                description: "El URL para restablecer la contraseña",
              },
            },
          },
        },
      },
      validate: {
        category: "Usuarios",

        title: "Validar Reiniciar contraseña Token",
        description: "Validar contraseña restablecer el punto final token",
        tag: "Reiniciar la validación",
        groups: {
          tokenInput: {
            title: "Validación por token",
            description:
              "Introduzca el token de reinicio de contraseña para validar",
          },
        },
        fields: {
          token: {
            label: "Reset Token",
            description:
              "restablecimiento de contraseña token desde el correo electrónico",
            placeholder: "Introducir reinicio token",
            help: "Introduzca la ficha que recibió en su correo electrónico",
            validation: {
              required: "Reiniciar ficha es necesario",
            },
          },
        },
        response: {
          title: "Resultado de validación",
          description: "Respuesta a la validación token",
          valid: "Token Valid",
          message: "Mensaje de validación",
          validationMessage: "Reiniciar la validación de token completado",
          userId: "Usuario ID",
          expiresAt: "Expires Token At",
          nextSteps: {
            item: "Siguientes pasos después de la validación",
            steps: [
              "Procede para establecer su nueva contraseña",
              "Elija una contraseña fuerte y única",
            ],
          },
        },
        errors: {
          title: "Error",
          validation: {
            title: "Error de validación",
            description: "Falló la validación de tokens",
          },
          unauthorized: {
            title: "Se requiere autenticación",
            description: "Token inválido o caducado",
          },
          internal: {
            title: "Error interno",
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
            description: "Token no encontró",
          },
          unsaved: {
            title: "Cambios sin guardar",
            description: "Se detectaron cambios no observados",
          },
          conflict: {
            title: "Conflicto",
            description: "Hay un conflicto entre los datos",
          },
        },
        success: {
          title: "Token Valid",
          description: "restablecimiento de contraseña token es válido",
        },
        post: {
          title: "Validación",
          description: "Punto final validado",
          form: {
            title: "Configuración validada",
            description: "Configurar parámetros validados",
          },
          response: {
            title: "Respuesta",
            description: "Datos de respuesta validados",
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
      },
      actions: {
        back: "Atrás",
        submit: "Enviar",
        submitting: "Enviando...",
      },
      success: {
        password_reset: "Su contraseña se ha restaurado con éxito.",
      },
      errors: {
        tokenValidationFailed: "Falló la validación de tokens",
        userLookupFailed: "Failed to lookup user",
        tokenDeletionFailed: "Fallado para borrar token",
        userDeletionFailed: "Fallado para borrar usuario",
        resetFailed: "No pudimos restablecer la contraseña",
        tokenCreationFailed: "Fallado para crear el token de reset",
        noDataReturned: "La base de datos no devolvió datos",
        tokenInvalid: "Reiniciar la ficha es inválida",
        tokenExpired: "Reiniciar la ficha ha expirado",
        tokenVerificationFailed: "Falló la verificación",
        userNotFound: "Usuario no encontrado",
        passwordUpdateFailed: "No actualizado la contraseña",
        passwordResetFailed: "No pudimos restablecer la contraseña",
        requestFailed: "Falló la solicitud de reasentamiento",
        emailMismatch: "El correo electrónico no coincide",
        confirmationFailed: "Confirmación de reajuste de contraseña falló",
      },
    },
    signup: {
      category: "Usuarios",

      _components: {
        passwordStrength: {
          label: "Seguridad de la contraseña",
          weak: "Débil",
          fair: "Aceptable",
          good: "Buena",
          strong: "Fuerte",
          requirement: {
            minLength: {
              icon: "✗",
              text: "Al menos 8 caracteres",
            },
            uppercase: {
              icon: "✗",
              text: "Al menos una letra mayúscula",
            },
            lowercase: {
              icon: "✗",
              text: "Por lo menos una carta inferior",
            },
            number: {
              icon: "✗",
              text: "Al menos un número",
            },
            special: {
              icon: "!",
              text: "Carácter especial (opcional, mejora la fuerza)",
            },
          },
        },
        post: {
          title: "_components",
          description: "_ punto final de los componentes",
          form: {
            title: "_components Configuration",
            description: "Configurar los parámetros _components",
          },
          response: {
            title: "Respuesta",
            description: "Datos de respuesta _components",
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
      },
      title: "Registro de Usuarios",
      description: "Punto final de registro del usuario",
      tag: "Autenticación",
      form: {
        title: "Bienvenido a AI sin censura",
        description:
          "Ayuda a construir sin censura, privacidad primero y verdaderamente independiente AI. unbottled.ai es fuente abierta y impulsado por la comunidad, su registro apoya el desarrollo de AI tecnología que respeta su libertad.",
      },
      actions: {
        submit: "Crear cuenta",
        submitting: "Crear cuenta...",
      },
      fields: {
        privateName: {
          label: "Su nombre privado",
          description:
            "Cómo el AI te dirigirá en conversaciones privadas. Esto se mantiene entre usted y el AI - completamente privado.",
          placeholder: "Introduzca su nombre",
          validation: {
            required: "Nombre privado es obligatorio",
            minLength: "El nombre debe ser por lo menos 2 caracteres",
            maxLength: "El nombre debe ser inferior a 100 caracteres",
          },
        },
        publicName: {
          label: "Su nombre público",
          description:
            "Su identidad en chats públicos y foros. Otros usuarios y AIs verán este nombre. Elige sabiamente - te representa en la comunidad.",
          placeholder: "Introduzca el nombre de la pantalla",
          validation: {
            required: "Nombre de la pantalla es necesario",
            minLength:
              "El nombre de la pantalla debe ser por lo menos 2 caracteres",
            maxLength:
              "El nombre de la pantalla debe ser inferior a 100 caracteres",
          },
        },
        email: {
          label: "Su correo electrónico",
          description:
            "Sus credenciales de inicio de sesión y método de contacto. Kept private - nunca compartido con otros usuarios o AIs.",
          placeholder: "Introduzca la dirección de correo electrónico",
          help: "Este será su email de inicio de sesión y el método de contacto primario",
          validation: {
            required: "El correo electrónico es necesario",
            invalid:
              "Por favor, introduzca una dirección de correo electrónico válida",
          },
        },
        password: {
          label: "Su contraseña",
          description:
            "Las contraseñas fuertes protegen su cuenta. Estamos implementando encriptación de extremo a extremo pronto - en ese punto, los resetes de contraseñas limpiarán su historia del mensaje ya que sólo usted tiene la clave de desciframiento. Guárdalo en un lugar seguro.",
          placeholder: "Ingrese contraseña",
          validation: {
            required: "Se requiere contraseña",
            minLength: "La contraseña debe tener al menos 8 caracteres",
            complexity:
              "La contraseña debe incluir mayúsculas, minúsculas y un número",
          },
        },
        confirmPassword: {
          label: "Confirme su contraseña",
          validation: {
            required: "Confirma tu contraseña",
            minLength: "La contraseña debe tener al menos 8 caracteres",
            mismatch: "Las contraseñas no coinciden",
          },
        },
        subscribeToNewsletter: {
          label: "Suscríbete al Newsletter",
          description:
            "Actualizaciones ocasionales sobre nuevos modelos y características. Sin spam, lo que importa.",
        },
        acceptTerms: {
          label: "Aceptar Términos y Condiciones",
          description:
            "Nuestros términos y condiciones respetan tu libertad y tu privacidad.",
          termsLink: "términos",
          conditionsLink: "política de privacidad",
          descriptionPrefix: "Nuestros",
          descriptionAnd: "y nuestra",
          descriptionSuffix: "respetan tu libertad.",
          validation: {
            required: "Para continuar, acepta los términos y condiciones",
          },
        },
        referralCode: {
          label: "Código de remisión (opcional)",
          description:
            "¿Tienes un amigo en unbottled.ai? Introduzca su código para apoyarlos. Se recompensan por traerte.",
          placeholder: "Introduzca el código de referencia (opcional)",
          labelPrefilled: "Código de referido",
          descriptionPrefilled:
            "Tu amigo recibe una recompensa cuando creas tu cuenta.",
        },
        supportedSkillId: {
          label: "Apoya a un creador",
          description:
            "Al registrarte, la persona que creó esta habilidad recibe un 5 % extra de tus suscripciones.",
          selectorTitle: "Apoya a un creador",
          selectorDescription:
            "Agregaste a tus favoritos habilidades de creadores independientes. Elige a quién apoyar: recibirá un 5 % extra de tus suscripciones. Puedes cambiar tu elección cuando quieras.",
          selectorNone: "Nadie (omitir)",
        },
        localFavorites: {
          label: "Locales favoritos",
        },
      },

      footer: {
        alreadyHaveAccount: "¿Ya tienes una cuenta? Inicia sesión",
      },
      errors: {
        title: "Error de registro",
        validation: {
          title: "Error de validación",
          description: "Por favor, compruebe su entrada e inténtelo de nuevo",
        },
        unauthorized: {
          title: "Se requiere autenticación",
          description: "Inicia sesión para continuar",
        },
        server: {
          title: "Error del servidor",
          description: "Ocurrió un error interno del servidor",
        },
        unknown: {
          title: "Error desconocido",
          description: "Ocurrió un error inesperado",
        },
        conflict: {
          title: "Conflicto contable",
          description: "Ya existe una cuenta con este correo",
        },
        forbidden: {
          title: "Acceso denegado",
          description: "Acceso denegado",
        },
        network: {
          title: "Error de red",
          description: "Ocurrió un error de red",
        },
        notFound: {
          title: "No encontrado",
          description: "No se encontró el recurso",
        },
        unsaved: {
          title: "Cambios sin guardar",
          description: "Tienes cambios sin guardar",
        },
        internal: {
          title: "Error interno",
          description: "Se produjo un error interno",
        },
      },
      emailCheck: {
        title: "Email Check",
        description:
          "Compruebe si el correo electrónico está disponible para el registro",
        tag: "Correo electrónico",
        fields: {
          email: {
            label: "Dirección de correo electrónico",
            description: "Correo electrónico para comprobar",
            placeholder: "Introduzca la dirección de correo electrónico",
            validation: {
              invalid: "Formato de correo electrónico inválido",
            },
          },
        },
        response: {
          title: "Email Check Response",
          description:
            "Resultado de comprobación de disponibilidad de correo electrónico",
          available: "Correo electrónico disponible",
          message: "Mensaje",
        },
        errors: {
          validation: {
            title: "Correo electrónico inválido",
            description:
              "Por favor, introduzca una dirección de correo electrónico válida",
          },
          internal: {
            title: "Error de comprobación de correo electrónico",
            description:
              "Verificación de errores disponibilidad de correo electrónico",
          },
          unknown: {
            title: "Error desconocido",
            description: "Ocurrió un error inesperado",
          },
          conflict: {
            title: "Correo electrónico ya tomado",
            description: "Este correo electrónico ya está registrado",
          },
          forbidden: {
            title: "Acceso denegado",
            description:
              "Usted no tiene permiso para comprobar este correo electrónico",
          },
          network: {
            title: "Error de red",
            description:
              "Error de red ocurrió mientras se comprueba el correo electrónico",
          },
          notFound: {
            title: "Servicio No encontrado",
            description:
              "El servicio de cheque por correo electrónico no está disponible",
          },
          unauthorized: {
            title: "Se requiere autenticación",
            description:
              "Autenticación requerida para comprobar el correo electrónico",
          },
          unsaved: {
            title: "Cambios sin guardar",
            description: "Tienes cambios sin guardar",
          },
        },
        success: {
          title: "Correo electrónico Completo",
          description:
            "Disponibilidad de correo electrónico comprobada con éxito",
        },
      },
      post: {
        title: "Signup",
        description: "Punto final de inscripción",
        form: {
          title: "Configuración de registro",
          description: "Configurar parámetros de registro",
        },
        response: {
          title: "Respuesta",
          description: "Datos de respuesta de registro",
          success: "Signup Successful",
          message: "Mensaje de Estado",
          userId: "Usuario ID",
          nextSteps: "Siguientes pasos",
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
          unsaved: {
            title: "Cambios sin guardar",
            description: "Tienes cambios sin guardar",
          },
        },
        success: {
          title: "Operación completada",
          description: "La operación se completó correctamente",
          processing: "Procesamiento de registro con éxito",
        },
      },
      response: {
        title: "Respuesta",
        description: "Datos de respuesta de registro",
        success: "Signup Successful",
        message: "Mensaje de Estado",
        user: {
          id: "Usuario ID",
          email: "Dirección de correo electrónico",
          firstName: "Nombre",
          lastName: "Apellido",
          privateName: "Nombre privado",
          publicName: "Nombre público",
          imageUrl: "Imagen de perfil URL",
          verificationRequired: "Verificación requerida",
        },
        verificationInfo: {
          title: "Verificación de correo electrónico",
          description:
            "Detalles sobre el proceso de verificación de correo electrónico",
          emailSent: "Email Sent",
          expiresAt: "Gastos de verificación en",
          checkSpamFolder: "Carpeta de Spam",
        },
        nextSteps: "Siguientes pasos",
      },
      success: {
        title: "Signup Successful",
        description: "Su cuenta ha sido creada con éxito",
      },
      admin_notification: {
        title: "Nuevo registro de usuario",
        subject: "Nuevo registro de {{privateName}}",
        preview: "{{privateName}} acaba de registrarse",
        message: "Hay un nuevo usuario en {{appName}}",
        privateName: "Nombre privado",
        publicName: "Nombre público",
        email: "Correo electrónico",
        locale: "Idioma",
        creditBalance: "Saldo de créditos",
        leadCreditBalance: "Saldo de créditos del prospecto",
        signup_preferences: "Preferencias de inscripción",
        user_details: "Detalles del usuario",
        basic_information: "Información básica",
        signup_type: "Tipo de registro",
        direct_signup: "Firma directa",
        newsletter: "Boletín",
        subscribed: "Suscrito",
        not_subscribed: "No está suscrito",
        signup_details: "Detalles de la inscripción",
        signup_date: "Fecha de inscripción",
        user_id: "Usuario ID",
        recommended_next_steps: "Próximos pasos recomendados",
        direct_recommendation:
          "Revisar perfil de usuario y configuración de pago",
        contact_user: "Contacto Usuario",
        footer: "Notificación automática de {{appName}}",
      },
      email: {
        subject: "Ya tienes acceso a {{appName}}",
        previewText:
          "Hola, {{privateName}}. Tu cuenta está lista. Chatea con Claude, GPT, Gemini, DeepSeek y {{modelCount}} modelos más. Gratis y sin tarjeta.",
        headline: "Tu IA te espera.",
        greeting: "Hola, {{privateName}}:",
        intro:
          "Te damos la bienvenida a {{appName}}. Todo lo que te gusta de ChatGPT, más modelos de código abierto y modelos sin filtros de contenido. Una cuenta, un solo lugar.",
        models: {
          title: "{{modelCount}} modelos en 3 categorías",
          mainstream: "Convencional",
          open: "Código abierto",
          uncensored: "Sin censura",
        },
        free: {
          title: "Lo que recibes gratis, para siempre:",
          credits:
            "{{freeCreditsSignedIn}} créditos gratis cada mes, {{freeCreditsMax}} con el boletín informativo. Sin tarjeta.",
          allModels: "Acceso a los {{modelCount}} modelos de IA",
          uncensored: "Modelos sin censura que sí responden a tus preguntas",
          chatModes: "Chats privados, de incógnito, compartidos y públicos",
          noCard: "Sin tarjeta de crédito. Nunca.",
        },
        ctaButton: "Empieza a chatear",
        upgrade: {
          title: "¿Quieres más?",
          desc: "Los planes van desde {{subscriptionPrice}} al mes por {{subscriptionCredits}} créditos hasta {{ultraCredits}} créditos por {{ultraPrice}}. Con una suscripción, puedes recargar con paquetes de créditos que nunca vencen.",
          cta: "Ver los planes",
        },
        signoff: "Que disfrutes tus chats,\nEl equipo de {{appName}}",
        ps: "P. D. Usa el modo incógnito para guardar tus conversaciones solo en tu dispositivo. Nunca las guardamos en nuestros servidores. Los archivos multimedia generados se almacenan temporalmente por motivos técnicos.",
      },
      emailTemplates: {
        welcome: {
          name: "Signup Welcome Email",
          description:
            "Correo electrónico de bienvenida enviado a los usuarios después del registro exitoso",
          category: "Autenticación",
          preview: {
            privateName: {
              label: "Nombre privado",
              description: "Nombre privado del usuario",
            },
            userId: {
              label: "Usuario ID",
              description: "El identificador único del usuario",
            },
            leadId: {
              label: "ID del contacto",
              description: "El identificador de prospecto del usuario",
            },
          },
        },
        adminSignup: {
          name: "Nombre de la firma de Admin Email",
          description:
            "Correo electrónico enviado a los administradores cuando un nuevo usuario se registra",
          category: "Administration",
          preview: {
            privateName: {
              label: "Nombre privado",
            },
            publicName: {
              label: "Nombre público",
            },
            email: {
              label: "Dirección de correo electrónico",
            },
            userId: {
              label: "Usuario ID",
            },
            subscribeToNewsletter: {
              label: "Suscripción",
            },
          },
        },
      },
    },
  },
  search: {
    category: "Usuarios",

    title: "Búsqueda de Usuarios",
    description: "Buscar usuarios",
    tag: "Búsqueda de Usuarios",
    container: {
      title: "Search Container",
      description: "contenedor de búsqueda de usuarios",
    },
    groups: {
      searchCriteria: {
        title: "Criterios de búsqueda",
        description: "Define los parámetros de búsqueda",
      },
      filters: {
        title: "Filtros avanzados",
        description: "Opciones adicionales de filtrado",
      },
      pagination: {
        title: "Pagination",
        description: "Controlar cómo los resultados están paginados",
      },
    },
    fields: {
      search: {
        label: "Búsqueda",
        description: "Introduzca los términos de búsqueda",
        placeholder: "Usuarios de búsqueda...",
        help: "Búsqueda por nombre, correo electrónico o empresa",
        validation: {
          minLength: "Buscar consultas debe ser por lo menos 2 caracteres",
        },
      },
      roles: {
        label: "Roles de usuario",
        description: "Filtro por funciones de usuario",
        placeholder: "Seleccionar roles...",
        help: "Seleccione uno o más roles para filtrar",
      },
      status: {
        label: "Situación del usuario",
        description: "Filtro por estado de usuario",
        placeholder: "Seleccione el estado...",
        help: "Filtrar por usuarios activos, inactivos o todos",
      },
      limit: {
        label: "Limitación",
        description: "Número máximo de resultados",
        help: "Especifique cuántos resultados devolver (predeterminado: 10)",
      },
      offset: {
        label: "Offset",
        description: "Número de resultados para saltar",
        help: "Especifique el offset de paginación (por defecto: 0)",
      },
    },
    status: {
      active: "Activa",
      inactive: "Inactivo",
      all: "Todos",
    },
    response: {
      title: "Resultados de búsqueda",
      description: "Resultados de búsqueda de usuarios",
      success: {
        badge: "Operación completada",
      },
      message: {
        content: "Mensaje del resultado de la búsqueda",
      },
      searchInfo: {
        title: "Información de búsqueda",
        description: "Detalles sobre la operación de búsqueda",
        searchTerm: "Período de búsqueda",
        appliedFilters: "Filtros aplicados",
        searchTime: "Tiempo de búsqueda",
        totalResults: "Total de resultados",
      },
      pagination: {
        title: "Pagination Info",
        description: "Información sobre la navegación por página",
        currentPage: "Página actual",
        totalPages: "Total de páginas",
        itemsPerPage: "Temas por página",
        totalItems: "Total de artículos",
        hasMore: "Tiene más",
        hasPrevious: "Anterior",
      },
      actions: {
        title: "Acciones disponibles",
        description: "Acciones que puede realizar en los resultados",
        type: "Tipo de acción",
        label: "Medida",
        href: "Enlace",
      },
      users: {
        label: "Usuarios encontrados",
        description: "Lista de usuarios que coinciden",
        item: {
          title: "Usuario",
          description: "Información de la cuenta de usuario",
        },
        id: "Usuario ID",
        leadId: "ID del contacto",
        isPublic: "Público",
        firstName: "Nombre",
        lastName: "Apellido",
        privateName: "Nombre privado",
        publicName: "Nombre público",
        company: "Company",
        email: "Correo electrónico",
        imageUrl: "Avatar",
        isActive: "Activa",
        emailVerified: "Email Verificado",
        requireTwoFactor: "2FA requerida",
        marketingConsent: "Consentimiento de comercialización",
        userRoles: {
          item: {
            title: "Función",
            description: "Función de usuario",
          },
          id: "Función ID",
          role: "Función",
        },
        createdAt: "Creado",
        updatedAt: "Actualizado",
      },
    },
    columns: {
      firstName: "Nombre",
      lastName: "Apellido",
      privateName: "Nombre privado",
      publicName: "Nombre público",
      email: "Correo electrónico",
      company: "Company",
      userRoles: "Funciones",
    },
    errors: {
      validation: {
        title: "Error de validación",
        description: "Parámetros de búsqueda inválidos",
      },
      unauthorized: {
        title: "Se requiere autenticación",
        description: "Búsqueda no autorizada",
      },
      internal: {
        title: "Error interno",
        description: "Error del servidor interno",
      },
      unknown: {
        title: "Error desconocido",
        description: "Ocurrió un error desconocido",
      },
      network: {
        title: "Error de red",
        description: "Error de conexión de red",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "No tienes acceso",
      },
      notFound: {
        title: "No encontrado",
        description: "No se encontraron usuarios",
      },
      conflict: {
        title: "Conflicto",
        description: "Conflicto de búsqueda",
      },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Los cambios no se salvaron",
      },
    },
    success: {
      title: "Búsqueda exitosa",
      description: "Búsqueda finalizada con éxito",
    },
    post: {
      title: "Buscar",
      description: "Punto final de búsqueda",
      form: {
        title: "Configuración de búsqueda",
        description: "Configurar los parámetros de búsqueda",
      },
      response: {
        title: "Respuesta",
        description: "Datos de respuesta a la búsqueda",
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
  },
  "session-cleanup": {
    category: "Usuarios",

    post: {
      title: "Sesión de limpieza",
      description: "Limpiar las sesiones y fichas de usuario caducadas",
      tag: "Sesión de limpieza",
      container: {
        title: "Sesión de limpieza",
        description: "Configurar y ejecutar la limpieza de sesión",
      },
      fields: {
        sessionRetentionDays: {
          label: "Días de retención de sesión",
          description: "Número de días para retener las sesiones",
        },
        tokenRetentionDays: {
          label: "Días de retención de tokens",
          description: "Número de días para retener las fichas",
        },
        batchSize: {
          label: "Tamaño del lote",
          description: "Número de registros para procesar por lote",
        },
        dryRun: {
          label: "Dry Run",
          description: "Ejecutar sin borrar registros",
        },
      },
      response: {
        sessionsDeleted: "Períodos de sesiones suprimidos",
        tokensDeleted: "Tokens Deleted",
        totalProcessed: "Total procesada",
        executionTimeMs: "Tiempo de ejecución (ms)",
      },
      errors: {
        unauthorized: {
          title: "Se requiere autenticación",
          description:
            "Usted debe ser un administrador para ejecutar la limpieza de sesión",
        },
        forbidden: {
          title: "Acceso denegado",
          description: "No tienes acceso",
        },
        server: {
          title: "Error del servidor",
          description: "Error del servidor interno durante la limpieza",
        },
        unknown: {
          title: "Error desconocido",
          description: "Ocurrió un error desconocido",
        },
        validation: {
          title: "Error de validación",
          description: "Configuración de limpieza inválida",
        },
      },
      success: {
        title: "Sesión de limpieza completada",
        description: "Sesiones y fichas limpiadas con éxito",
      },
    },
    task: {
      name: "user-session-cleanup",
      description:
        "Limpiar las sesiones de usuario expiradas para mantener la seguridad del sistema",
      purpose:
        "Elimina las sesiones vencidas para mantener la seguridad y el rendimiento",
      impact:
        "Mejora el rendimiento y la seguridad del sistema eliminando los datos de sesión",
      rollback: "Rollback no aplicable para operaciones de limpieza",
    },
    errors: {
      default: "Se produjo un error durante la limpieza de sesión",
      execution_failed: {
        title: "Sesión de limpieza fracasada",
        description: "No se puede limpiar las sesiones expiradas",
      },
      partial_failure: {
        title: "Fallo de limpieza en sesión parcial",
        description: "Algunas sesiones no pueden ser limpiadas",
      },
      unknown_error: {
        title: "Error de limpieza de sesión desconocido",
        description:
          "Un error desconocido ocurrió durante la limpieza de sesión",
      },
      invalid_session_retention: {
        title: "Retención de sesión inválida",
        description:
          "Período de retención del período de sesiones inválido especificado",
      },
      invalid_token_retention: {
        title: "Retención de Token inválida",
        description: "Período de retención de token inválido especificado",
      },
      invalid_batch_size: {
        title: "Tamaño del lote inválido",
        description: "Tamaño de lote inválido especificado para la limpieza",
      },
      validation_failed: {
        title: "Validación fallida",
        description:
          "La validación de la configuración de limpieza de sesión falló",
      },
    },
    success: {
      title: "Sesión de limpieza completada",
      description: "Sucesivamente limpiado las sesiones caducadas",
    },
    monitoring: {
      alertTrigger: "La tarea de limpieza del período de sesiones falló",
    },
    documentation: {
      overview:
        "Esta tarea elimina las sesiones de usuario expiradas del sistema para mantener la seguridad y el rendimiento",
    },
  },
  sessionCleanup: {
    category: "Usuarios",

    post: {
      title: "Sesión de limpieza",
      description: "Limpiar las sesiones y fichas de usuario caducadas",
      tag: "Sesión de limpieza",
      container: {
        title: "Sesión de limpieza",
        description: "Configurar y ejecutar la limpieza de sesión",
      },
      fields: {
        sessionRetentionDays: {
          label: "Días de retención de sesión",
          description: "Número de días para retener las sesiones",
        },
        tokenRetentionDays: {
          label: "Días de retención de tokens",
          description: "Número de días para retener las fichas",
        },
        batchSize: {
          label: "Tamaño del lote",
          description: "Número de registros para procesar por lote",
        },
        dryRun: {
          label: "Dry Run",
          description: "Ejecutar sin borrar registros",
        },
      },
      response: {
        sessionsDeleted: "Períodos de sesiones suprimidos",
        tokensDeleted: "Tokens Deleted",
        totalProcessed: "Total procesada",
        executionTimeMs: "Tiempo de ejecución (ms)",
      },
      errors: {
        unauthorized: {
          title: "Se requiere autenticación",
          description:
            "Usted debe ser un administrador para ejecutar la limpieza de sesión",
        },
        forbidden: {
          title: "Acceso denegado",
          description: "No tienes acceso",
        },
        server: {
          title: "Error del servidor",
          description: "Error del servidor interno durante la limpieza",
        },
        unknown: {
          title: "Error desconocido",
          description: "Ocurrió un error desconocido",
        },
        validation: {
          title: "Error de validación",
          description: "Configuración de limpieza inválida",
        },
      },
      success: {
        title: "Sesión de limpieza completada",
        description: "Sesiones y fichas limpiadas con éxito",
      },
    },
    task: {
      name: "user-session-cleanup",
      description:
        "Limpiar las sesiones de usuario expiradas para mantener la seguridad del sistema",
      purpose:
        "Elimina las sesiones vencidas para mantener la seguridad y el rendimiento",
      impact:
        "Mejora el rendimiento y la seguridad del sistema eliminando los datos de sesión",
      rollback: "Rollback no aplicable para operaciones de limpieza",
    },
    errors: {
      default: "Se produjo un error durante la limpieza de sesión",
      execution_failed: {
        title: "Sesión de limpieza fracasada",
        description: "No se puede limpiar las sesiones expiradas",
      },
      partial_failure: {
        title: "Fallo de limpieza en sesión parcial",
        description: "Algunas sesiones no pueden ser limpiadas",
      },
      unknown_error: {
        title: "Error de limpieza de sesión desconocido",
        description:
          "Un error desconocido ocurrió durante la limpieza de sesión",
      },
      invalid_session_retention: {
        title: "Retención de sesión inválida",
        description:
          "Período de retención del período de sesiones inválido especificado",
      },
      invalid_token_retention: {
        title: "Retención de Token inválida",
        description: "Período de retención de token inválido especificado",
      },
      invalid_batch_size: {
        title: "Tamaño del lote inválido",
        description: "Tamaño de lote inválido especificado para la limpieza",
      },
      validation_failed: {
        title: "Validación fallida",
        description:
          "La validación de la configuración de limpieza de sesión falló",
      },
    },
    success: {
      title: "Sesión de limpieza completada",
      description: "Sucesivamente limpiado las sesiones caducadas",
    },
    monitoring: {
      alertTrigger: "La tarea de limpieza del período de sesiones falló",
    },
    documentation: {
      overview:
        "Esta tarea elimina las sesiones de usuario expiradas del sistema para mantener la seguridad y el rendimiento",
    },
  },
  userRoles: {
    errors: {
      find_failed: "Failed to find user roles",
      batch_find_failed: "Failed to batch find user roles",
      not_found: "Función de usuario no encontrada",
      lookup_failed: "Failed to lookup user role",
      add_failed: "Failed to add role to user",
      no_data_returned: "La base de datos no devolvió datos",
      remove_failed: "Fallado para eliminar el papel del usuario",
      check_failed: "Fallado para comprobar si el usuario tiene papel",
      delete_failed: "Fallado para eliminar funciones de usuario",
      endpoint_not_created:
        "El endpoint de roles de usuario aún no está disponible",
    },
    post: {
      title: "Roles de usuario",
      description: "Endpoint de roles de usuario",
      form: {
        title: "Configuración de roles de usuario",
        description: "Configura los parámetros de los roles de usuario",
      },
      response: {
        title: "Respuesta",
        description: "Datos de respuesta de los roles de usuario",
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
        database_connection_failed: {
          title: "Falló la conexión con la base de datos",
          description: "No se pudo conectar con la base de datos",
        },
      },
      success: {
        title: "Operación completada",
        description: "La operación se completó correctamente",
      },
    },
    enums: {
      userRole: {
        public: "Público",
        customer: "Cliente",
        partnerAdmin: "Administrador del socio",
        partnerEmployee: "Empleado del socio",
        admin: "Administrador",
        cliOff: "CLI desactivada",
        cliAuthBypass: "CLI sin autenticación",
        aiToolOff: "Herramienta de IA desactivada",
        webOff: "Web desactivada",
        mcpOff: "MCP desactivado",
        mcpVisible: "Visible en MCP",
        productionOff: "Desactivado en producción",
        skillOff: "Habilidad desactivada",
      },
    },
  },
  profileVisibility: {
    public: "Público",
    private: "Privadas",
    contactsOnly: "Contactos Sólo",
  },
  contactMethods: {
    email: "Correo electrónico",
    phone: "Teléfono",
    sms: "SMS",
    whatsapp: "WhatsApp",
  },
  theme: {
    light: "Luz",
    dark: "Oscuro",
    system: "Sistema",
  },
  userDetailLevel: {
    minimal: "Minimal",
    standard: "Estándar",
    complete: "Completado",
  },
  language: {
    it: "Italiano",
    es: "Español",
    en: "Inglés",
    de: "Alemán",
    pl: "Polaco",
    fr: "Francés",
  },
  timezone: {
    utc: "UTC",
    america_new_york: "América/New_York",
    america_los_angeles: "América/Los_Angeles",
    europe_london: "Europa/Londres",
    europe_berlin: "Europe/Berlin",
    europe_warsaw: "Europe/Warsaw",
    asia_tokyo: "Asia/Tokyo",
    australia_sydney: "Australia/Sydney",
  },
  errors: {
    emailAlreadyInUse: "Dirección de correo electrónico ya está en uso",
    locale_required: "Locale es necesario",
    auth_required: "Se requiere autenticación. Uno de estos roles: {{roles}}",
    auth_retrieval_failed: "Fallado para recuperar autenticación: {{error}}",
    not_found: "Usuario no encontrado",
    not_found_by_id: "No se ha encontrado ningún usuario con ID {{userId}}",
    not_found_by_email:
      "No se ha encontrado ningún usuario con correo electrónico {{email}}",
    roles_lookup_failed: "Failed to look up roles for user {{userId}}",
    roles_batch_fetch_failed: "Failed to lotch fetch roles for {{count}} users",
    id_lookup_failed: "Failed to look up user {{userId}} : {{error}}",
    email_lookup_failed:
      "Failed to look up user by email {{email}} : {{error}}",
    email_check_failed: "Failed to check email {{email}} : {{error}}",
    email_duplicate_check_failed:
      "Failed to check email {{email}} against other users (excluding {{excludeUserId}}): {{error}}",
    search_failed: "Failed to search users for {{query}} : {{error}}",
    list_failed: "Failed to list users: {{error}}",
    email_already_in_use: "Dirección de correo electrónico ya está en uso",
    creation_failed: "Failed to create user: {{error}}",
    no_data_returned: "La base de datos no devolvió datos",
    password_hashing_failed:
      "Failed to hash password for {{email}} : {{error}}",
    not_implemented_on_native:
      "Esta característica no se implementa en React Native",
    count_failed: "Failed to get user count: {{error}}",
  },
  userNoteType: {
    note: "Nota",
    call: "Call",
    email: "Correo electrónico",
    meeting: "Reunión",
    task: "Tareas",
  },
  notifications: {
    profileUpdated: {
      title: "Perfil Actualizado",
      description: "Su perfil ha sido actualizado con éxito",
    },
    updateFailed: {
      title: "Actualización Fallada",
      description:
        "Falló para actualizar su perfil. Por favor, inténtalo de nuevo.",
    },
  },
};
