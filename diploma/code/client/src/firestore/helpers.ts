import { faker } from "@faker-js/faker";
import { User, UserInfo } from "./types/collections.types";

export const generateDocId = () =>
  faker.datatype.uuid().replaceAll("-", "").slice(0, 20);

export const getUserInfoFromUser = (user: User): UserInfo => {
  const clonedUser: User = {
    ...user,
  };
  delete clonedUser.diary;
  delete clonedUser.employee;
  delete clonedUser.relativePatient;
  return JSON.parse(JSON.stringify(clonedUser));
};
