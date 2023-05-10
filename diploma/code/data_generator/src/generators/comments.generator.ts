import type { Comment, UserInfo } from "../types/utils.types";

import { faker } from "@faker-js/faker";

import { generateMessages } from "../generators";


export const generateComments = (count: number, minDate: number, maxDate: number, commenters: UserInfo[]): Comment[] => {
  return new Array(count)
    .fill(null)
    .map((): Comment => ({
      message: generateMessages(1, minDate, maxDate, [faker.helpers.arrayElement(commenters)])[0],
      score: faker.datatype.number({ min: -10, max: 10 })
    }))
}
