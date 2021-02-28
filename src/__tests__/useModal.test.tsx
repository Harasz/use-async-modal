import { CSSProperties } from "react";
import { renderHook, act } from "@testing-library/react-hooks";
import { render, fireEvent, screen } from "@testing-library/react";
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
  const { result } = renderHook(() => useModal({ Component, overlayStyles, overlayClassName }));
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
});
