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
    get: "¡Vamos!",
  },
  get: {
    title: "Información de la empresa",
    titleShort: "Company",
    description: "Ver información de la empresa",
    companyId: {
      label: "Company ID",
      description: "La empresa para ver",
    },
    errors: {
      validation: {
        title: "Error de validación",
        description: "Inválido ID",
      },
      unauthorized: {
        title: "No se registró",
        description: "Inicie sesión para ver detalles de la empresa",
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
        description: "Esta compañía no existe o usted perdió el acceso",
      },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Tienes cambios sin guardar",
      },
    },
    success: {
      title: "Compañía cargada",
      description: "Datos de la compañía recuperados",
    },
    widget: {
      setupAccounting: "Configurar la contabilidad",
      back: "Atrás",
      loading: "Compañía de carga...",
      edit: "Editar",
      members: "Miembros",
      invite: "Invitar Miembro",
      chartOfAccounts: "Gráfico de Cuentas",
      viewInvoices: "Ver facturas",
      viewTerminals: "Ver Terminales POS",
      active: "Activa",
      inactive: "Inactivo",
      country: "País",
      currency: "Moneda",
      vatNumber: "Número de VAT",
      taxId: "Impuesto ID",
      email: "Correo electrónico",
      phone: "Teléfono",
      website: "Sitio web",
      createdAt: "Miembro desde",
      actions: "Acciones",
      modules: {
        title: "Módulos",
        accounting: {
          label: "Contabilidad",
          description: "Cargo de cuentas, entradas de revistas, informes",
        },
        invoices: {
          label: "Facturas",
          description: "AR facturas, estimaciones, pagos",
        },
        estimates: {
          label: "Estimación",
          description: "Proyecto de presupuestos para clientes",
        },
        bills: {
          label: "Bills",
          description: "Facturas AP y pagos de proveedores",
        },
        pos: {
          label: "Punto de venta",
          description: "Terminales, sesiones, órdenes",
        },
        purchasing: {
          label: "Compras",
          description: "Pedidos de compra y proveedores",
        },
        inventory: {
          label: "Inventario",
          description: "Stock, warehouses, transfers",
        },
        team: {
          label: "Equipo",
          description: "Miembros y funciones",
        },
      },
    },
  },
};
