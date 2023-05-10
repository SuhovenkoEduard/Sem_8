export enum CollectionNames {
  USERS = "Users",
  MEDICATIONS = "Medications",
  THEMATIC_MATERIALS = "ThematicMaterials",
  DIALOGS = "Dialogs",
}

export const COLLECTION_SIZES: {
  [key in CollectionNames]: number
} = {
  [CollectionNames.USERS]: 7,
  [CollectionNames.MEDICATIONS]: 5,
  [CollectionNames.THEMATIC_MATERIALS]: 10,
  [CollectionNames.DIALOGS]: 1,
};

export const BASE_FILE_PATH = "out/";


