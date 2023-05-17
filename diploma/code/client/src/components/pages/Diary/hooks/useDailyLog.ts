import { DailyLog, User } from "firestore/types/collections.types";
import { useSelector } from "react-redux";
import { GlobalState } from "store";
import dayjs from "dayjs";
import { useMemo } from "react";

export const createDailyLog = (date: dayjs.Dayjs): DailyLog => {
  return {
    createdAt: date.toString(),
    takenMedications: [],
    blood: {
      sugarLevel: 0,
      pulse: 0,
      pressure: {
        systolic: 0,
        diastolic: 0,
      },
    },
    calories: {
      total: 0,
      carbohydratesIntake: 0,
    },
    temperature: 0,
    weight: 0,
    notes: [],
  };
};

export const useDailyLog = (date: dayjs.Dayjs) => {
  const user = useSelector<GlobalState, User>(
    (state) => state.currentUser.user as User
  );

  return useMemo(() => {
    const dailyLogs: DailyLog[] = user.diary?.dailyLogs as DailyLog[];

    const selectedLog = dailyLogs.find(
      (log) => dayjs(log.createdAt).format("l") === date.format("l")
    );

    return selectedLog ?? createDailyLog(date);
  }, [user, date]);
};
