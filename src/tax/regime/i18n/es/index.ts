import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  errors: {
    validation: {
      title: "Error de validación",
      description:
        "Compruebe el país de la empresa, el régimen de IVA y la fecha de entrada en vigor.",
    },
    unauthorized: {
      title: "Se requiere autenticación",
      description: "Debes estar conectado.",
    },
    forbidden: {
      title: "Acceso denegado",
      description:
        "Solo los propietarios y administradores de la empresa pueden cambiar el régimen de IVA.",
    },
    notFound: {
      title: "No encontrado",
      description: "Compañía no encontrada",
    },
    conflict: {
      title: "Fecha de entrada en vigor ya utilizada",
      description: "Ya hay un régimen de IVA registrado para esa fecha.",
    },
    server: {
      title: "Error del servidor",
      description: "Se produjo un error interno",
    },
    network: {
      title: "Error de red",
      description: "Se produjo un error de red",
    },
    unknown: {
      title: "Error desconocido",
      description: "Ocurrió un error inesperado",
    },
    unsavedChanges: {
      title: "Cambios sin guardar",
      description: "Tienes cambios sin guardar",
    },
  },
  reviewDescription:
    "Consulte el régimen de IVA aplicable a la empresa en la fecha seleccionada.",
  view: "Consultar el régimen de IVA",
  asOf: "A fecha de",
  change: "Cambiar régimen fiscal",
  regimes: {
    standard: "Régimen general de IVA",
    german: "Alemania: exención para pequeñas empresas (§ 19 UStG)",
    austrian:
      "Austria: exención para pequeñas empresas (§ 6, apdo. 1, n.º 27 UStG)",
    slovak: "Eslovaquia: empresa no registrada a efectos del IVA",
    slovakSection7:
      "Eslovaquia: registrada a efectos del IVA según el § 7 (no sujeto pasivo)",
    slovakSection7a:
      "Eslovaquia: registrada a efectos del IVA según el § 7a (no sujeto pasivo)",
  },
  title: "Régimen de IVA de la empresa",
  description:
    "Elija cómo se aplica el IVA a los documentos desde la fecha indicada.",
  company: "Empresa",
  from: "Vigente desde",
  save: "Guardar régimen fiscal",
  regime: "Tratamiento del IVA",
  saved: "El régimen se aplica desde la fecha seleccionada.",
  conflict: "Elija otra fecha o revise el régimen ya registrado.",
  foreign:
    "Consulte con su asesor fiscal los servicios adquiridos en el extranjero. La inversión del sujeto pasivo también puede aplicarse a pequeñas empresas exentas.",
  saleConflict:
    "El IVA repercutido es incompatible con la exención. Revise las partidas antes de emitir la factura.",
  choose: "Elige el régimen de IVA",
  back: "Volver",
  appliesOn: "Régimen de IVA a {{date}}",
  invoiceText: "Texto en las facturas",
  savedTitle: "{{regime}} se aplica desde el {{date}}",
  pickCompany: {
    title: "Elige una empresa",
    message:
      "Consulta qué reglas de IVA se aplican a sus facturas en cualquier fecha.",
  },
  hints: {
    standard:
      "Las facturas aplican IVA con los tipos de la empresa. El IVA soportado es deducible.",
    german: "Facturas sin IVA, con la mención de exención del § 19 UStG.",
    austrian:
      "Facturas sin IVA, con la mención del régimen austriaco de pequeñas empresas.",
    slovak:
      "Facturas sin IVA, porque la empresa no está registrada a efectos del IVA.",
    slovakSection7:
      "Facturas nacionales sin IVA. Las adquisiciones de bienes en la UE por encima del umbral las tributa usted con su NIF-IVA SK.",
    slovakSection7a:
      "Facturas nacionales sin IVA. Los servicios a empresas de la UE usan inversión del sujeto pasivo con su NIF-IVA SK.",
  },
};
