/**
 * Small memoization helper aligned with the Java SDK utility naming.
 */
export function memoize<T>(factory: () => T): () => T {
  let value: T | undefined;

  return () => {
    if (value === undefined) {
      value = factory();
    }

    return value;
  };
}
