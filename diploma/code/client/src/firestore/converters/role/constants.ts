import { Role } from "firestore/types/collections.types";

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
