import type { AuthUserId, EmployeeReview } from "../types/collections.types";

import { faker } from "@faker-js/faker";

import { EmployeeReviewRate } from "../types/collections.types";

export const generateEmployeeReviews = (
  reviewers: AuthUserId[],
  minDate: number,
  maxDate: number
): EmployeeReview[] => {
  const reviewersLeft = [...reviewers];
  return new Array(reviewers.length).fill(null).map(
    (): EmployeeReview => ({
      createdAt: faker.datatype
        .datetime({ min: minDate, max: maxDate })
        .toString(),
      score: faker.datatype.number({ min: 3, max: 5, precision: 0.1 }),
      content: faker.lorem.sentences(faker.datatype.number({ min: 1, max: 3 })),
      reviewer: reviewersLeft.shift(),
    })
  );
};
