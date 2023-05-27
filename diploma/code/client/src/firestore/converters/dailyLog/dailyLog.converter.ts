import { DailyLog, DailyLogPropName } from "firestore/types/collections.types";
import { DailyLogData } from "firestore/converters/dailyLog/types";
import { PartialBy } from "firestore/types/client.types";
import { deepCopy } from "deep-copy-ts";
import { RUSSIAN_DAILY_LOG_PROP_NAMES } from "firestore/converters/role/constants";

export const convertDailyLogToDailyLogData = (
  dailyLog: DailyLog
): DailyLogData => {
  const copiedDailyLog: PartialBy<DailyLog, "blood" | "calories"> =
    deepCopy(dailyLog);
  delete copiedDailyLog.blood;
  delete copiedDailyLog.calories;
  return {
    ...copiedDailyLog,
    sugarLevel: dailyLog.blood.sugarLevel.toString(),
    pulse: dailyLog.blood.pulse?.toString() ?? "",
    systolic: dailyLog.blood.pressure?.systolic?.toString() ?? "",
    diastolic: dailyLog.blood.pressure?.diastolic?.toString() ?? "",
    total: dailyLog.calories?.total?.toString() ?? "",
    carbohydratesIntake:
      dailyLog.calories?.carbohydratesIntake?.toString() ?? "",
    temperature: dailyLog.temperature?.toString() ?? "",
    weight: dailyLog.weight?.toString() ?? "",
  };
};

export const convertDailyLogDataToDailyLog = (
  dailyLogData: DailyLogData
): DailyLog => {
  const copiedDailyLogData: PartialBy<
    DailyLogData,
    | "sugarLevel"
    | "pulse"
    | "systolic"
    | "diastolic"
    | "total"
    | "carbohydratesIntake"
    | "temperature"
    | "weight"
  > = deepCopy(dailyLogData);
  delete copiedDailyLogData.sugarLevel;
  delete copiedDailyLogData.pulse;
  delete copiedDailyLogData.systolic;
  delete copiedDailyLogData.diastolic;
  delete copiedDailyLogData.total;
  delete copiedDailyLogData.carbohydratesIntake;
  delete copiedDailyLogData.temperature;
  delete copiedDailyLogData.weight;
  return {
    ...copiedDailyLogData,
    blood: {
      sugarLevel: +dailyLogData.sugarLevel,
      pulse: +dailyLogData.pulse,
      pressure: {
        systolic: +dailyLogData.systolic,
        diastolic: +dailyLogData.diastolic,
      },
    },
    calories: {
      total: +dailyLogData.total,
      carbohydratesIntake:
        dailyLogData.carbohydratesIntake === ""
          ? 0
          : +dailyLogData.carbohydratesIntake,
    },
    temperature: +dailyLogData.temperature,
    weight: +dailyLogData.weight,
  };
};

export const convertDailyLogPropNameToRussian = (propName: DailyLogPropName) =>
  RUSSIAN_DAILY_LOG_PROP_NAMES[propName];
