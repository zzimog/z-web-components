import type { Context, ContextValue } from './create-context';

export type ContextCallback<T extends ContextValue> = (value: T) => void;

export function useContext<T extends ContextValue>(
  target: HTMLElement,
  context: Context<T>,
  contextCallback?: ContextCallback<T>,
): () => T | undefined {
  const contextRef = {
    value: undefined,
  };

  target.dispatchEvent(
    new CustomEvent('context-request', {
      bubbles: true,
      composed: true,
      detail: {
        context,
        callback: (context: T) => {
          (contextRef as Context<T>).value = context;
          contextCallback?.(context);
        },
      },
    }),
  );

  return () => contextRef.value;
}
