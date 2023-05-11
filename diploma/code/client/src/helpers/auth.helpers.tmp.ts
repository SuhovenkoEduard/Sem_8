import { UserCredential } from "firebase/auth";
import { NavigateFunction } from "react-router-dom";
import { NotificationManager } from "react-notifications";
import { APP_ROUTES } from "components/routing";
import { firebaseAdapters } from "firestore/data/adapters";
import { generateDocId } from "firestore/helpers";
import { Role } from "firestore/types/collections.types";
import { firebaseRepositories } from "firestore/data/repositories";
import { faker } from "@faker-js/faker";

export const successfulAuth = async (
  userCredential: UserCredential,
  navigate: NavigateFunction
) => {
  NotificationManager.success("Successful authentication!");
  navigate(APP_ROUTES.profile);
  const { uid } = userCredential.user;
  console.log({ uid, userCredential });

  const users = await firebaseAdapters.users.getDocs();
  // const dialogs = await firebaseAdapters.dialogs.getDocs();
  // const thematicMaterials = await firebaseAdapters.thematicMaterials.getDocs();
  // const medications = await firebaseAdapters.medications.getDocs();

  const currentUser = users.find((user) => user.fbUId === uid);

  console.log({
    users,
    // dialogs,
    // thematicMaterials,
    // medications,
    currentUser,
  });
};

export const successfulSignUp = async ({
  firstName,
  lastName,
  userCredential,
}: {
  firstName: string;
  lastName: string;
  userCredential: UserCredential;
}) => {
  const { uid } = userCredential.user;

  const doctors = (await firebaseRepositories.users.getDocs()).filter(
    (user) => user.role === Role.DOCTOR
  );

  const newUserId = generateDocId();
  await firebaseRepositories.users.updateDoc({
    fbUId: uid,
    docId: newUserId,
    address: "",
    email: "",
    imageUrl: "",
    name: { first: firstName, last: lastName },
    phone: "",
    role: Role.PATIENT,
  });

  const assignedDoctor = faker.helpers.arrayElement(doctors);
  const newDialogId = generateDocId();
  await firebaseRepositories.dialogs.updateDoc({
    docId: newDialogId,
    doctor: assignedDoctor.docId,
    patient: newUserId,
    messages: [],
  });
};
