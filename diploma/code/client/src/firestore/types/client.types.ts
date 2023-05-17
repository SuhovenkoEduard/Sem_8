import { UserData } from "firestore/converters";

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type ProfileFormErrors = {
  [key in keyof Pick<
    UserData,
    "firstName" | "lastName" | "address" | "phone"
  >]: string | null;
};
