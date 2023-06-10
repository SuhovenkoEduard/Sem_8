import path from "path";
import * as fs from "fs";
import * as constants from "./constants";
import * as types from "./types";
import { CollectorParams } from "./types";

export const getFiles = ({
  dirPath,
  extensions,
  excludeFileNames = [],
}: {
  dirPath: CollectorParams['sourcesPath'];
  extensions: CollectorParams['extensions'];
  excludeFileNames?: CollectorParams['excludedFileNames'];
}): types.FileData[] => {
  const filePaths: string[] = getFilePathsRecursively({
    dirPath,
    extensions,
    excludeFileNames,
  });
  return filePaths.map((filePath) => ({
    fileName: path.parse(filePath).name + path.extname(filePath),
    content: fs.readFileSync(filePath).toString(),
  }));
};

const getFilePathsRecursively = ({
  dirPath,
  extensions,
  excludeFileNames = [],
}: {
  dirPath: CollectorParams['sourcesPath'];
  extensions: CollectorParams['extensions'];
  excludeFileNames?: CollectorParams['excludedFileNames'];
}): string[] => {
  const filesInDirectory = fs.readdirSync(dirPath);
  let files: string[] = [];
  for (const file of filesInDirectory) {
    const absolute = path.join(dirPath, file);
    if (fs.statSync(absolute).isDirectory()) {
      files = [
        ...files,
        ...getFilePathsRecursively({
          dirPath: absolute,
          extensions,
          excludeFileNames,
        }),
      ];
    } else if (
      extensions.includes(path.extname(absolute) as constants.Extension) &&
      !excludeFileNames.some(excludeFileName => path.parse(absolute).name.includes(excludeFileName))
    ) {
      files = [...files, absolute];
    }
  }

  return files;
};
