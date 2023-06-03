import React, { useCallback, useMemo } from "react";
import { CardContainer } from "../../../../ui/CardContainer";
import { formatDate } from "../../../../../helpers/helpers";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import { PatientReplyStatus } from "../../../../../firestore/types/collections.types";
import MenuItem from "@mui/material/MenuItem";

export const Status = ({ notification, onStatusChange }) => {
  const recommendation = notification.recommendation ?? null;

  const selectedStatus = useMemo(() => {
    if (!recommendation) {
      return PatientReplyStatus.DOESNT_EXIST;
    }
    if (!recommendation.patientReply) {
      return PatientReplyStatus.NOT_SEEN;
    }
    return recommendation.patientReply.status;
  }, [recommendation]);

  const onChange = useCallback(
    ({ target: { value } }) => {
      if (onStatusChange) {
        return onStatusChange(notification, value);
      }
      return null;
    },
    [notification, onStatusChange]
  );

  return (
    <>
      {recommendation?.patientReply && (
        <CardContainer sx={{ mb: 1, p: 1 }}>
          Дата ответа: {formatDate(recommendation?.patientReply.createdAt)}
        </CardContainer>
      )}
      {!onStatusChange && (
        <CardContainer sx={{ mb: 1, p: 1 }}>
          <div style={{ textAlign: "center" }}>Статус рекомендации</div>
          <div
            style={{
              textAlign: "center",
              fontSize: "10pt",
              fontWeight: "bold",
              margin: "1px",
            }}
          >
            {selectedStatus}
          </div>
        </CardContainer>
      )}
      {onStatusChange && (
        <FormControl fullWidth>
          <InputLabel id="patient-reply-status-select-label-id">
            Статус рекомендации
          </InputLabel>
          <Select
            labelId="patient-reply-status-select-label-id"
            value={selectedStatus}
            label="Статус рекомендации"
            onChange={onChange}
            disabled={!Boolean(onStatusChange)}
          >
            {Object.values(PatientReplyStatus).map((status) => (
              <MenuItem
                key={notification.docId + status}
                value={status}
                style={{
                  display: [
                    PatientReplyStatus.NOT_SEEN,
                    PatientReplyStatus.DOESNT_EXIST,
                  ].includes(status)
                    ? "none"
                    : "block",
                }}
              >
                {status}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
    </>
  );
};
