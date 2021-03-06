import { useModal, ModalContainer } from "use-async-modal";

export const Dialog = ({ onResolve }) => {
  return (
    <div>
      <p>Your question?</p>
      <button onClick={() => onResolve({ accepted: true })}>Accept</button>
      <button onClick={() => onResolve({ accepted: false })}>Cancel</button>
    </div>
  );
};

export const App = () => {
  const showModal = useModal({
    Component: Dialog,
  });

  async function handleClick() {
    const status = await showModal();
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
