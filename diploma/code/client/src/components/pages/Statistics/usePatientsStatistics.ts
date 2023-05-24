import { Role, User } from "firestore/types/collections.types";
import { useState } from "react";
import useAsyncEffect from "use-async-effect";
import { NotificationManager } from "react-notifications";
import { firebaseRepositories } from "firestore/data/repositories";
import { where } from "firebase/firestore";

export const usePatientsStatistics = (user: User) => {
  const [patients, setPatients] = useState<User[]>([]);
  const [relative, setRelative] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useAsyncEffect(async () => {
    try {
      setIsLoading(true);
      if (user.role === Role.PATIENT) {
        setPatients([user]);
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
        setPatients([relativePatient]);
      }
      if (user.role === Role.DOCTOR) {
        const newPatients = await firebaseRepositories.users.getDocs(
          where("doctor", "==", user.docId)
        );
        setPatients(newPatients);
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
    patients,
  };
};
