import { UserInfo } from "firestore/types/collections.types";
import { Omit } from "firestore/types/client.types";

export type UserData = Omit<UserInfo, "name"> & {
  firstName: string;
  lastName: string;
};
