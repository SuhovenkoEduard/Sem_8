import {
  Comment,
  Dialog,
  EmployeeReview,
  Medication,
  Message,
  ThematicMaterial,
  User,
} from "firestore/types/collections.types";
import {
  FBComment,
  FBDialog,
  FBEmployeeReview,
  FBMedication,
  FBMessage,
  FBThematicMaterial,
  FBUser,
} from "firestore/types/firebase/fb_collections.types";
import { firebaseRepositories } from "firestore/data/repositories";
import { getUserInfoFromUser } from "firestore/helpers";

export type ExtendConverter<FBType, Type> = (document: FBType) => Promise<Type>;

export const extendEmployeeReview: ExtendConverter<
  FBEmployeeReview,
  EmployeeReview
> = async (employeeReview: FBEmployeeReview): Promise<EmployeeReview> => {
  const reviewer = await firebaseRepositories.users.getDocById(
    employeeReview.reviewer
  );
  return {
    ...employeeReview,
    reviewer: getUserInfoFromUser(reviewer as FBUser),
  };
};

export const extendUser: ExtendConverter<FBUser, User> = async (
  user: FBUser
): Promise<User> => {
  let employeeObj: Pick<FBUser, "employee"> | Record<never, never> = {};

  if (user?.employee) {
    employeeObj = {
      employee: {
        ...user?.employee,
        reviews: await Promise.all(
          user.employee.reviews.map(extendEmployeeReview)
        ),
      },
    };
  }

  let relativePatientObj:
    | Pick<FBUser, "relativePatient">
    | Record<never, never> = {};

  if (user?.relativePatient) {
    const relativePatient = await firebaseRepositories.users.getDocById(
      user.relativePatient
    );
    relativePatientObj = {
      relativePatient: getUserInfoFromUser(relativePatient as FBUser),
    };
  }

  return {
    ...user,
    ...employeeObj,
    ...relativePatientObj,
  } as User;
};

export const extendMessage: ExtendConverter<FBMessage, Message> = async (
  message: FBMessage
): Promise<Message> => {
  const sender = await firebaseRepositories.users.getDocById(message.sender);
  return {
    ...message,
    sender: getUserInfoFromUser(sender as FBUser),
  };
};

export const extendDialog: ExtendConverter<FBDialog, Dialog> = async (
  dialog: FBDialog
): Promise<Dialog> => {
  const patient = await firebaseRepositories.users.getDocById(dialog.patient);
  const doctor = await firebaseRepositories.users.getDocById(dialog.doctor);
  return {
    ...dialog,
    patient: getUserInfoFromUser(patient as FBUser),
    doctor: getUserInfoFromUser(doctor as FBUser),
    messages: await Promise.all(dialog.messages.map(extendMessage)),
  };
};

export const extendComment: ExtendConverter<FBComment, Comment> = async (
  comment: FBComment
): Promise<Comment> => {
  return {
    ...comment,
    message: await extendMessage(comment.message),
  };
};

export const extendThematicMaterial: ExtendConverter<
  FBThematicMaterial,
  ThematicMaterial
> = async (thematicMaterial: FBThematicMaterial): Promise<ThematicMaterial> => {
  const author = await firebaseRepositories.users.getDocById(
    thematicMaterial.author
  );
  return {
    ...thematicMaterial,
    author: getUserInfoFromUser(author as FBUser),
    comments: await Promise.all(thematicMaterial.comments.map(extendComment)),
  };
};

export const extendMedication: (
  medication: FBMedication
) => Promise<Medication> = async (
  medication: FBMedication
): Promise<Medication> => Promise.resolve(medication);
