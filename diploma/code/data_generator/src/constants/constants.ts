export enum CollectionName {
  USERS = "users",
  MEDICATIONS = "medications",
  THEMATIC_MATERIALS = "thematicMaterials",
  HEALTH_STATES = "healthStates",
  NOTIFICATIONS = "notifications",
}

export const COLLECTION_SIZES: {
  [key in CollectionName]?: number;
} = {
  [CollectionName.MEDICATIONS]: 10,
  [CollectionName.THEMATIC_MATERIALS]: 10,
};

export const BASE_FILE_PATH = "out/";
