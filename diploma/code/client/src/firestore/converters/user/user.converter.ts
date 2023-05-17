import { User, UserInfo } from "firestore/types/collections.types";

export const convertUserToUserInfo = (user: User): UserInfo => {
  const clonedUser: User = {
    ...user,
  };
  delete clonedUser.diary;
  delete clonedUser.employee;
  delete clonedUser.relativePatient;
  return JSON.parse(JSON.stringify(clonedUser));
};
