import { FC, useState } from "react";
import { useModal, ModalContainer } from "use-async-modal";

interface ModalResult {
  email: string;
}

interface DialogProps {
  onResolve(x: ModalResult): void;
}

export const Dialog: FC<DialogProps> = ({ onResolve }) => {
  const [email, setEmail] = useState<string>("");

  const handleSubmit = () => {
    onResolve({ email });
  };

  return (
    <div>
      <p>Your question?</p>
      <input value={email} onChange={(e) => setEmail(e.target.value)} />
      <button onClick={handleSubmit}>Submit</button>
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
    // { email: "you@example.com" }
  }

  return (
    <>
      <ModalContainer />
      <button onClick={handleClick}>dialog</button>
    </>
  );
};
