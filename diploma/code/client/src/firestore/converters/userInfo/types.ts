import { UserInfo } from "firestore/types/collections.types";

export type UserData = Pick<
  UserInfo,
  "docId" | "address" | "phone" | "imageUrl" | "email" | "role"
> & {
  firstName: string;
  lastName: string;
};
