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
