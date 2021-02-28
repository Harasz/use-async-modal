import ReactDOM from "react-dom";
import { useAddPortal, useRemovePortal } from "./events";
import { cssPropertiesToString, getRandomPostfix } from "./helpers";
import {
  UseModalContainerRef,
  UseModalReturnType,
  UseModalOptions,
  ResolveFunction,
  UseModalOnOpenOptions,
} from "./useModal.interface";

export function useModal<ResultType>({
  Component,
  overlayStyles,
  overlayClassName,
  onOpen,
  onClose,
}: UseModalOptions<ResultType>): UseModalReturnType<ResultType> {
  const addPortal = useAddPortal();
  const removePortal = useRemovePortal();

  const onResolve = (resolve: ResolveFunction<ResultType>, containerIdPostfix: string) => {
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

  const createModal = (resolve: ResolveFunction<ResultType>) => {
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

    const onOpenOptions: UseModalOnOpenOptions = {
      containerRef: modalContainer,
      containerId: containerIdPostfix,
    };

    const containerRef: UseModalContainerRef = {
      ...onOpenOptions,
      portal: ReactDOM.createPortal(
        <Component onResolve={onResolve(resolve, containerIdPostfix)} />,
        modalContainer,
        containerIdPostfix,
      ),
    };

    addPortal(containerRef);

    onOpen && onOpen(onOpenOptions);
  };

  const cleanupContainer = (containerIdPostfix: string) => {
    const body = document.querySelector("body");
    const modalContainer = document.querySelector(`div#modal__${containerIdPostfix}`);

    removePortal(containerIdPostfix);

    if (!modalContainer || !body) {
      return;
    }

    body.removeChild(modalContainer);
  };

  return showModal;
}
