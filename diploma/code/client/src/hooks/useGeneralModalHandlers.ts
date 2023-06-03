import { useCallback, useState } from "react";

export const useGeneralModalHandlers = ({
  onOpen,
  onClose,
}: {
  onOpen?: (...args: unknown[]) => void;
  onClose?: () => void;
} = {}) => {
  const [isModalOpened, setIsModalOpened] = useState(false);

  const openModal = useCallback(
    (...args: unknown[]) => {
      onOpen?.(...args);
      setIsModalOpened(true);
    },
    [setIsModalOpened, onOpen]
  );

  const closeModal = useCallback(() => {
    onClose?.();
    setIsModalOpened(false);
  }, [setIsModalOpened, onClose]);

  return [isModalOpened, openModal, closeModal];
};
