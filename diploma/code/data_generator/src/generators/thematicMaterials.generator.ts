import type { ThematicMaterial } from '../types/collections.types'
import type { UserInfo } from '../types/collections.types'

import moment from 'moment'
import { faker } from '@faker-js/faker'
import { generateDocId } from '../helpers'

import { generateComments } from '../generators'


export const generateThematicMaterial = (count: number, authors: UserInfo[], commenters: UserInfo[]): ThematicMaterial[] => {
  return new Array(count)
    .fill(null)
    .map((): ThematicMaterial => {
      const createdAt = faker.datatype.datetime({ min: +moment().subtract(3, 'months').toDate(), max: +moment().toDate() })
      return {
        docId: generateDocId(),
        imageUrl: faker.image.food(),
        docUrl: 'https://docs.google.com/document/d/1FWeMX1fWdd5wAlwPFOPgIVxtrIvaklxmQdS5XA38fPY/edit',
        createdAt: createdAt.toString(),
        title: faker.lorem.words(3),
        description: faker.lorem.sentences(3),
        author: faker.helpers.arrayElement(authors),
        comments: generateComments(
          faker.datatype.number({ min: 0, max: 5 }),
          +createdAt,
          +new Date(),
          commenters,
        ),
      }
    })
}
