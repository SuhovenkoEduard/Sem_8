import type { Note } from "../types/utils.types";

import { faker } from "@faker-js/faker";


export const generateNotes = (count: number, minDate: number, maxDate: number): Note[] => {
  return new Array(count)
    .fill(null)
    .map((): Note => ({
      createdAt: faker.datatype.datetime({ min: minDate, max: maxDate }).toString(),
      content: faker.lorem.sentences(faker.datatype.number({ min: 2, max: 5 }))
    }))
}
