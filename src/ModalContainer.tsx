import { FC, useState, useEffect } from "react";
import { useSubscribeAddPortal, useSubscribeRemovePortal } from "./events";
import { blockBodyScroll } from "./helpers/common";
import { UseModalContainerRef } from "./useModal.interface";

export const ModalContainer: FC = () => {
  const [containers, setContainers] = useState<UseModalContainerRef[]>([]);

  useSubscribeAddPortal((container) => {
    setContainers((prev) => [...prev, container]);
    container.blockBodyScroll && blockBodyScroll(true);
  });

  useSubscribeRemovePortal((containerId) =>
    setContainers((prev) => prev.filter((container) => container.containerId !== containerId)),
  );

  useEffect(() => {
    const hasBodyScroll = containers.reduce((has, container) => {
      return has || container.blockBodyScroll;
    }, false);

    if (!hasBodyScroll) blockBodyScroll(false);
  }, [containers]);

  const modalPortals = containers.map((container) => container.portal);

  return <>{modalPortals}</>;
};
