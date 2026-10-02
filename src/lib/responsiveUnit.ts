/** Converts a design-mock pixel value into the `--u` fluid unit, optionally floored at `min` px. */
export const u = (n: number, min?: number): string =>
  min ? `max(${min}px, calc(${n} * var(--u)))` : `calc(${n} * var(--u))`;

