import type { ThematicMaterial, AuthUserId } from "../types/collections.types";

import moment from "moment";
import { faker } from "@faker-js/faker";
import { generateDocId } from "../helpers";

import { generateComments } from "../generators";
import fetch from "node-fetch";
import { ThematicMaterialsData } from "../constants";

export const generateThematicMaterial = (
  thematicMaterialsData: ThematicMaterialsData,
  authorsIds: AuthUserId[]
): ThematicMaterial[] => {
  return thematicMaterialsData.map((thematicMaterial): ThematicMaterial => {
    // const createdAt = faker.datatype.datetime({
    //   min: +moment().subtract(3, "months").toDate(),
    //   max: +moment().toDate(),
    // });
    // const { url: imageUrl } = await fetch(faker.image.nature());
    return {
      ...thematicMaterial,
      author: faker.helpers.arrayElement(authorsIds),
      comments: [],
      // comments: generateComments(
      //   faker.datatype.number({ min: 0, max: 5 }),
      //   +createdAt,
      //   +new Date(),
      //   commentersIds
      // ),
    };
  });
};
