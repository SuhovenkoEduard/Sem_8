import { UserCredential } from "firebase/auth";
import { NavigateFunction } from "react-router-dom";
import { NotificationManager } from "react-notifications";
import { Routes } from "components/routing";
import { generateDocId } from "firestore/helpers";
import { Role } from "firestore/types/collections.types";
import { firebaseRepositories } from "firestore/data/repositories";
import { faker } from "@faker-js/faker";

export const successfulAuth = async (
  userCredential: UserCredential,
  navigate: NavigateFunction
) => {
  NotificationManager.success("Successful authentication!");
  navigate(Routes.profile);
  // const { uid } = userCredential.user;
  // console.log({ uid, userCredential });

  // const users = await firebaseRepositories.users.getDocs();
  // const dialogs = await firebaseRepositories.dialogs.getDocs();
  // const thematicMaterials = await firebaseRepositories.thematicMaterials.getDocs();
  // const medications = await firebaseRepositories.medications.getDocs();

  // const currentUser = await firebaseRepositories.users.getDocById(uid);

  // console.log({
  //   // users,
  //   // patientsAndDoctors,
  //   // patients,
  //   // dialogs,
  //   // thematicMaterials,
  //   // medications,
  //   // currentUser,
  // });
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

  await firebaseRepositories.users.updateDoc({
    docId: uid,
    address: "",
    email: "",
    imageUrl: "",
    name: { first: firstName, last: lastName },
    phone: "",
    role: Role.PATIENT,
    diary: {
      dailyLogs: [],
      goals: [],
    },
  });

  const assignedDoctor = faker.helpers.arrayElement(doctors);
  const newDialogId = generateDocId();
  await firebaseRepositories.dialogs.updateDoc({
    docId: newDialogId,
    doctor: assignedDoctor.docId,
    patient: uid,
    messages: [],
  });
};
