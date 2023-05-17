import { DailyLog } from "firestore/types/collections.types";
import { Omit } from "firestore/types/client.types";

export type DailyLogData = Required<
  Omit<DailyLog, "blood" | "calories" | "temperature" | "weight"> & {
    sugarLevel: string;
    pulse: string;
    systolic: string;
    diastolic: string;
    total: string;
    carbohydratesIntake: string;
    temperature: string;
    weight: string;
  }
>;
