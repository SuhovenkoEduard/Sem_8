import { faker } from "@faker-js/faker";
import { User, UserInfo } from "./types/collections.types";
import { FBUser } from "firestore/types/firebase/fb_collections.types";

export const generateDocId = () =>
  faker.datatype.uuid().replaceAll("-", "").slice(0, 20);

export const getUserInfoFromUser = (user: User | FBUser): UserInfo => {
  const clonedUser: Omit<User | FBUser, "fbUId"> & { fbUId?: string } = {
    ...user,
  };
  delete clonedUser.fbUId;
  delete clonedUser.diary;
  delete clonedUser.employee;
  delete clonedUser.relativePatient;
  return JSON.parse(JSON.stringify(clonedUser));
};
