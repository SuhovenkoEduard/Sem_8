import { GeneratorResults } from "../../types/generator.types";
import { doc, getFirestore, setDoc } from "firebase/firestore";
import { firebaseApp } from "../../firebase_config";
import { CollectionName } from "../../constants";

export const addCollections = async (results: GeneratorResults) => {
  const { users, medications, thematicMaterials, dialogs, healthStates } =
    results;

  const db = getFirestore(firebaseApp);

  if (users) {
    await Promise.all(
      users.map((user) =>
        setDoc(doc(db, CollectionName.USERS, user.docId), user)
      )
    );
    console.log("Users added!");
  }

  if (medications) {
    await Promise.all(
      medications.map((medication) =>
        setDoc(
          doc(db, CollectionName.MEDICATIONS, medication.docId),
          medication
        )
      )
    );
    console.log("Medications added!");
  }

  if (thematicMaterials) {
    await Promise.all(
      thematicMaterials.map((thematicMaterial) =>
        setDoc(
          doc(db, CollectionName.THEMATIC_MATERIALS, thematicMaterial.docId),
          thematicMaterial
        )
      )
    );
    console.log("ThematicMaterials added!");
  }

  if (dialogs) {
    await Promise.all(
      dialogs.map((dialog) =>
        setDoc(doc(db, CollectionName.DIALOGS, dialog.docId), dialog)
      )
    );
    console.log("Dialogs added!");
  }

  if (healthStates) {
    await Promise.all(
      healthStates.map((healthState) =>
        setDoc(
          doc(db, CollectionName.HEALTH_STATES, healthState.docId),
          healthState
        )
      )
    );
    console.log("HealthStates added!");
  }
};
