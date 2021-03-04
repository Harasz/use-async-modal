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
  closeOnEsc,
  closeOnOverlayClick,
  defaultResolved,
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

  const addEscListener = (containerIdPostfix: string, onResolve: (x: ResultType) => void) => {
    const container = document.querySelector<HTMLDivElement>(`div#modal__${containerIdPostfix}`);

    if (!defaultResolved) {
      console.error(
        "use-async-modal: when options `closeOnEsc` is true, `defaultResolved` must be set!",
      );
    }

    if (!container) {
      return;
    }

    container.addEventListener("keydown", function _onEsc(e) {
      if (e.key === "Escape") {
        onResolve(defaultResolved!);
        container.removeEventListener("keydown", _onEsc);
      }
    });
  };

  const addClickListener = (containerIdPostfix: string, onResolve: (x: ResultType) => void) => {
    const container = document.querySelector<HTMLDivElement>(`div#modal__${containerIdPostfix}`);

    if (!defaultResolved) {
      console.error(
        "use-async-modal: when options `closeOnOverlayClick` is true, `defaultResolved` must be set!",
      );
    }

    if (!container) {
      return;
    }

    container.addEventListener("click", function _onClick(e) {
      if (e.target === container) {
        onResolve(defaultResolved!);
        container.removeEventListener("click", _onClick);
      }
    });
  };

  const createModal = (resolve: ResolveFunction<ResultType>) => {
    const containerIdPostfix = getRandomPostfix();
    const body = document.querySelector("body");
    const modalContainer = document.createElement("div");

    modalContainer.setAttribute("id", `modal__${containerIdPostfix}`);
    modalContainer.setAttribute("role", "dialog");
    modalContainer.setAttribute("aria-modal", "true");
    modalContainer.tabIndex = -1;

    // Apply styles
    modalContainer.classList.add("useModal__overlay");
    overlayStyles && modalContainer.setAttribute("style", cssPropertiesToString(overlayStyles));
    overlayClassName && modalContainer.classList.add(...overlayClassName?.split(" "));

    body?.appendChild(modalContainer);

    const onOpenOptions: UseModalOnOpenOptions = {
      containerRef: modalContainer,
      containerId: containerIdPostfix,
    };

    const handleResolve = onResolve(resolve, containerIdPostfix);

    const containerRef: UseModalContainerRef = {
      ...onOpenOptions,
      portal: ReactDOM.createPortal(
        <Component onResolve={handleResolve} />,
        modalContainer,
        containerIdPostfix,
      ),
    };

    addPortal(containerRef);

    closeOnEsc && addEscListener(onOpenOptions.containerId, handleResolve);
    closeOnOverlayClick && addClickListener(onOpenOptions.containerId, handleResolve);

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
