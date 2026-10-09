export function useId() {
  const prefix = 'z';
  const time = Date.now().toString(36).slice(-5);
  const random = Math.random().toString(36).slice(-5);
  return [prefix, time, random].join(':');
}
