import fs from "fs";
import { generateUsers } from "./generators";
import { BASE_FILE_PATH, COLLECTION_SIZES, CollectionNames } from "./constants";
import { Dialog, Medication, ThematicMaterial, User } from "./types/collections.types";
import { Role, UserInfo } from "./types/utils.types";
import { getUserInfoFromUser } from "./helpers";
import {
  generateMedication,
  generateThematicMaterial,
  generateDialogs
} from "./generators";

const getUsersInfoByRoles = ({ users , roles }: {
  users: User[],
  roles: Role[]
}): UserInfo[] =>
  users
    .filter(user => roles.includes(user.role))
    .map(getUserInfoFromUser)

const writeToFile = <T>({ collectionName, collection }:{
  collectionName: string,
  collection: T[]
}) => {
  fs.writeFileSync(`${BASE_FILE_PATH}/${collectionName}.json`, JSON.stringify(collection, null, '  '));
}

const medications: Medication[] = generateMedication(COLLECTION_SIZES.Medications);
const users: User[] = generateUsers(COLLECTION_SIZES.Users, medications);

const users_patients: UserInfo[] = getUsersInfoByRoles({ users, roles: [Role.PATIENT] })
const users_doctors: UserInfo[] = getUsersInfoByRoles({ users, roles: [Role.DOCTOR] })
const users_authors: UserInfo[] = getUsersInfoByRoles({ users, roles: [Role.CONTENT_MAKER] })


const thematicMaterials: ThematicMaterial[] = generateThematicMaterial(
  COLLECTION_SIZES.ThematicMaterials,
  users_authors,
  users_patients
)

const dialogs: Dialog[] = generateDialogs(users_patients, users_doctors)

writeToFile<User>({ collectionName: CollectionNames.USERS, collection: users });
writeToFile<Medication>({ collectionName: CollectionNames.MEDICATIONS, collection: medications });
writeToFile<ThematicMaterial>({ collectionName: CollectionNames.THEMATIC_MATERIALS, collection: thematicMaterials });
writeToFile<Dialog>({ collectionName: CollectionNames.DIALOGS, collection: dialogs });
