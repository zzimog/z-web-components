export type ContextValue = Record<string, unknown> | undefined;

export type Context<T extends ContextValue> = {
  value: T | undefined;
};

export function createContext<T extends ContextValue>(key: string) {
  return Symbol(key) as unknown as Context<T>;
}
