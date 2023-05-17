import { setIsPending, setUser } from "store/reducers/user/userSlice";
import { firebaseRepositories } from "firestore/data/repositories";
import { NotificationManager } from "react-notifications";
import { AppDispatch } from "store/store";

export const fetchUser = (uid: string) => async (dispatch: AppDispatch) => {
  try {
    dispatch(setIsPending(true));
    const user = await firebaseRepositories.users.getDocById(uid);
    dispatch(setUser(user));
  } catch (e) {
    console.log(e);
    NotificationManager.error(
      "Error while loading user from firestore!",
      "Firestore error"
    );
  } finally {
    dispatch(setIsPending(false));
  }
};
