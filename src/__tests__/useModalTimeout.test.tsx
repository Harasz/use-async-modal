import { renderHook, act } from "@testing-library/react-hooks";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import { useModal, ModalContainer } from "../index";
import { Component } from "./TestComponent";

jest.useFakeTimers();

describe("useModal Timeout should", () => {
  render(<ModalContainer />);
  const { result } = renderHook(() =>
    useModal({
      Component,
      closeTimeoutMs: 1000,
      overlayClassNameOnOpen: "open",
      overlayClassNameOnClose: "close",
    }),
  );
  const callback = jest.fn();

  test("render with OnOpen class name", () => {
    act(() => {
      result.current().then(callback);
    });

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(callback).not.toBeCalled();

    expect(screen.getByRole("dialog").classList.contains("open")).toBeTruthy();
    expect(screen.getByRole("dialog").classList.contains("close")).toBeFalsy();
  });

  test("close after specified time", async () => {
    act(() => {
      fireEvent.click(screen.getByRole("button"));
    });

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(callback).not.toBeCalled();

    expect(screen.getByRole("dialog").classList.contains("open")).toBeFalsy();
    expect(screen.getByRole("dialog").classList.contains("close")).toBeTruthy();

    act(() => {
      jest.runAllTimers();
    });
    await Promise.resolve();

    expect(callback).toBeCalled();
    expect(setTimeout).toHaveBeenNthCalledWith(2, expect.any(Function), 1000);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
