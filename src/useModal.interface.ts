import { FC, CSSProperties, ReactPortal } from "react";

export type ResolveFunction<ResultType> = ((x: ResultType) => void) | (() => void);

export interface UseModalComponentProps<ResultType> {
  onResolve: ResolveFunction<ResultType>;
}

export type UseModalOptions<ResultType> = UseModalOptionsBasic<ResultType>;

export interface UseModalOptionsBasic<ResultType> {
  Component: FC<UseModalComponentProps<ResultType>>;
  overlayStyles?: CSSProperties;
  overlayClassName?: string;
  closeOnEsc?: boolean;
  closeOnOverlayClick?: boolean;
  defaultResolved?: ResultType;
  overlayClassNameOnOpen?: string;
  overlayClassNameOnClose?: string;
  closeTimeoutMs?: number;
  blockBodyScroll?: boolean;
  onOpen?: (options: UseModalOnOpenOptions) => void | Promise<void>;
  onClose?: (options: UseModalOnCloseOptions<ResultType>) => void | Promise<void>;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface UseModalOnOpenOptions extends Omit<UseModalContainerRef, "portal"> {}

export interface UseModalOnCloseOptions<ResultType> {
  resolved: ResultType;
}

export interface UseModalContainerRef {
  containerId: string;
  containerRef: HTMLDivElement;
  portal: ReactPortal;
  blockBodyScroll: boolean;
}

export type UseModalReturnType<ResultType = unknown> = () => Promise<ResultType>;
