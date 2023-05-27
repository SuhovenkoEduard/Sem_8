import { Role, User, UserInfo } from "firestore/types/collections.types";
import { Channel } from "stream-chat";
import useAsyncEffect from "use-async-effect";
import { useState } from "react";
import { getUserFullName } from "firestore/helpers";
import { NotificationManager } from "react-notifications";
import { streamClient } from "containers/App/App";

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
  currentUser,
  dialogsUsers,
  selectedUser,
}: {
  currentUser: User;
  dialogsUsers: UserInfo[] | null;
  selectedUser: User | null;
}) => {
  const [channel, setChannel] = useState<Channel | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useAsyncEffect(async () => {
    if (!selectedUser || !dialogsUsers || !dialogsUsers.length) {
      return;
    }

    try {
      setIsLoading(true);

      const patient =
        currentUser.role === Role.PATIENT ? currentUser : selectedUser;

      const doctor =
        currentUser.role === Role.PATIENT ? selectedUser : currentUser;

      const channelId = `${doctor.docId}_${patient.docId}`;

      const channelName =
        currentUser.role === Role.PATIENT
          ? getUserFullName({ name: doctor.name })
          : getUserFullName({ name: patient.name });

      const channelImage = selectedUser.imageUrl;

      await connectStreamUser(currentUser);

      const newChannel = streamClient.channel("messaging", channelId);

      await newChannel.watch();

      await newChannel.update({
        name: channelName,
        image: channelImage,
        members: [currentUser.docId, selectedUser.docId],
      });

      setChannel(newChannel);
    } catch (e) {
      console.log(e);
      NotificationManager.error(
        "Загрузке данных для диалогов",
        "Ошибка данных диалогов"
      );
    } finally {
      setIsLoading(false);
    }
  }, [currentUser, dialogsUsers, selectedUser]);

  return {
    isLoading,
    channel,
  };
};
