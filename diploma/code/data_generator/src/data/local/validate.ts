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
  users.forEach((fbUser) => userSchema.parse(fbUser));
  medications.forEach((fbMedication) => medicationSchema.parse(fbMedication));
  thematicMaterials.forEach((fbThematicMaterial) =>
    thematicMaterialSchema.parse(fbThematicMaterial)
  );
  dialogs.forEach((fbDialog) => dialogSchema.parse(fbDialog));
};
