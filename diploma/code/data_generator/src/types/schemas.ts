import { z } from "zod";
import {
  EmployeeReviewRate,
  GoalCategory,
  GoalStatus,
  MedicationRoute,
  Role,
} from "./collections.types";

export const fbAuthUserIdSchema = z.string();

export const firebaseDocIdSchema = z
  .object({
    docId: fbAuthUserIdSchema,
  })
  .strict();

export const timestampSchema = z.string();

export const roleSchema = z.nativeEnum(Role);

export const goalCategorySchema = z.nativeEnum(GoalCategory);

export const goalStatusSchema = z.nativeEnum(GoalStatus);

export const medicationRouteSchema = z.nativeEnum(MedicationRoute);

export const employeeReviewRateSchema = z.nativeEnum(EmployeeReviewRate);

export const fBNoteSchema = z
  .object({
    createdAt: timestampSchema,
    content: z.string(),
  })
  .strict();

export const fBGoalSchema = z
  .object({
    title: z.string(),
    description: z.string(),
    notes: z.array(fBNoteSchema),
    createdAt: timestampSchema,
    deadline: timestampSchema,
    category: goalCategorySchema,
    status: goalStatusSchema,
    progress: z.number(),
  })
  .strict();

export const fBMedicationSchema = firebaseDocIdSchema
  .extend({
    imageUrl: z.string(),
    title: z.string(),
    description: z.string(),
    instruction: z.string(),
    medicationRoute: medicationRouteSchema,
  })
  .strict();

export const fBTakenMedicationSchema = z
  .object({
    medication: fBMedicationSchema,
    time: timestampSchema,
    dosage: z.number(),
  })
  .strict();

export const fBMessageSchema = z
  .object({
    createdAt: timestampSchema,
    content: z.string(),
    sender: fbAuthUserIdSchema,
  })
  .strict();

export const fBEmployeeReviewSchema = z
  .object({
    createdAt: timestampSchema,
    rate: employeeReviewRateSchema,
    content: z.string(),
    reviewer: fbAuthUserIdSchema,
  })
  .strict();

export const fBDialogSchema = firebaseDocIdSchema
  .extend({
    doctor: fbAuthUserIdSchema,
    patient: fbAuthUserIdSchema,
    messages: z.array(fBMessageSchema),
  })
  .strict();

export const fBDailyLogSchema = z
  .object({
    createdAt: timestampSchema,
    takenMedications: z.array(fBTakenMedicationSchema),
    blood: z
      .object({
        sugarLevel: z.number(),
        pulse: z.number().optional(),
        pressure: z
          .object({
            systolic: z.number(),
            diastolic: z.number(),
          })
          .strict()
          .optional(),
      })
      .strict(),
    calories: z
      .object({
        total: z.number(),
        carbohydratesIntake: z.number().optional(),
      })
      .strict()
      .optional(),
    temperature: z.number().optional(),
    weight: z.number().optional(),
    notes: z.array(fBNoteSchema),
  })
  .strict();

export const fBCommentSchema = z
  .object({
    message: fBMessageSchema,
    score: z.number(),
  })
  .strict();

export const fBThematicMaterialSchema = firebaseDocIdSchema
  .extend({
    imageUrl: z.string(),
    docUrl: z.string(),
    createdAt: timestampSchema,
    title: z.string(),
    description: z.string(),
    author: fbAuthUserIdSchema,
    comments: z.array(fBCommentSchema),
  })
  .strict();

export const fBDiarySchema = z
  .object({
    dailyLogs: z.array(fBDailyLogSchema),
    goals: z.array(fBGoalSchema),
  })
  .strict();

export const fBUserSchema = firebaseDocIdSchema
  .extend({
    email: z.string(),
    imageUrl: z.string(),
    name: z
      .object({
        first: z.string(),
        last: z.string(),
      })
      .strict(),
    address: z.string(),
    phone: z.string(),
    role: roleSchema,
    diary: fBDiarySchema.optional(),
    employee: z
      .object({
        hiredAt: timestampSchema,
        reviews: z.array(fBEmployeeReviewSchema),
        salary: z.number(),
      })
      .strict()
      .optional(),
    relativePatient: fbAuthUserIdSchema.optional(),
  })
  .strict();
