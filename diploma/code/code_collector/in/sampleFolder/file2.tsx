import * as types from "./types";
import * as docx from "docx";

export const generateFileChild = ({ fileName, content }: types.FileData) => {
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
    new docx.Paragraph({
      children: [
        new docx.TextRun({
          text: content,
          font: "Times New Roman",
          size: 10 * 2,
        }),
      ],
    }),
    new docx.Paragraph({}),
  ];
};
