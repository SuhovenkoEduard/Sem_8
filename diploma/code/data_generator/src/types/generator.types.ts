import {
  Dialog,
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
  dialogs: Dialog[];
  healthStates: HealthState[];
  notifications: Notification[];
};
