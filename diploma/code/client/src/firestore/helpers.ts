import { faker } from "@faker-js/faker";
import { Role, User, UserInfo } from "./types/collections.types";
import {
  PartialBy,
  RUSSIAN_ROLES,
  UserData,
} from "firestore/types/client.types";
import { deepCopy } from "deep-copy-ts";

export const generateDocId = () =>
  faker.datatype.uuid().replaceAll("-", "").slice(0, 20);

export const convertUserToUserInfo = (user: User): UserInfo => {
  const clonedUser: User = {
    ...user,
  };
  delete clonedUser.diary;
  delete clonedUser.employee;
  delete clonedUser.relativePatient;
  return JSON.parse(JSON.stringify(clonedUser));
};

export const convertUserInfoToUserData = (userInfo: UserInfo): UserData => {
  const copiedUserInfo: PartialBy<UserInfo, "name"> = deepCopy(userInfo);
  delete copiedUserInfo.name;
  return {
    ...copiedUserInfo,
    firstName: userInfo.name.first,
    lastName: userInfo.name.last,
  };
};

export const convertUserDataToUserInfo = (userData: UserData): UserInfo => {
  const copiedUserInfo: PartialBy<UserData, "firstName" | "lastName"> =
    deepCopy(userData);
  delete copiedUserInfo.firstName;
  delete copiedUserInfo.lastName;
  return {
    ...copiedUserInfo,
    name: {
      first: userData.firstName,
      last: userData.lastName,
    },
  };
};

export const convertRoleToRussian = (role: Role): string => RUSSIAN_ROLES[role];
