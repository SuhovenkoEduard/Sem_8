import { GeneratorResults } from '../../types/generator.types'
import { collection, getDocs, getFirestore } from 'firebase/firestore'
import { firebaseApp } from '../../firebase_config'
import { CollectionNames } from '../../constants'

export const getDocuments = async <T>(collectionName: CollectionNames): Promise<T[]> => {
  const db = getFirestore(firebaseApp);
  const snapShot = await getDocs(collection(db, collectionName))
  return snapShot.docs.map(doc => doc.data()) as T[];
}

export const readCollections = async (): Promise<GeneratorResults> => {
  return {
    users: await getDocuments(CollectionNames.USERS),
    thematicMaterials: await getDocuments(CollectionNames.THEMATIC_MATERIALS),
    medications: await getDocuments(CollectionNames.MEDICATIONS),
    dialogs: await getDocuments(CollectionNames.DIALOGS)
  }
}
