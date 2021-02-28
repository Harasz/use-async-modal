import { FC } from "react";

export const Component: FC<ComponentProps> = ({ onResolve }) => {
  return (
    <div id="modal-container">
      <p>Dialog</p>
      <button id={"btn"} onClick={() => onResolve("resolve")}>
        Accept
      </button>
    </div>
  );
};

interface ComponentProps {
  onResolve(x: string): void;
}
