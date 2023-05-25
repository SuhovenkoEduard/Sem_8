import { faker } from '@faker-js/faker'
import { addCollections, generate, read, removeCollections, validate, write, } from './data'
import { CollectionName } from './constants'

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
  
  await removeCollections([
    CollectionName.USERS,
    CollectionName.THEMATIC_MATERIALS
  ]);
  await addCollections(results);
  console.log("End of the data function!");
};

main();
