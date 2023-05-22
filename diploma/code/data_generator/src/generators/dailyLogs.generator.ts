import type { DailyLog, Medication } from "../types/collections.types";
import moment from "moment";
import { faker } from "@faker-js/faker";

import { generateNotes } from "../generators";

export const generateDailyLogs = (
  minDate: number,
  maxDate: number,
  medications: Medication[]
): DailyLog[] => {
  const startDate = moment(minDate);
  const endDate = moment(maxDate);

  let temperature = faker.datatype.number({
    min: 36.1,
    max: 37.2,
    precision: 0.01,
  });
  let totalCalories = faker.datatype.number({ min: 2000, max: 3000 });
  let weight = faker.datatype.number({ min: 50, max: 80, precision: 0.01 });
  let sugarLevel = faker.datatype.number({
    min: 3.5 - 1,
    max: 7 + 1,
    precision: 0.01,
  });
  let pulse = faker.datatype.number({ min: 80 - 10, max: 100 + 10 });

  let systolic = faker.datatype.number({ min: 120 - 10, max: 120 + 10 });
  let diastolic = faker.datatype.number({ min: 80 - 10, max: 80 + 10 });

  const dailyLogs: DailyLog[] = [];
  for (
    let currentDate = startDate;
    currentDate.isBefore(endDate);
    currentDate.add(1, "day")
  ) {
    const randomTimeDate = faker.datatype.datetime({
      min: +moment(currentDate).startOf("day").toDate(),
      max: +moment(currentDate).endOf("day").toDate(),
    });

    // const carbohydratesIntakePercentage = faker.datatype.number({
    //   min: 0.45 - 0.15,
    //   max: 0.65 + 0.15,
    //   precision: 0.01,
    // });
    // const carbohydratesIntake = Math.floor(
    //   totalCalories * carbohydratesIntakePercentage
    // );

    if (faker.datatype.number({ min: 1, max: 3 }) === 1) {
      if (faker.datatype.boolean()) {
        totalCalories += 10;
      } else {
        totalCalories -= 10;
      }
    }
    totalCalories = Math.max(2000, Math.min(3000, totalCalories));

    if (faker.datatype.number({ min: 1, max: 5 }) === 4) {
      if (faker.datatype.boolean()) {
        temperature += 0.1;
      } else {
        temperature -= 0.1;
      }
    }
    temperature = Math.max(36.1, Math.min(37.2, temperature));

    if (faker.datatype.number({ min: 1, max: 6 }) === 1) {
      if (faker.datatype.boolean()) {
        weight += 0.2;
      } else {
        weight -= 0.2;
      }
    }
    weight = Math.max(50, Math.min(80, weight));

    if (faker.datatype.number({ min: 1, max: 3 }) === 1) {
      if (faker.datatype.boolean()) {
        sugarLevel += 0.05;
      } else {
        sugarLevel -= 0.05;
      }
    }
    sugarLevel = Math.max(2.5, Math.min(8, sugarLevel));

    if (faker.datatype.number({ min: 1, max: 2 }) === 1) {
      if (faker.datatype.boolean()) {
        pulse += 0.1;
      } else {
        pulse -= 0.1;
      }
    }
    pulse = Math.max(70, Math.min(110, pulse));

    if (faker.datatype.number({ min: 1, max: 7 }) === 1) {
      if (faker.datatype.boolean()) {
        systolic += 0.2;
      } else {
        systolic -= 0.2;
      }
    }
    systolic = Math.max(110, Math.min(130, systolic));

    if (faker.datatype.number({ min: 1, max: 8 }) === 1) {
      if (faker.datatype.boolean()) {
        diastolic += 0.3;
      } else {
        diastolic -= 0.3;
      }
    }
    diastolic = Math.max(70, Math.min(90, diastolic));

    const dailyLog: DailyLog = {
      createdAt: randomTimeDate.toString(),
      takenMedications: [],
      // faker.datatype
      // .array(faker.datatype.number({ min: 0, max: 3 }))
      // .map(() => ({
      //   medication: faker.helpers.arrayElement(medications),
      //   time: faker.datatype
      //     .datetime({
      //       min: +moment(randomTimeDate).startOf("day").toDate(),
      //       max: +moment(randomTimeDate).endOf("day").toDate(),
      //     })
      //     .toString(),
      //   dosage: faker.datatype.number({ min: 1, max: 3 }),
      // })),
      blood: {
        sugarLevel: +sugarLevel.toFixed(2),
        pulse: +pulse.toFixed(2),
        pressure: {
          systolic: +systolic.toFixed(2),
          diastolic: +diastolic.toFixed(2),
        },
      },
      calories: {
        total: +totalCalories.toFixed(2),
        // carbohydratesIntake,
      },
      temperature: +temperature.toFixed(2),
      weight: +weight.toFixed(2),
      notes: generateNotes(
        faker.datatype.number({ min: 0, max: 3 }),
        +moment(randomTimeDate).startOf("day").toDate(),
        Math.min(+new Date(), +moment(randomTimeDate).endOf("day").toDate())
      ),
    };
    dailyLogs.push(dailyLog);
  }

  return dailyLogs;
};
