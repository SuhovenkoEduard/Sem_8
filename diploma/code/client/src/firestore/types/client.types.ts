import { Role, UserInfo } from "firestore/types/collections.types";

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type UserData = Omit<UserInfo, "name"> & {
  firstName: string;
  lastName: string;
};

export type ProfileErrors = Omit<
  UserData,
  "docId" | "role" | "imageUrl" | "email"
>;

export const RUSSIAN_ROLES: {
  [key in Role]: string;
} = {
  [Role.PATIENT]: "пациент",
  [Role.RELATIVE]: "родственник",
  [Role.DOCTOR]: "доктор",
  [Role.CONTENT_MAKER]: "контент-мейкер",
  [Role.MODERATOR]: "модератор",
  [Role.ADMIN]: "админ",
};
