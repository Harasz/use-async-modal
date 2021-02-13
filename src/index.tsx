import React, { FC, useState } from "react";
import ReactDOM from "react-dom";

export function useModal<ResultType>({
  Component,
}: UseModalOptions<ResultType>): UseModalReturnType<ResultType> {
  const [containerIdPostfix] = useState<string>(getRandomPostfix);

  const onResolve = (resolve: (x: ResultType) => void) => {
    return (result: ResultType) => {
      cleanupContainer();
      resolve(result);
    };
  };

  const showModal = () => {
    return new Promise<ResultType>((resolve) => {
      createModal(resolve);
    });
  };

  const createModal = (resolve: (v: ResultType) => void) => {
    const body = document.querySelector("body");
    const modalContainer = document.createElement("div");

    modalContainer.setAttribute("id", `modal__${containerIdPostfix}`);
    body?.appendChild(modalContainer);

    ReactDOM.render(<Component onResolve={onResolve(resolve)} />, modalContainer);
  };

  const cleanupContainer = () => {
    const body = document.querySelector("body");
    const modalContainer = document.querySelector(`div#modal__${containerIdPostfix}`);

    if (!modalContainer || !body) {
      return;
    }

    body.removeChild(modalContainer);
  };

  return showModal;
}

interface UseModalComponentProps<T> {
  onResolve(x: T): void;
}

interface UseModalOptions<T> {
  Component: FC<UseModalComponentProps<T>>;
}

type UseModalReturnType<T extends unknown> = () => Promise<T>;

const getRandomPostfix = () => Math.random().toString(36).substring(2);
