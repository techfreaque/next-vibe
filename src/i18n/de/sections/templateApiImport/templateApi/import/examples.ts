import type { examplesTranslations as EnglishExamplesTranslations } from "../../../../../en/sections/templateApiImport/templateApi/import/examples";

export const examplesTranslations: typeof EnglishExamplesTranslations = {
  csv: {
    title: "CSV-Format-Beispiel",
    description: "Beispiel für CSV-Format für Vorlagen-Import",
    sample:
      'name,description,content,status,tags\\n\\"E-Mail-Vorlage\\",\\"Newsletter-Vorlage\\",\\"<h1>{{title}}</h1>\\",\\"DRAFT\\",\\"email,newsletter\\"',
  },
  json: {
    title: "JSON-Format-Beispiel",
    description: "Beispiel für JSON-Format für Vorlagen-Import",
    sample:
      '[\\n  {\\n    \\"name\\": \\"E-Mail-Vorlage\\",\\n    \\"description\\": \\"Newsletter-Vorlage\\",\\n    \\"content\\": \\"<h1>{{title}}</h1>\\",\\n    \\"status\\": \\"DRAFT\\",\\n    \\"tags\\": [\\"email\\", \\"newsletter\\"]\\n  }\\n]',
  },
  xml: {
    title: "XML-Format-Beispiel",
    description: "Beispiel für XML-Format für Vorlagen-Import",
    sample:
      "<templates>\\n  <template>\\n    <name>E-Mail-Vorlage</name>\\n    <description>Newsletter-Vorlage</description>\\n    <content><![CDATA[<h1>{{title}}</h1>]]></content>\\n    <status>DRAFT</status>\\n    <tags>email,newsletter</tags>\\n  </template>\\n</templates>",
  },
};
