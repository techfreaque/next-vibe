import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Referidos",
  tags: {
    referral: "referral",
    admin: "admin",
  },
  post: {
    title: "Código de referencia Bono",
    titleShort: "Código de bonificación",
    description:
      "Establezca los créditos de bonificación de una sola vez un código de remisión da a la gente que trae. Pagado cuando comienzan su primer plan pagado, nunca en la inscripción gratuita. 0 elimina el bono.",
    fields: {
      code: {
        label: "Código de referido",
        description: "El código para cambiar (caso no importa)",
        placeholder: "krysalid",
      },
      bonusCredits: {
        label: "Créditos de bonificación",
        description:
          "Créditos concedidos una vez con el primer plan pagado. 0 = sin bono.",
        placeholder: "100",
      },
    },
    response: {
      code: "Código",
      ownerEmail: "Propietario del Código",
      previousBonusCredits: "Previo bono",
      subscriptionBonusCredits: "Créditos de bonificación",
    },
    widget: {
      back: "Atrás",
      hint: 'Se muestra en el registro como "+N créditos de bonificación con su primera suscripción". Concedido una vez por usuario.',
      submit: "Ahorra bono",
      set: "{{code}} ({{owner}}): + créditos {{credits}} con el primer plan (fue {{previous}}).",
      cleared: "{{code}} ({{owner}}): no hay bonificación (fue {{previous}}).",
    },
  },
  errors: {
    validation: {
      title: "Entrada inválida",
      description: "Compruebe el código y la cantidad de crédito",
    },
    unauthorized: {
      title: "No está firmado",
      description:
        "Inicie sesión como administrador para establecer bonos de código",
    },
    forbidden: {
      title: "Admins only",
      description: "Sólo los administradores pueden establecer bonos de código",
    },
    notFound: {
      title: "Cuenta o sesión no encontradas",
      description: "El código no existe",
    },
    conflict: {
      title: "Conflicto",
      description: "El código cambió mientras tanto, inténtalo de nuevo",
    },
    server: {
      title: "Error del servidor",
      description: "No podía salvar el bono",
    },
    network: {
      title: "Error de red",
      description: "La solicitud no llegó al servidor",
    },
    unknown: {
      title: "Error desconocido",
      description: "Algo inesperado falló",
    },
    unsavedChanges: {
      title: "Cambios sin guardar",
      description: "Guardar o descartar sus cambios primero",
    },
    codeNotFound: "Código de referencia {{code}} no existe",
  },
  success: {
    title: "Guardado",
    description: "Bono de código actualizado",
  },
};
