import { useEmit, useSubscriber } from "eventelo";
import { useEffect } from "react";

export const REMOVE_PORTAL_EVENT = "REMOVE_PORTAL_EVENT";

type ReturnType = (id: string) => void;

export const useRemovePortal = (): ReturnType => {
  const { emit } = useEmit();

  const overrideEmit = (id: string) => {
    emit(REMOVE_PORTAL_EVENT, id);
  };

  return overrideEmit;
};

export const useSubscribeRemovePortal = (callback: ReturnType): void => {
  const { subscribe, unsubscribe } = useSubscriber();

  useEffect(() => {
    const key = subscribe<string>(REMOVE_PORTAL_EVENT, callback);
    return () => {
      unsubscribe(key);
    };
  }, []);
};
