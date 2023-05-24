import { Repository } from "firestore/data/repositories/repositories";
import {
  Medication,
  ThematicMaterial,
  User,
} from "firestore/types/collections.types";
import { CollectionNames } from "firestore/constants";
import {
  medicationSchema,
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

const medicationsRepository: Repository<Medication> =
  new Repository<Medication>(CollectionNames.MEDICATIONS, medicationSchema);

export const firebaseRepositories = {
  [CollectionNames.USERS]: usersRepository,
  [CollectionNames.THEMATIC_MATERIALS]: thematicMaterialsRepository,
  [CollectionNames.MEDICATIONS]: medicationsRepository,
};

export { Repository } from "./repositories";
export type { IRepository } from "./repositories";
