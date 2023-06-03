import { DailyLogPropName } from "./types/collections.types";

export enum CollectionName {
  USERS = "users",
  MEDICATIONS = "medications",
  THEMATIC_MATERIALS = "thematicMaterials",
  DIALOGS = "dialogs",
  HEALTH_STATES = "healthStates",
  NOTIFICATIONS = "notifications",
}

export const PATIENT_REPORT_RANGES = {
  [DailyLogPropName.SUGAR_LEVEL]: {
    min: 3.5,
    max: 7,
  },
  [DailyLogPropName.PULSE]: {
    min: 80,
    max: 100,
  },
  [DailyLogPropName.SYSTOLIC]: {
    min: 110,
    max: 130,
  },
  [DailyLogPropName.DIASTOLIC]: {
    min: 70,
    max: 90,
  },
  [DailyLogPropName.WEIGHT]: {
    min: 50,
    max: 95,
  },
  [DailyLogPropName.TOTAL]: {
    min: 2000,
    max: 3500,
  },
  [DailyLogPropName.TEMPERATURE]: {
    min: 36.1,
    max: 37.2,
  },
};
