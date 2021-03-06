import { FC } from "react";
import { useModal, ModalContainer } from "use-async-modal";

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
  const showModal = useModal<ModalResult>({
    Component: Dialog,
  });

  async function handleClick() {
    const status: ModalResult = await showModal();
    console.log(status);
    // { accepted: true } or { accepted: false }
  }

  return (
    <>
      <ModalContainer />
      <button onClick={handleClick}>Open confirm dialog</button>
    </>
  );
};
