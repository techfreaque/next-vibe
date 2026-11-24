import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  trigger: "Idioma y región: {{language}}, {{region}}",
  title: "Idioma y región",
  description:
    "Elige el idioma de la interfaz y la región que determina tu moneda y tus precios.",
  language: "Idioma",
  region: "Región",
  regionHint: "Define tu moneda y tus precios.",
  pricesIn: "Precios en {{currency}}",
  searchRegions: "Buscar país",
  noResults: "No se encontró ningún país. Prueba otro nombre.",
};
