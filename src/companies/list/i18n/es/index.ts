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
    list: "Lista",
  },
  get: {
    title: "Mis empresas",
    titleShort: "Empresas",
    description: "Empresas que son miembros de",
    page: {
      label: "Página",
      description: "Número de página (fotos a 1)",
    },
    pageSize: {
      label: "Por página",
      description: "Resultados por página (max 100)",
    },
    errors: {
      validation: {
        title: "Error de validación",
        description: "Solicitud inválida",
      },
      unauthorized: {
        title: "No se registró",
        description: "Inicie sesión para ver sus empresas",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "Acceso denegado",
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
        title: "No encontrado",
        description: "No hay ninguna empresa encontrada",
      },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Tienes cambios sin guardar",
      },
    },
    success: {
      title: "Empresas cargadas",
      description: "Lista de la empresa recuperada",
    },
    widget: {
      back: "Atrás",
      loading: "Cargando empresas...",
      title: "Mis empresas",
      create: "New Company",
      total: "empresas",
      totalSingular: "empresa",
      inactive: "Inactivo",
      empty: {
        title: "Todavía no hay ninguna empresa",
        hint: "Cree una empresa para comenzar a gestionar su contabilidad, facturación y equipo.",
        cta: "Crear su primera empresa",
      },
    },
    response: {
      total: "Total",
      id: "ID",
      name: "Nombre",
      type: "Tipo",
      role: "Su papel",
      isActive: "Activa",
      country: "País",
      currency: "Moneda",
      email: "Correo electrónico",
      createdAt: "Creado",
    },
  },
};
