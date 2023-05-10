import {
  Comment,
  Message,
  UserInfo,
  EmployeeReview,
  Role,
  MedicationRoute, Diary,
} from "./utils.types";

export type Timestamp = string;

export type FirebaseDocId = {
  docId: string;
};

export type User = FirebaseDocId & {
  email: string;
  imageUrl: string;
  name: {
    first: string;
    last: string;
  };
  address: string;
  phone: string;
  role: Role;
  diary?: Diary;
  employee?: {
    reviews: EmployeeReview[];
    salary: number;
  }
};

export type Medication = FirebaseDocId & {
  imageUrl: string;
  title: string;
  description: string;
  instruction: string;
  medicationRoute: MedicationRoute;
};

export type ThematicMaterial = FirebaseDocId & {
  imageUrl: string;
  docUrl: string;
  createdAt: Timestamp;
  title: string;
  description: string;
  author: UserInfo;
  comments: Comment[];
};

export type Dialog = FirebaseDocId & {
  doctor: UserInfo;
  patient: UserInfo;
  messages: Message[];
};
