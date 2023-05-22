import { faker } from "@faker-js/faker";
import {
  generate,
  validate,
  read,
  write,
  addCollections,
  removeCollections,
} from "./data";
import fetch from "node-fetch";
import { readCollections } from './data/global'

faker.setLocale("ru");

const main = async () => {
  // const results = await generate();
  // validate(results);
  // write(results);

  const results = read();
  validate(results);

  // const results = await readCollections();
  // validate(results)
  // write(results)
  
  // await removeCollections();
  // await addCollections(results);
  console.log("End of the data function!");
};

main();
