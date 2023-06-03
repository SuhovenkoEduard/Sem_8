import { z } from "zod";
import {
  DailyLogPropName,
  EmployeeReviewRate,
  FirebaseDocId,
  GoalCategory,
  GoalStatus,
  MedicationRoute,
  PatientReplyStatus,
  Role,
} from "./collections.types";

export const authUserIdSchema = z.string();

export const firebaseDocIdSchema = z
  .object({
    docId: authUserIdSchema,
  })
  .strict();

export const timestampSchema = z.string();

export const roleSchema = z.nativeEnum(Role);

export const goalCategorySchema = z.nativeEnum(GoalCategory);

export const goalStatusSchema = z.nativeEnum(GoalStatus);

export const medicationRouteSchema = z.nativeEnum(MedicationRoute);

export const employeeReviewRateSchema = z.nativeEnum(EmployeeReviewRate);

export const noteSchema = z
  .object({
    createdAt: timestampSchema,
    content: z.string(),
  })
  .strict();

export const goalSchema = z
  .object({
    title: z.string(),
    description: z.string(),
    notes: z.array(noteSchema),
    createdAt: timestampSchema,
    deadline: timestampSchema,
    category: goalCategorySchema,
    status: goalStatusSchema,
    progress: z.number(),
  })
  .strict();

export const medicationSchema = firebaseDocIdSchema
  .extend({
    imageUrl: z.string(),
    title: z.string(),
    description: z.string(),
    instruction: z.string(),
    medicationRoute: medicationRouteSchema,
  })
  .strict();

export const takenMedicationSchema = z
  .object({
    medication: medicationSchema,
    time: timestampSchema,
    dosage: z.number(),
  })
  .strict();

export const messageSchema = z
  .object({
    createdAt: timestampSchema,
    content: z.string(),
    sender: authUserIdSchema,
  })
  .strict();

export const employeeReviewSchema = z
  .object({
    createdAt: timestampSchema,
    score: z.number(),
    content: z.string(),
    reviewer: authUserIdSchema,
  })
  .strict();

export const dailyLogSchema = z
  .object({
    createdAt: timestampSchema,
    takenMedications: z.array(takenMedicationSchema),
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
    notes: z.array(noteSchema),
  })
  .strict();

export const commentSchema = z
  .object({
    message: messageSchema,
    score: z.number(),
  })
  .strict();

export const thematicMaterialSchema = firebaseDocIdSchema
  .extend({
    imageUrl: z.string(),
    content: z.string(),
    createdAt: timestampSchema,
    title: z.string(),
    description: z.string(),
    author: authUserIdSchema,
    comments: z.array(commentSchema),
  })
  .strict();

export const diarySchema = z
  .object({
    diabetType: z.number(),
    dailyLogs: z.array(dailyLogSchema),
    goals: z.array(goalSchema),
  })
  .strict();

export const userSchema = firebaseDocIdSchema
  .extend({
    email: z.string(),
    password: z.string(),
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
    diary: diarySchema.optional(),
    employee: z
      .object({
        hiredAt: timestampSchema,
        reviews: z.array(employeeReviewSchema),
        salary: z.number(),
        description: z.string(),
      })
      .strict()
      .optional(),
    relativePatient: authUserIdSchema.optional(),
    doctor: authUserIdSchema.optional(),
  })
  .strict();

export const dailyLogPropNameSchema = z.nativeEnum(DailyLogPropName);

export const healthStateSchema = firebaseDocIdSchema
  .extend({
    title: z.string(),
    propName: dailyLogPropNameSchema,
    min: z.number(),
    max: z.number(),
    warning: z.string(),
    recommendation: z.string(),
  })
  .strict();

export const patientReplyStatusSchema = z.nativeEnum(PatientReplyStatus);

export const patientReplySchema = z
  .object({
    createdAt: timestampSchema,
    status: patientReplyStatusSchema,
    comment: z.string(),
  })
  .strict();

export const recommendationSchema = z
  .object({
    createdAt: timestampSchema,
    healthStates: z.array(healthStateSchema),
    comment: z.string(),
    patientReply: patientReplySchema.or(z.null()),
  })
  .strict();

export const patientReportSchema = z
  .object({
    currentValue: z.number(),
    propName: dailyLogPropNameSchema,
  })
  .strict();

export const notificationSchema = firebaseDocIdSchema
  .extend({
    createdAt: timestampSchema,
    patient: authUserIdSchema,
    doctor: authUserIdSchema,
    patientReports: z.array(patientReportSchema),
    recommendation: recommendationSchema.or(z.null()),
  })
  .strict();
