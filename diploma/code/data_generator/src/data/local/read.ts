import {
  HealthState,
  Medication,
  Notification,
  ThematicMaterial,
  User,
} from "../../types/collections.types";
import fs from "fs";
import { BASE_FILE_PATH, CollectionName } from "../../constants/constants";
import { GeneratorResults } from "../../types/generator.types";

export const read = () => {
  const users: User[] = JSON.parse(
    fs.readFileSync(`${BASE_FILE_PATH}/${CollectionName.USERS}.json`).toString()
  );
  const medications: Medication[] = JSON.parse(
    fs
      .readFileSync(`${BASE_FILE_PATH}/${CollectionName.MEDICATIONS}.json`)
      .toString()
  );
  const thematicMaterials: ThematicMaterial[] = JSON.parse(
    fs
      .readFileSync(
        `${BASE_FILE_PATH}/${CollectionName.THEMATIC_MATERIALS}.json`
      )
      .toString()
  );
  const healthStates: HealthState[] = JSON.parse(
    fs
      .readFileSync(`${BASE_FILE_PATH}/${CollectionName.HEALTH_STATES}.json`)
      .toString()
  );
  const notifications: Notification[] = JSON.parse(
    fs
      .readFileSync(`${BASE_FILE_PATH}/${CollectionName.NOTIFICATIONS}.json`)
      .toString()
  );

  const result: GeneratorResults = {
    users,
    medications,
    thematicMaterials,
    healthStates,
    notifications,
  };

  return result;
};
