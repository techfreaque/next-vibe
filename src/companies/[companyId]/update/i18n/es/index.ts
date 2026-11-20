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
    update: "Actualización",
    management: "Gestión",
  },
  patch: {
    title: "Update Company",
    titleShort: "Update Company",
    description:
      "Editar detalles de la compañía. Requiere el papel de Admin o Propietario.",
    companyId: {
      label: "Company ID",
      description: "La empresa para actualizar",
    },
    name: {
      label: "Nombre de la empresa",
      description: "Nombre legal de la empresa",
      placeholder: "Acme GmbH",
    },
    type: {
      label: "Tipo de empresa",
      description: "Modelo de negocio",
      placeholder: "Seleccione el tipo",
    },
    vatNumber: {
      label: "Número de VAT",
      description: "Número de identificación VAT",
      placeholder: "DE123456789",
    },
    country: {
      label: "País",
      description: "País de inscripción",
      placeholder: "DE",
    },
    currency: {
      label: "Moneda por defecto",
      description: "Moneda de facturación primaria",
      placeholder: "EUR",
    },
    email: {
      label: "Company Email",
      description: "Correo electrónico de negocios primario",
      placeholder: "contact@company.com",
    },
    phone: {
      label: "Company Phone",
      description: "Teléfono de negocios primario",
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
        description: "Revise el formulario e inténtelo de nuevo",
      },
      unauthorized: {
        title: "No se registró",
        description: "Inicie sesión para actualizar detalles de la empresa",
      },
      forbidden: {
        title: "Acceso denegado",
        description:
          "Función de administrador o propietario necesaria para actualizar los detalles de la empresa",
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
      title: "Actualización de la empresa",
      description: "Detalles de la empresa guardados con éxito",
    },
    response: {
      id: "Company ID",
      name: "Nombre de la empresa",
    },
    widget: {
      back: "Atrás",
      successLabel: "Empresa actualizada",
      viewCompany: "View Company",
    },
  },
};
