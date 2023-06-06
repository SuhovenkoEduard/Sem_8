import React from "react";

import { PageContainer } from "../../layout";
import { LoadingSpinner } from "../../ui/LoadingSpinner";
import { Role } from "../../../firestore/types/collections.types";
import { useGeneralDataHook } from "../../../hooks/useGeneralDataHook";
import { firebaseRepositories } from "../../../firestore/data/repositories";
import { and, where } from "firebase/firestore";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { CardContainer } from "../../ui/CardContainer";
import Typography from "@mui/material/Typography";
import {
  convertRoleToRussian,
  convertRoleToRussianPlural,
} from "../../../firestore/converters/role/role.converter";
import Avatar from "@mui/material/Avatar";
import { getUserFullName } from "../../../firestore/helpers";
import { getUserSelector } from "../../../store/selectors";
import { useSelector } from "react-redux";

export const PatientsPage = () => {
  const currentUser = useSelector(getUserSelector);

  const [isPatientsLoading, patients] = useGeneralDataHook(async () => {
    return firebaseRepositories.users.getDocs(
      and(
        where("role", "==", Role.PATIENT),
        where("doctor", "==", currentUser.docId)
      )
    );
  }, [currentUser]);

  return (
    <PageContainer
      style={{
        padding: "30px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "20px",
        minHeight: "calc(100vh - 60px)",
        width: "100%",
      }}
    >
      {isPatientsLoading ? (
        <LoadingSpinner />
      ) : (
        patients && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "30px",
              width: "100%",
            }}
          >
            {!patients.length && "Пациентов нет."}
            {Boolean(patients.length) && (
              <div style={{ display: "flex", width: "100%" }}>
                <TableContainer component={CardContainer}>
                  <Typography variant="h5" sx={{ textAlign: "center" }}>
                    {convertRoleToRussianPlural(Role.PATIENT)}
                  </Typography>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>
                          {convertRoleToRussian(Role.PATIENT)}
                        </TableCell>
                        <TableCell>Эл. почта</TableCell>
                        <TableCell>Телефон</TableCell>
                        <TableCell>Адрес</TableCell>
                        <TableCell>Тип диабета</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {patients.map((patient) => (
                        <TableRow key={patient.docId}>
                          <TableCell>
                            <div
                              style={{
                                display: "flex",
                                gap: "10px",
                                alignItems: "center",
                              }}
                            >
                              <Avatar
                                src={patient.imageUrl}
                                alt={getUserFullName(patient)}
                              />
                              <Typography>
                                {getUserFullName(patient)}
                              </Typography>
                            </div>
                          </TableCell>
                          <TableCell>{patient.email}</TableCell>
                          <TableCell>{patient.phone}</TableCell>
                          <TableCell>{patient.address}</TableCell>
                          <TableCell>{patient.diary.diabetType}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
            )}
          </div>
        )
      )}
    </PageContainer>
  );
};
