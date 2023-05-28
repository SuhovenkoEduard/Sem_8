import { Repository } from "firestore/data/repositories/repositories";
import {
  HealthState,
  Notification,
  ThematicMaterial,
  User,
} from "firestore/types/collections.types";
import { CollectionName } from "firestore/constants";
import {
  healthStateSchema,
  notificationSchema,
  thematicMaterialSchema,
  userSchema,
} from "firestore/types/schemas";

const usersRepository: Repository<User> = new Repository<User>(
  CollectionName.USERS,
  userSchema
);

const thematicMaterialsRepository: Repository<ThematicMaterial> =
  new Repository<ThematicMaterial>(
    CollectionName.THEMATIC_MATERIALS,
    thematicMaterialSchema
  );

const healthStatesRepository: Repository<HealthState> =
  new Repository<HealthState>(CollectionName.HEALTH_STATES, healthStateSchema);

const notificationsRepository: Repository<Notification> =
  new Repository<Notification>(
    CollectionName.NOTIFICATIONS,
    notificationSchema
  );

export const firebaseRepositories = {
  [CollectionName.USERS]: usersRepository,
  [CollectionName.THEMATIC_MATERIALS]: thematicMaterialsRepository,
  [CollectionName.HEALTH_STATES]: healthStatesRepository,
  [CollectionName.NOTIFICATIONS]: notificationsRepository,
};

export { Repository } from "./repositories";
export type { IRepository } from "./repositories";
