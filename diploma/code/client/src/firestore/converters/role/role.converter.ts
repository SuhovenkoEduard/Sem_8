import { Role } from "firestore/types/collections.types";
import {
  RUSSIAN_ROLES,
  RUSSIAN_ROLES_PLURAL,
} from "firestore/converters/role/constants";

export const convertRoleToRussian = (role: Role): string => RUSSIAN_ROLES[role];

export const convertRoleToRussianPlural = (role: Role): string =>
  RUSSIAN_ROLES_PLURAL[role];
