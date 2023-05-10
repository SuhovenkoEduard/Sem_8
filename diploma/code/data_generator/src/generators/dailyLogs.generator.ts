import type { DailyLog } from "../types/utils.types";
import type { Medication } from "../types/collections.types";

import moment from "moment";
import { faker } from "@faker-js/faker";

import { generateNotes } from "../generators";


export const generateDailyLogs = (minDate: number, maxDate: number, medications: Medication[]): DailyLog[] => {
  const startDate = moment(minDate);
  const endDate = moment(maxDate);
  
  let weight = faker.datatype.number({ min: 50, max: 80, precision: 0.01 })
  
  const dailyLogs: DailyLog[] = []
  for (let currentDate = startDate; currentDate.isBefore(endDate); currentDate.add(1, 'day')) {
    const randomTimeDate = faker.datatype.datetime({ min: +moment(currentDate).startOf('day').toDate(), max: +moment(currentDate).endOf('day').toDate() })
    
    let totalCalories = faker.datatype.number({ min: 2000, max: 3000 })
    const carbohydratesIntakePercentage = faker.datatype.number({ min: 0.45 - 0.15, max: 0.65 + 0.15, precision: 0.01 })
    const carbohydratesIntake = Math.floor(totalCalories * carbohydratesIntakePercentage)
    const temperature = faker.datatype.number({ min: 36.1, max: 37.2, precision: 0.01 })
    
    if (faker.datatype.boolean()) {
      if (faker.datatype.boolean()) {
        weight += 0.5
      } else {
        weight -= 0.5
      }
    }
    
    const dailyLog: DailyLog = {
      createdAt: randomTimeDate.toString(),
      takenMedications: faker.datatype.array(faker.datatype.number({ min: 0, max: 3 })).map(() => ({
        medication: faker.helpers.arrayElement(medications),
        time: faker.datatype.datetime({ min: +moment(randomTimeDate).startOf('day').toDate(), max: +moment(randomTimeDate).endOf('day').toDate() }).toString(),
        dosage: faker.datatype.number({ min: 1, max: 3 })
      })),
      blood: {
        sugarLevel: faker.datatype.number({ min: 90 - 5, max: 130 + 5 }),
        pulse: faker.datatype.number({ min: 80 - 10, max: 100 + 10 }),
        pressure: {
          systolic: faker.datatype.number({ min: 120 - 10, max: 120 + 10 }),
          diastolic: faker.datatype.number({ min: 80 - 10, max: 80 + 10 })
        }
      },
      calories: {
        total: totalCalories,
        carbohydratesIntake
      },
      temperature,
      weight,
      notes: generateNotes(faker.datatype.number({ min: 0, max: 3 }), +moment(randomTimeDate).startOf('day').toDate(), Math.min(+new Date(), +moment(randomTimeDate).endOf('day').toDate()))
    }
    dailyLogs.push(dailyLog)
  }
  
  return dailyLogs;
}
