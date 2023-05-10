import type { Medication } from '../types/collections.types'

import { faker } from '@faker-js/faker'
import { MedicationRoute } from '../types/collections.types'
import { generateDocId } from '../helpers'


export const generateMedication = (count: number): Medication[] => {
  return new Array(count)
    .fill(null)
    .map((): Medication => ({
      docId: generateDocId(),
      imageUrl: faker.image.abstract(),
      title: faker.lorem.words(faker.datatype.number({ min: 1, max: 2 })),
      description: faker.lorem.sentences(2, ' '),
      instruction: faker.lorem.sentences(faker.datatype.number({ min: 3, max: 5 }), ' '),
      medicationRoute: faker.helpers.arrayElement(Object.values(MedicationRoute)),
    }))
}
