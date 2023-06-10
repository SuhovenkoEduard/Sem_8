import * as fs from "fs";
import * as constants from "./constants";
import * as helpers from "./helpers";
import * as docx from "docx";

const main = async () => {
  const doc = new docx.Document({
    sections: [
      {
        properties: {},
        children: [...helpers.generateFileChild(constants.mockFiles[0])],
      },
    ],
  });

  const buffer = await docx.Packer.toBuffer(doc);
  fs.writeFileSync(constants.DOCX_FILE_PATH, buffer);

  console.log("Code was successfully collected.");
};

main();
