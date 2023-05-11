import { ZodError } from "zod";
import { NotificationManager } from "react-notifications";

export const tryToExecute = <Out, ErrOut>({
  callback,
  error: { result, title, message },
}: {
  callback: () => Out;
  error: {
    result: ErrOut;
    title: string;
    message: string;
  };
}): Out | ErrOut => {
  try {
    return callback();
  } catch (e) {
    const err = e as ZodError;
    console.log(err);
    NotificationManager.error(message, title);
    return result;
  }
};
