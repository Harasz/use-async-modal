# use-async-modal

Show promised based modal programmatically using hook for React.js.

# Table of Contents

1. [Installation](#installation)
2. [Usage](#usage)
3. [Contributing](#contributing)
4. [License](#license)

## Installation

You can install package using [npm](https://www.npmjs.com/package/use-async-modal) or [yarn](https://yarnpkg.com/):

```bash
npm i use-async-modal

yarn add use-async-modal
```

## Usage

First, we will need a component modal to show:

```JSX
export const Dialog = ({ onResolve }) => {
  return (
    <div>
      <button onClick={() => onResolve({ accepted: true })}>Accept</button>
      <button onClick={() => onResolve({ accepted: false })}>Cancel</button>
    </div>
  );
};
```

Then in the component we want to open a modal, we need to use `useModal` hook from `use-async-modal` package.

```JSX
import { useModal } from "use-async-modal";
import { Dialog } from "./Dialog";

export const App = () => {
    const { showModal, modalPortals } = useModal({
    Component: Dialog,

    /*
        Type: Function
        Desc: Will be called after modal close.
        Options:
          - resolved: value passed to onResolve
    */
    onClose: ({ resolved }) => {},

    /*
        Type: Function
        Desc: Will be called after modal open.
        Options:
          - containerId: string containing attribute id for overlay in DOM
          - containerRef: HTMLDivElement ref to overlay
    */
    onOpen: ({ containerId, containerRef }) => {},

    /*
        Type: Object
        Desc: Inline styles applied to overlay.
    */
    overlayStyles: {
      backgroundColor: "red",
      margin: "1px"
    },

    /*
        Type: String
        Desc: Classes to be applied to overlay.
        Accept multiple classes names separated
        by space ex. "px-1 mx-2 bg-green"
    */
    overlayClassName: "px-1",
  });

  async function handleClick() {
    const status = await showModal();
    // { accepted: true } or { accepted: false }
  }

  return (
    <>
      {modalPortals}
      <button onClick={handleClick}>Open dialog</button>
    </>
  );
};

```

As a hook argument we pass an object with properties `Component` which is our modal component. `showModal` is a function that return promise with our value passed to function `onResolve` in `Dialog` component. `modalPortals` is an array containing Portals of opened modals.

More [examples](https://github.com/Harasz/use-async-modal/tree/main/examples) of usage.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT](https://github.com/Harasz/use-async-modal/blob/main/LICENSE)
