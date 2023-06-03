import { GeneratorResults } from "../../types/generator.types";
import { doc, getFirestore, setDoc } from "firebase/firestore";
import { firebaseApp } from "../../firebase_config";
import { CollectionName } from "../../constants";

export const addCollections = async (results: GeneratorResults) => {
  const { users, medications, thematicMaterials, healthStates, notifications } =
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

  if (notifications) {
    await Promise.all(
      notifications.map((notification) =>
        setDoc(
          doc(db, CollectionName.NOTIFICATIONS, notification.docId),
          notification
        )
      )
    );
    console.log("Notifications added!");
  }
};
