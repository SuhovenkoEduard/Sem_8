import { faker } from "@faker-js/faker";
import { DailyLogPropName, UserInfo } from "./types/collections.types";
import { PATIENT_REPORT_RANGES } from "./constants";

export const generateDocId = () =>
  faker.datatype.uuid().replaceAll("-", "").slice(0, 20);

export const getUserFullName = ({
  name: { first, last },
}: Pick<UserInfo, "name">) => `${first} ${last}`;

export const calculatePatientReportDeviation = (
  propName: DailyLogPropName,
  value: number
) => {
  const { min, max } = PATIENT_REPORT_RANGES[propName];
  if (value < min) {
    return +(value - min).toFixed(2);
  }
  if (value > max) {
    return +(value - max).toFixed(2);
  }
  return 0;
};
