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
  const showDialog = useModal({
    Component: Dialog,
  });

  async function handleClick() {
    const status = await showDialog();
    // { accepted: true } or { accepted: false }
  }

  return (
    <>
      <button onClick={handleClick}>Open dialog</button>
    </>
  );
};

```

As a hook argument we pass an object with properties `Component` which is our modal component. `showDialog` is a function that return promise with our value passed to function `onResolve` in `Dialog` component.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT](https://github.com/Harasz/use-async-modal/blob/main/LICENSE)
