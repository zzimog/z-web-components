export type ContextValue = Record<string, unknown>;

export type Context<T extends ContextValue> = T | undefined;

export function createContext<T extends ContextValue>(key: string) {
  return Symbol(key) as unknown as Context<T>;
}
