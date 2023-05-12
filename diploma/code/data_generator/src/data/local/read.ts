import {
  Dialog,
  Medication,
  ThematicMaterial,
  User,
} from "../../types/collections.types";
import fs from "fs";
import { BASE_FILE_PATH, CollectionNames } from "../../constants";
import { GeneratorResults } from "../../types/generator.types";

export const read = () => {
  const users: User[] = JSON.parse(
    fs
      .readFileSync(`${BASE_FILE_PATH}/${CollectionNames.USERS}.json`)
      .toString()
  );
  const medications: Medication[] = JSON.parse(
    fs
      .readFileSync(`${BASE_FILE_PATH}/${CollectionNames.MEDICATIONS}.json`)
      .toString()
  );
  const thematicMaterials: ThematicMaterial[] = JSON.parse(
    fs
      .readFileSync(
        `${BASE_FILE_PATH}/${CollectionNames.THEMATIC_MATERIALS}.json`
      )
      .toString()
  );
  const dialogs: Dialog[] = JSON.parse(
    fs
      .readFileSync(`${BASE_FILE_PATH}/${CollectionNames.DIALOGS}.json`)
      .toString()
  );

  const result: GeneratorResults = {
    users,
    medications,
    thematicMaterials,
    dialogs,
  };

  return result;
};
