import * as constants from "./constants";
import * as helpers from "./helpers";
import * as types from "./types";
import { getFiles } from "./read";

import yargs from "yargs";
import { hideBin } from "yargs/helpers"
import { DOCX_FILE_PATH, TEST_SOURCES_DIR_PATH } from "./constants";
import { CollectionParamsPropName } from "./types";

export const getArgvString = async (yargsArguments: yargs.Argv, propName: string) => {
  return (await yargsArguments.parse())[propName] as string
}

export const getArgvBoolean = async (yargsArguments: yargs.Argv, propName: string) => {
  return (await yargsArguments.boolean(propName).parse())[propName] as boolean
}

export const getArgvStringArray = async (yargsArguments: yargs.Argv, propName: string) => {
  return (await yargsArguments.array(propName).parse())[propName] as string[]
}

const main = async () => {
  const yargsArguments = yargs(hideBin(process.argv));

  const argSourcesPath = await getArgvString(yargsArguments, CollectionParamsPropName.SOURCE_PATH)
  const argExtensions = await getArgvStringArray(yargsArguments, CollectionParamsPropName.EXTENSIONS)
  const argExcludedFileNames = await getArgvStringArray(yargsArguments, CollectionParamsPropName.EXCLUDED_FILE_NAMES)
  const argDelimiter = await getArgvString(yargsArguments, CollectionParamsPropName.DELIMITER)
  const argPreserveEmptyLines = await getArgvBoolean(yargsArguments, CollectionParamsPropName.PRESERVE_EMPTY_LINES)
  const argDocxFilePath = await getArgvString(yargsArguments, CollectionParamsPropName.DOCX_FILE_PATH)
  
  const params: types.CollectorParams = {
    sourcesPath: argSourcesPath ?? TEST_SOURCES_DIR_PATH,
    extensions: argExtensions ?? Object.values(constants.Extension),
    excludedFileNames: argExcludedFileNames ?? constants.EXCLUDED_FILE_NAMES,
    delimiter: argDelimiter ?? constants.DOCX_LINE_DELIMITER,
    preserveEmptyLines: argPreserveEmptyLines ?? false,
    docxFilePath: argDocxFilePath ?? DOCX_FILE_PATH
  }
  
  console.log(params)
  
  const files = getFiles({
    dirPath: params.sourcesPath,
    extensions: params.extensions,
    excludeFileNames: params.excludedFileNames
  });
  console.log("Number of files processed:", files.length);
  const document = helpers.generateDocx(files, params.delimiter, params.preserveEmptyLines);
  await helpers.writeDocxToFile(document, params.docxFilePath);
  console.log("Docx was successfully generated!");
};

main();
