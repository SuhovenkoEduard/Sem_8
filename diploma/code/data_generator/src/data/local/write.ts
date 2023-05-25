import fs from "fs";
import { BASE_FILE_PATH, CollectionName } from "../../constants";
import { GeneratorResults } from "../../types/generator.types";
import {
  Dialog,
  Medication,
  ThematicMaterial,
  User,
} from "../../types/collections.types";

export const writeToFile = <T>({
  collectionName,
  collection,
}: {
  collectionName: string;
  collection: T[] | null;
}) => {
  if (!collection) {
    return
  }
  fs.writeFileSync(
    `${BASE_FILE_PATH}/${collectionName}.json`,
    JSON.stringify(collection, null, "  ")
  );
};

export const write = ({
  users,
  medications,
  thematicMaterials,
  dialogs,
}: GeneratorResults) => {
  writeToFile<User>({
    collectionName: CollectionName.USERS,
    collection: users,
  });
  writeToFile<Medication>({
    collectionName: CollectionName.MEDICATIONS,
    collection: medications,
  });
  writeToFile<ThematicMaterial>({
    collectionName: CollectionName.THEMATIC_MATERIALS,
    collection: thematicMaterials,
  });
  writeToFile<Dialog>({
    collectionName: CollectionName.DIALOGS,
    collection: dialogs,
  });
};
