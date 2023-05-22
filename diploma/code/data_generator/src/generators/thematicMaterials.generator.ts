import type { ThematicMaterial, AuthUserId } from "../types/collections.types";

import moment from "moment";
import { faker } from "@faker-js/faker";
import { generateDocId } from "../helpers";

import { generateComments } from "../generators";
import fetch from "node-fetch";

export const generateThematicMaterial = async (
  count: number,
  authorsIds: AuthUserId[],
  commentersIds: AuthUserId[]
): Promise<ThematicMaterial[]> => {
  return Promise.all(
    new Array(count).fill(null).map(async (): Promise<ThematicMaterial> => {
      const createdAt = faker.datatype.datetime({
        min: +moment().subtract(3, "months").toDate(),
        max: +moment().toDate(),
      });
      const { url: imageUrl } = await fetch(faker.image.nature());
      return {
        docId: generateDocId(),
        imageUrl,
        content: faker.lorem.sentences(2),
        createdAt: createdAt.toString(),
        title: faker.lorem.words(3),
        description: faker.lorem.sentences(3),
        author: faker.helpers.arrayElement(authorsIds),
        comments: generateComments(
          faker.datatype.number({ min: 0, max: 5 }),
          +createdAt,
          +new Date(),
          commentersIds
        ),
      };
    })
  );
};
