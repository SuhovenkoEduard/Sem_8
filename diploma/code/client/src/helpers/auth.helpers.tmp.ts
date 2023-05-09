import { UserCredential } from "firebase/auth";
import { NavigateFunction } from "react-router-dom";
import { NotificationManager } from "react-notifications";
import { APP_ROUTES } from "components/routing";
import { getFirestoreUsers } from "firestore/mappers/users.tmp";

// TODO create mappers

export const successfulAuth = async (
  userCredential: UserCredential,
  navigate: NavigateFunction
) => {
  NotificationManager.success("Successful authentication!");
  navigate(APP_ROUTES.profile);
  const { uid } = userCredential.user;
  console.log({ uid, userCredential });

  const users = await getFirestoreUsers();
  console.log(users);
  // console.log(users);
};
