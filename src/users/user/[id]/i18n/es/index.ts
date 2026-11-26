import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
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
            description: "Se produjo un error inesperado al agregar el papel",
          },
        },
        success: {
          title: "Papel añadido",
          description: "El papel ha sido otorgado con éxito al usuario",
        },
      },
      delete: {
        title: "Eliminar el papel de usuario",
        description: "Rechazar un papel de una cuenta de usuario específica",
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
            description: "Se produjo un error inesperado al eliminar el papel",
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
      titleShort: "Detalles del usuario",
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
          description: "Información sobre el estado de la cuenta de usuario",
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
          confirmedEarnedCents: {
            content: "Confirmado Ganado (centros)",
          },
          pendingEarnedCents: {
            content: "Pendiente (centros)",
          },
        },
        engagement: {
          title: "Créditos &quot; Participación",
          description: "Saldo, gastos, ganancias y actividad",
          creditBalance: {
            content: "Saldo de créditos",
          },
          freeAllowance: {
            content: "Permiso libre",
          },
          lifetimeCreditsSpent: {
            content: "Lifetime Spend",
          },
          favoritesCount: {
            content: "Favoritos",
          },
          customSkillsCount: {
            content: "Habilidades personalizadas",
          },
          newsletterConsent: {
            content: "Newsletter Consentimiento",
          },
          hasConfirmedNewsletter: {
            content: "Newsletter Confirmado",
          },
          paymentsCount: {
            content: "Pagos",
          },
          creditEntriesCount: {
            content: "Movimientos de créditos",
          },
          threadsCount: {
            content: "Hilos",
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
          description: "Debes iniciar sesión para ver los detalles del usuario",
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
          detail: "No se ha encontrado ningún usuario con ID {{userId}}.",
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
          detail: "No se puede cargar este usuario: {{error}}",
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
      titleShort: "Actualizar usuario",
      description: "Actualizar información de usuario y detalles del perfil",
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
          detail: "No se ha encontrado ningún usuario con ID {{userId}}.",
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
          detail: "No se pudieron guardar cambios a este usuario: {{error}}",
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
      titleShort: "Eliminar el usuario",
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
        label: "Eliminar cuenta",
        loadingText: "Eliminando...",
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
          description: "Usuario inválido ID proporcionado para la eliminación",
        },
        forbidden: {
          title: "Access Forbidden",
          description: "Usted no tiene permiso para borrar usuarios",
        },
        notFound: {
          title: "Usuario No encontrado",
          description: "No se pudo encontrar el usuario que eliminara",
          detail: "No se ha encontrado ningún usuario con ID {{userId}}.",
        },
        server: {
          title: "Error del servidor",
          description: "Incapaz de borrar usuario debido al error del servidor",
          detail: "No se puede eliminar este usuario: {{error}}",
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
      leadId: "ID de contacto",
      viewLead: "Ver contacto",
      created: "Alta",
      lastUpdated: "Última actualización",
      relatedRecords: "Datos relacionados",
      relatedPayments: "Pagos",
      relatedThreadActivity: "Actividad de los hilos",
      confirmBan: "¿Bloquear el acceso a la cuenta de {{name}}?",
      confirmUnban: "¿Restablecer el acceso a la cuenta de {{name}}?",
      editAccountNamed: "Editar la cuenta de {{name}}",
      saveAccount: "Guardar cambios",
      fullProfile: "Abrir perfil completo",
      referrals: "Remisiones",
      subscription: "Suscripción",
      creditHistory: "Historial de créditos",
      identifiers: "Detalles técnicos",
      engagementTitle: "Créditos y actividad",
      balance: "Saldo en créditos",
      freeAllowance: "Límite de créditos gratuitos",
      lifetimeSpend: "Créditos utilizados",
      earned: "Ganancias por referidos",
      earnedPending: "Pending:",
      referred: "Usuarios referidos",
      favorites: "Favoritos",
      skills: "Skills",
      newsletter: "Boletín",
      newsletterConfirmed: "Confirmado",
      newsletterConsent: "Optado en",
      newsletterNone: "Ninguno",
      deleteUser: "Eliminar usuario",
      userDeletedSuccessfully: "Usuario eliminado con éxito",
      deletedAt: "Suprimidos",
      dangerZone: "Acciones irreversibles",
      deleteAccountHint: "Elimina definitivamente la cuenta de {{name}}.",
      cancelDeletion: "Cancelar",
      confirmDeletion: "Confirmar eliminación",
      confirmDeletionMessage:
        "La cuenta se eliminará de forma permanente. Esta acción no se puede deshacer.",
      titleReferralCodes: "Ver códigos de referencia y estadísticas",
      titleSubscription: "Ver suscripción",
      copyLeadId: "Copiar ID de contacto",
      noEarnings: "Aún ninguna",
      earningUnitsUnavailable: "Desglose de ganancias no disponible",
      titleCopyUserId: "Copiar ID de usuario",
      creditsAmount: "{{count}} créditos",
      freeAllowanceHint: "Cupo gratuito: {{count}} créditos al mes",
      moreActions: "Más",
      editAccount: "Editar cuenta",
      deleteAccount: "Eliminar cuenta",
      deleteDialogTitle: "¿Eliminar la cuenta de {{name}}?",
      accountTitle: "Cuenta",
      publicName: "Nombre público",
      roles: "Roles",
      savedItems: "Elementos guardados",
      savedItemsValue: "{{favorites}} favoritos, {{skills}} skills",
      userId: "ID de usuario",
      stripeCustomer: "Cliente de Stripe",
    },
    getCrm: {
      get: {
        title: "Obtener perfil de usuario CRM",
        titleShort: "Perfil CRM",
        description:
          "Recuperar los campos de facturación y cuenta de notas de un usuario",
        fields: {
          userId: {
            label: "Usuario ID",
            description: "El usuario para buscar",
            placeholder: "Usuario UUID",
          },
        },
        errors: {
          validation: {
            title: "Error de validación",
            description: "Usuario inválido ID",
          },
          unauthorized: {
            title: "Se requiere autenticación",
            description: "Debes estar conectado.",
          },
          forbidden: {
            title: "Acceso denegado",
            description:
              "Usted no tiene acceso a los datos CRM de este usuario",
          },
          notFound: {
            title: "No encontrado",
            description: "Usuario no encontrado",
          },
          conflict: {
            title: "Conflicto",
            description: "Se produjo un conflicto",
          },
          network: {
            title: "Error de red",
            description: "Solicitud de red falló",
          },
          unsavedChanges: {
            title: "Cambios sin guardar",
            description: "Hay cambios sin salvar",
          },
          internal: {
            title: "Error interno",
            description: "Error del servidor. inténtelo de nuevo",
          },
          unknown: {
            title: "Error desconocido",
            description: "Ocurrió un error inesperado",
          },
        },
        success: {
          title: "Perfil CRM Cargado",
          description: "Datos de usuario CRM recuperados",
        },
        widget: {
          addNote: "Nota",
          viewNotes: "Notas de opinión",
        },
        response: {
          id: "Usuario ID",
          email: "Correo electrónico",
          privateName: "Nombre",
          companyBillingName: "Compañía / Nombre de facturación",
          vatNumber: "Número de VAT",
          taxId: "Impuesto ID",
          phone: "Teléfono",
          addressLine1: "Línea de dirección 1",
          addressLine2: "Línea de dirección 2",
          city: "Ciudad",
          region: "Región",
          postalCode: "Código postal",
          billingCountry: "País",
          defaultCurrency: "Moneda por defecto",
          paymentTermsDays: "Términos de pago (días)",
          notesCount: "Total Notas",
        },
      },
      tag: "CRM",
    },
    notesCreate: {
      post: {
        title: "Crear Nota de Usuario",
        titleShort: "Crear nota",
        description:
          "Añada una nota CRM, registro de llamadas, registro de correo electrónico, reunión o tarea para un usuario",
        fields: {
          userId: {
            label: "Usuario",
            description: "El usuario de esta nota se trata",
            placeholder: "Seleccione usuario",
          },
          type: {
            label: "Tipo de actividad",
            description: "Qué tipo de interacción este registro",
            placeholder: "Seleccione el tipo",
          },
          content: {
            label: "Contenido",
            description: "Detalles de la actividad",
            placeholder: "Escribe lo que pasó...",
          },
          isPrivate: {
            label: "Privadas",
            description: "Sólo puedes ver notas privadas",
          },
        },
        errors: {
          validation: {
            title: "Error de validación",
            description: "Revise los campos e inténtelo de nuevo",
          },
          unauthorized: {
            title: "Se requiere autenticación",
            description: "Debes estar conectado.",
          },
          forbidden: {
            title: "Acceso denegado",
            description: "Usted no tiene acceso a este usuario",
          },
          notFound: {
            title: "No encontrado",
            description: "Usuario no encontrado",
          },
          conflict: {
            title: "Conflicto",
            description: "Se produjo un conflicto",
          },
          network: {
            title: "Error de red",
            description: "Solicitud de red falló",
          },
          unsavedChanges: {
            title: "Cambios sin guardar",
            description: "Hay cambios sin salvar",
          },
          internal: {
            title: "Error interno",
            description: "Error del servidor. inténtelo de nuevo",
          },
          unknown: {
            title: "Error desconocido",
            description: "Ocurrió un error inesperado",
          },
        },
        success: {
          title: "Nota Creada",
          description: "La nota fue salvada",
        },
        widget: {
          created: "Nota Creada",
          noteId: "Nota ID",
          backToNotes: "Volver a Notas",
        },
        response: {
          id: "Nota ID",
          userId: "Usuario ID",
          authorUserId: "Autor ID",
          type: "Tipo",
          content: "Contenido",
          isPrivate: "Privadas",
          createdAt: "Creado en",
          updatedAt: "Actualizado en",
        },
      },
      tag: "CRM",
    },
    notesList: {
      get: {
        title: "Lista Notas de usuario",
        titleShort: "Notas de usuario",
        description:
          "Lista de notas CRM para un usuario, filtradas por tipo y visibilidad",
        fields: {
          userId: {
            label: "Usuario ID",
            description: "Cuyas notas a la lista",
            placeholder: "Usuario UUID",
          },
          type: {
            label: "Tipo",
            description: "Filtro por tipo de actividad",
            placeholder: "Todos los tipos",
          },
          isPrivate: {
            label: "Privada",
            description: "Mostrar sólo sus notas privadas",
          },
        },
        errors: {
          validation: {
            title: "Error de validación",
            description: "Revise los filtros e inténtelo de nuevo",
          },
          unauthorized: {
            title: "Se requiere autenticación",
            description: "Debes estar conectado.",
          },
          forbidden: {
            title: "Acceso denegado",
            description: "No tienes acceso a estas notas",
          },
          notFound: {
            title: "No encontrado",
            description: "Usuario no encontrado",
          },
          conflict: {
            title: "Conflicto",
            description: "Se produjo un conflicto",
          },
          network: {
            title: "Error de red",
            description: "Solicitud de red falló",
          },
          unsavedChanges: {
            title: "Cambios sin guardar",
            description: "Hay cambios sin salvar",
          },
          internal: {
            title: "Error interno",
            description: "Error del servidor. inténtelo de nuevo",
          },
          unknown: {
            title: "Error desconocido",
            description: "Ocurrió un error inesperado",
          },
        },
        success: {
          title: "Notas cargadas",
          description: "Notas recuperadas con éxito",
        },
        widget: {
          addNote: "Nota",
          total: "Total",
          empty: "Todavía no hay notas",
          delete: "Eliminar",
          private: "Privadas",
          ago: "hace mucho tiempo.",
        },
        response: {
          notes: "Notas",
          total: "Total",
          note: {
            id: "Nota ID",
            userId: "Usuario ID",
            authorUserId: "Autor ID",
            type: "Tipo",
            content: "Contenido",
            isPrivate: "Privadas",
            createdAt: "Creado en",
            updatedAt: "Actualizado en",
          },
        },
      },
      tag: "CRM",
    },
    noteDelete: {
      post: {
        title: "Eliminar la Nota de Usuario",
        titleShort: "Suprímase la nota",
        description:
          "Eliminar una nota CRM – sólo el autor o un administrador pueden hacer esto",
        fields: {
          noteId: {
            label: "Nota ID",
            description: "La nota para eliminar",
            placeholder: "Nota UUID",
          },
        },
        errors: {
          validation: {
            title: "Error de validación",
            description: "Nota inválida ID",
          },
          unauthorized: {
            title: "Se requiere autenticación",
            description: "Debes estar conectado.",
          },
          forbidden: {
            title: "Acceso denegado",
            description:
              "Sólo el autor o un administrador pueden borrar esta nota",
          },
          notFound: {
            title: "No encontrado",
            description: "Nota no encontrada",
          },
          conflict: {
            title: "Conflicto",
            description: "Se produjo un conflicto",
          },
          network: {
            title: "Error de red",
            description: "Solicitud de red falló",
          },
          unsavedChanges: {
            title: "Cambios sin guardar",
            description: "Hay cambios sin salvar",
          },
          internal: {
            title: "Error interno",
            description: "Error del servidor. inténtelo de nuevo",
          },
          unknown: {
            title: "Error desconocido",
            description: "Ocurrió un error inesperado",
          },
        },
        success: {
          title: "Nota suprimida",
          description: "La nota fue eliminada permanentemente",
        },
        widget: {
          warning: "Esta nota se eliminará permanentemente.",
          deleted: "Nota eliminada.",
          backToNotes: "Volver a Notas",
        },
        response: {
          deleted: "Suprimidos",
        },
      },
      tag: "CRM",
    },
  },
};
