import { shallowEqual } from '@core/utils';
import type { Context, ContextValue } from './create-context';
import type { ContextCallback } from './use-context';

type ContextEvent<T extends ContextValue> = CustomEvent<{
  context: Context<T>;
  callback: ContextCallback<T>;
}>;

export function createContextProvider<T extends ContextValue>(
  provider: HTMLElement,
  context: Context<T>,
  defaultValue: T,
) {
  const consumers = new Set<ContextCallback<T>>();
  let currentValue = defaultValue;

  provider.addEventListener('context-request', (event: Event) => {
    const { detail } = event as ContextEvent<T>;
    if (context === detail.context) {
      event.stopImmediatePropagation();
      detail.callback?.(currentValue);
      consumers.add(detail.callback);
    }
  });

  return {
    set(values: Partial<T>) {
      const newValue = {
        ...currentValue,
        ...values,
      };

      if (!shallowEqual(currentValue, newValue)) {
        currentValue = newValue;
        consumers.forEach((f) => f(newValue));
      }
    },
  };
}
