import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Usuarios",

  roles: {
    widget: {
      added: "Función concedida: {{role}}",
      removed: "Retirada del papel: {{role}}",
      removeWarning:
        "El usuario pierde todos los permisos que este rol otorga en su próxima solicitud.",
      addHint: "Efectúa la próxima solicitud del usuario.",
    },
    post: {
      title: "Agregar el papel de usuario",
      titleShort: "Add Role",
      description: "Dar un papel a una cuenta de usuario específica",
      container: {
        title: "Add Role",
        description: "Seleccione un papel para otorgar a este usuario",
      },
      id: {
        label: "Usuario",
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
          detail: "No se ha encontrado ningún usuario con ID {{userId}}.",
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
          detail: "No podía otorgar el papel {{role}} al usuario {{userId}}.",
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
      titleShort: "Eliminar el papel",
      description: "Rechazar un papel de una cuenta de usuario específica",
      container: {
        title: "Eliminar el papel",
        description: "Seleccione un papel para revocar de este usuario",
      },
      id: {
        label: "Usuario",
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
          detail: "No se ha encontrado ningún usuario con ID {{userId}}.",
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
          detail:
            "No se puede eliminar el papel {{role}} del usuario {{userId}}.",
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
};
