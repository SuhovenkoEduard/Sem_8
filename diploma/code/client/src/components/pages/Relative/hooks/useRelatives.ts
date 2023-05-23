import { Role, User } from "firestore/types/collections.types";
import useAsyncEffect from "use-async-effect";
import { useCallback, useState } from "react";
import { NotificationManager } from "react-notifications";
import { firebaseRepositories } from "firestore/data/repositories";
import { and, where } from "firebase/firestore";

export const useRelatives = (user: User) => {
  const [patient, setPatient] = useState<User | null>(null);
  const [relative, setRelative] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const updateRelatives = useCallback(async () => {
    try {
      setIsLoading(true);
      if (user.role === Role.PATIENT) {
        setPatient(user);
        const [newRelative] = await firebaseRepositories.users.getDocs(
          and(
            where("relativePatient", "==", user.docId),
            where("role", "==", Role.RELATIVE)
          )
        );
        setRelative(newRelative ?? null);
      }
      if (user.role === Role.RELATIVE) {
        setRelative(user);
        if (!user.relativePatient) {
          throw new Error("У родственника должен быть добавлен пациент!");
        }
        const newPatient = await firebaseRepositories.users.getDocById(
          user.relativePatient
        );
        setPatient(newPatient);
      }
    } catch (e) {
      console.log(e);
      NotificationManager.error(
        "Ошибка загрузки пары родственников",
        'Страница "родственник"'
      );
    } finally {
      setIsLoading(false);
    }
  }, [user, setIsLoading, setPatient, setRelative]);

  useAsyncEffect(updateRelatives, [user]);

  return {
    isLoading,
    patient,
    relative,
    updateRelatives,
  };
};
