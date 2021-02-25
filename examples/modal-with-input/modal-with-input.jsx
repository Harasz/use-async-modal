import { useState } from "react";
import { useModal } from "use-async-modal";

export const Dialog = ({ onResolve }) => {
  const [email, setEmail] = useState("");

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

export const App = () => {
  const { showModal, modalPortals } = useModal({
    Component: Dialog,
  });

  async function handleClick() {
    const status = await showModal();
    console.log(status);
    // { email: "you@example.com" }
  }

  return (
    <>
      {modalPortals}
      <button onClick={handleClick}>dialog</button>
    </>
  );
};
