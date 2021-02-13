import { FC } from "react";
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
  const { result } = renderHook(() => useModal({ Component }));
  let modalResult: string;

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
      }
    }

    return bodyHasModalContainer;
  };

  test("render modal container", () => {
    act(() => {
      result.current().then((result) => (modalResult = result));
    });

    const modalContainer = document.querySelector("#modal-container");

    expect(isBodyHasModalContainer()).toBeTruthy();
    expect(modalContainer).toBeDefined();
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
