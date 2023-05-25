import { GeneratorResults } from "../../types/generator.types";
import { doc, getFirestore, setDoc } from "firebase/firestore";
import { firebaseApp } from "../../firebase_config";

export const addCollections = async (results: GeneratorResults) => {
  const { users, medications, thematicMaterials, dialogs } = results;

  const db = getFirestore(firebaseApp);

  if (users) {
    await Promise.all(
      users.map((user) => setDoc(doc(db, "users", user.docId), user))
    );
    console.log("Users added!");
  }
  
  if (medications) {
    await Promise.all(
      medications.map((medication) =>
        setDoc(doc(db, "medications", medication.docId), medication)
      )
    );
    console.log("Medications added!");
  }

  if (thematicMaterials) {
    await Promise.all(
      thematicMaterials.map((thematicMaterial) =>
        setDoc(
          doc(db, "thematicMaterials", thematicMaterial.docId),
          thematicMaterial
        )
      )
    );
    console.log("ThematicMaterials added!");
    
  }

  if (dialogs) {
    await Promise.all(
      dialogs.map((dialog) => setDoc(doc(db, "dialogs", dialog.docId), dialog))
    );
    console.log("Dialogs added!");
  }
};
