import { AppDispatch } from "store/store";
import { setIsPending, setDialogs } from "store/reducers/dialogs/dialogsSlice";
import { firebaseRepositories } from "firestore/data/repositories";
import { NotificationManager } from "react-notifications";
import { or, where } from "firebase/firestore";

export const fetchDialogs = (uid: string) => async (dispatch: AppDispatch) => {
  try {
    dispatch(setIsPending(true));
    const dialogs = await firebaseRepositories.dialogs.getDocs(
      or(where("doctor", "==", uid), where("patient", "==", uid))
    );
    dispatch(setDialogs(dialogs));
  } catch (e) {
    console.log(e);
    NotificationManager.error(
      "Error while loading dialogs from firestore!",
      "Firestore error"
    );
  } finally {
    dispatch(setIsPending(false));
  }
};
