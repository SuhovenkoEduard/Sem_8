import { UserInfo } from "firestore/types/collections.types";
import { PartialBy } from "firestore/types/client.types";
import { deepCopy } from "deep-copy-ts";
import { UserData } from "firestore/converters";

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
