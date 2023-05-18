import React, { useEffect, useState } from "react";
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

import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
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

export const Dialogs = () => {
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
  const handleSelectedDialogChange = (e: SelectChangeEvent<string | null>) => {
    const {
      target: { value },
    } = e;
    if (!value || !dialogs) {
      return;
    }
    setSelectedDialog(
      dialogs.find((dialog) => dialog.docId === value) as Dialog
    );
  };

  return (
    <PageContainer className="dialogs-page-container">
      <Typography variant="h4" className="dialogs-page-title">
        Диалоги
      </Typography>
      <div className="dialogs-container">
        {!dialogs || !dialogsUsers.length ? (
          <LoadingSpinner />
        ) : (
          dialogs.length !== 1 && (
            <FormControl>
              <InputLabel id="dialog-select-label">Диалоги</InputLabel>
              <Select
                id="dialog-select"
                labelId="dialog-select-label"
                label="Диалоги"
                className="dialogs-page-select"
                value={selectedDialog?.docId ?? ""}
                onChange={handleSelectedDialogChange}
              >
                {dialogs.map((dialog) => (
                  <MenuItem key={dialog.docId} value={dialog.docId}>
                    {getUserFullName({
                      name:
                        userInfo.role === Role.PATIENT
                          ? (
                              dialogsUsers.find(
                                (user) => user.docId === dialog.doctor
                              ) as UserInfo
                            ).name
                          : (
                              dialogsUsers.find(
                                (user) => user.docId === dialog.patient
                              ) as UserInfo
                            ).name,
                    })}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
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
