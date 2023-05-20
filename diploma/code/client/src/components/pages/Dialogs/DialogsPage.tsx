import React, { SyntheticEvent, useCallback, useEffect, useState } from "react";
import { PageContainer } from "components/layout";
import { useDialogsData } from "components/pages/Dialogs/hooks/useDialogsData";
import { getDialogsSelector, getUserInfoSelector } from "store/selectors";
import { useSelector } from "react-redux";
import { LoadingSpinner } from "components/ui/LoadingSpinner";
import {
  Channel,
  ChannelHeader,
  Chat,
  MessageInput,
  MessageList,
  Streami18n,
  Thread,
  Window,
} from "stream-chat-react";
import "stream-chat-react/dist/css/v2/index.css";
import { streamClient } from "components/App/App";
import useAsyncEffect from "use-async-effect";
import { fetchDialogs } from "store/reducers/dialogs/actions";
import { useAppDispatch } from "store";
import { Dialog, Role, UserInfo } from "firestore/types/collections.types";

import { Autocomplete, TextField } from "@mui/material";
import { getUserFullName } from "firestore/helpers";
import { firebaseRepositories } from "firestore/data/repositories";
import { convertUserToUserInfo } from "firestore/converters";
import { where } from "firebase/firestore";
import ruUpdated from "assets/i18/ru.json";

import "./dialogs.scss";

const getDialogsUserIds = (dialogs: Dialog[] | null) => {
  if (!dialogs) {
    return [];
  }
  return [
    ...new Set(
      dialogs.map((dialog: Dialog) => [dialog.patient, dialog.doctor]).flat()
    ),
  ];
};

const i18nInstance = new Streami18n({
  language: "ru",
  translationsForLanguage: ruUpdated,
});

export const DialogsPage = () => {
  // state
  // global
  const dispatch = useAppDispatch();
  const userInfo = useSelector(getUserInfoSelector);

  // dialogs
  const dialogs = useSelector(getDialogsSelector);
  const [dialogsUsers, setDialogsUsers] = useState<UserInfo[]>([]);
  const [selectedDialog, setSelectedDialog] = useState<Dialog | null>(null);

  const { isLoading, channel } = useDialogsData({
    uid: userInfo.docId,
    role: userInfo.role,
    dialogsUsers,
    selectedDialog,
  });

  // effects
  // fetch dialogs on initial load
  useAsyncEffect(async () => {
    await dispatch(fetchDialogs(userInfo.docId));
  }, [userInfo]);

  // get dialogs users
  useAsyncEffect(async () => {
    const dialogsUserIds = getDialogsUserIds(dialogs);
    if (!dialogsUserIds.length) {
      return;
    }
    const users = await firebaseRepositories.users.getDocs(
      where("docId", "in", dialogsUserIds)
    );
    setDialogsUsers(users.map(convertUserToUserInfo));
  }, [dialogs]);

  // set first user as selected if there's only one
  useEffect(() => {
    if (dialogs && dialogs.length === 1) {
      setSelectedDialog(dialogs[0]);
    }
  }, [dialogs]);

  // handlers
  // handles dialog selection
  const handleSelectedDialogChange = (
    event: SyntheticEvent<Element, Event>,
    option: unknown
  ) => {
    const { value } = option as { value: string; label: string };
    if (!value || !dialogs) {
      return;
    }
    setSelectedDialog(
      dialogs.find((dialog) => dialog.docId === value) as Dialog
    );
  };

  const getUserOption = useCallback(
    (dialog: Dialog) => {
      const person =
        userInfo.role === Role.PATIENT
          ? (dialogsUsers.find(
              (user) => user.docId === dialog.doctor
            ) as UserInfo)
          : (dialogsUsers.find(
              (user) => user.docId === dialog.patient
            ) as UserInfo);
      return {
        value: dialog.docId,
        label: getUserFullName(person),
      };
    },
    [dialogsUsers, userInfo]
  );

  return (
    <PageContainer className="dialogs-page-container">
      <div className="dialogs-container">
        {!dialogs || !dialogsUsers.length ? (
          <LoadingSpinner />
        ) : (
          dialogs.length !== 1 && (
            <Autocomplete
              id="dialog-select"
              className="dialogs-page-select"
              value={selectedDialog ? getUserOption(selectedDialog) : null}
              onChange={handleSelectedDialogChange}
              options={dialogs.map(getUserOption)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Выберите диалог"
                  inputProps={{
                    ...params.inputProps,
                    // autoComplete: 'new-password', // disable autocomplete and autofill
                  }}
                />
              )}
              blurOnSelect
            />
          )
        )}
        {selectedDialog &&
          !!dialogsUsers.length &&
          // "!channel" check only because of typescript
          (isLoading || !channel ? (
            <LoadingSpinner />
          ) : (
            <Chat
              client={streamClient}
              theme="str-chat__theme-light"
              i18nInstance={i18nInstance}
              customClasses={{
                chatContainer:
                  userInfo.role === Role.DOCTOR
                    ? "str-chat__container doctor-view"
                    : "str-chat__container",
              }}
            >
              <Channel channel={channel}>
                <Window>
                  <ChannelHeader />
                  <MessageList />
                  <MessageInput />
                </Window>
                <Thread />
              </Channel>
            </Chat>
          ))}
      </div>
    </PageContainer>
  );
};
