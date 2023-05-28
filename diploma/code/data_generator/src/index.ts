import { faker } from "@faker-js/faker";
import {
  addCollections,
  generate,
  read,
  removeCollections,
  validate,
  write,
} from "./data";
import { CollectionName } from "./constants";
import { GeneratorResults } from "./types/generator.types";

faker.setLocale("ru");

const main = async () => {
  const results = await generate();
  validate(results);
  write(results);

  // const results = read();
  // validate(results);

  // const results = await readCollections();
  // validate(results)
  // write(results)

  await removeCollections([
    CollectionName.USERS,
    CollectionName.THEMATIC_MATERIALS,
    CollectionName.HEALTH_STATES
  ]);
  await addCollections(results);
  console.log("End of the data function!");
};

main();
