import { FC } from "react";
import { renderHook, act } from "@testing-library/react-hooks";
import { useModal, UseModalOnCloseOptions } from "../index";

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

describe("useModal onClose callback should", () => {
  let onCloseOptions: UseModalOnCloseOptions<string>;
  const { result } = renderHook(() =>
    useModal({ Component, onClose: (options) => (onCloseOptions = options) }),
  );

  act(() => {
    result.current.showModal();
  });

  test("not be called before close", () => {
    expect(onCloseOptions).toBeUndefined();
  });

  test("match result", () => {
    const button = document.querySelector("#btn");
    expect(button).toBeDefined();

    act(() => {
      button?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    expect(onCloseOptions.resolved).toBe("resolve");
  });
});
