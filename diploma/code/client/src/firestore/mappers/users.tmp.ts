import { collection, getDocs, getFirestore, query } from "firebase/firestore";
import { firebaseApp } from "firebase_config";

// TODO move this logic into mappers

export const getFirestoreUsers = async () => {
  const usersCollectionRef = collection(getFirestore(firebaseApp), "Users");
  const { docs: userDocs } = await getDocs(query(usersCollectionRef));
  return userDocs.map((userDoc) => userDoc.data());
};
