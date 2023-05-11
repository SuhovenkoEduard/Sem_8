import {
  IRepository,
  Repository,
} from "firestore/data/repositories/repositories";
import {
  FBDialog,
  FBMedication,
  FBThematicMaterial,
  FBUser,
} from "firestore/types/firebase/fb_collections.types";
import { CollectionNames } from "firestore/constants";
import {
  fBDialogSchema,
  fBMedicationSchema,
  fBThematicMaterialSchema,
  fBUserSchema,
} from "firestore/types/firebase/fb_schemas";

const fbUsersRepository: IRepository<FBUser> = new Repository<FBUser>(
  CollectionNames.USERS,
  fBUserSchema
);

const fbDialogsRepository: IRepository<FBDialog> = new Repository<FBDialog>(
  CollectionNames.DIALOGS,
  fBDialogSchema
);

const fbThematicMaterialsRepository: IRepository<FBThematicMaterial> =
  new Repository<FBThematicMaterial>(
    CollectionNames.THEMATIC_MATERIALS,
    fBThematicMaterialSchema
  );

const fbMedicationsRepository: IRepository<FBMedication> =
  new Repository<FBMedication>(CollectionNames.MEDICATIONS, fBMedicationSchema);

export const firebaseRepositories = {
  [CollectionNames.USERS]: fbUsersRepository,
  [CollectionNames.DIALOGS]: fbDialogsRepository,
  [CollectionNames.THEMATIC_MATERIALS]: fbThematicMaterialsRepository,
  [CollectionNames.MEDICATIONS]: fbMedicationsRepository,
};

export { Repository } from "./repositories";
export type { IRepository } from "./repositories";
