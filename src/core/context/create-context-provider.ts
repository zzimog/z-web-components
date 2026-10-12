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
  let value = defaultValue;

  provider.addEventListener('context-request', (event: Event) => {
    const { detail } = event as ContextEvent<T>;
    if (context === detail.context) {
      detail.callback?.(value);
      consumers.add(detail.callback);
      event.stopPropagation();
    }
  });

  return {
    get value() {
      return value;
    },
    set(values: Partial<T>) {
      const newValue = {
        ...value,
        ...values,
      };

      if (!shallowEqual(value, newValue)) {
        value = newValue;
        consumers.forEach((f) => f(newValue));
      }
    },
  };
}
