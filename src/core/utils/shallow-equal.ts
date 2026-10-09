type Comparable = Record<string, unknown>;

export function shallowEqual<T>(objA: T, objB: T): boolean {
  // Check if same reference
  if (Object.is(objA, objB)) return true;

  // Check types
  if (
    typeof objA !== 'object' ||
    typeof objB !== 'object' ||
    objA === null ||
    objB === null
  ) {
    return false;
  }

  // Check keys count
  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);
  if (keysA.length !== keysB.length) return false;

  // Check values for keys
  for (const key of keysA) {
    if (
      !Object.prototype.hasOwnProperty.call(objB, key) ||
      !Object.is((objA as Comparable)[key], (objB as Comparable)[key])
    ) {
      return false;
    }
  }

  return true;
}
