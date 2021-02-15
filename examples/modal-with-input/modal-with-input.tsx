import { FC, useState } from "react";
import { useModal } from "use-async-modal";

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
  const showDialog = useModal<ModalResult>({
    Component: Dialog,
  });

  async function handleClick() {
    const status: ModalResult = await showDialog();
    console.log(status);
    // { email: "you@example.com" }
  }

  return (
    <>
      <button onClick={handleClick}>dialog</button>
    </>
  );
};