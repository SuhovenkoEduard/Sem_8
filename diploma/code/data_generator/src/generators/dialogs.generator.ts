import type { AuthUserId, Dialog } from "../types/collections.types";

import moment from "moment";
import { faker } from "@faker-js/faker";
import { generateDocId } from "../helpers";

import { generateMessages } from "../generators";

export const generateDialogs = (
  patientsIds: AuthUserId[],
  doctorsIds: AuthUserId[]
): Dialog[] => {
  return patientsIds.map((patient): Dialog => {
    const doctor = faker.helpers.arrayElement(doctorsIds);
    return {
      docId: generateDocId(),
      patient,
      doctor,
      messages: generateMessages(
        faker.datatype.number({ min: 10, max: 20 }),
        +moment().subtract(3, "months").toDate(),
        +new Date(),
        [patient, doctor]
      ),
    };
  });
};
