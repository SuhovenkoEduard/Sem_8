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

export type ShrinkConverter<Type, FBType> = (document: Type) => FBType;

export const shrinkEmployeeReview: ShrinkConverter<
  EmployeeReview,
  FBEmployeeReview
> = (employeeReview: EmployeeReview): FBEmployeeReview => {
  return {
    ...employeeReview,
    reviewer: employeeReview.reviewer.docId,
  };
};

export const shrinkUser: ShrinkConverter<User, FBUser> = (
  user: User
): FBUser => {
  let employeeObj: Pick<FBUser, "employee"> | Record<never, never> = {};

  if (user?.employee) {
    employeeObj = {
      employee: {
        ...user?.employee,
        reviews: user.employee.reviews.map(shrinkEmployeeReview),
      },
    };
  }

  let relativePatientObj:
    | Pick<FBUser, "relativePatient">
    | Record<never, never> = {};

  if (user?.relativePatient) {
    relativePatientObj = {
      relativePatient: user.relativePatient.docId,
    };
  }

  return {
    ...user,
    ...employeeObj,
    ...relativePatientObj,
  } as FBUser;
};

export const shrinkMessage: ShrinkConverter<Message, FBMessage> = (
  message: Message
): FBMessage => {
  return {
    ...message,
    sender: message.sender.docId,
  };
};

export const shrinkDialog: ShrinkConverter<Dialog, FBDialog> = (
  dialog: Dialog
): FBDialog => {
  return {
    ...dialog,
    patient: dialog.patient.docId,
    doctor: dialog.doctor.docId,
    messages: dialog.messages.map(shrinkMessage),
  };
};

export const shrinkComment: ShrinkConverter<Comment, FBComment> = (
  comment: Comment
): FBComment => {
  return {
    ...comment,
    message: shrinkMessage(comment.message),
  };
};

export const shrinkThematicMaterial: ShrinkConverter<
  ThematicMaterial,
  FBThematicMaterial
> = (thematicMaterial: ThematicMaterial): FBThematicMaterial => {
  return {
    ...thematicMaterial,
    author: thematicMaterial.author.docId,
    comments: thematicMaterial.comments.map(shrinkComment),
  };
};

export const shrinkMedication: ShrinkConverter<Medication, FBMedication> = (
  medication: Medication
): FBMedication => medication;
