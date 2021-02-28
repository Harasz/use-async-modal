import { render, screen } from "@testing-library/react";
import { renderHook, act } from "@testing-library/react-hooks";
import { useModal, UseModalOnOpenOptions, ModalContainer } from "../index";
import { Component } from "./TestComponent";

describe("useModal onOpen callback should", () => {
  let onOpenOptions: UseModalOnOpenOptions;

  const callback = jest.fn();

  render(<ModalContainer />);
  const { result } = renderHook(() => useModal({ Component, onOpen: callback }));

  act(() => {
    result.current();
  });

  test("be called", () => {
    expect(callback).toBeCalledTimes(1);
  });

  test("return correct modalRef", () => {
    onOpenOptions = callback.mock.calls[0][0];

    expect(screen.getByRole("dialog")).toBe(onOpenOptions.containerRef);
  });

  test("return correct modalId", () => {
    const id = screen.getByRole("dialog").id.substr("modal__".length);
    expect(id).toBe(onOpenOptions.containerId);
  });
});
