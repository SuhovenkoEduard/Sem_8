import {
  Comment,
  Dialog,
  EmployeeReview,
  Medication,
  Message,
  ThematicMaterial,
  User,
} from "../collections.types";

export type FBMedication = Medication;
export type FBUserId = string;

export type FBUser = Omit<User, "employee" | "relativePatient"> & {
  employee?: Omit<Pick<User, "employee">, "reviews"> & {
    reviews: FBEmployeeReview[];
  };
  relativePatient?: FBUserId;
};

export type FBThematicMaterial = Omit<
  ThematicMaterial,
  "author" | "comments"
> & {
  author: FBUserId;
  comments: FBComment[];
};

export type FBDialog = Omit<Dialog, "doctor" | "patient" | "messages"> & {
  doctor: FBUserId;
  patient: FBUserId;
  messages: FBMessage[];
};

export type FBComment = Omit<Comment, "message"> & {
  message: FBMessage;
};

export type FBMessage = Omit<Message, "sender"> & {
  sender: FBUserId;
};

export type FBEmployeeReview = Omit<EmployeeReview, "reviewer"> & {
  reviewer: FBUserId;
};
