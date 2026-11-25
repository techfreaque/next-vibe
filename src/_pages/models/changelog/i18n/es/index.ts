import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    category: "Modelos de IA",
    title:
      "Changelog de modelos de IA: nuevos, retirados y con precio nuevo | {{appName}}",
    description:
      "Cada cambio de modelos en {{appName}}, con fecha: modelos nuevos, modelos retirados y quién los reemplaza, cambios de precio y de nivel. Sacado directamente de nuestro registro de modelos. Con feed RSS.",
    imageAlt: "Changelog de modelos en {{appName}}",
    keywords:
      "changelog modelos IA, nuevos modelos IA, precios LLM, modelos IA retirados, novedades modelos sin censura, {{appName}}",
  },
  breadcrumb: {
    models: "Modelos de IA",
    changelog: "Changelog",
  },
  hero: {
    eyebrow: "Actualizado el {{date}}",
    title: "Changelog de modelos",
    subtitle:
      "Qué modelos llegaron, cuáles pasaron a legacy, qué bajó de precio. Cada entrada tiene fecha y sale directamente de nuestro registro de modelos.",
    rss: "Feed RSS",
    allModels: "Todos los modelos",
  },
  stats: {
    added: "Modelos añadidos",
    legacy: "Pasados a legacy",
    repriced: "Cambios de precio",
    since: "Registrado desde",
  },
  badge: {
    replaces: "Sucesor",
    added: "Nuevo",
    legacy: "Legacy",
    restored: "Vuelve",
    repriced: "Precio",
    tier: "Nivel",
    removed: "Retirado",
  },
  title: {
    added: "Modelo nuevo",
    legacy: "Pasado a legacy",
    restored: "De vuelta en el catálogo",
    repriced: "Cambio de precio",
    tier: "Cambio de nivel",
    removed: "Retirado",
  },
  summary: {
    added: "Nuevo modelo en el nivel {{tier}}.",
    legacy: "Pasado a legacy. Ya no aparece en el selector de modelos.",
    replacedBy: "Reemplazado por",
    replaces: "Toma el relevo de",
    restored: "De vuelta en el catálogo activo.",
    tier: "Pasa del nivel {{from}} al nivel {{to}}.",
    removed: "Ya no se ofrece.",
    priceUp: "{{metric}} sube un {{percent}}",
    priceDown: "{{metric}} baja un {{percent}}",
  },
  metric: {
    input: "Precio de entrada",
    output: "Precio de salida",
    image: "Precio por imagen",
    second: "Precio por segundo",
    clip: "Precio por clip",
    character: "Precio por carácter",
    fixed: "Precio por mensaje",
  },
  list: {
    heading: "Todos los cambios",
    empty: "Todavía no hay cambios registrados.",
    count: "{{count}} cambios",
  },
  about: {
    heading: "De dónde salen los datos",
    body: "Cada entrada se genera a partir del historial de versiones de nuestro registro de modelos: los mismos archivos que mueven el selector de modelos, los precios y la facturación. Nadie escribe esta lista a mano. La fecha marca cuándo llegó el cambio al registro.",
    prices:
      "Los cambios de precio comparan la ruta pública más barata antes y después. Un cambio puede venir del propio proveedor, o de que se añadió o se quitó una ruta más barata.",
    start:
      "El registro empieza el {{date}}. Los modelos que ya estaban activos entonces no tienen entrada Nuevo.",
  },
  model: {
    heading: "Qué ha cambiado",
    intro:
      "Cambios con fecha en {{model}}, directos de nuestro registro de modelos.",
    none: "Sin cambios en {{model}} desde que empezó el registro, el {{date}}.",
    link: "Changelog completo de modelos",
  },
  index: {
    link: "Changelog de modelos",
    hint: "Modelos nuevos, legacy y con precio nuevo, con fecha",
  },
  feed: {
    title: "Changelog de modelos de {{appName}}",
    description:
      "Nuevos modelos de IA, pasos a legacy y cambios de precio en {{appName}}, con fecha, desde nuestro registro de modelos.",
  },
};
