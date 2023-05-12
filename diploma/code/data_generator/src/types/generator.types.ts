import {
  Dialog,
  Medication,
  ThematicMaterial,
  User,
} from "./collections.types";

export type GeneratorResults = {
  users: User[];
  medications: Medication[];
  thematicMaterials: ThematicMaterial[];
  dialogs: Dialog[];
};
