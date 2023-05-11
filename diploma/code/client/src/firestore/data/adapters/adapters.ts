import { IRepository } from "firestore/data/repositories";
import { FirebaseDocId } from "firestore/types/collections.types";
import { tryToExecute } from "firestore/data/helpers";
import { ShrinkConverter } from "firestore/data/converters/shrink";
import { ExtendConverter } from "firestore/data/converters/extend";
import { z } from "zod";

export class Adapter<FBType extends FirebaseDocId, Type extends FirebaseDocId>
  implements IRepository<Type>
{
  repository: IRepository<FBType>;

  shrinkConverter: ShrinkConverter<Type, FBType>;

  extendConverter: ExtendConverter<FBType, Type>;

  validator: z.ZodSchema;

  collectionName: string;

  constructor({
    repository,
    shrinkConverter,
    extendConverter,
    validator,
    collectionName,
  }: {
    repository: IRepository<FBType>;
    shrinkConverter: ShrinkConverter<Type, FBType>;
    extendConverter: ExtendConverter<FBType, Type>;
    validator: z.ZodSchema;
    collectionName: string;
  }) {
    this.repository = repository;
    this.shrinkConverter = shrinkConverter;
    this.extendConverter = extendConverter;
    this.validator = validator;
    this.collectionName = collectionName;
  }

  getDocs = async (): Promise<Type[]> => {
    const docs: FBType[] = await this.repository.getDocs();

    const extendedDocs: Type[] = await Promise.all(
      docs.map((document) => this.extendConverter(document))
    );

    return tryToExecute<Type[], []>({
      callback: () => {
        extendedDocs.map((document) => this.validator.parse(document));
        return extendedDocs;
      },
      error: {
        result: [],
        title: `Adapter<${this.collectionName}> [GET_DOCS]`,
        message: "Invalid docs after extend converter",
      },
    });
  };

  getDocById = async (docId: string): Promise<Type | null> => {
    const fbDoc = await this.repository.getDocById(docId);

    if (!fbDoc) {
      return null;
    }

    const document = await this.extendConverter(fbDoc);

    return tryToExecute<Type, null>({
      callback: () => {
        this.validator.parse(document);
        return document;
      },
      error: {
        result: null,
        title: `Adapter<${this.collectionName}> [GET_DOC_BY_ID]`,
        message: "Invalid document after extend converter",
      },
    });
  };

  updateDoc = async (document: Type): Promise<void> => {
    const isValid = tryToExecute<true, false>({
      callback: () => {
        this.validator.parse(document);
        return true;
      },
      error: {
        result: false,
        title: `Adapter<${this.collectionName}> - [UPDATE_DOC]`,
        message: "Invalid document from arguments",
      },
    });

    if (!isValid) {
      return;
    }

    const extendedDocument = this.shrinkConverter(document);
    await this.repository.updateDoc(extendedDocument);
  };

  deleteDocById = async (docId: string): Promise<void> => {
    await this.repository.deleteDocById(docId);
  };
}
