import React from "react";
import { CardContainer } from "../../../../ui/CardContainer";
import {
  convertDailyLogPropNameToMeasurement,
  convertDailyLogPropNameToRussian,
} from "../../../../../firestore/converters";
import { calculatePatientReportDeviation } from "../../../../../firestore/helpers";

import "./notification-details.scss";

export const NotificationDetails = ({ notification }) => {
  return (
    <div className="notification-details">
      {notification.patientReports.map((patientReport) => (
        <>
          <CardContainer
            className="patient-report"
            key={notification.docId + patientReport.propName}
          >
            <div className="prop-name">
              {convertDailyLogPropNameToRussian(patientReport.propName)}:
            </div>
            <div className="current-value">
              {patientReport.currentValue}{" "}
              {convertDailyLogPropNameToMeasurement(patientReport.propName)}
            </div>
          </CardContainer>
          <div
            style={{
              fontSize: "13px",
              textAlign: "center",
              fontStyle: "italic",
            }}
          >
            Отклонение от нормы:{" "}
            {calculatePatientReportDeviation(
              patientReport.propName,
              patientReport.currentValue
            )}
            {" " + convertDailyLogPropNameToMeasurement(patientReport.propName)}
          </div>
        </>
      ))}
    </div>
  );
};
