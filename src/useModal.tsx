import ReactDOM from "react-dom";
import { useAddPortal, useRemovePortal } from "./events";
import {
  cssPropertiesToString,
  getRandomPostfix,
  getModalContainerById,
  addClassesToModalContainer,
  removeClassesFromModalContainer,
} from "./helpers";
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
  overlayClassNameOnClose,
  overlayClassNameOnOpen,
  closeTimeoutMs,
  blockBodyScroll,
  onOpen,
  onClose,
}: UseModalOptions<ResultType>): UseModalReturnType<ResultType> {
  const addPortal = useAddPortal();
  const removePortal = useRemovePortal();

  const onResolve = (resolve: ResolveFunction<ResultType>, containerIdPostfix: string) => {
    return (result: ResultType) => {
      const beforeCloseActions = () => {
        onClose && onClose({ resolved: result });

        const modalContainer = getModalContainerById(containerIdPostfix);
        removeClassesFromModalContainer(modalContainer, overlayClassNameOnOpen);
        addClassesToModalContainer(modalContainer, overlayClassNameOnClose);
      };

      const afterCloseActions = () => {
        cleanupContainer(containerIdPostfix);
        resolve(result);
      };

      beforeCloseActions();
      closeTimeoutMs ? setTimeout(afterCloseActions, closeTimeoutMs) : afterCloseActions();
    };
  };

  const showModal = () => {
    return new Promise<ResultType>((resolve) => {
      createModal(resolve);
    });
  };

  const addEscListener = (containerIdPostfix: string, onResolve: (x: ResultType) => void) => {
    const container = getModalContainerById(containerIdPostfix);

    // TODO: Find method to not shown error while ResultType is void
    // if (!defaultResolved) {
    //   console.warn(
    //     "use-async-modal: when options `closeOnEsc` is true, `defaultResolved` must be set!",
    //   );
    // }

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
    const container = getModalContainerById(containerIdPostfix);

    // TODO: Find method to not shown error while ResultType is void
    // if (!defaultResolved) {
    //   console.warn(
    //     "use-async-modal: when options `closeOnOverlayClick` is true, `defaultResolved` must be set!",
    //   );
    // }

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
    addClassesToModalContainer(modalContainer, overlayClassName);
    addClassesToModalContainer(modalContainer, overlayClassNameOnOpen);

    body?.appendChild(modalContainer);

    const onOpenOptions: UseModalOnOpenOptions = {
      containerRef: modalContainer,
      containerId: containerIdPostfix,
      blockBodyScroll: blockBodyScroll ?? true,
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
    const modalContainer = getModalContainerById(containerIdPostfix);

    removePortal(containerIdPostfix);

    if (!modalContainer || !body) {
      return;
    }

    body.removeChild(modalContainer);
  };

  return showModal;
}
