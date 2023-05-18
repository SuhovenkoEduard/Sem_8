import { faker } from "@faker-js/faker";
import { UserInfo } from "./types/collections.types";

export const generateDocId = () =>
  faker.datatype.uuid().replaceAll("-", "").slice(0, 20);

export const getUserFullName = ({
  name: { first, last },
}: Pick<UserInfo, "name">) => `${first} ${last}`;
