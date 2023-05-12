import { GeneratorResults } from "../../types/generator.types";
import {
  fBDialogSchema,
  fBMedicationSchema,
  fBThematicMaterialSchema,
  fBUserSchema,
} from "../../types/schemas";

export const validate = ({
  users,
  medications,
  thematicMaterials,
  dialogs,
}: GeneratorResults) => {
  users.forEach((fbUser) => fBUserSchema.parse(fbUser));
  medications.forEach((fbMedication) => fBMedicationSchema.parse(fbMedication));
  thematicMaterials.forEach((fbThematicMaterial) =>
    fBThematicMaterialSchema.parse(fbThematicMaterial)
  );
  dialogs.forEach((fbDialog) => fBDialogSchema.parse(fbDialog));
};
