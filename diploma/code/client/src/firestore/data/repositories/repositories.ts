import { FirebaseDocId } from "firestore/types/collections.types";
import { CollectionNames } from "firestore/constants";
import {
  collection,
  CollectionReference,
  doc,
  Firestore,
  getDoc,
  getDocs,
  getFirestore,
  DocumentReference,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import { firebaseApp } from "firebase_config";
import { z } from "zod";
import { tryToExecute } from "firestore/data/helpers";

export interface IRepository<T extends FirebaseDocId> {
  getDocs: () => Promise<T[]>;
  getDocById: (docId: string) => Promise<T | null>;
  updateDoc: (document: T) => Promise<void>;
  deleteDocById: (docId: string) => Promise<void>;
}

export class Repository<T extends FirebaseDocId> implements IRepository<T> {
  private validator: z.ZodSchema;

  private firestore: Firestore;

  private collectionName: CollectionNames;

  private collectionRef: CollectionReference<T>;

  constructor(collectionName: CollectionNames, validator: z.ZodSchema) {
    this.validator = validator;
    this.firestore = getFirestore(firebaseApp);
    this.collectionName = collectionName;
    this.collectionRef = collection(
      this.firestore,
      this.collectionName
    ) as CollectionReference<T>;
  }

  getDocs = async (): Promise<T[]> => {
    const docsSnapshot = await getDocs<T>(this.collectionRef);
    const docs = docsSnapshot.docs.map((docSnapshot) => docSnapshot.data());

    return tryToExecute<T[], []>({
      callback: () => {
        docs.forEach((document) => this.validator.parse(document));
        return docs;
      },
      error: {
        result: [],
        title: `Repository<${this.collectionName}> - [GET_DOCS]`,
        message: "Invalid docs from firestore",
      },
    });
  };

  getDocById = async (docId: string): Promise<T | null> => {
    const docSnapshot = await getDoc<T>(
      doc(this.firestore, this.collectionName, docId) as DocumentReference<T>
    );

    const document = docSnapshot.data();

    if (!document) {
      return null;
    }

    return tryToExecute<T, null>({
      callback: () => {
        this.validator.parse(document);
        return document;
      },
      error: {
        result: null,
        title: `Repository<${this.collectionName}> - [GET_DOC_BY_ID]`,
        message: "Invalid document from firestore",
      },
    });
  };

  updateDoc = async (document: T): Promise<void> => {
    const isValid = tryToExecute<true, false>({
      callback: () => {
        this.validator.parse(document);
        return true;
      },
      error: {
        result: false,
        title: `Repository<${this.collectionName}> - [UPDATE_DOC]`,
        message: "Invalid document from arguments",
      },
    });

    if (!isValid) {
      return;
    }

    await setDoc(
      doc(
        this.firestore,
        this.collectionName,
        document.docId
      ) as DocumentReference<T>,
      document
    );
  };

  deleteDocById = async (docId: string): Promise<void> => {
    await deleteDoc(
      doc(this.firestore, this.collectionName, docId) as DocumentReference<T>
    );
  };
}
