import type {
  EmployeeReview,
  UserInfo,
} from '../types/collections.types'

import { faker } from '@faker-js/faker'

import { EmployeeReviewRate } from '../types/collections.types'


export const generateEmployeeReviews = (reviewers: UserInfo[], minDate: number, maxDate: number): EmployeeReview[] => {
  const reviewersLeft = [...reviewers]
  return new Array(reviewers.length)
    .fill(null)
    .map((): EmployeeReview => ({
      createdAt: faker.datatype.datetime({ min: minDate, max: maxDate }).toString(),
      rate: faker.helpers.arrayElement(Object.values(EmployeeReviewRate)),
      content: faker.lorem.sentences(faker.datatype.number({ min: 2, max: 5 })),
      reviewer: reviewersLeft.shift(),
    }))
}
