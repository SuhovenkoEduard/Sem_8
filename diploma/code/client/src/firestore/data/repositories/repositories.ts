import { FirebaseDocId } from "firestore/types/collections.types";
import { CollectionName } from "firestore/constants";
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
  QueryFieldFilterConstraint,
  query,
  Query,
  QueryCompositeFilterConstraint,
  or,
} from "firebase/firestore";
import { firebaseApp } from "firebase_config";
import { z } from "zod";
import { tryToExecute } from "firestore/data/helpers";

export type QueryFilter =
  | QueryFieldFilterConstraint
  | QueryCompositeFilterConstraint
  | null;

export interface IRepository<T extends FirebaseDocId> {
  getDocs: (queryFilter: QueryFilter) => Promise<T[]>;
  getDocById: (docId: string) => Promise<T | null>;
  updateDoc: (document: T) => Promise<void>;
  deleteDocById: (docId: string) => Promise<void>;
}

export class Repository<T extends FirebaseDocId> implements IRepository<T> {
  private validator: z.ZodSchema;

  private firestore: Firestore;

  private collectionName: CollectionName;

  private collectionRef: CollectionReference<T>;

  constructor(collectionName: CollectionName, validator: z.ZodSchema) {
    this.validator = validator;
    this.firestore = getFirestore(firebaseApp);
    this.collectionName = collectionName;
    this.collectionRef = collection(
      this.firestore,
      this.collectionName
    ) as CollectionReference<T>;
  }

  getDocs = async (queryFilter: QueryFilter = null): Promise<T[]> => {
    const docsQuery: Query<T> =
      queryFilter !== null
        ? query(this.collectionRef, or(queryFilter))
        : this.collectionRef;

    const docsSnapshot = await getDocs<T>(docsQuery);
    const docs = docsSnapshot.docs.map((docSnapshot) => docSnapshot.data());

    return tryToExecute<T[], []>({
      callback: () => {
        docs.forEach((document) => this.validator.parse(document));
        return docs;
      },
      error: {
        result: [],
        title: `Репозиторий<${this.collectionName}> - [Получение документов]`,
        message: "Неправильный формат документа",
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
        title: `Репозиторий<${this.collectionName}> - [Получение документа по id]`,
        message: "Неправильный формат документа",
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
        title: `Репозиторий<${this.collectionName}> - [Обновление документа]`,
        message: "Неправильный формат документа",
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
