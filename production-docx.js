// production-docx.js
const fs = require("fs");
const {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  ImageRun,
  Header,
  Footer,
  PageNumber,
  PageBreak,
  AlignmentType,
  LevelFormat,
  TableOfContents,
  HeadingLevel,
  WidthType,
  ShadingType,
  BorderStyle,
  PageOrientation,
} = require("docx");

// --- Create production-grade document ---
const doc = new Document({
  styles: {
    default: {
      document: { run: { font: "Arial", size: 24 } }, // 12pt default
    },
    paragraphStyles: [
      {
        id: "Heading1",
        name: "Heading 1",
        basedOn: "Normal",
        next: "Normal",
        quickFormat: true,
        run: { size: 32, bold: true, font: "Arial" },
        paragraph: { spacing: { before: 240, after: 240 }, outlineLevel: 0 },
      },
      {
        id: "Heading2",
        name: "Heading 2",
        basedOn: "Normal",
        next: "Normal",
        quickFormat: true,
        run: { size: 28, bold: true, font: "Arial" },
        paragraph: { spacing: { before: 180, after: 180 }, outlineLevel: 1 },
      },
    ],
  },
  sections: [
    {
      properties: {
        page: {
          size: {
            width: 12240, // US Letter
            height: 15840,
            orientation: PageOrientation.PORTRAIT,
          },
          margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 },
        },
      },
      headers: {
        default: new Header({
          children: [
            new Paragraph({
              children: [new TextRun({ text: "Production Header", bold: true })],
              alignment: AlignmentType.CENTER,
            }),
          ],
        }),
      },
      footers: {
        default: new Footer({
          children: [
            new Paragraph({
              children: [
                new TextRun("Page "),
                new TextRun({ children: [PageNumber.CURRENT] }),
              ],
              alignment: AlignmentType.CENTER,
            }),
          ],
        }),
      },
      children: [
        // Title
        new Paragraph({
          text: "Production DOCX Example",
          heading: HeadingLevel.HEADING_1,
          alignment: AlignmentType.CENTER,
        }),

        // Table of Contents
        new Paragraph({ text: "Table of Contents", heading: HeadingLevel.HEADING_2 }),
        new TableOfContents("Table of Contents", {
          hyperlink: true,
          headingStyleRange: "1-3",
        }),

        new Paragraph({ children: [new PageBreak()] }),

        // Section with table
        new Paragraph({ text: "Sales Data", heading: HeadingLevel.HEADING_2 }),
        new Table({
          width: { size: 9360, type: WidthType.DXA },
          columnWidths: [4680, 4680],
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  width: { size: 4680, type: WidthType.DXA },
                  shading: { fill: "D5E8F0", type: ShadingType.CLEAR },
                  children: [new Paragraph("Product")],
                  borders: {
                    top: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
                    bottom: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
                    left: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
                    right: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
                  },
                }),
                new TableCell({
                  width: { size: 4680, type: WidthType.DXA },
                  shading: { fill: "D5E8F0", type: ShadingType.CLEAR },
                  children: [new Paragraph("Revenue")],
                  borders: {
                    top: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
                    bottom: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
                    left: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
                    right: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
                  },
                }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({ children: [new Paragraph("Widget A")] }),
                new TableCell({ children: [new Paragraph("$1,200")] }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({ children: [new Paragraph("Widget B")] }),
                new TableCell({ children: [new Paragraph("$3,400")] }),
              ],
            }),
          ],
        }),

        new Paragraph({ children: [new PageBreak()] }),

        // Section with image
        new Paragraph({ text: "Product Image", heading: HeadingLevel.HEADING_2 }),
        new Paragraph({
          children: [
            new ImageRun({
              data: fs.readFileSync("product.png"),
              type: "png",
              transformation: { width: 300, height: 200 },
              altText: { title: "Product", description: "Product Image", name: "product-img" },
            }),
          ],
        }),

        new Paragraph({ children: [new PageBreak()] }),

        // Numbered list example
        new Paragraph({
          text: "Top Features",
          heading: HeadingLevel.HEADING_2,
        }),
        new Paragraph({
          numbering: { reference: "numbers", level: 0 },
          children: [new TextRun("Fast performance")],
        }),
        new Paragraph({
          numbering: { reference: "numbers", level: 0 },
          children: [new TextRun("Secure authentication")],
        }),
        new Paragraph({
          numbering: { reference: "numbers", level: 0 },
          children: [new TextRun("Cross-platform support")],
        }),
      ],
    },
  ],
  numbering: {
    config: [
      {
        reference: "numbers",
        levels: [
          {
            level: 0,
            format: LevelFormat.DECIMAL,
            text: "%1.",
            alignment: AlignmentType.LEFT,
          },
        ],
      },
    ],
  },
});

// --- Export DOCX ---
Packer.toBuffer(doc)
  .then((buffer) => {
    fs.writeFileSync("ProductionExample.docx", buffer);
    console.log("Production-grade DOCX created successfully!");
  })
  .catch((err) => console.error(err));
