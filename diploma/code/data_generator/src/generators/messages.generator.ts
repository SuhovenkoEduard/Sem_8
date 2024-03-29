import type { AuthUserId, Message } from "../types/collections.types";

import { faker } from "@faker-js/faker";

export const generateMessages = (
  count: number,
  minDate: number,
  maxDate: number,
  sendersIds: AuthUserId[]
): Message[] => {
  return new Array(count).fill(null).map(
    (): Message => ({
      createdAt: faker.datatype
        .datetime({ min: minDate, max: maxDate })
        .toString(),
      content: faker.lorem.sentences(faker.datatype.number({ min: 1, max: 3 })),
      sender: faker.helpers.arrayElement(sendersIds),
    })
  );
};
