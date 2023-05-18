import { Dialog, Role, UserInfo } from "firestore/types/collections.types";
import { Channel } from "stream-chat";
import useAsyncEffect from "use-async-effect";
import { useState } from "react";
import { getUserFullName } from "firestore/helpers";
import { NotificationManager } from "react-notifications";
import { streamClient } from "components/App/App";

const getStreamUserData = (userInfo: UserInfo) => ({
  id: userInfo.docId,
  name: `${userInfo.name.first} ${userInfo.name.last}`,
  image: userInfo.imageUrl,
});

const getStreamUserToken = (uid: string) => streamClient.devToken(uid);

const connectStreamUser = async (userInfo: UserInfo) =>
  streamClient.connectUser(
    getStreamUserData(userInfo),
    getStreamUserToken(userInfo.docId)
  );

export const useDialogsData = ({
  uid,
  role,
  dialogsUsers,
  selectedDialog,
}: {
  uid: string;
  role: Role;
  dialogsUsers: UserInfo[];
  selectedDialog: Dialog | null;
}) => {
  const [channel, setChannel] = useState<Channel | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useAsyncEffect(async () => {
    if (!selectedDialog || !dialogsUsers.length) {
      return;
    }

    try {
      setIsLoading(true);

      const channelId = `${selectedDialog.doctor}_${selectedDialog.patient}`;

      const doctorUserInfo = dialogsUsers.find(
        (userInfo) => userInfo.docId === selectedDialog.doctor
      ) as UserInfo;
      const patientUserInfo = dialogsUsers.find(
        (userInfo) => userInfo.docId === selectedDialog.patient
      ) as UserInfo;

      const channelName =
        role === Role.PATIENT
          ? getUserFullName({ name: doctorUserInfo.name })
          : getUserFullName({ name: patientUserInfo.name });

      const channelImage =
        role === Role.PATIENT
          ? doctorUserInfo.imageUrl
          : patientUserInfo.imageUrl;

      await connectStreamUser(
        role === Role.PATIENT ? patientUserInfo : doctorUserInfo
      );

      const newChannel = streamClient.channel("messaging", channelId);

      await newChannel.watch();

      await newChannel.update({
        name: channelName,
        image: channelImage,
        members: [doctorUserInfo.docId, patientUserInfo.docId],
      });

      setChannel(newChannel);
    } catch (e) {
      console.log(e);
      NotificationManager.error(
        "Error in selectedDialog setup",
        "Dialogs data error"
      );
    } finally {
      setIsLoading(false);
    }
  }, [uid, role, dialogsUsers, selectedDialog]);

  return {
    isLoading,
    channel,
  };
};
