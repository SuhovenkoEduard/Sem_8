import { Repository } from "firestore/data/repositories/repositories";
import {
  HealthState,
  ThematicMaterial,
  User,
} from "firestore/types/collections.types";
import { CollectionNames } from "firestore/constants";
import {
  healthStateSchema,
  thematicMaterialSchema,
  userSchema,
} from "firestore/types/schemas";

const usersRepository: Repository<User> = new Repository<User>(
  CollectionNames.USERS,
  userSchema
);

const thematicMaterialsRepository: Repository<ThematicMaterial> =
  new Repository<ThematicMaterial>(
    CollectionNames.THEMATIC_MATERIALS,
    thematicMaterialSchema
  );

const healthStatesRepository: Repository<HealthState> =
  new Repository<HealthState>(CollectionNames.HEALTH_STATES, healthStateSchema);

export const firebaseRepositories = {
  [CollectionNames.USERS]: usersRepository,
  [CollectionNames.THEMATIC_MATERIALS]: thematicMaterialsRepository,
  [CollectionNames.HEALTH_STATES]: healthStatesRepository,
};

export { Repository } from "./repositories";
export type { IRepository } from "./repositories";
