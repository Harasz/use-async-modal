import { useModal } from "use-async-modal";

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
  const showDialog = useModal({
    Component: Dialog,
  });

  async function handleClick() {
    const status = await showDialog();
    console.log(status);
    // { accepted: true } or { accepted: false }
  }

  return (
    <>
      <button onClick={handleClick}>Open confirm dialog</button>
    </>
  );
};
