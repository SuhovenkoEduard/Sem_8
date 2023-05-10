import type { Medication, User } from '../types/collections.types'
import type { UserInfo } from '../types/collections.types'

import moment from 'moment'
import { faker } from '@faker-js/faker'
import { Role } from '../types/collections.types'

import { generateDocId, getUserInfoFromUser } from '../helpers'
import { generateDiaries, generateEmployeeReviews } from '../generators'
import { USERS_AUTH_DATA } from '../constants'


const addFields = (users: User[], medications: Medication[]): User[] => {
  const allReviewers: UserInfo[] = users
    .filter(user => [Role.ADMIN, Role.MODERATOR, Role.CONTENT_MAKER, Role.DOCTOR].includes(user.role))
    .map(getUserInfoFromUser)
  
  return users.map((user) => {
    const { role } = user
    let diaryObj = {}
    if (role === Role.PATIENT) {
      diaryObj = {
        diary: generateDiaries(1, medications)[0],
      }
    }
    
    const possibleReviewers = allReviewers.filter(reviewer => reviewer.docId !== user.docId)
    const subsetOfReviewer = faker.helpers.arrayElements(possibleReviewers, faker.datatype.number({ min: 0, max: possibleReviewers.length }))
    
    let employeeObj = {}
    if ([Role.CONTENT_MAKER, Role.MODERATOR, Role.ADMIN, Role.DOCTOR].includes(role)) {
      employeeObj = {
        employee: {
          hiredAt: faker.datatype.datetime({
            min: +moment().startOf('year').subtract(1, 'year').toDate(),
            max: +moment().startOf('year').toDate(),
          }).toString(),
          reviews: generateEmployeeReviews(
            subsetOfReviewer,
            +moment().subtract(3, 'months').toDate(),
            +new Date(),
          ),
          salary: faker.datatype.number({ min: 1000, max: 3000 }),
        },
      }
    }
    
    return {
      ...user,
      ...diaryObj,
      ...employeeObj,
    }
  })
}

export const generateUsers = (count: number, medications: Medication[]): User[] => {
  const users = USERS_AUTH_DATA
    .map(({ role, uid, firstName }): User => {
      return {
        fbUId: uid,
        docId: generateDocId(),
        email: faker.internet.email(),
        imageUrl: faker.image.animals(),
        name: {
          first: firstName ?? faker.name.firstName(),
          last: faker.name.lastName(),
        },
        address: `${faker.address.country()}, ${faker.address.streetAddress()} ${faker.address.buildingNumber()}`,
        phone: faker.phone.number('+375-##-#######'),
        role,
      }
    })
  
  return addFields(users, medications)
}
