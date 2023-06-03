import React, { SyntheticEvent, useCallback, useEffect, useState } from "react";
import { PageContainer } from "components/layout";
import { useDialogsData } from "components/pages/Dialogs/hooks/useDialogsData";
import { getUserSelector } from "store/selectors";
import { useSelector } from "react-redux";
import { LoadingSpinner } from "components/ui/LoadingSpinner";
import {
  Channel,
  ChannelHeader,
  Chat,
  MessageInput,
  MessageList,
  Thread,
  Window,
} from "stream-chat-react";
import "stream-chat-react/dist/css/v2/index.css";
import { i18nInstance, streamClient } from "containers/App/App";
import useAsyncEffect from "use-async-effect";
import { Role, UserInfo } from "firestore/types/collections.types";
import { Autocomplete, TextField } from "@mui/material";
import { getUserFullName } from "firestore/helpers";
import { firebaseRepositories } from "firestore/data/repositories";
import { where } from "firebase/firestore";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import * as emailjs from "@emailjs/browser";

import "./dialogs.scss";

export const DialogsPage = () => {
  const currentUser = useSelector(getUserSelector);

  // dialogs
  const [dialogsUsers, setDialogsUsers] = useState<UserInfo[] | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserInfo | null>(null);

  const { isLoading, channel } = useDialogsData({
    currentUser,
    dialogsUsers,
    selectedUser,
  });

  // effects
  // fetch dialogs on initial load
  useAsyncEffect(async () => {
    if (currentUser.role === Role.PATIENT && !currentUser.doctor) {
      setDialogsUsers([]);
      return;
    }

    const filter =
      currentUser.role === Role.PATIENT
        ? where("docId", "==", currentUser.doctor)
        : where("doctor", "==", currentUser.docId);
    const newDialogsUsers = await firebaseRepositories.users.getDocs(filter);
    setDialogsUsers(newDialogsUsers);
  }, [currentUser]);

  // set first user as selected if user is patient
  useEffect(() => {
    if (dialogsUsers && dialogsUsers.length > 0) {
      setSelectedUser(dialogsUsers[0]);
    }
  }, [dialogsUsers, currentUser]);

  // send emails when a new message occurs
  useEffect(() => {
    return streamClient.on("message.new", async (event) => {
      if (!selectedUser || !dialogsUsers || !dialogsUsers.length) {
        return;
      }

      if (event?.user?.id === currentUser.docId && event?.message?.text) {
        const message = event.message.text;
        const receiverId = selectedUser.docId;
        const receiverUserInfo = dialogsUsers.find(
          (user) => user.docId === receiverId
        ) as UserInfo;

        await emailjs.send("service_oxiflh8", "template_4mhfpd6", {
          to_email: receiverUserInfo.email,
          from_name: getUserFullName(currentUser),
          to_name: getUserFullName(receiverUserInfo),
          message,
        });
      }
    }).unsubscribe;
  }, [selectedUser, dialogsUsers, currentUser]);

  // handlers
  // handles dialog selection
  const handleSelectedDialogChange = (
    event: SyntheticEvent<Element, Event>,
    option: unknown
  ) => {
    if (!dialogsUsers) {
      return;
    }
    const castedOption = option as { value: string; label: string } | null;
    setSelectedUser(
      dialogsUsers.find((user) => user.docId === castedOption?.value) ?? null
    );
  };

  const getUserOption = useCallback((user: UserInfo) => {
    return {
      value: user.docId,
      label: getUserFullName(user),
      imageUrl: user.imageUrl,
    };
  }, []);

  return (
    <PageContainer className="dialogs-page-container">
      <div className="dialogs-container">
        {!dialogsUsers ? (
          <LoadingSpinner />
        ) : (
          <>
            {!dialogsUsers.length && (
              <div className="no-dialog-users">
                {currentUser.role === Role.DOCTOR && "Нет пациентов"}
                {currentUser.role === Role.PATIENT &&
                  "Доктор не выбран, перейдите на вкладку [Доктор]"}
              </div>
            )}
            {dialogsUsers.length > 0 && currentUser.role === Role.DOCTOR && (
              <Autocomplete
                id="dialog-select"
                className="dialogs-page-select"
                value={selectedUser ? getUserOption(selectedUser) : null}
                onChange={handleSelectedDialogChange}
                options={dialogsUsers.map(getUserOption)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Выберите диалог"
                    inputProps={{
                      ...params.inputProps,
                    }}
                  />
                )}
                blurOnSelect
                noOptionsText="Нет пациентов с таким именем."
                renderOption={(props, option) => (
                  <Box
                    component="li"
                    sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
                    {...props}
                  >
                    <Avatar
                      src={option.imageUrl}
                      sx={{
                        width: "30px",
                        height: "30px",
                        marginRight: "20px",
                      }}
                    />
                    {option.label}
                  </Box>
                )}
              />
            )}
          </>
        )}
        {selectedUser &&
          dialogsUsers &&
          dialogsUsers.length > 0 &&
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
                  currentUser.role === Role.DOCTOR
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
