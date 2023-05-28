import { DailyLogPropName, Role } from "firestore/types/collections.types";

export const RUSSIAN_ROLES: {
  [key in Role]: string;
} = {
  [Role.PATIENT]: "пациент",
  [Role.RELATIVE]: "родственник",
  [Role.DOCTOR]: "доктор",
  [Role.CONTENT_MAKER]: "контент-мейкер",
  [Role.MODERATOR]: "модератор",
  [Role.ADMIN]: "админ",
};

export const RUSSIAN_DAILY_LOG_PROP_NAMES: {
  [key in DailyLogPropName]: string;
} = {
  [DailyLogPropName.SUGAR_LEVEL]: "Уровень сахара",
  [DailyLogPropName.PULSE]: "Пульс",
  [DailyLogPropName.SYSTOLIC]: "Систолическое давление",
  [DailyLogPropName.DIASTOLIC]: "Диастолическое давление",
  [DailyLogPropName.WEIGHT]: "Вес",
  [DailyLogPropName.TOTAL]: "Количество калорий",
  [DailyLogPropName.TEMPERATURE]: "Температура",
};

export const MEASUREMENTS: {
  [key in DailyLogPropName]: string;
} = {
  [DailyLogPropName.SUGAR_LEVEL]: "ммоль/л",
  [DailyLogPropName.PULSE]: "уд/мин",
  [DailyLogPropName.SYSTOLIC]: "ммрт",
  [DailyLogPropName.DIASTOLIC]: "ммрт",
  [DailyLogPropName.WEIGHT]: "кг",
  [DailyLogPropName.TOTAL]: "ккал",
  [DailyLogPropName.TEMPERATURE]: "°C",
};
