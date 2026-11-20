import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Empresas",
  tags: {
    companies: "Empresas",
    create: "Crear",
    list: "Lista",
    get: "¡Vamos!",
    update: "Actualización",
    members: "Miembros",
    invite: "Invitar",
    management: "Gestión",
  },
  endpointCategories: {
    companies: "Empresas",
    companyManagement: "Administración de empresas",
    companyMembers: "Socios de la empresa",
  },
  enums: {
    companyType: {
      b2b: "B2B",
      b2c: "B2C",
      individual: "Individual",
    },
    companyMemberRole: {
      owner: "Propietario",
      admin: "Administrador",
      member: "Miembro",
      accountant: "Contable",
      viewer: "Viewer",
    },
  },

  // Shared auth/repository error messages
  auth: {
    errors: {
      forbidden: {
        title: "Acceso denegado",
        description: "Usted no tiene permiso para realizar esta acción",
      },
      notFound: {
        title: "Company Not Found",
        description: "Esta compañía no existe",
      },
      server: {
        title: "Error del servidor",
        description: "Algo salió mal. inténtalo de nuevo",
      },
      patchNotFound: {
        title: "Company Not Found",
        description: "No podía encontrar compañía para actualizar",
      },
      patchServer: {
        title: "Error del servidor",
        description: "Failed to update company",
      },
    },
  },

  // update-role endpoint translations
  updateRole: {
    patch: {
      title: "Función actualizada de los Miembros",
      titleShort: "Función de actualización",
      description: "Cambiar el papel de un miembro. Propietario sólo.",
      companyId: { label: "Company ID", description: "Company" },
      memberId: {
        label: "Member ID",
        description: "El miembro para actualizar",
      },
      role: {
        label: "Nuevo papel",
        description: "Función para asignar a este miembro",
        placeholder: "Seleccionar el papel",
      },
      errors: {
        validation: {
          title: "Error de validación",
          description: "Entrada inválida",
        },
        unauthorized: {
          title: "No se registró",
          description:
            "Inicie sesión para actualizar las funciones de los miembros",
        },
        forbidden: {
          title: "Propietario",
          description:
            "Sólo el propietario de la empresa puede cambiar las funciones de miembro",
        },
        conflict: { title: "Conflicto", description: "Conflicto de datos" },
        server: {
          title: "Error del servidor",
          description: "Algo salió mal. inténtalo de nuevo",
        },
        unknown: {
          title: "Error desconocido",
          description: "Ocurrió un error inesperado",
        },
        network: {
          title: "Error de red",
          description: "Revise su conexión e inténtelo de nuevo",
        },
        notFound: {
          title: "Member Not Found",
          description: "Este miembro no existe en la empresa",
        },
        unsavedChanges: {
          title: "Cambios sin guardar",
          description: "Tienes cambios sin guardar",
        },
      },
      success: {
        title: "Función actualizada",
        description: "El papel de los Miembros ha cambiado con éxito",
      },
      response: {
        memberId: "Member ID",
        role: "Nuevo papel",
      },
      widget: {
        back: "Volver a los Miembros",
        successLabel: "Función actualizada",
        title: "Función de los Miembros",
      },
    },
  },

  // remove endpoint translations
  removeMember: {
    post: {
      title: "Eliminar Miembro",
      titleShort: "Eliminar Miembro",
      description:
        "Retire a un miembro de la empresa. No puedo quitar el último Propietario.",
      companyId: { label: "Company ID", description: "Company" },
      memberId: { label: "Member ID", description: "El miembro para retirar" },
      errors: {
        validation: {
          title: "Error de validación",
          description: "Entrada inválida",
        },
        unauthorized: {
          title: "No se registró",
          description: "Inicie sesión para eliminar miembros",
        },
        forbidden: {
          title: "Acceso denegado",
          description:
            "Propietario o función de Admin. No puedo quitar el último Propietario.",
        },
        conflict: {
          title: "Último propietario",
          description: "No se puede quitar el último Propietario de la empresa",
        },
        server: {
          title: "Error del servidor",
          description: "Algo salió mal. inténtalo de nuevo",
        },
        unknown: {
          title: "Error desconocido",
          description: "Ocurrió un error inesperado",
        },
        network: {
          title: "Error de red",
          description: "Revise su conexión e inténtelo de nuevo",
        },
        notFound: {
          title: "Member Not Found",
          description: "Este miembro no existe en la empresa",
        },
        unsavedChanges: {
          title: "Cambios sin guardar",
          description: "Tienes cambios sin guardar",
        },
      },
      success: {
        title: "Miembro eliminado",
        description: "Miembro ha sido retirado de la empresa",
      },
      response: {
        removedMemberId: "Miembro eliminado ID",
      },
      widget: {
        back: "Volver a los Miembros",
        successLabel: "Miembro eliminado",
        confirmTitle: "¿Retirar a este miembro?",
        confirmDescription:
          "Perderán el acceso a esta empresa inmediatamente. Esto no puede ser deshecho.",
        confirmButton: "Sí, retirar miembro",
        cancelButton: "Cancelar",
      },
    },
  },
};
