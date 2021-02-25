import { CSSProperties, FC } from "react";
import { renderHook, act } from "@testing-library/react-hooks";
import { useModal } from "../index";

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

describe("useModal should", () => {
  const overlayStyles: CSSProperties = {
    width: "100%",
    backgroundColor: "white",
  };
  const overlayInlineStyles = "width: 100%; background-color: white;";
  const overlayClassName = "overlay modal w-100";

  const { result } = renderHook(() => useModal({ Component, overlayStyles, overlayClassName }));
  let modalResult: string;
  let modalRef: HTMLDivElement;

  const isBodyHasModalContainer = () => {
    const body = document.querySelector("body");

    if (!body) {
      return;
    }

    let bodyHasModalContainer = false;

    for (let index = 0; index < body.children.length; index++) {
      const child = body.children[index];

      if (child.id.startsWith("modal__")) {
        bodyHasModalContainer = true;
        modalRef = child as HTMLDivElement;
      }
    }

    return bodyHasModalContainer;
  };

  test("render modal container", () => {
    act(() => {
      result.current.showModal().then((result) => (modalResult = result));
    });

    const modalContainer = document.querySelector("#modal-container");

    expect(isBodyHasModalContainer()).toBeTruthy();
    expect(modalContainer).toBeDefined();
  });

  test("modal overlay match styles", () => {
    const overlayClasses = modalRef.classList.toString();

    expect(overlayClasses).toBe("useModal__overlay " + overlayClassName);
    expect(modalRef.style.cssText).toBe(overlayInlineStyles);
  });

  test("close modal container", () => {
    const button = document.querySelector("#btn");
    expect(button).toBeDefined();

    act(() => {
      button?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    const modalContainer = document.querySelector("#modal-container");

    expect(isBodyHasModalContainer()).toBeFalsy();
    expect(modalContainer).toBeNull();
  });

  test("match result", () => {
    expect(modalResult).toBe("resolve");
  });
});
