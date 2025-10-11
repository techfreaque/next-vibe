import type { examplesTranslations as EnglishExamplesTranslations } from "../../../../../en/sections/templateApiImport/templateApi/import/examples";

export const examplesTranslations: typeof EnglishExamplesTranslations = {
  csv: {
    title: "Przykład Formatu CSV",
    description: "Przykład formatu CSV dla importu szablonów",
    sample:
      'name,description,content,status,tags\\n\\"Szablon Email\\",\\"Szablon newslettera\\",\\"<h1>{{title}}</h1>\\",\\"DRAFT\\",\\"email,newsletter\\"',
  },
  json: {
    title: "Przykład Formatu JSON",
    description: "Przykład formatu JSON dla importu szablonów",
    sample:
      '[\\n  {\\n    \\"name\\": \\"Szablon Email\\",\\n    \\"description\\": \\"Szablon newslettera\\",\\n    \\"content\\": \\"<h1>{{title}}</h1>\\",\\n    \\"status\\": \\"DRAFT\\",\\n    \\"tags\\": [\\"email\\", \\"newsletter\\"]\\n  }\\n]',
  },
  xml: {
    title: "Przykład Formatu XML",
    description: "Przykład formatu XML dla importu szablonów",
    sample:
      "<templates>\\n  <template>\\n    <name>Szablon Email</name>\\n    <description>Szablon newslettera</description>\\n    <content><![CDATA[<h1>{{title}}</h1>]]></content>\\n    <status>DRAFT</status>\\n    <tags>email,newsletter</tags>\\n  </template>\\n</templates>",
  },
};
