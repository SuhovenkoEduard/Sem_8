import { Medication, Timestamp, User } from "firestore/types/collections.types";

export enum Role {
  PATIENT = "patient",
  RELATIVE = "relative",
  DOCTOR = "doctor",
  CONTENT_MAKER = "content maker",
  MODERATOR = "moderator",
  ADMIN = "admin",
}

export enum GoalCategory {
  EDUCATION = "education",
  FITNESS = "fitness",
  CAREER = "career",
  OTHER = "other",
}

export enum GoalStatus {
  COMPLETED = "completed",
  IN_PROGRESS = "in progress",
  PENDING = "pending",
  CANCELLED = "cancelled",
}

export enum MedicationRoute {
  ORAL = "oral",
  TOPICAL = "topical",
  INJECTION = "injection",
}

export type UserInfo = Omit<User, "diary">;

export type DailyLog = {
  createdAt: Timestamp;
  carbohydratesIntake: number;
  takenMedications: TakenMedication[];
  blood: {
    sugarLevels: number[];
    pulse?: number;
    pressure?: {
      systolic: number;
      diastolic: number;
    };
  };
  calories?: number;
  temperature?: number;
  weight?: number;
  notes: Note[];
};

export type TakenMedication = {
  medication: Medication;
  time: Timestamp;
  dosage: number;
};

export type Note = {
  createdAt: Timestamp;
  content: string;
};

export type Goal = {
  title: string;
  description: string;
  notes: Note[];
  createdAt: Timestamp;
  deadline: Timestamp;
  category: GoalCategory;
  status: GoalStatus;
  progress: number;
};

export type Comment = {
  message: Message;
  score: number;
};

export type Message = {
  createdAt: Timestamp;
  content: string;
  sender: UserInfo;
};

export type EmployeeReview = {
  content: string;
  reviewer: UserInfo;
};
