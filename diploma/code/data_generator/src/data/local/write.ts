import fs from "fs";
import { BASE_FILE_PATH, CollectionNames } from "../../constants";
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
  collection: T[];
}) => {
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
    collectionName: CollectionNames.USERS,
    collection: users,
  });
  writeToFile<Medication>({
    collectionName: CollectionNames.MEDICATIONS,
    collection: medications,
  });
  writeToFile<ThematicMaterial>({
    collectionName: CollectionNames.THEMATIC_MATERIALS,
    collection: thematicMaterials,
  });
  writeToFile<Dialog>({
    collectionName: CollectionNames.DIALOGS,
    collection: dialogs,
  });
};
