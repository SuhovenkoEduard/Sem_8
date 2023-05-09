import {
  DailyLog,
  Comment,
  Message,
  UserInfo,
  EmployeeReview,
  Goal,
  Role,
  MedicationRoute,
} from "firestore/types/utils.types";

export type Timestamp = number;

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
  diary?: string;
};

export type Diary = FirebaseDocId & {
  dailyLogs: DailyLog[];
  goals: Goal[];
};

export type Medication = FirebaseDocId & {
  title: string;
  description: string;
  instruction: string;
  medicationRoute: MedicationRoute;
  frequency: string;
};

export type ThematicMaterial = FirebaseDocId & {
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

export type Employee = FirebaseDocId & {
  user: UserInfo;
  hiredAt: Timestamp;
  reviews: EmployeeReview[];
  salary: number;
};
