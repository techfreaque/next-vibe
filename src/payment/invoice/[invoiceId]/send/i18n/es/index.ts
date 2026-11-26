import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Facturación",
  tags: {
    payment: "pago",
    invoice: "factura",
  },
  post: {
    title: "Emitir factura",
    titleShort: "Emitir factura",
    description: "Emite el borrador y contabiliza la cuenta por cobrar.",
    form: {
      title: "Emitir factura",
      description: "Tras emitirla se generará un enlace para el cliente.",
    },
    response: {
      success: "Factura emitida",
      message: "Mensaje de Estado",
      viewUrl: "Vista al cliente URL",
    },
    errors: {
      invoiceLines:
        "Añade líneas con un total positivo antes de emitir la factura.",
      posting:
        "Revisa el total de la factura, la moneda de la empresa, el periodo contable y las cuentas de registro.",
      unauthorized: {
        title: "Se requiere autenticación",
        description: "Inicia sesión para continuar",
      },
      validation: {
        title: "Error de validación",
        description: "Parámetros inválidos",
      },
      server: {
        title: "Error del servidor",
        description: "Ocurrió un error interno del servidor",
      },
      unknown: {
        title: "Error desconocido",
        description: "Ocurrió un error desconocido",
      },
      network: {
        title: "Error de red",
        description: "Ocurrió un error de red",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "No tienes acceso",
      },
      notFound: {
        title: "No encontrado",
        description: "Factura no encontrada",
      },
      conflict: {
        title: "Conflicto",
        description: "La facturación no figura en el proyecto de estatuto",
      },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Hay cambios sin salvar",
      },
    },
    success: {
      title: "Factura emitida",
      description: "El enlace de consulta está listo para compartir.",
    },
  },
  invoiceId: {
    label: "Factura ID",
    description: "ID de la factura para enviar",
    placeholder: "Introduzca la factura ID",
  },
  delivery: {
    share: "Compartir factura",
    description:
      "Copia el enlace para el cliente o envíalo al correo registrado en la factura.",
    send: "Enviar por correo",
    confirmDescription:
      "Envía el enlace de la factura al destinatario confirmado.",
    recipient: "Destinatario de la factura",
    noRecipient:
      "La factura no tiene un destinatario válido. Puedes copiar el enlace.",
    status: "Estado del correo",
    notIssued: "Solo se pueden compartir facturas emitidas.",
    recipientChanged:
      "El destinatario cambió o no está disponible. Abre de nuevo la opción Compartir factura.",
    emailSubject: "Factura {{number}}",
    emailText:
      "{{company}} ha emitido la factura {{number}}. Ábrela aquí:\n{{url}}",
    states: {
      ready: "Listo para enviar",
      pending:
        "El envío está en curso o pendiente de confirmación. Los nuevos intentos están pausados.",
      accepted: "El servidor de correo aceptó el mensaje.",
      retryable:
        "No se contactó con el servidor de correo. Puedes volver a intentarlo.",
      uncertain:
        "No se pudo confirmar el resultado del envío. Consulta al destinatario antes de compartir el enlace por separado.",
    },
  },
  widget: {
    back: "Atrás",
    submit: "Emitir factura",
    sent: "Comparte el enlace con el cliente para entregarle la factura.",
    copy: "Copiar enlace para el cliente",
    copied: "Enlace copiado",
    copyError:
      "No se pudo copiar el enlace. Selecciona y copia la dirección de arriba.",
    viewUrl: "Enlace de vista al cliente",
  },
};
