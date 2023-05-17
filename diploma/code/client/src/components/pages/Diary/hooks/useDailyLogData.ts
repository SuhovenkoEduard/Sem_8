import { DailyLog } from "firestore/types/collections.types";
import { useCallback, useEffect, useState } from "react";
import {
  convertDailyLogToDailyLogData,
  DailyLogData,
} from "firestore/converters";

export const useDailyLogData = (dailyLog: DailyLog) => {
  const [dailyLogData, setDailyLogData] = useState<DailyLogData>(
    convertDailyLogToDailyLogData(dailyLog)
  );

  const resetDailyLogData = useCallback(() => {
    setDailyLogData(convertDailyLogToDailyLogData(dailyLog));
  }, [setDailyLogData, dailyLog]);

  // effects
  useEffect(resetDailyLogData, [dailyLog, resetDailyLogData]);

  return { dailyLogData, setDailyLogData, resetDailyLogData };
};
