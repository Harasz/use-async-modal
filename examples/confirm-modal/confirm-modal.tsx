import { FC } from "react";
import { useModal } from "use-async-modal";

interface ModalResult {
  accepted: boolean;
}

interface DialogProps {
  onResolve(x: ModalResult): void;
}

export const Dialog: FC<DialogProps> = ({ onResolve }) => {
  return (
    <div>
      <p>Your question?</p>
      <button onClick={() => onResolve({ accepted: true })}>Accept</button>
      <button onClick={() => onResolve({ accepted: false })}>Cancel</button>
    </div>
  );
};

export const App: FC = () => {
  const showDialog = useModal<ModalResult>({
    Component: Dialog,
  });

  async function handleClick() {
    const status: ModalResult = await showDialog();
    console.log(status);
    // { accepted: true } or { accepted: false }
  }

  return (
    <>
      <button onClick={handleClick}>Open confirm dialog</button>
    </>
  );
};
