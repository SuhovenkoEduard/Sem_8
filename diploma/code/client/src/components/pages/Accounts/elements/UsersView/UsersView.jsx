import React from "react";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import Typography from "@mui/material/Typography";
import {
  convertRoleToRussian,
  convertRoleToRussianPlural,
} from "firestore/converters/role/role.converter";
import { getUserFullName } from "../../../../../firestore/helpers";
import { CardContainer } from "../../../../ui/CardContainer";
import { Role } from "../../../../../firestore/types/collections.types";
import Avatar from "@mui/material/Avatar";

export const UsersView = ({ role, users, editAccount, deleteAccount }) => {
  return (
    <div style={{ display: "flex", width: "100%" }}>
      <TableContainer component={CardContainer}>
        <Typography variant="h5" sx={{ textAlign: "center" }}>
          {convertRoleToRussianPlural(role)}
        </Typography>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Button
            color="success"
            variant="contained"
            sx={{ fontSize: "11px", fontWeight: "bold" }}
            onClick={() => editAccount(role)}
          >
            Добавить
          </Button>
        </div>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{convertRoleToRussian(role)}</TableCell>
              <TableCell>Эл. почта</TableCell>
              <TableCell>Телефон</TableCell>
              <TableCell>Адрес</TableCell>
              {role === Role.PATIENT && <TableCell>Тип диабета</TableCell>}
              {[
                Role.DOCTOR,
                Role.CONTENT_MAKER,
                Role.MODERATOR,
                Role.ADMIN,
              ].includes(role) && <TableCell>Зарплата</TableCell>}
              <TableCell>Управление</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.docId}>
                <TableCell>
                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      alignItems: "center",
                    }}
                  >
                    <Avatar src={user.imageUrl} alt={getUserFullName(user)} />
                    <Typography>{getUserFullName(user)}</Typography>
                  </div>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.phone}</TableCell>
                <TableCell>{user.address}</TableCell>
                {role === Role.PATIENT && (
                  <TableCell>{user.diary.diabetType}</TableCell>
                )}
                {[
                  Role.DOCTOR,
                  Role.CONTENT_MAKER,
                  Role.MODERATOR,
                  Role.ADMIN,
                ].includes(role) && (
                  <TableCell>{user.employee.salary} $</TableCell>
                )}
                <TableCell>
                  <div style={{ display: "flex", gap: "5px" }}>
                    <Button
                      color="warning"
                      variant="contained"
                      sx={{ fontSize: "11px", fontWeight: "bold" }}
                      onClick={() => editAccount(role, user)}
                    >
                      Редактировать
                    </Button>
                    <Button
                      color="error"
                      variant="contained"
                      sx={{ fontSize: "11px", fontWeight: "bold" }}
                      onClick={() => deleteAccount(role, user)}
                      disabled={true} // todo side effects
                    >
                      Удалить
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};
