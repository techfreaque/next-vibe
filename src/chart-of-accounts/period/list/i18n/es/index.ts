import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  get: {
    title: "Períodos de contabilidad",
    titleShort: "Períodos",
    description: "Listar todos los periodos de contabilidad para una empresa",
    companyId: {
      label: "Company ID",
      description: "Compañía cuyos períodos de lista",
      placeholder: "Entrar en la empresa UUID",
    },
    response: {
      periods: "Períodos",
      id: "ID",
      name: "Nombre",
      startDate: "Comienzo",
      endDate: "Final",
      status: "Situación",
      closedAt: "Cerrado",
    },
    errors: {
      unauthorized: {
        title: "Se requiere autenticación",
        description: "Acceso requerido",
      },
      validation: {
        title: "Error de validación",
        description: "Inválido ID",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "Autorizaciones insuficientes",
      },
      server: {
        title: "Error del servidor",
        description: "No se pueden cargar períodos",
      },
      unknown: {
        title: "Error desconocido",
        description: "Ocurrió un error inesperado",
      },
      conflict: { title: "Conflicto", description: "Conflicto de datos" },
      network: {
        title: "Error de red",
        description: "No podía llegar al servidor",
      },
      notFound: {
        title: "No encontrado",
        description: "No hay períodos encontrados",
      },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Tienes cambios sin guardar",
      },
    },
    success: {
      title: "Períodos cargados",
      description: "Períodos de contabilidad recuperados",
    },
    widget: {
      loading: "Períodos de carga...",
      empty: "No se han encontrado períodos contables.",
      createButton: "Crear período",
    },
  },
  enums: {
    periodStatus: {
      OPEN: "Abierto",
      CLOSED: "Cerrado",
      LOCKED: "Bloqueados",
    },
  },
  title: "Lista de períodos",
  description: "Períodos de contabilidad",
  category: "Gráfico de Cuentas",
  tag: "Período",
};
