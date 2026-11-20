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
    create: "Crear",
  },
  post: {
    title: "Create Company",
    titleShort: "New Company",
    description:
      "Registre una nueva empresa. Te conviertes en su dueño automáticamente.",
    name: {
      label: "Nombre de la empresa",
      description: "Nombre legal de la empresa",
      placeholder: "Acme GmbH",
    },
    type: {
      label: "Tipo de empresa",
      description: "Modelo de negocio: B2B, B2C o individual",
      placeholder: "Seleccione el tipo",
    },
    vatNumber: {
      label: "Número de VAT",
      description: "Número de identificación VAT con fines fiscales",
      placeholder: "DE123456789",
    },
    country: {
      label: "País",
      description: "País donde la empresa está registrada",
      placeholder: "Seleccionar país",
    },
    currency: {
      label: "Moneda por defecto",
      description: "Moneda primaria para facturación",
      placeholder: "EUR",
    },
    email: {
      label: "Company Email",
      description: "Dirección de correo electrónico de negocios primario",
      placeholder: "contact@company.com",
    },
    phone: {
      label: "Company Phone",
      description: "Número de teléfono principal",
      placeholder: "+43 1 234 5678",
    },
    website: {
      label: "Sitio web",
      description: "Sitio web de la empresa URL",
      placeholder: "https://company.com",
    },
    errors: {
      validation: {
        title: "Error de validación",
        description: "Revise los campos del formulario e inténtelo de nuevo",
      },
      unauthorized: {
        title: "No se registró",
        description: "Inicie sesión para crear una empresa",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "Usted no tiene permiso para crear una empresa",
      },
      conflict: {
        title: "Ya existe.",
        description: "Una empresa con este nombre ya existe",
      },
      server: {
        title: "Error del servidor",
        description: "Algo salió mal en nuestro extremo. inténtalo de nuevo",
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
        description: "No se encontró el recurso",
      },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Tienes cambios sin guardar",
      },
    },
    success: {
      title: "Empresa Creada",
      description: "Su compañía está lista. Añadir miembros para empezar.",
    },
    response: {
      id: "Company ID",
      name: "Nombre de la empresa",
    },
    widget: {
      viewCompany: "View Company",
      back: "Volver a la lista",
    },
  },
};
