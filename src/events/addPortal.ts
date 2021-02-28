import { useEmit, useSubscriber } from "eventelo";
import { useEffect } from "react";
import { UseModalContainerRef } from "../useModal.interface";

export const ADD_PORTAL_EVENT = "ADD_PORTAL_EVENT";

type ReturnType = (container: UseModalContainerRef) => void;

export const useAddPortal = (): ReturnType => {
  const { emit } = useEmit();

  const overrideEmit = (container: UseModalContainerRef) => {
    emit(ADD_PORTAL_EVENT, container);
  };

  return overrideEmit;
};

export const useSubscribeAddPortal = (callback: ReturnType): void => {
  const { subscribe, unsubscribe } = useSubscriber();

  useEffect(() => {
    const key = subscribe<UseModalContainerRef>(ADD_PORTAL_EVENT, callback);
    return () => {
      unsubscribe(key);
    };
  }, []);
};
