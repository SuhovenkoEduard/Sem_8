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
      "Загрузка пользователя из firestore!",
      "Ошибка Firestore"
    );
  } finally {
    dispatch(setIsPending(false));
  }
};
