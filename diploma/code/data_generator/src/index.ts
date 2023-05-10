import { faker } from '@faker-js/faker'
import {
  generate,
  GeneratorResults,
  readFromFiles,
} from './generate'
import {
  getFirestore,
  doc,
  getDocs,
  collection,
  setDoc,
  deleteDoc,
  Firestore,
  DocumentData,
} from 'firebase/firestore'
import { firebaseApp } from './firebase_config'
import { CollectionNames } from './constants'

faker.setLocale('ru')

const getCollectionDocs = async (db: Firestore, collectionName: CollectionNames) => {
  const docsSnap = await getDocs(collection(db, collectionName))
  return docsSnap.docs.map(document => document.data())
}

const removeDocs = async (db: Firestore, collectionName: CollectionNames, docs: DocumentData[]) => {
  return Promise.all(docs.map(document => deleteDoc(doc(db, collectionName, document.docId))))
}

const removeCollection = async (db: Firestore, collectionName: CollectionNames) => {
  const documents = await getCollectionDocs(db, collectionName)
  await removeDocs(db, collectionName, documents)
}

const writeToDB = async (results: GeneratorResults) => {
  const { firebase } = results
  const { users, medications, thematicMaterials, dialogs } = firebase
  
  const db = getFirestore(firebaseApp)
  
  await Promise.all(Object.values(CollectionNames).map(collectionName => removeCollection(db, collectionName)))
  console.log('All collections are removed!')
  
  await Promise.all(users.map((user) => setDoc(doc(db, 'users', user.docId), user)))
  console.log('Users added!')
  await Promise.all(medications.map((medication) => setDoc(doc(db, 'medications', medication.docId), medication)))
  console.log('Medications added!')
  await Promise.all(thematicMaterials.map((thematicMaterial) => setDoc(doc(db, 'thematicMaterials', thematicMaterial.docId), thematicMaterial)))
  console.log('ThematicMaterials added!')
  await Promise.all(dialogs.map((dialog) => setDoc(doc(db, 'dialogs', dialog.docId), dialog)))
  console.log('Dialogs added!')
}

const main = async () => {
  const results = readFromFiles()
  
  // await writeToDB(results)
  console.log('End of the main function!')
}

main()

// const docId = 'fdfdgdgdf2'
// const collectionName = 'Diaries'
//
// // await deleteDoc(doc(db, collectionName, docId))
//
// const docSnap = await getDoc(doc(db, collectionName, docId))
// if (docSnap.exists()) {
//   console.log('Document exists!')
// } else {
//   console.log('Document doesn\'t exist! We will add it.')
//   await setDoc(doc(db, collectionName, 'fdfdgdgdf2'), { example: '123' })
//   const docSnapAfterAdding = await getDoc(doc(db, collectionName, docId))
//   console.log('After adding:', docSnapAfterAdding.data())
// }
//
// const collectionRef = collection(db, collectionName)
//
// const docsSnap = await getDocs(collectionRef)
// console.log('All docs:', docsSnap.docs.map(d => d.data()))
