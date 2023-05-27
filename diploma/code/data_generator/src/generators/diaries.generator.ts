import type { Medication, Diary } from "../types/collections.types";

import moment from "moment";
import { faker } from "@faker-js/faker";

import { generateGoals, generateDailyLogs } from "../generators";

export const generateDiaries = (
  count: number,
  medications: Medication[]
): Diary[] => {
  return new Array(count).fill(null).map(
    (): Diary => ({
      diabetType: faker.datatype.number({ min: 1, max: 2 }),
      dailyLogs: generateDailyLogs(
        +moment().subtract(1, "week").toDate(),
        +moment().toDate(),
        medications
      ),
      goals: [], // generateGoals(faker.datatype.number({ min: 3, max: 10 })),
    })
  );
};
