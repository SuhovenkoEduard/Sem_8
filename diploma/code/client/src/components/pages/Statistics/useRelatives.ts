import { Role, User } from "firestore/types/collections.types";
import { useState } from "react";
import useAsyncEffect from "use-async-effect";
import { NotificationManager } from "react-notifications";
import { firebaseRepositories } from "firestore/data/repositories";
import { where } from "firebase/firestore";

export const useRelatives = (user: User) => {
  const [patient, setPatient] = useState<User | null>(null);
  const [relative, setRelative] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useAsyncEffect(async () => {
    try {
      setIsLoading(true);
      if (user.role === Role.PATIENT) {
        setPatient(user);
        const relatives = await firebaseRepositories.users.getDocs(
          where("relativePatient", "==", user.docId)
        );
        if (relatives && relatives.length === 1) {
          setRelative(relatives[0]);
        }
      }
      if (user.role === Role.RELATIVE) {
        if (!user.relativePatient) {
          throw new Error("There's no relativePatient for this user[relative]");
        }
        setRelative(relative);
        const relativePatient = await firebaseRepositories.users.getDocById(
          user.relativePatient
        );
        if (!relativePatient) {
          throw new Error(`Patient with this id doesn't exist.`);
        }
        setPatient(relativePatient);
      }
    } catch (e) {
      console.log(e);
      NotificationManager.error(
        "useRelativeDailyLogsData",
        "Data loading error"
      );
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  return {
    isLoading,
    relative,
    patient,
  };
};
