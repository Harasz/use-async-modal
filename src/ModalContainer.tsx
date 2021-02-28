import { FC, useState } from "react";
import { useSubscribeAddPortal, useSubscribeRemovePortal } from "./events";
import { UseModalContainerRef } from "./useModal.interface";

export const ModalContainer: FC = () => {
  const [containers, setContainers] = useState<UseModalContainerRef[]>([]);

  useSubscribeAddPortal((container) => setContainers((prev) => [...prev, container]));
  useSubscribeRemovePortal((containerId) =>
    setContainers((prev) => prev.filter((container) => container.containerId !== containerId)),
  );

  const modalPortals = containers.map((container) => container.portal);

  return <>{modalPortals}</>;
};
