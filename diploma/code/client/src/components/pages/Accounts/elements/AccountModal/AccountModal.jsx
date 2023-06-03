import React, { useCallback, useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { LoadingSpinner } from "components/ui/LoadingSpinner";
import { deepCopy } from "deep-copy-ts";
import { isMobile } from "react-device-detect";
import { convertRoleToRussian } from "firestore/converters";
import { createUser } from "./AccountModal.helpers";
import { Role } from "firestore/types/collections.types";
import { formatDate } from "../../../../../helpers/helpers";

import "./account-modal.scss";

export const AccountModal = ({
  isOpen,
  onClose,
  submitAccount,
  selectedAccount,
  role,
}) => {
  const getAccount = useCallback(
    () => (selectedAccount ? deepCopy(selectedAccount) : createUser(role)),
    [selectedAccount, role]
  );

  const [account, setAccount] = useState(getAccount());
  const [isLoading, setIsLoading] = useState(false);

  const resetAccount = useCallback(() => {
    setAccount(getAccount());
  }, [setAccount, getAccount]);

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setAccount((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmitAccount = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    await submitAccount(account, selectedAccount);
    setIsLoading(false);
    onClose();
  };

  useEffect(() => {
    resetAccount();
  }, [selectedAccount, isOpen, resetAccount]);

  return (
    <Dialog open={isOpen} onClose={onClose} className="account-modal-dialog">
      <DialogTitle>
        {(selectedAccount ? "Редактирование" : "Добавление") +
          " пользователя [" +
          convertRoleToRussian(role) +
          "]"}
      </DialogTitle>
      <DialogContent
        className="account-modal-content"
        sx={{
          width: isMobile ? "300px" : "600px",
        }}
      >
        <form className="account-form" onSubmit={handleSubmitAccount}>
          <TextField
            label="Роль"
            name="role"
            value={account.role}
            disabled={true}
          />
          {selectedAccount && (
            <TextField
              label="Идентификатор пользователя"
              name="docId"
              value={account.docId}
              disabled={true}
            />
          )}
          <TextField
            label="Эл. почта"
            name="email"
            value={account.email}
            onChange={handleFieldChange}
            disabled={isLoading}
          />
          <TextField
            label="Пароль"
            name="password"
            value={account.password}
            onChange={handleFieldChange}
            disabled={isLoading}
          />
          <TextField
            label="Ссылка на изображение профиля"
            name="imageUrl"
            value={account.imageUrl}
            onChange={handleFieldChange}
            disabled={isLoading}
          />
          <TextField
            label="Имя"
            value={account.name.first}
            onChange={({ target: { value } }) =>
              setAccount((prevAccount) => ({
                ...prevAccount,
                name: {
                  ...prevAccount.name,
                  first: value,
                },
              }))
            }
            disabled={isLoading}
          />
          <TextField
            label="Фамилия"
            value={account.name.last}
            onChange={({ target: { value } }) =>
              setAccount((prevAccount) => ({
                ...prevAccount,
                name: {
                  ...prevAccount.name,
                  last: value,
                },
              }))
            }
            disabled={isLoading}
          />
          <TextField
            label="Адрес"
            name="address"
            value={account.address}
            onChange={handleFieldChange}
            disabled={isLoading}
          />
          <TextField
            label="Телефон"
            name="phone"
            value={account.phone}
            onChange={handleFieldChange}
            disabled={isLoading}
          />
          {/* patient */}
          {role === Role.PATIENT && (
            <>
              <TextField
                label="Тип диабета"
                value={account.diary.diabetType}
                onChange={({ target: { value } }) =>
                  setAccount((prevAccount) => ({
                    ...prevAccount,
                    diary: {
                      ...prevAccount.diary,
                      diabetType: isNaN(+value) ? 0 : +value,
                    },
                  }))
                }
                disabled={isLoading}
              />
            </>
          )}
          {/* relative */}
          {role === Role.RELATIVE && (
            <>
              <TextField
                label="Код приглашения пациента родственника"
                name="relativePatient"
                value={account.relativePatient}
                onChange={handleFieldChange}
                disabled={isLoading}
              />
            </>
          )}
          {/* employee */}
          {[
            Role.DOCTOR,
            Role.CONTENT_MAKER,
            Role.MODERATOR,
            Role.ADMIN,
          ].includes(role) && (
            <>
              <TextField
                label="Дата найма"
                name="hiredAt"
                value={formatDate(account.employee.hiredAt)}
                disabled={true}
              />
              <TextField
                multiline
                minRows={3}
                maxRows={4}
                label="Описание"
                value={account.employee.description}
                onChange={({ target: { value } }) =>
                  setAccount((prevAccount) => ({
                    ...prevAccount,
                    employee: {
                      ...prevAccount.employee,
                      description: value,
                    },
                  }))
                }
                disabled={isLoading}
                fullWidth
              />
              <TextField
                label="Зарплата"
                value={account.employee.salary}
                onChange={({ target: { value } }) =>
                  setAccount((prevAccount) => ({
                    ...prevAccount,
                    employee: {
                      ...prevAccount.employee,
                      salary: isNaN(+value) ? 0 : +value,
                    },
                  }))
                }
                disabled={isLoading}
              />
            </>
          )}
          <DialogActions className="controls">
            <Button onClick={onClose} disabled={isLoading} variant="outlined">
              Отмена
            </Button>
            {isLoading ? (
              <LoadingSpinner style={{ margin: "0", width: "100px" }} />
            ) : (
              <Button
                type="submit"
                variant="outlined"
                disabled={false} // todo
                autoFocus
              >
                {selectedAccount ? "Изменить" : "Добавить"}
              </Button>
            )}
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};
