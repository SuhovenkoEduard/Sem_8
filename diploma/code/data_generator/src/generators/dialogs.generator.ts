import type {  UserInfo } from '../types/collections.types'
import type { Dialog } from '../types/collections.types'

import moment from 'moment'
import { faker } from '@faker-js/faker'
import { generateDocId } from '../helpers'

import { generateMessages } from '../generators'


export const generateDialogs = (patients: UserInfo[], doctors: UserInfo[]): Dialog[] => {
  return patients
    .map((patient): Dialog => {
      const doctor = faker.helpers.arrayElement(doctors)
      return {
        docId: generateDocId(),
        patient,
        doctor,
        messages: generateMessages(
          faker.datatype.number({ min: 10, max: 20 }),
          +moment().subtract(3, 'months').toDate(),
          +new Date(),
          [patient, doctor],
        ),
      }
    })
}
