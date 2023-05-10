import type { Goal } from '../types/collections.types'

import moment from 'moment'
import { faker } from '@faker-js/faker'
import { GoalCategory, GoalStatus } from '../types/collections.types'

import { generateNotes } from '../generators'


export const generateGoals = (count: number): Goal[] => {
  return new Array(count)
    .fill(null)
    .map((): Goal => {
      const createdAt = faker.datatype.datetime({ min: +moment().startOf('year').subtract(1, 'year').toDate(), max: +moment().subtract(4, 'month').toDate() })
      let deadline
      
      if (faker.datatype.boolean()) {
        deadline = faker.datatype.datetime({ min: +moment().add(2, 'months').toDate(), max: +moment().add(4, 'months').toDate() })
      } else {
        deadline = faker.datatype.datetime({ min: +moment(createdAt).add(1, 'week').toDate(), max: +moment(createdAt).add(3, 'months').toDate() })
      }
      
      let status
      
      if (+deadline > +new Date()) {
        status = faker.helpers.arrayElement(Object.values(GoalStatus))
      } else {
        status = faker.helpers.arrayElement(Object.values([GoalStatus.COMPLETED, GoalStatus.CANCELLED]))
      }
      
      let progress = 0
      switch (status) {
        case GoalStatus.IN_PROGRESS:
          progress = faker.datatype.number({ min: 1, max: 99 })
          break
        case GoalStatus.PENDING:
          progress = 0
          break
        case GoalStatus.CANCELLED:
          progress = 0
          break
        case GoalStatus.COMPLETED:
          progress = 100
      }

      return {
        title: faker.lorem.sentence(faker.datatype.number({ min: 5, max: 15 })),
        description: faker.lorem.sentences(faker.datatype.number({ min: 2, max: 5 }), ' '),
        notes: generateNotes(faker.datatype.number({ min: 0, max: 5 }), Math.min(+new Date(), +moment(createdAt).add('1', 'hour').toDate()), +moment(deadline).toDate()),
        createdAt: createdAt.toString(),
        deadline: deadline.toString(),
        category: faker.helpers.arrayElement(Object.values(GoalCategory)),
        status,
        progress,
      }
    })
}
