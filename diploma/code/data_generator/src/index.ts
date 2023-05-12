import { faker } from "@faker-js/faker";
import {
  generate,
  validate,
  read,
  write,
  addCollections,
  removeCollections,
} from "./data";

faker.setLocale("ru");

const main = async () => {
  // const results = generate();
  // validate(results);
  // write(results);

  const results = read();
  validate(results);

  // await removeCollections();
  // await addCollections(results);
  console.log("End of the data function!");
};

main();
