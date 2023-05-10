import { Dialog, Medication, Role, ThematicMaterial, User, UserInfo } from './types/collections.types'
import { generateDialogs, generateMedication, generateThematicMaterial, generateUsers } from './generators'
import { BASE_FB_FILE_PATH, BASE_TS_FILE_PATH, COLLECTION_SIZES, CollectionNames } from './constants'
import { shrinkDialog, shrinkMedication, shrinkThematicMaterial, shrinkUser } from './mappers/shrink.mappers'
import { dialogSchema, medicationSchema, thematicMaterialSchema, userSchema } from './types/schemas'
import {
  fBDialogSchema,
  fBMedicationSchema,
  fBThematicMaterialSchema,
  fBUserSchema,
} from './types/firebase/fb_schemas'
import { FBDialog, FBMedication, FBThematicMaterial, FBUser } from './types/firebase/fb_collections.types'
import { getUserInfoFromUser } from './helpers'
import fs from 'fs'

export const getUsersInfoByRoles = ({ users, roles }: {
  users: User[],
  roles: Role[]
}): UserInfo[] =>
  users
    .filter(user => roles.includes(user.role))
    .map(getUserInfoFromUser)

export const writeToFile = (filePath: string) => <T>({ collectionName, collection }:{
  collectionName: string
  collection: T[]
}) => {
  fs.writeFileSync(`${filePath}/${collectionName}.json`, JSON.stringify(collection, null, '  '))
}

export const writeToTsFolder = writeToFile(BASE_TS_FILE_PATH)
export const writeToFBFolder = writeToFile(BASE_FB_FILE_PATH)

export type GeneratorResults = {
  ts: {
    users: User[]
    medications: Medication[]
    thematicMaterials: ThematicMaterial[]
    dialogs: Dialog[]
  },
  firebase: {
    users: FBUser[]
    medications: FBMedication[]
    thematicMaterials: FBThematicMaterial[]
    dialogs: FBDialog[]
  }
}

export const validateData = ({
  ts: {
    users,
    medications,
    thematicMaterials,
    dialogs,
  },
  firebase: {
    users: fbUsers,
    medications: fbMedications,
    thematicMaterials: fbThematicMaterials,
    dialogs: fbDialogs,
  },
}: GeneratorResults) => {
  users.forEach(user => userSchema.parse(user))
  medications.forEach(medication => medicationSchema.parse(medication))
  thematicMaterials.forEach(thematicMaterial => thematicMaterialSchema.parse(thematicMaterial))
  dialogs.forEach(dialog => dialogSchema.parse(dialog))
  
  fbUsers.forEach(fbUser => fBUserSchema.parse(fbUser))
  fbMedications.forEach(fbMedication => fBMedicationSchema.parse(fbMedication))
  fbThematicMaterials.forEach(fbThematicMaterial => fBThematicMaterialSchema.parse(fbThematicMaterial))
  fbDialogs.forEach(fbDialog => fBDialogSchema.parse(fbDialog))
}

export const generate = (): GeneratorResults => {
  const medications: Medication[] = generateMedication(COLLECTION_SIZES.medications)
  const users: User[] = generateUsers(COLLECTION_SIZES.users, medications)
  
  const usersPatients: UserInfo[] = getUsersInfoByRoles({ users, roles: [Role.PATIENT] })
  const usersAuthors: UserInfo[] = getUsersInfoByRoles({ users, roles: [Role.CONTENT_MAKER] })
  const thematicMaterials: ThematicMaterial[] = generateThematicMaterial(
    COLLECTION_SIZES.thematicMaterials,
    usersAuthors,
    usersPatients,
  )
  
  const usersDoctors: UserInfo[] = getUsersInfoByRoles({ users, roles: [Role.DOCTOR] })
  const dialogs: Dialog[] = generateDialogs(usersPatients, usersDoctors)
  
  const fbUsers = users.map(shrinkUser)
  const fbMedications = medications.map(shrinkMedication)
  const fbThematicMaterials = thematicMaterials.map(shrinkThematicMaterial)
  const fbDialogs = dialogs.map(shrinkDialog)
  
  validateData({
    ts: { users, medications, dialogs, thematicMaterials },
    firebase: { users: fbUsers, medications: fbMedications, dialogs: fbDialogs, thematicMaterials: fbThematicMaterials },
  })
  
  writeToTsFolder<User>({ collectionName: CollectionNames.USERS, collection: users })
  writeToTsFolder<Medication>({ collectionName: CollectionNames.MEDICATIONS, collection: medications })
  writeToTsFolder<ThematicMaterial>({ collectionName: CollectionNames.THEMATIC_MATERIALS, collection: thematicMaterials })
  writeToTsFolder<Dialog>({ collectionName: CollectionNames.DIALOGS, collection: dialogs })
  
  writeToFBFolder<FBUser>({ collectionName: CollectionNames.USERS, collection: fbUsers })
  writeToFBFolder<FBMedication>({ collectionName: CollectionNames.MEDICATIONS, collection: fbMedications })
  writeToFBFolder<FBThematicMaterial>({ collectionName: CollectionNames.THEMATIC_MATERIALS, collection: fbThematicMaterials })
  writeToFBFolder<FBDialog>({ collectionName: CollectionNames.DIALOGS, collection: fbDialogs })
  
  return {
    ts: { users, medications, thematicMaterials, dialogs },
    firebase: { users: fbUsers, medications: fbMedications, thematicMaterials: fbThematicMaterials, dialogs: fbDialogs },
  }
}

export const readFromFiles = () => {
  const users: User[] = JSON.parse(fs.readFileSync(`${BASE_TS_FILE_PATH}/${CollectionNames.USERS}.json`).toString())
  const medications: Medication[] = JSON.parse(fs.readFileSync(`${BASE_TS_FILE_PATH}/${CollectionNames.MEDICATIONS}.json`).toString())
  const thematicMaterials: ThematicMaterial[] = JSON.parse(fs.readFileSync(`${BASE_TS_FILE_PATH}/${CollectionNames.THEMATIC_MATERIALS}.json`).toString())
  const dialogs: Dialog[] = JSON.parse(fs.readFileSync(`${BASE_TS_FILE_PATH}/${CollectionNames.DIALOGS}.json`).toString())
  
  const fbUsers: FBUser[] = JSON.parse(fs.readFileSync(`${BASE_FB_FILE_PATH}/${CollectionNames.USERS}.json`).toString())
  const fbMedications: FBMedication[] = JSON.parse(fs.readFileSync(`${BASE_FB_FILE_PATH}/${CollectionNames.MEDICATIONS}.json`).toString())
  const fbThematicMaterials: FBThematicMaterial[] = JSON.parse(fs.readFileSync(`${BASE_FB_FILE_PATH}/${CollectionNames.THEMATIC_MATERIALS}.json`).toString())
  const fbDialogs: FBDialog[] = JSON.parse(fs.readFileSync(`${BASE_FB_FILE_PATH}/${CollectionNames.DIALOGS}.json`).toString())
  
  const result: GeneratorResults = {
    ts: { users, medications, thematicMaterials, dialogs },
    firebase: { users: fbUsers, medications: fbMedications, thematicMaterials: fbThematicMaterials, dialogs: fbDialogs },
  }
  
  validateData(result)
  
  return result
}
