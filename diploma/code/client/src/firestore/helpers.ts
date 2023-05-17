import { faker } from "@faker-js/faker";

export const generateDocId = () =>
  faker.datatype.uuid().replaceAll("-", "").slice(0, 20);
