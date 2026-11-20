import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
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
  tags: {
    companies: "Empresas",
    members: "Miembros",
    invite: "Invitar",
  },
  post: {
    title: "Invitar Miembro",
    titleShort: "Invitar Miembro",
    description: "Invitar a un usuario registrado a la empresa por email",
    companyId: {
      label: "Company ID",
      description: "La empresa para invitar al usuario a",
    },
    email: {
      label: "Correo electrónico",
      description: "Email del usuario registrado para invitar",
      placeholder: "colleague@company.com",
    },
    role: {
      label: "Función",
      description: "Función de asignar al nuevo miembro",
      placeholder: "Seleccionar el papel",
    },
    errors: {
      validation: {
        title: "Error de validación",
        description: "Revisa el correo electrónico y prueba de nuevo",
      },
      unauthorized: {
        title: "No se registró",
        description: "Inicie sesión para invitar a miembros",
      },
      forbidden: {
        title: "Acceso denegado",
        description:
          "Función de administrador o propietario requerida para invitar a miembros",
      },
      conflict: {
        title: "Ya es miembro",
        description: "Este usuario ya es miembro de la empresa",
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
        title: "Usuario No encontrado",
        description:
          "No se ha encontrado ningún usuario registrado en este correo electrónico",
      },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Tienes cambios sin guardar",
      },
    },
    success: {
      title: "Member Invited",
      description: "El usuario ha sido añadido a la empresa",
    },
    response: {
      memberId: "Member ID",
      userId: "Usuario ID",
      role: "Función",
    },
    widget: {
      back: "Volver a los Miembros",
      invited: "Miembro invitado",
    },
  },
};
