import React, { FC, useRef, CSSProperties } from "react";
import ReactDOM from "react-dom";
import { cssPropertiesToString, getRandomPostfix } from "./helpers";

export function useModal<ResultType>({
  Component,
  overlayStyles,
  overlayClassName,
  onOpen,
  onClose,
}: UseModalOptions<ResultType>): UseModalReturnType<ResultType> {
  const containers = useRef<ContainerRef[]>([]);

  const onResolve = (resolve: (x: ResultType) => void, containerIdPostfix: string) => {
    return (result: ResultType) => {
      cleanupContainer(containerIdPostfix);
      onClose && onClose({ resolved: result });
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

    // Apply styles
    modalContainer.classList.add("useModal__overlay");
    overlayStyles && modalContainer.setAttribute("style", cssPropertiesToString(overlayStyles));
    overlayClassName && modalContainer.classList.add(...overlayClassName?.split(" "));

    body?.appendChild(modalContainer);

    const containerRef: ContainerRef = {
      containerRef: modalContainer,
      containerId: containerIdPostfix,
    };
    containers.current.push(containerRef);

    onOpen && onOpen(containerRef);

    ReactDOM.render(
      <Component onResolve={onResolve(resolve, containerIdPostfix)} />,
      modalContainer,
    );
  };

  const cleanupContainer = (containerIdPostfix: string) => {
    const body = document.querySelector("body");
    const modalContainer = document.querySelector(`div#modal__${containerIdPostfix}`);

    containers.current = containers.current.filter(
      (container) => container.containerId !== containerIdPostfix,
    );

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
  overlayStyles?: CSSProperties;
  overlayClassName?: string;
  onOpen?: (options: UseModalOnOpenOptions) => void;
  onClose?: (options: UseModalOnCloseOptions<T>) => void;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface UseModalOnOpenOptions extends ContainerRef {}

export interface UseModalOnCloseOptions<T> {
  resolved: T;
}

export interface ContainerRef {
  containerId: string;
  containerRef: HTMLDivElement;
}

export type UseModalReturnType<T = unknown> = () => Promise<T>;
