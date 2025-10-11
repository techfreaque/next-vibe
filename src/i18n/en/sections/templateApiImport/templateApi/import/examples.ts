export const examplesTranslations = {
  csv: {
    title: "CSV Format Example",
    description: "Example of CSV format for template import",
    sample:
      'name,description,content,status,tags\\n\\"Email Template\\",\\"Newsletter template\\",\\"<h1>{{title}}</h1>\\",\\"DRAFT\\",\\"email,newsletter\\"',
  },
  json: {
    title: "JSON Format Example",
    description: "Example of JSON format for template import",
    sample:
      '[\\n  {\\n    \\"name\\": \\"Email Template\\",\\n    \\"description\\": \\"Newsletter template\\",\\n    \\"content\\": \\"<h1>{{title}}</h1>\\",\\n    \\"status\\": \\"DRAFT\\",\\n    \\"tags\\": [\\"email\\", \\"newsletter\\"]\\n  }\\n]',
  },
  xml: {
    title: "XML Format Example",
    description: "Example of XML format for template import",
    sample:
      "<templates>\\n  <template>\\n    <name>Email Template</name>\\n    <description>Newsletter template</description>\\n    <content><![CDATA[<h1>{{title}}</h1>]]></content>\\n    <status>DRAFT</status>\\n    <tags>email,newsletter</tags>\\n  </template>\\n</templates>",
  },
};
