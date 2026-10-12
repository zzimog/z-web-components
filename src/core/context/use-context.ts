import type { Context, ContextValue } from './create-context';

export type ContextCallback<T extends ContextValue> = (value: T) => void;

/*
export class ContextRequestEvent<T extends ContextValue> extends Event {
  readonly consumer: Element;
  readonly context: Context<T>;
  readonly callback: ContextCallback<T>;

  constructor(
    consumer: Element,
    context: Context<T>,
    callback: ContextCallback<T>,
  ) {
    super('context-request', { bubbles: true, composed: true });
    this.consumer = consumer;
    this.context = context;
    this.callback = callback;
  }
}
*/

export function useContext<T extends ContextValue>(
  target: HTMLElement,
  context: Context<T>,
  contextCallback?: ContextCallback<T>,
): Context<T> {
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

  return contextRef;
}
