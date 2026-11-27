import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  post: {
    title: "Período de cuenta abierto",
    titleShort: "Nuevo período",
    description: "Crear un nuevo período de contabilidad para una empresa",
    companyId: {
      label: "Empresa",
      description: "Empresa para abrir el período",
      placeholder: "Selecciona una empresa",
    },
    name: {
      label: "Nombre del período",
      description: "Por ejemplo. 2026 de enero",
      placeholder: "2026 de enero",
    },
    startDate: {
      label: "Fecha de inicio",
      description: "Fecha de inicio del período",
      placeholder: "",
    },
    endDate: {
      label: "Fecha final",
      description: "Fecha final del período",
      placeholder: "",
    },
    response: { id: "Período ID", name: "Nombre" },
    errors: {
      unauthorized: {
        title: "Se requiere autenticación",
        description: "Acceso requerido",
      },
      validation: {
        title: "Error de validación",
        description: "Fechas de inicio/fino",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "Autorizaciones insuficientes",
      },
      server: {
        title: "Error del servidor",
        description: "No se puede crear el período",
      },
      unknown: {
        title: "Error desconocido",
        description: "Ocurrió un error inesperado",
      },
      conflict: {
        title: "Superposición",
        description: "El rango de fechas se superpone con el período existente",
      },
      network: {
        title: "Error de red",
        description: "No podía llegar al servidor",
      },
      notFound: {
        title: "No encontrado",
        description: "Compañía no encontrada",
      },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Tienes cambios sin guardar",
      },
    },
    success: {
      title: "Período Creado",
      description: "Período de cuenta abierto",
    },
    widget: {
      viewButton: "Período de vista",
      back: "Atrás",
    },
  },
  title: "Crear período",
  description: "Abrir un nuevo período de contabilidad",
  category: "Gráfico de Cuentas",
  tag: "Período",
};
