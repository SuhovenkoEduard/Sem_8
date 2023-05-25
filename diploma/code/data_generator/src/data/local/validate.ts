import { GeneratorResults } from "../../types/generator.types";
import {
  dialogSchema,
  medicationSchema,
  thematicMaterialSchema,
  userSchema,
} from "../../types/schemas";

export const validate = ({
  users,
  medications,
  thematicMaterials,
  dialogs,
}: GeneratorResults) => {
  if (users) {
    users.forEach((fbUser) => userSchema.parse(fbUser));
  }
  if (medications) {
    medications.forEach((fbMedication) => medicationSchema.parse(fbMedication));
  }
  if (thematicMaterials) {
    thematicMaterials.forEach((fbThematicMaterial) =>
      thematicMaterialSchema.parse(fbThematicMaterial)
    );
  }
  if (dialogs) {
    dialogs.forEach((fbDialog) => dialogSchema.parse(fbDialog));
  }
};
