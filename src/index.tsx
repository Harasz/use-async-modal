import React, { FC } from "react";
import ReactDOM from "react-dom";

export function useModal<ResultType>({
  Component,
}: UseModalOptions<ResultType>): UseModalReturnType<ResultType> {
  const onResolve = (resolve: (x: ResultType) => void, containerIdPostfix: string) => {
    return (result: ResultType) => {
      cleanupContainer(containerIdPostfix);
      resolve(result);
    };
  };

  const showModal = () => {
    return new Promise<ResultType>((resolve) => {
      createModal(resolve);
    });
  };

  const createModal = (resolve: (v: ResultType) => void) => {
    const containerIdPostfix = getRandomPostfix();
    const body = document.querySelector("body");
    const modalContainer = document.createElement("div");

    modalContainer.setAttribute("id", `modal__${containerIdPostfix}`);
    modalContainer.setAttribute("role", "dialog");
    modalContainer.setAttribute("aria-modal", "true");
    body?.appendChild(modalContainer);

    ReactDOM.render(
      <Component onResolve={onResolve(resolve, containerIdPostfix)} />,
      modalContainer,
    );
  };

  const cleanupContainer = (containerIdPostfix: string) => {
    const body = document.querySelector("body");
    const modalContainer = document.querySelector(`div#modal__${containerIdPostfix}`);

    if (!modalContainer || !body) {
      return;
    }

    body.removeChild(modalContainer);
  };

  return showModal;
}
export default useModal;

export interface UseModalComponentProps<T> {
  onResolve(x: T): void;
}

export interface UseModalOptions<T> {
  Component: FC<UseModalComponentProps<T>>;
}

export type UseModalReturnType<T = unknown> = () => Promise<T>;

const getRandomPostfix = () => Math.random().toString(36).substring(2);
