import type { HealthState } from "../types/collections.types";

import { HealthStatesData } from "../constants/healthStates";
import { generateDocId } from "../helpers";

export const generateHealthStates = (
  healthStatesData: HealthStatesData
): HealthState[] => {
  return healthStatesData.map((healthStateData) => ({
    docId: generateDocId(),
    ...healthStateData,
  }));
};
