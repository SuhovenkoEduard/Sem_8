import {
  Comment,
  Dialog,
  EmployeeReview,
  Medication,
  Message,
  ThematicMaterial,
  User,
} from '../types/collections.types'
import {
  FBComment,
  FBDialog,
  FBEmployeeReview, FBMedication,
  FBMessage,
  FBThematicMaterial,
  FBUser,
} from '../types/firebase/fb_collections.types'

export const shrinkEmployeeReview = (employeeReview: EmployeeReview): FBEmployeeReview => {
  return {
    ...employeeReview,
    reviewer: employeeReview.reviewer.docId,
  }
}

export const shrinkUser = (user: User): FBUser => {
  let employeeObj: Pick<FBUser, 'employee'> | Record<never, never> = {}
  
  if (user?.employee) {
    employeeObj = {
      employee: {
        ...user?.employee,
        reviews: user.employee.reviews.map(shrinkEmployeeReview),
      },
    }
  }
  
  let relativePatientObj: Pick<FBUser, 'relativePatient'> | Record<never, never> = {}
  
  if (user?.relativePatient) {
    relativePatientObj = {
      relativePatient: user.relativePatient.docId,
    }
  }
  
  return {
    ...user,
    ...employeeObj,
    ...relativePatientObj,
  } as FBUser
}

export const shrinkMessage = (message: Message): FBMessage => {
  return {
    ...message,
    sender: message.sender.docId,
  }
}

export const shrinkDialog = (dialog: Dialog): FBDialog => {
  return {
    ...dialog,
    patient: dialog.patient.docId,
    doctor: dialog.doctor.docId,
    messages: dialog.messages.map(shrinkMessage),
  }
}

export const shrinkComment = (comment: Comment): FBComment => {
  return {
    ...comment,
    message: shrinkMessage(comment.message),
  }
}

export const shrinkThematicMaterial = (thematicMaterial: ThematicMaterial): FBThematicMaterial => {
  return {
    ...thematicMaterial,
    author: thematicMaterial.author.docId,
    comments: thematicMaterial.comments.map(shrinkComment),
  }
}

export const shrinkMedication = (medication: Medication): FBMedication => medication
