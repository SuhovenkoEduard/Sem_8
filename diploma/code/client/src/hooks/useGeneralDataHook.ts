import { useState } from "react";
import { NotificationManager } from "react-notifications";
import useAsyncEffect from "use-async-effect";

export const useGeneralDataHook = <T>(
  callback: () => Promise<T>,
  deps: unknown[] = []
) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [data, setData] = useState<T | null>(null);

  const reset = async () => {
    try {
      setIsLoading(true);
      const newData = await callback();
      setData(newData);
    } catch (e) {
      console.log(e);
      NotificationManager.error("Получение данных с сервера", "Ошибка сервера");
    } finally {
      setIsLoading(false);
    }
  };

  useAsyncEffect(reset, deps);

  return [isLoading, data, reset];
};
