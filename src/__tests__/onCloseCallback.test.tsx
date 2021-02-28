import { renderHook, act } from "@testing-library/react-hooks";
import { render, fireEvent, screen } from "@testing-library/react";
import { useModal, UseModalOnCloseOptions, ModalContainer } from "../index";
import { Component } from "./TestComponent";

describe("useModal onClose callback should", () => {
  let onCloseOptions: UseModalOnCloseOptions<string>;

  const callback = jest.fn();

  render(<ModalContainer />);
  const { result } = renderHook(() => useModal({ Component, onClose: callback }));

  act(() => {
    result.current();
  });

  test("not be called before close", () => {
    expect(callback).toBeCalledTimes(0);
  });

  test("be called after close", () => {
    const button = screen.getByRole("button");

    fireEvent.click(button);
    expect(callback).toBeCalledTimes(1);
  });

  test("match result", () => {
    onCloseOptions = callback.mock.calls[0][0];

    expect(onCloseOptions.resolved).toBe("resolve");
  });
});
