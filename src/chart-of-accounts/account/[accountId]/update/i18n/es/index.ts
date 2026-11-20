import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  patch: {
    title: "Editar cuenta",
    titleShort: "Editar cuenta",
    description:
      "Actualizar el nombre de la cuenta, descripción o orden. El tipo y el subtipo no pueden cambiarse en las cuentas del sistema.",
    accountId: {
      label: "Cuenta",
      description: "La cuenta para editar",
      placeholder: "Cuenta UUID",
    },
    code: {
      label: "Código",
      description: "Código de la cuenta",
    },
    type: {
      label: "Tipo",
      description: "Tipo de cuenta",
    },
    subtype: {
      label: "Subtipo",
      description: "Subtipo de la cuenta",
    },
    isSystem: {
      label: "Cuenta del sistema",
      description: "Si esto es una cuenta de sistema",
    },
    isActive: {
      label: "Activa",
      description: "Si esta cuenta está activa",
    },
    name: {
      label: "Nombre de la cuenta",
      description: "Nombre de visualización para esta cuenta",
      placeholder: "Por ejemplo. Cuentas disponibles",
    },
    accountDescription: {
      label: "Descripción",
      description: "Notas opcionales sobre el propósito de esta cuenta",
      placeholder: "Por ejemplo. Pistas de cantidades adeudadas por clientes",
    },
    sortOrder: {
      label: "Ordenar orden",
      description:
        "Orden de visualización dentro del grupo padre. los números inferiores aparecen primero",
      placeholder: "por ejemplo 10",
    },
    errors: {
      unauthorized: {
        title: "Se requiere autenticación",
        description: "Acceso requerido",
      },
      validation: {
        title: "Error de validación",
        description: "Ver todos los campos",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "No puede modificar los campos de cuenta del sistema",
      },
      server: {
        title: "Error del servidor",
        description: "No se puede actualizar la cuenta",
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
      notFound: { title: "No encontrado", description: "Cuenta no encontrada" },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Tienes cambios sin guardar",
      },
    },
    success: {
      title: "Actualización de la cuenta",
      description: "Cambios salvados",
    },
    widget: {
      savedLabel: "Guardado",
      failedLabel: "Failed",
      back: "Atrás",
      submit: "Guardar cambios",
      viewAccount: "Ver Cuenta",
      successTitle: "Cambios salvados",
      successDesc: "La cuenta ha sido actualizada.",
      systemNotice: "Cuenta del sistema: tipo y subtipo están bloqueados.",
      inactiveNotice: "Esta cuenta es inactiva.",
      selectPrompt: "Elija una cuenta para editar",
    },
  },
  title: "Editar cuenta",
  description: "Editar detalles de la cuenta",
  category: "Gráfico de Cuentas",
  tag: "Cuenta",
};
