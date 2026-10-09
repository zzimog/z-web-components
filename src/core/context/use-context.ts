import type { Context, ContextValue } from './create-context';

export type ContextCallback<T extends ContextValue> = (value: T) => void;

export function useContext<T extends ContextValue>(
  target: HTMLElement,
  context: Context<T>,
  contextCallback?: ContextCallback<T>,
) {
  let contextValue: Context<T>;

  target.dispatchEvent(
    new CustomEvent('context-request', {
      bubbles: true,
      composed: true,
      detail: {
        context,
        callback: (context: T) => {
          contextValue = context;
          contextCallback?.(context);
        },
      },
    }),
  );

  return contextValue;
}
