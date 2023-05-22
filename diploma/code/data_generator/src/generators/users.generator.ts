import type { AuthUserId } from "../types/collections.types";
import type { User, Medication } from "../types/collections.types";
import type { UsersAuthData } from "../constants";
import { Role } from "../types/collections.types";

import moment from "moment";

import { faker } from "@faker-js/faker";
import { generateDiaries, generateEmployeeReviews } from "../generators";
import fetch from "node-fetch";

const addFields = (users: User[], medications: Medication[]): User[] => {
  const allReviewersIds: AuthUserId[] = users
    .filter((user) =>
      [Role.ADMIN, Role.MODERATOR, Role.CONTENT_MAKER, Role.DOCTOR].includes(
        user.role
      )
    )
    .map(({ docId }) => docId);

  return users.map((user) => {
    const { role } = user;
    let diaryObj = {};
    if (role === Role.PATIENT) {
      diaryObj = {
        diary: generateDiaries(1, medications)[0],
      };
    }

    const possibleReviewers = allReviewersIds.filter(
      (reviewerId) => reviewerId !== user.docId
    );
    const subsetOfReviewersIds = faker.helpers.arrayElements(
      possibleReviewers,
      faker.datatype.number({ min: 1, max: possibleReviewers.length })
    );

    let employeeObj = {};
    if (
      [Role.CONTENT_MAKER, Role.MODERATOR, Role.ADMIN, Role.DOCTOR].includes(
        role
      )
    ) {
      employeeObj = {
        employee: {
          hiredAt: faker.datatype
            .datetime({
              min: +moment().startOf("year").subtract(1, "year").toDate(),
              max: +moment().startOf("year").toDate(),
            })
            .toString(),
          reviews: generateEmployeeReviews(
            subsetOfReviewersIds,
            +moment().subtract(3, "months").toDate(),
            +new Date()
          ),
          salary: faker.datatype.number({ min: 1000, max: 3000 }),
        },
      };
    }

    const patientsIds: AuthUserId[] = users
      .filter((_user) => _user.role === Role.PATIENT)
      .map(({ docId }) => docId);

    let relativePatientObj = {};
    if (role === Role.RELATIVE) {
      relativePatientObj = {
        relativePatient: faker.helpers.arrayElement(patientsIds),
      };
    }

    return {
      ...user,
      ...diaryObj,
      ...employeeObj,
      ...relativePatientObj,
    };
  });
};

export const generateUsers = async (
  usersAuthData: UsersAuthData,
  medications: Medication[]
): Promise<User[]> => {
  const users = await Promise.all(
    usersAuthData.map(async ({ role, uid, firstName }): Promise<User> => {
      const { url: imageUrl } = await fetch(faker.image.animals());
      return {
        docId: uid,
        email: faker.internet.email(),
        imageUrl,
        name: {
          first: firstName ?? faker.name.firstName(),
          last: faker.name.lastName(),
        },
        address: `${faker.address.country()}, ${faker.address.streetAddress()} ${faker.address.buildingNumber()}`,
        phone: faker.phone.number("+375-##-#######"),
        role,
      };
    })
  );

  return addFields(users, medications);
};
