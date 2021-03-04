import { CSSProperties } from "react";
import { renderHook, act } from "@testing-library/react-hooks";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import { useModal, ModalContainer } from "../index";
import { Component } from "./TestComponent";

describe("useModal should", () => {
  const overlayStyles: CSSProperties = {
    width: "100%",
    backgroundColor: "white",
  };
  const overlayInlineStyles = "width: 100%; background-color: white;";
  const overlayClassName = "overlay modal w-100";

  render(<ModalContainer />);
  const { result } = renderHook(() =>
    useModal({
      Component,
      overlayStyles,
      overlayClassName,
      closeOnEsc: true,
      closeOnOverlayClick: true,
      defaultResolved: "esc key",
    }),
  );
  const callback = jest.fn();

  test("render modal container", () => {
    act(() => {
      result.current().then(callback);
    });

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Dialog")).toBeInTheDocument();
  });

  test("modal overlay match styles", () => {
    const overlayClasses = screen.getByRole("dialog").classList.toString();

    expect(overlayClasses).toBe("useModal__overlay " + overlayClassName);
    expect(screen.getByRole("dialog").style.cssText).toBe(overlayInlineStyles);
  });

  test("close modal container", () => {
    const button = screen.getByText("Accept");
    fireEvent.click(button);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  test("match result", () => {
    expect(callback).toBeCalledWith("resolve");
  });

  test("close on ESC", async () => {
    const callbackEsc = jest.fn();

    act(() => {
      result.current().then(callbackEsc);
    });

    fireEvent.keyDown(screen.getByRole("dialog"), { key: "Escape", code: "Escape" });
    await waitFor(() => expect(callbackEsc).toBeCalledWith("esc key"));
  });

  test("close on overlay click", async () => {
    const callbackClick = jest.fn();

    act(() => {
      result.current().then(callbackClick);
    });

    fireEvent.click(screen.getByRole("dialog"));
    await waitFor(() => expect(callbackClick).toBeCalledWith("esc key"));
  });
});
