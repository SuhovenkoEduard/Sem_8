import dayjs from "dayjs";
import { Role, User } from "firestore/types/collections.types";

export const createUser = (role: Role): User => {
  const baseUser = {
    docId: "",
    email: "",
    password: "",
    imageUrl: "",
    name: {
      first: "",
      last: "",
    },
    address: "",
    phone: "",
    role,
  };

  const patientPart = {
    diary: {
      dailyLogs: [],
      goals: [],
      diabetType: 1,
    },
    doctor: "",
  };

  const relativePart = {
    relativePatient: "",
  };

  const employeePart = {
    employee: {
      hiredAt: dayjs().toDate().toString(),
      reviews: [],
      salary: 0,
      description: "",
    },
  };

  return {
    ...baseUser,
    ...(role === Role.PATIENT ? patientPart : {}),
    ...(role === Role.RELATIVE ? relativePart : {}),
    ...([Role.DOCTOR, Role.CONTENT_MAKER, Role.MODERATOR, Role.ADMIN].includes(
      role
    )
      ? employeePart
      : {}),
  };
};
