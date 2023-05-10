import type { Medication } from '../types/collections.types'
import type { Diary } from '../types/collections.types'

import moment from 'moment'
import { faker } from '@faker-js/faker'

import { generateGoals, generateDailyLogs } from '../generators'


export const generateDiaries = (count: number, medications: Medication[]): Diary[] => {
  return new Array(count)
    .fill(null)
    .map((): Diary => ({
      dailyLogs: generateDailyLogs(+moment().subtract(faker.datatype.number({ min: 3, max: 12 }), 'months').toDate(), +moment().toDate(), medications),
      goals: generateGoals(faker.datatype.number({ min: 3, max: 10 })),
    }))
}
