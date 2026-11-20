import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  post: {
    title: "Cuenta desactivada",
    titleShort: "Desactivar",
    description:
      "Desactivar una cuenta. No puede desactivar cuentas del sistema o cuentas con las líneas de entrada de la revista publicadas.",
    accountId: {
      label: "Cuenta ID",
      description: "La cuenta para desactivar",
      placeholder: "Cuenta UUID",
    },
    errors: {
      unauthorized: {
        title: "Se requiere autenticación",
        description: "Acceso requerido",
      },
      validation: {
        title: "Error de validación",
        description: "Cuenta inválida ID",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "Las cuentas del sistema no pueden desactivarse",
      },
      server: {
        title: "Error del servidor",
        description: "No se puede desactivar la cuenta",
      },
      unknown: {
        title: "Error desconocido",
        description: "Ocurrió un error inesperado",
      },
      conflict: {
        title: "Ha habido transacciones",
        description:
          "No se puede desactivar una cuenta que tenga líneas de entrada de diario",
      },
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
      title: "Cuenta desactivada",
      description: "La cuenta ahora es inactiva",
    },
    widget: {
      confirmWarning:
        "Esta cuenta será desactivada. Esta acción no puede ser aprobada para cuentas con transacciones publicadas.",
      doneLabel: "Listo",
      confirmTitle: "¿Desactivar la cuenta?",
      confirmDescription:
        "Esta cuenta será desactivada y ya no se puede utilizar para nuevas entradas de revistas. Las entradas existentes no se ven afectadas.",
      confirmButton: "Sí, desactivar",
      cancelButton: "Cancelar",
    },
  },
  title: "Cuenta desactivada",
  description: "Suave desactivar una cuenta",
  category: "Gráfico de Cuentas",
  tag: "Cuenta",
};
