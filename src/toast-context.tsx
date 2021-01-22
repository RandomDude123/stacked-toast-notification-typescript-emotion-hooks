/** @jsxRuntime classic */
/** @jsx jsx */
import * as React from "react";
import { css, jsx } from "@emotion/core";
import { TransitionGroup } from "react-transition-group";
import styled from "@emotion/styled";
import { nanoid } from "nanoid";
import { FiXCircle } from "react-icons/fi";

import StyledTransition from "./utils/styled-transition";

const NOTIFICATION_WIDTH = 360; // in px
const TRANSTION_DURATION = 220; // in ms
const TIME_FULLY_VISIBLE = 5000; // in ms

const colors = {
  black: "#000000",
  white: "#FFFFFF",
  info: "#31343c",
  success: "#62b440",
  warning: "#e0a408",
  danger: "#f44336"
};

const StyledTransitionGroup = styled(TransitionGroup)`
  bottom: 0;
  box-sizing: border-box;
  max-height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  padding: 8px;
  position: fixed;
  right: 0;
  z-index: 1000;
`;

export enum ToastTypes {
  ERROR = "error",
  INFO = "info",
  SUCCESS = "success",
  WARNING = "warning"
}

const toastColors = {
  error: { backgroundColor: colors.danger, color: colors.white },
  info: { backgroundColor: colors.info, color: colors.white },
  success: { backgroundColor: colors.success, color: colors.white },
  warning: { backgroundColor: colors.warning, color: colors.white }
};

const Wrapper = styled.div<{ toastType: ToastTypes }>`
  background-color: ${({ toastType }) =>
    toastColors[toastType].backgroundColor};
  border-radius: 4px;
  box-shadow: 0 3px 8px rgb(0 0 0 / 18%);
  color: ${({ toastType }) => toastColors[toastType].color};
  display: flex;
  margin-bottom: 8px;
  overflow: hidden;
  width: ${NOTIFICATION_WIDTH}px;
`;

const Content = styled.div`
  flex-grow: 1;
  line-height: 1.5;
  min-height: 40px;
  padding: 8px 12px;
`;

const CloseButtonWrapper = styled.div`
  align-items: start;
  display: flex;
  flex-shrink: 0;
`;

const Overlay = styled.div`
  border-bottom-left-radius: 4px;
  height: 100%;
  left: 0;
  position: absolute;
  top: 0;
  width: 100%;

  :hover  {
    background-color: rgba(255, 255, 255, 0.5);
  }
`;

const CloseButton = styled.button<{ toastType: ToastTypes }>`
  background-color: ${({ toastType }) =>
    toastColors[toastType].backgroundColor};
  border: 0;
  border-radius: 4px;
  color: inherit;
  cursor: pointer;
  outline: 0;
  padding: 12px;
  position: relative;
`;

type ToastProps = {
  autoDismiss?: boolean;
  autoDismissTimeout?: number;
  id: string;
  msg: string;
  type: ToastTypes;
};

interface ToastContextType {
  addToast: (toast: Omit<ToastProps, "id">) => void;
  clearAllToasts: () => void;
}

const ToastContext = React.createContext<ToastContextType | null>(null);
ToastContext.displayName = "ToastContext";

type ToastContextProviderProps = {
  children: React.ReactNode;
};

function ToastContextProvider({ children }: ToastContextProviderProps) {
  const [toasts, setToasts] = React.useState<ToastProps[]>([]);

  React.useEffect(() => {
    if (toasts.length > 0) {
      const newToast = toasts[toasts.length - 1];
      if (newToast.autoDismiss) {
        const timer = setTimeout(
          () => setToasts((prev) => prev.slice(1)),
          newToast.autoDismissTimeout
        );
        return () => clearTimeout(timer);
      }
    }
  }, [toasts]);

  const addToast = React.useCallback(
    ({
      autoDismiss = true,
      autoDismissTimeout = TIME_FULLY_VISIBLE,
      ...rest
    }) =>
      setToasts((toasts) => [
        ...toasts,
        { id: nanoid(), autoDismiss, autoDismissTimeout, ...rest }
      ]),
    [setToasts]
  );

  const clearToast = React.useCallback(
    (indexToDelete) =>
      setToasts((toasts) =>
        toasts.filter((_, index) => indexToDelete !== index)
      ),
    [setToasts]
  );

  const clearAllToasts = React.useCallback(() => setToasts([]), [setToasts]);

  const value = React.useMemo(
    () => ({
      addToast,
      clearAllToasts
    }),
    [addToast, clearAllToasts]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}

      <StyledTransitionGroup>
        {toasts.map((toast, index) => (
          <StyledTransition
            key={toast.id}
            timeout={2 * TRANSTION_DURATION}
            transitions={{
              /* + padding of StyledTransitionGroup */
              enter: css`
                transform: translate(${NOTIFICATION_WIDTH + 8}px, 0);
              `,
              enterActive: css`
                transform: translate(0, 0);
                transition-property: all;
                transition-duration: ${TRANSTION_DURATION}ms;
                transition-timing-function: cubic-bezier(0.2, 0, 0, 1);
                transition-delay: ${TRANSTION_DURATION}ms;
              `,
              exit: css`
                opacity: 1;
              `,
              exitActive: css`
                transition: all ${TRANSTION_DURATION}ms ease-out;
                opacity: 0;
              `
            }}
          >
            <Wrapper toastType={toast.type}>
              <Content>{toast.msg}</Content>

              <CloseButtonWrapper>
                <CloseButton
                  toastType={toast.type}
                  onClick={() => clearToast(index)}
                  tabIndex={-1}
                >
                  <Overlay />
                  <FiXCircle size="24" />
                </CloseButton>
              </CloseButtonWrapper>
            </Wrapper>
          </StyledTransition>
        ))}
      </StyledTransitionGroup>
    </ToastContext.Provider>
  );
}

function useToast() {
  const context = React.useContext(ToastContext);
  if (context === null) {
    throw new Error(`useToast must be used within a ToastContextProvider`);
  }
  return context;
}

export { ToastContextProvider, useToast };
