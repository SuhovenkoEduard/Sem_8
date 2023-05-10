import type { Medication, User } from "../types/collections.types";
import type { UserInfo } from "../types/utils.types";

import moment from "moment";
import { faker } from '@faker-js/faker';
import { Role } from "../types/utils.types";

import { generateDocId, getUserInfoFromUser } from "../helpers";
import { generateDiaries, generateEmployeeReviews } from "../generators";


const addFields = (users: User[], medications: Medication[]): User[] => {
  const allReviewers: UserInfo[] = users
    .filter(user => [Role.ADMIN, Role.MODERATOR, Role.CONTENT_MAKER, Role.DOCTOR].includes(user.role))
    .map(getUserInfoFromUser)
  
  return users.map((user) => {
    const { role } = user
    let diaryObj = {}
    if (role === Role.PATIENT) {
      diaryObj = {
        diary: generateDiaries(1, medications)[0]
      }
    }
    
    const possibleReviewers = allReviewers.filter(reviewer => reviewer.docId !== user.docId)
    const subsetOfReviewer = faker.helpers.arrayElements(possibleReviewers, faker.datatype.number({ min: 0, max: possibleReviewers.length }))
    
    let employeeObj = {}
    if ([Role.CONTENT_MAKER, Role.MODERATOR, Role.ADMIN, Role.DOCTOR].includes(role)) {
      employeeObj = {
        employee: generateEmployeeReviews(
          subsetOfReviewer,
          +moment().subtract(3, 'months').toDate(),
          +new Date()
        )
      }
    }
    
    return {
      ...user,
      ...diaryObj,
      ...employeeObj
    }
  })
}

export const generateUsers = (count: number, medications: Medication[]): User[] => {
  const roles = [...Object.values(Role), Role.PATIENT]
  const users = faker.datatype.array(count)
    .map((): User => {
      let role;
      if (roles.length) {
        role = roles.shift();
      } else {
        role = faker.helpers.arrayElement(Object.values(Role))
      }
      
      return {
        docId: generateDocId(),
        email: faker.internet.email(),
        imageUrl: faker.image.animals(),
        name: {
          first: faker.name.firstName(),
          last: faker.name.lastName(),
        },
        address: `${faker.address.country()} ${faker.address.streetAddress()} ${faker.address.buildingNumber()}`,
        phone: faker.phone.number("+375-##-#######"),
        role,
      }
    })
  
  return addFields(users, medications)
}
