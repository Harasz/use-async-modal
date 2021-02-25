import { FC } from "react";
import { renderHook, act } from "@testing-library/react-hooks";
import { useModal, UseModalOnOpenOptions } from "../index";

const Component: FC<ComponentProps> = ({ onResolve }) => {
  return (
    <div id="modal-container">
      <button id={"btn"} onClick={() => onResolve("resolve")}>
        Accept
      </button>
    </div>
  );
};

interface ComponentProps {
  onResolve(x: string): void;
}

describe("useModal onOpen callback should", () => {
  let onOpenOptions: UseModalOnOpenOptions;
  let modalRef: HTMLDivElement;
  let modalId: string;
  const { result } = renderHook(() =>
    useModal({ Component, onOpen: (options) => (onOpenOptions = options) }),
  );

  const assignModalRefAndId = () => {
    const body = document.querySelector("body");

    if (!body) {
      return;
    }

    for (let index = 0; index < body.children.length; index++) {
      const child = body.children[index];

      if (child.id.startsWith("modal__")) {
        modalRef = child as HTMLDivElement;
        modalId = child.id.substr("modal__".length);
        return;
      }
    }
  };

  act(() => {
    result.current.showModal();
  });

  test("return correct modalRef", () => {
    assignModalRefAndId();

    expect(onOpenOptions.containerRef).toBe(modalRef);
  });

  test("return correct modalId", () => {
    expect(onOpenOptions.containerId).toBe(modalId);
  });
});
