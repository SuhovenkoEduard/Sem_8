import { Role } from "firestore/types/collections.types";
import { RUSSIAN_ROLES } from "firestore/converters/role/constants";

export const convertRoleToRussian = (role: Role): string => RUSSIAN_ROLES[role];
