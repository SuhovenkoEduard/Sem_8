import { Role } from "./types/collections.types";

export enum CollectionNames {
  USERS = "users",
  MEDICATIONS = "medications",
  THEMATIC_MATERIALS = "thematicMaterials",
  DIALOGS = "dialogs",
}

export const COLLECTION_SIZES: {
  [key in CollectionNames]?: number;
} = {
  [CollectionNames.MEDICATIONS]: 10,
  [CollectionNames.THEMATIC_MATERIALS]: 10,
};

export const BASE_FILE_PATH = "out/";

export const USERS_AUTH_DATA = [
  {
    firstName: "Алексей",
    uid: "4SjKsrZJdMdMOXHB3vzrlx7Y0Dj1",
    role: Role.PATIENT,
  },
  {
    firstName: "Игорь",
    uid: "jsvFTA0FUvYi7rBzIpKboW9iOap1",
    role: Role.PATIENT,
  },
  {
    uid: "1Nsuwpw16ONs5wBbCZz9N3dlOBh1",
    role: Role.RELATIVE,
  },
  {
    uid: "ibtsnqFcOma3Ip1U2CRVBQD4Bwv1",
    role: Role.DOCTOR,
  },
  {
    uid: "Dq03CloeXRSEwoSxuMFbz1u24jw1",
    role: Role.CONTENT_MAKER,
  },
  {
    uid: "G5hkZ9otwEdqJtpDqkiC8UhqSqf2",
    role: Role.MODERATOR,
  },
  {
    uid: "Ph0RnmF77cduOdfNg16CVYYDjVc2",
    role: Role.ADMIN,
  },
];

export type UsersAuthData = typeof USERS_AUTH_DATA;
