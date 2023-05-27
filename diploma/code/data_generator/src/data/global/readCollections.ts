import { GeneratorResults } from "../../types/generator.types";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import { firebaseApp } from "../../firebase_config";
import { CollectionName } from "../../constants";

export const getDocuments = async <T>(
  collectionName: CollectionName
): Promise<T[]> => {
  const db = getFirestore(firebaseApp);
  const snapShot = await getDocs(collection(db, collectionName));
  return snapShot.docs.map((doc) => doc.data()) as T[];
};

export const readCollections = async (): Promise<GeneratorResults> => {
  return {
    users: await getDocuments(CollectionName.USERS),
    thematicMaterials: await getDocuments(CollectionName.THEMATIC_MATERIALS),
    medications: await getDocuments(CollectionName.MEDICATIONS),
    dialogs: await getDocuments(CollectionName.DIALOGS),
    healthStates: await getDocuments(CollectionName.HEALTH_STATES),
  };
};
