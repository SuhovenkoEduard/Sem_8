import { faker } from "@faker-js/faker";
import {
  readCollections,
  addCollections,
  generate,
  read,
  removeCollections,
  validate,
  write,
} from "./data";

faker.setLocale("ru");

const main = async () => {
  // const results = await generate();
  // validate(results);
  // write(results);

  // const results = read();
  // validate(results);

  const results = await readCollections();
  validate(results);
  write(results);

  // await removeCollections([
  //   CollectionName.USERS,
  //   CollectionName.THEMATIC_MATERIALS,
  //   CollectionName.HEALTH_STATES
  // ]);
  // await addCollections(results);
  console.log("End of the data function!");
};

main();
