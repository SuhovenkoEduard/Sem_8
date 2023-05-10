import { faker } from '@faker-js/faker'
import { User } from './types/collections.types'
import { UserInfo } from './types/collections.types'

export const generateDocId = () => faker.datatype.uuid().replaceAll('-', '').slice(0, 20)

export const getUserInfoFromUser = (user: User): UserInfo => {
  const clonedUser: User = { ...user }
  clonedUser.fbUId = undefined
  clonedUser.diary = undefined
  clonedUser.employee = undefined
  return JSON.parse(JSON.stringify(clonedUser))
}
