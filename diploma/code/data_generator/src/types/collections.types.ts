export type Timestamp = string;
export type FBAuthUserId = string;

export type FirebaseDocId = {
  docId: string;
}

export type User = FirebaseDocId & {
  fbUId: FBAuthUserId;
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
    hiredAt: Timestamp;
    reviews: EmployeeReview[];
    salary: number;
  }
}

export type UserInfo = Omit<User, 'fbUId' | 'diary' | 'employee'>;

export type Medication = FirebaseDocId & {
  imageUrl: string;
  title: string;
  description: string;
  instruction: string;
  medicationRoute: MedicationRoute;
}

export type ThematicMaterial = FirebaseDocId & {
  imageUrl: string;
  docUrl: string;
  createdAt: Timestamp;
  title: string;
  description: string;
  author: UserInfo;
  comments: Comment[];
}

export type Dialog = FirebaseDocId & {
  doctor: UserInfo;
  patient: UserInfo;
  messages: Message[];
}

export enum Role {
  PATIENT = 'patient',
  RELATIVE = 'relative',
  DOCTOR = 'doctor',
  CONTENT_MAKER = 'content maker',
  MODERATOR = 'moderator',
  ADMIN = 'admin',
}

export enum GoalCategory {
  EDUCATION = 'education',
  FITNESS = 'fitness',
  CAREER = 'career',
  OTHER = 'other',
}

export enum GoalStatus {
  COMPLETED = 'completed',
  IN_PROGRESS = 'in progress',
  PENDING = 'pending',
  CANCELLED = 'cancelled',
}

export enum MedicationRoute {
  ORAL = 'oral',
  TOPICAL = 'topical',
  INJECTION = 'injection',
}

export enum EmployeeReviewRate {
  GREAT = 'great',
  ACCEPTABLE = 'acceptable',
  BAD = 'bad',
  TERRIBLE = 'terrible',
}

export type Diary = {
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
  sender: UserInfo;
};

export type EmployeeReview = {
  createdAt: Timestamp;
  rate: EmployeeReviewRate;
  content: string;
  reviewer: UserInfo;
};
