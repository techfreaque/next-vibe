import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Pasivos por créditos de clientes",
  description:
    "Consulta el pasivo contabilizado de los paquetes de créditos pagados vinculados a esta empresa.",
  tag: "Pasivos por créditos",
  company: "Empresa",
  choose:
    "Selecciona una empresa para consultar el pasivo contabilizado por créditos.",
  empty: "No hay asientos vinculados a créditos pagados",
  account: "Cuenta contable",
  currency: "Moneda",
  amount: "Saldo contable",
  asOf: "Situación al",
  reportDay: "Hasta el {{date}} (UTC)",
  scope:
    "Se incluyen ventas, reembolsos, ingresos reconocidos y reversiones vinculados. Se excluyen los créditos de monederos y los importes sin vinculación empresarial verificada.",
  ledgerScope:
    "Abre una cuenta para ver el libro mayor completo, incluidos los asientos ajenos al informe.",
  supplierLink: "Consultar anticipos a proveedores",
  errors: {
    validation: {
      title: "Revisa la empresa seleccionada",
      description: "Selecciona una empresa activa a la que tengas acceso.",
    },
    forbidden: {
      title: "Se necesita acceso a la empresa",
      description: "No tienes acceso a esta empresa.",
    },
    server: {
      title: "No se pudieron cargar los pasivos por créditos",
      description: "Intenta cargar el informe de nuevo.",
    },
  },
};
