import {
  generateDialogs,
  generateHealthStates,
  generateMedication,
  generateThematicMaterial,
  generateUsers,
} from "../../generators";
import {
  COLLECTION_SIZES,
  THEMATIC_MATERIALS_DATA,
  USERS_AUTH_DATA,
} from "../../constants/";
import {
  AuthUserId,
  Dialog,
  HealthState,
  Medication,
  Role,
  ThematicMaterial,
  User,
} from "../../types/collections.types";
import { GeneratorResults } from "../../types/generator.types";
import { HEALTH_STATES_DATA } from "../../constants/healthStates";

export const getUsersIdsByRoles = ({
  users,
  roles,
}: {
  users: User[];
  roles: Role[];
}): AuthUserId[] =>
  users.filter((user) => roles.includes(user.role)).map(({ docId }) => docId);

export const generate = async (): Promise<GeneratorResults> => {
  // const medications: Medication[] = generateMedication(
  //   COLLECTION_SIZES.medications
  // );
  const users: User[] = generateUsers(USERS_AUTH_DATA, []);

  const usersPatientsIds: AuthUserId[] = getUsersIdsByRoles({
    users,
    roles: [Role.PATIENT],
  });
  const usersAuthorsIds: AuthUserId[] = getUsersIdsByRoles({
    users,
    roles: [Role.DOCTOR],
  });
  const thematicMaterials: ThematicMaterial[] = generateThematicMaterial(
    THEMATIC_MATERIALS_DATA,
    usersAuthorsIds
  );
  const healthStates: HealthState[] = generateHealthStates(HEALTH_STATES_DATA);

  // const usersDoctorsIds: AuthUserId[] = getUsersIdsByRoles({
  //   users,
  //   roles: [Role.DOCTOR],
  // });
  // const dialogs: Dialog[] = generateDialogs(usersPatientsIds, usersDoctorsIds);

  return {
    users,
    medications: null,
    thematicMaterials,
    dialogs: null,
    healthStates,
  };
};
