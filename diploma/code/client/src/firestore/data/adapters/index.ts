import { Adapter } from "firestore/data/adapters/adapters";
import { firebaseRepositories } from "firestore/data/repositories";
import {
  shrinkDialog,
  shrinkMedication,
  shrinkThematicMaterial,
  shrinkUser,
} from "firestore/data/converters/shrink";
import {
  extendDialog,
  extendMedication,
  extendThematicMaterial,
  extendUser,
} from "firestore/data/converters/extend";
import {
  dialogSchema,
  medicationSchema,
  thematicMaterialSchema,
  userSchema,
} from "firestore/types/schemas";
import { CollectionNames } from "firestore/constants";
import {
  FBDialog,
  FBMedication,
  FBThematicMaterial,
  FBUser,
} from "firestore/types/firebase/fb_collections.types";
import {
  Dialog,
  Medication,
  ThematicMaterial,
  User,
} from "firestore/types/collections.types";

const usersAdapter = new Adapter<FBUser, User>({
  repository: firebaseRepositories.users,
  shrinkConverter: shrinkUser,
  extendConverter: extendUser,
  validator: userSchema,
  collectionName: CollectionNames.USERS,
});

const dialogsAdapter = new Adapter<FBDialog, Dialog>({
  repository: firebaseRepositories.dialogs,
  shrinkConverter: shrinkDialog,
  extendConverter: extendDialog,
  validator: dialogSchema,
  collectionName: CollectionNames.DIALOGS,
});

const thematicMaterialsAdapter = new Adapter<
  FBThematicMaterial,
  ThematicMaterial
>({
  repository: firebaseRepositories.thematicMaterials,
  shrinkConverter: shrinkThematicMaterial,
  extendConverter: extendThematicMaterial,
  validator: thematicMaterialSchema,
  collectionName: CollectionNames.THEMATIC_MATERIALS,
});

const medicationsAdapter = new Adapter<FBMedication, Medication>({
  repository: firebaseRepositories.medications,
  shrinkConverter: shrinkMedication,
  extendConverter: extendMedication,
  validator: medicationSchema,
  collectionName: CollectionNames.MEDICATIONS,
});

export const firebaseAdapters = {
  [CollectionNames.USERS]: usersAdapter,
  [CollectionNames.DIALOGS]: dialogsAdapter,
  [CollectionNames.THEMATIC_MATERIALS]: thematicMaterialsAdapter,
  [CollectionNames.MEDICATIONS]: medicationsAdapter,
};

export { Adapter } from "./adapters";
