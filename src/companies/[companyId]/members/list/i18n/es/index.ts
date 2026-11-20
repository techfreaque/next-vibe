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
    list: "Lista",
  },
  get: {
    title: "Miembros del Equipo",
    titleShort: "Miembros del Equipo",
    description: "Listar a todos los miembros de esta empresa",
    companyId: {
      label: "Company ID",
      description: "La empresa cuyos miembros se enumeran",
    },
    errors: {
      validation: {
        title: "Error de validación",
        description: "Inválido ID",
      },
      unauthorized: {
        title: "No se registró",
        description: "Inicie sesión para ver a los miembros de la empresa",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "Usted no es miembro de esta empresa",
      },
      conflict: {
        title: "Conflicto",
        description: "Conflicto de datos",
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
        title: "Company Not Found",
        description: "Esta compañía no existe",
      },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Tienes cambios sin guardar",
      },
    },
    success: {
      title: "Miembros cargados",
      description: "Lista de miembros recuperada",
    },
    response: {
      id: "Member ID",
      userId: "Usuario ID",
      email: "Correo electrónico",
      name: "Nombre",
      role: "Función",
      isActive: "Activa",
      joinedAt: "Únete",
    },
    widget: {
      back: "Atrás",
      loading: "Miembros de carga...",
      title: "Miembros del Equipo",
      memberSingular: "miembro",
      memberPlural: "miembros",
      invite: "Invitar Miembro",
      updateRole: "Función del cambio",
      remove: "Retirar",
      active: "Activa",
      inactive: "Inactivo",
      empty: {
        title: "Todavía no hay miembros del equipo",
        hint: "Invitar a los colegas a colaborar en la contabilidad y las operaciones de esta empresa.",
        cta: "Invitar primer miembro",
      },
    },
  },
};
