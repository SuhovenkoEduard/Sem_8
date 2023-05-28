export type Timestamp = string;
export type AuthUserId = string;

export type FirebaseDocId = {
  docId: AuthUserId;
};

export type User = FirebaseDocId & {
  email: string;
  password?: string;
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
    hiredAt: Timestamp;
    reviews: EmployeeReview[];
    salary: number;
    description: string;
  };
  relativePatient?: AuthUserId;
  doctor?: string;
};

export type UserInfo = Omit<User, "diary" | "employee" | "relativePatient">;

export type Medication = FirebaseDocId & {
  imageUrl: string;
  title: string;
  description: string;
  instruction: string;
  medicationRoute: MedicationRoute;
};

export type ThematicMaterial = FirebaseDocId & {
  imageUrl: string;
  content: string;
  createdAt: Timestamp;
  title: string;
  description: string;
  author: AuthUserId;
  comments: Comment[];
};

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

export enum EmployeeReviewRate {
  GREAT = "great",
  ACCEPTABLE = "acceptable",
  BAD = "bad",
  TERRIBLE = "terrible",
}

export type Diary = {
  diabetType: number;
  dailyLogs: DailyLog[];
  goals: Goal[];
};

export type DailyLog = {
  createdAt: Timestamp;
  takenMedications: TakenMedication[];
  blood: {
    sugarLevel: number;
    pulse?: number;
    pressure?: {
      systolic: number;
      diastolic: number;
    };
  };
  calories?: {
    total: number;
    carbohydratesIntake?: number;
  };
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
  sender: AuthUserId;
};

export type EmployeeReview = {
  createdAt: Timestamp;
  score: number;
  content: string;
  reviewer: AuthUserId;
};

export enum DailyLogPropName {
  SUGAR_LEVEL = "sugarLevel",
  PULSE = "pulse",
  SYSTOLIC = "systolic",
  DIASTOLIC = "diastolic",
  WEIGHT = "weight",
  TOTAL = "total",
  TEMPERATURE = "temperature",
}

export type HealthState = FirebaseDocId & {
  propName: DailyLogPropName;
  min: number;
  max: number;
  warning: string;
  recommendation: string;
};

export enum PatientReplyStatus {
  DONE = "Выполнено, спасибо!",
  IGNORED = "Проигнорирована",
  DENIED = "Отклонена",
  NOT_SEEN = "Не просмотрена",
}

export type PatientReply = {
  createdAt: Timestamp;
  status: PatientReplyStatus;
  comment: string;
};

export type Recommendation = {
  createdAt: Timestamp;
  healthStates: HealthState[];
  comment: string;
  patientReply: PatientReply | null;
};

export type PatientReport = {
  currentValue: number;
  propName: DailyLogPropName;
};

export type Notification = FirebaseDocId & {
  createdAt: Timestamp;
  patient: AuthUserId;
  doctor: AuthUserId;
  patientReports: PatientReport[];
  recommendation: Recommendation | null;
};
