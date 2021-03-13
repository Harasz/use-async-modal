import { CSSProperties } from "react";

export const getRandomPostfix = (): string => Math.random().toString(36).substring(2);

export const cssPropertiesToString = (properties: CSSProperties): string => {
  return Object.keys(properties).reduce((inlineCss: string, key: string) => {
    const cssPropertiesKey = key
      .split(/(?=[A-Z])/)
      .join("-")
      .toLowerCase();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const cssPropertiesValue = properties[key];

    return inlineCss + `${cssPropertiesKey}: ${cssPropertiesValue};`;
  }, "");
};

export const getModalContainerById = (containerIdPostfix: string): HTMLDivElement | null =>
  document.querySelector<HTMLDivElement>(`div#modal__${containerIdPostfix}`);

export const addClassesToModalContainer = (
  modalContainer: HTMLDivElement | null,
  classes?: string,
): void => {
  if (!modalContainer) return;

  classes && modalContainer.classList.add(...classes?.split(" "));
};

export const removeClassesFromModalContainer = (
  modalContainer: HTMLDivElement | null,
  classes?: string,
): void => {
  if (!modalContainer) return;

  classes && modalContainer.classList.remove(...classes?.split(" "));
};

export const blockBodyScroll = (block: boolean): void => {
  const prop = block ? "hidden" : "";
  document.body.style.overflow = prop;
};
