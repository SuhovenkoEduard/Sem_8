import * as constants from "./constants";

export type FileData = {
  fileName: string;
  content: string;
};

export type CollectorParams = {
  [CollectionParamsPropName.SOURCE_PATH]: string
  [CollectionParamsPropName.EXTENSIONS]: (constants.Extension | string)[]
  [CollectionParamsPropName.EXCLUDED_FILE_NAMES]: string[]
  [CollectionParamsPropName.DELIMITER]: string
  [CollectionParamsPropName.PRESERVE_EMPTY_LINES]: boolean
  [CollectionParamsPropName.DOCX_FILE_PATH]: string
}

export enum CollectionParamsPropName {
  SOURCE_PATH = 'sourcesPath',
  EXTENSIONS = 'extensions',
  EXCLUDED_FILE_NAMES = 'excludedFileNames',
  DELIMITER = 'delimiter',
  PRESERVE_EMPTY_LINES = 'preserveEmptyLines',
  DOCX_FILE_PATH = 'docxFilePath'
}
