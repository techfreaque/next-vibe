import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  enums: {
    country: {
      AT: "Austria (AT)",
      DE: "Alemania (DE)",
      XX: "Genérico (XX)",
    },
  },
  tags: { companies: "empresas", onboard: "a bordo", setup: "Configuración" },
  post: {
    title: "Onboard Company",
    titleShort: "A bordo",
    description:
      "Establecer una nueva empresa: mapa de cuentas, tasas fiscales y cuenta bancaria predeterminada",
    companyId: {
      label: "Company ID",
      description: "La empresa para establecer",
    },
    country: {
      label: "País",
      description:
        "País determina los índices de impuestos y la plantilla de cuentas",
      placeholder: "DE",
    },
    errors: {
      validation: {
        title: "Error de validación",
        description: "Ver todos los campos",
      },
      unauthorized: {
        title: "No se registró",
        description: "Inicie sesión a bordo de una empresa",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "Función de personal necesaria",
      },
      conflict: {
        title: "Ya está a bordo",
        description: "La compañía ya ha sido creada",
      },
      server: {
        title: "Error del servidor",
        description: "No se puede completar a bordo",
      },
      unknown: {
        title: "Error desconocido",
        description: "Ocurrió un error inesperado",
      },
      network: { title: "Error de red", description: "Comprueba tu conexión" },
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
      title: "Compañía lista",
      description: "Empresa creada con éxito",
    },
    response: {
      accountsCreated: "Cuentas creadas",
      accountsSkipped: "Cuentas gastadas",
      taxRatesCreated: "Tasas de impuestos creadas",
      cashAccountId: "Cuenta de efectivo ID",
      bankAccountId: "Cuenta bancaria ID",
      success: "Operación completada",
    },
  },
};
