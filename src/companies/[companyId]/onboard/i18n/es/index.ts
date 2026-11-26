import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  enums: {
    country: {
      AT: "Austria (AT)",
      DE: "Alemania (DE)",
      XX: "Plan genérico (tipos impositivos por configurar)",
      SK: "Eslovaquia (SK)",
    },
  },
  tags: { companies: "empresas", onboard: "a bordo", setup: "Configuración" },
  post: {
    title: "Configurar la contabilidad",
    titleShort: "Configurar la contabilidad",
    description:
      "Instala el plan contable y prepara las cuentas de caja y banco para contabilizar movimientos.",
    companyId: { label: "Empresa", description: "Empresa" },
    country: {
      genericPreview:
        "Añade un plan genérico. Configura los tipos impositivos antes de emitir facturas.",
      regionalPreview:
        "Usa el plan contable y los tipos de IVA del país seleccionado.",
      label: "Plantilla del plan contable",
      description:
        "Si la empresa está registrada en Austria o Alemania, elige la plantilla de ese país. Para otros países, elige el plan genérico.",
      placeholder: "Elige una plantilla",
    },
    period: {
      title: "Primer periodo contable",
      open: "Abrir este periodo durante la configuración",
      description:
        "Se propone el mes actual. Cambia las fechas para un periodo personalizado o anual.",
      name: "Nombre del periodo",
      start: "Fecha de inicio",
      end: "Fecha de fin",
      proposal: "Periodo propuesto {{name}}, del {{start}} al {{end}}",
      kept: "Se conserva el calendario contable existente.",
      invalid:
        "Indica un nombre y una fecha de fin igual o posterior a la de inicio.",
      opened: "El periodo {{name}} está abierto para contabilizar.",
      view: "Ver periodos contables",
      viewHint: "Revisa el calendario contable.",
      createHint: "Elige las fechas antes de registrar el primer asiento.",
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
        title: "El plan contable existente usa una plantilla de otro país",
        description:
          "Revisa el plan contable existente antes de cambiar la plantilla.",
      },
      profileMismatch:
        "Elige la plantilla que corresponda al país del perfil de la empresa.",
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
      title: "Configuración contable completada",
      description:
        "El plan contable está listo. Puedes abrir un periodo y empezar a crear documentos.",
    },
    widget: {
      books: "Configuración contable",
      setupCounts: "Cuentas listas {{accounts}} · Tipos añadidos {{rates}}",
      invoiceHint:
        "Prepara un borrador para esta empresa y revísalo antes de emitirlo.",
      submit: "Configurar la contabilidad",
      company: "Empresa: {{name}}",
      back: "Volver",
      cashAndBankReady:
        "Las cuentas de caja y banco están listas para contabilizar movimientos.",
      nextHint: "Abre un periodo contable antes de contabilizar asientos.",
      period: "Crear un periodo",
      invoice: "Crear borrador de factura",
    },
    response: {
      accountsCreated: "Cuentas añadidas",
      accountsSkipped: "Cuentas existentes",
      taxRatesCreated: "Tipos impositivos añadidos",
      cashAccountId: "Cuenta de efectivo ID",
      bankAccountId: "Cuenta bancaria ID",
      success: "Operación completada",
    },
  },
};
