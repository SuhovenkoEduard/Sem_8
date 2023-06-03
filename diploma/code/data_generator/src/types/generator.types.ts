import {
  HealthState,
  Medication,
  Notification,
  ThematicMaterial,
  User,
} from "./collections.types";

export type GeneratorResults = {
  users: User[];
  medications: Medication[];
  thematicMaterials: ThematicMaterial[];
  healthStates: HealthState[];
  notifications: Notification[];
};
