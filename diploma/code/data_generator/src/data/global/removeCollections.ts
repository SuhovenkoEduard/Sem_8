import {
  collection,
  deleteDoc,
  doc,
  DocumentData,
  Firestore,
  getDocs,
  getFirestore,
} from "firebase/firestore";
import { CollectionNames } from "../../constants";
import { firebaseApp } from "../../firebase_config";

const getCollectionDocs = async (
  db: Firestore,
  collectionName: CollectionNames
) => {
  const docsSnap = await getDocs(collection(db, collectionName));
  return docsSnap.docs.map((document) => document.data());
};

const removeDocs = async (
  db: Firestore,
  collectionName: CollectionNames,
  docs: DocumentData[]
) => {
  return Promise.all(
    docs.map((document) => deleteDoc(doc(db, collectionName, document.docId)))
  );
};

const removeCollection = async (
  db: Firestore,
  collectionName: CollectionNames
) => {
  const documents = await getCollectionDocs(db, collectionName);
  await removeDocs(db, collectionName, documents);
};

export const removeCollections = async () => {
  const db = getFirestore(firebaseApp);

  await Promise.all(
    Object.values(CollectionNames).map((collectionName) =>
      removeCollection(db, collectionName)
    )
  );
  console.log("All collections are removed!");
};
