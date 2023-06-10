import * as types from "./types";
import * as docx from "docx";
import fs from "fs";

export const generateFileDocxChildren = ({
  fileName,
  content,
}: types.FileData, delimiter: string, preserveEmptyLines: boolean) => {
  return [
    new docx.Paragraph({
      children: [
        new docx.TextRun({
          text: fileName,
          bold: true,
          italics: true,
          font: "Times New Roman",
          size: 14 * 2,
        }),
      ],
    }),
    new docx.Paragraph({}),
    ...content.split(delimiter).filter(line => preserveEmptyLines ? true : Boolean(line.trim())).map(
      (line) =>
        new docx.Paragraph({
          children: [
            new docx.TextRun({
              text: line,
              font: "Times New Roman",
              size: 10 * 2,
            }),
          ],
        })
    ),
    ...(preserveEmptyLines ? [] : [new docx.Paragraph({})])
  ];
};

export const generateDocx = (files: types.FileData[], delimiter: string, preserveEmptyLines: boolean) => {
  return new docx.Document({
    sections: [
      {
        properties: {},
        children: files.flatMap((file) => generateFileDocxChildren(file, delimiter, preserveEmptyLines)),
      },
    ],
  });
};

export const writeDocxToFile = async (
  document: docx.Document,
  filePath: string
) => {
  const buffer = await docx.Packer.toBuffer(document);
  fs.writeFileSync(filePath, buffer);
};
