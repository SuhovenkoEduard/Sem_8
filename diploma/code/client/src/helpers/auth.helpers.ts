import { UserCredential } from "firebase/auth";
import { NavigateFunction } from "react-router-dom";
import { NotificationManager } from "react-notifications";
import { Route } from "components/routing";
import { Role } from "firestore/types/collections.types";
import { firebaseRepositories } from "firestore/data/repositories";
import { faker } from "@faker-js/faker";

export const successfulAuth = async (
  userCredential: UserCredential,
  navigate: NavigateFunction
) => {
  NotificationManager.success("Успешная авторизация!");
  navigate(Route.profile);
};

export const successfulSignUp = async ({
  firstName,
  lastName,
  email,
  password,
  role,
  relativePatientId,
  diabetType,
  userCredential,
}: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: Role;
  relativePatientId?: string;
  diabetType?: number;
  userCredential: UserCredential;
}) => {
  const { uid } = userCredential.user;

  const doctors = (await firebaseRepositories.users.getDocs()).filter(
    (user) => user.role === Role.DOCTOR
  );

  const assignedDoctor = faker.helpers.arrayElement(doctors);

  const patientData =
    role === Role.PATIENT && diabetType
      ? {
          diary: {
            diabetType,
            dailyLogs: [],
            goals: [],
          },
          doctor: assignedDoctor.docId,
        }
      : undefined;

  const relativeData =
    role === Role.PATIENT
      ? undefined
      : {
          relativePatient: relativePatientId,
        };

  await firebaseRepositories.users.updateDoc({
    docId: uid,
    address: "",
    email,
    password,
    imageUrl: "",
    name: { first: firstName, last: lastName },
    phone: "",
    role,
    ...patientData,
    ...relativeData,
  });
};
